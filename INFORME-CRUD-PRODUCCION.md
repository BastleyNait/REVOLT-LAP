# Informe de investigación — CRUD de productos en producción (REVOLT-LAP)

**Fecha:** 2026-08-23
**Alcance:** Solo lectura (sin cambios de código). Objetivo: entender cómo funciona el CRUD,
diagnosticar por qué no funciona en producción y dejar un plan de tareas accionable.
**Método:** Lectura completa del stack (UI → Server Actions → API → repository → Supabase/R2 →
auth/middleware → config → schema) + inspección de `git` (commits, tracked/untracked) + inspección
de las variables de entorno locales (solo claves y longitudes, **nunca** los valores).

---

## 1. Resumen ejecutivo

El CRUD de productos está bien diseñado y es completo en el código local. El problema de
producción **no es (solo) un bug de lógica**: es principalmente un **problema de despliegue y
configuración de entorno**. Hay 3 hallazgos, en orden de probabilidad de ser la causa raíz:

| # | Hallazgo | Impacto | Probabilidad |
|---|----------|---------|--------------|
| **A** | **Las variables de entorno no están (todas) configuradas en Vercel.** El CRUD de escritura necesita `SUPABASE_SERVICE_ROLE_KEY`; la lectura necesita `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Ningún `.env` local se sube a Vercel. | Si falta la service role, **todos los writes fallan** con `Supabase admin client unavailable`. Si falta el URL/anon, la tienda y el admin muestran **datos de demo** (fallback). | **Alta** |
| **B** | **Toda la funcionalidad R2 (upload de imágenes) está sin commit.** `src/lib/r2/`, `src/app/api/upload/`, `src/components/admin/ImageUploader.tsx` son **untracked**; `actions.ts`, `ProductForm.tsx`, `env.ts`, `next.config.mjs`, `package.json`, `[id]/route.ts` están **modificados pero sin commit**. `origin/main` (lo que despliega Vercel) no los contiene. | Si el deploy sale de GitHub, producción corre el **código viejo** (textarea de imágenes, sin `/api/upload`). Si se despliega el código local, el upload falla sin las vars `R2_*`. | **Alta** (depende de cómo se despliega) |
| **C** | **Bugs de código reales** (secundarios): `isR2Configured` inconsistente, stale-closure en `ImageUploader` (imágenes perdidas/reaparecen), `deleteImageByPublicUrl` lanza llamadas S3 inválidas para URLs externas. | Afectan la gestión de imágenes, **no** el CRUD base (crear/editar/borrar). | Media (no bloquea el CRUD) |

**Conclusión:** lo primero que hay que hacer es **verificar y completar las variables de entorno
en Vercel** y **comitear + desplegar el código R2**. Solo después tiene sentido tocar el código.

---

## 2. Cómo funciona el CRUD (arquitectura)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  UI ADMIN (Next.js App Router)                                              │
│  /admin (listar)  /admin/new (crear)  /admin/[id]/edit (editar)             │
│  └─ ProductForm.tsx (client) ── ImageUploader.tsx (client)                  │
│        │  (form action)                  │  (fetch /api/upload)             │
│        ▼                                 ▼                                  │
│  SERVER ACTIONS (src/app/admin/actions.ts)     API /api/upload (route.ts)   │
│  createProductAction / updateProductAction      └─ uploadImage() → R2       │
│  deleteProductAction                                 (Cloudflare R2 bucket)  │
│        │  auth: isAuthed() (cookie SHA-256)                                 │
│        │  validación: Zod (productInputSchema)                              │
│        ▼                                                                    │
│  REPOSITORY (src/lib/repositories/products.ts)  ← ÚNICA capa de datos       │
│  lecturas: getPublicClient() (anon, RLS)                                    │
│  escrituras: getAdminClient() (service role, bypassa RLS)                   │
│  si no hay Supabase → fallback a datos demo (fallback-products.ts)          │
│        ▼                                                                    │
│  SUPABASE (tabla products, RLS: anon solo lee is_active)                    │
└─────────────────────────────────────────────────────────────────────────────┘
  + API REST /api/products y /api/products/[id] (doble vía de escritura, auth por
    header x-admin-password o cookie)
  + middleware.ts protege /admin* con la misma cookie
  + next/image: remotePatterns (next.config.mjs) + SafeImage + image-hosts.ts
```

### Capa por capa (archivos clave)

| Capa | Archivo(s) | Rol |
|------|-----------|-----|
| UI admin | `src/app/admin/page.tsx`, `new/page.tsx`, `[id]/edit/page.tsx`, `layout.tsx` | Páginas del panel |
| Formulario | `src/components/admin/ProductForm.tsx` | Form controlado (client) |
| Upload | `src/components/admin/ImageUploader.tsx` | Drag&drop + fetch `/api/upload` |
| Server Actions | `src/app/admin/actions.ts` | `create/update/deleteProductAction` |
| API REST | `src/app/api/products/route.ts`, `[id]/route.ts`, `upload/route.ts` | Doble vía de escritura + upload |
| Validación | `src/lib/validators/product.ts` | Zod + `productInputFromFormData` |
| Repository | `src/lib/repositories/products.ts` | Única capa de acceso a datos |
| Supabase | `src/lib/supabase/client.ts` (anon), `admin.ts` (service role) | Clientes |
| R2 | `src/lib/r2/client.ts`, `upload.ts` | Cliente S3 + helpers |
| Auth | `src/lib/auth/admin.ts`, `token.ts`, `src/middleware.ts` | Gate de /admin |
| Env | `src/lib/env.ts` | Acceso central a `process.env` |
| Imágenes | `next.config.mjs`, `src/lib/config/image-hosts.ts`, `src/components/ui/SafeImage.tsx` | `next/image` |
| BD | `supabase/schema.sql` | Tabla `products` + RLS + trigger |

### Flujo exacto de un CREATE (crear producto)
1. El admin llena `ProductForm` y (opcional) sube imágenes → `ImageUploader` hace
   `POST /api/upload` (multipart) → `uploadImage()` sube a R2 y devuelve URLs públicas.
2. Las URLs quedan en un `<input type="hidden" name="images">` (join por `\n`).
3. Al guardar, el form llama a `createProductAction(formData)` (Server Action).
4. `isAuthed()` verifica la cookie (SHA-256 de `ADMIN_PASSWORD`).
5. `productInputFromFormData` + `productInputSchema.safeParse` (Zod) validan.
6. `createProduct()` (repository) → `getAdminClient()` (service role) → `insert` en Supabase.
7. `revalidatePath("/")`, `/admin`, `/products/{slug}` y `redirect("/admin?status=created")`.

---

## 3. Causas raíz identificadas (con evidencia)

### CAUSA A — Variables de entorno en Vercel (la más probable)

**Evidencia:**
- Localmente las credenciales viven en **dos archivos** que **no se suben a git** (`.gitignore`
  ignora `.env`, `.env*.local`):
  - `.env` → credenciales R2 (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
    `R2_BUCKET`, `R2_PUBLIC_URL`) + `ADMIN_PASSWORD` + `NEXT_PUBLIC_SITE_URL` +
    `NEXT_PUBLIC_USD_RATE`. **Los campos Supabase están VACÍOS aquí.**
  - `.env.local` → `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
    `SUPABASE_SERVICE_ROLE_KEY` (los únicos con valor real de Supabase).
- Next.js **no** carga `.env`/`.env.local` en Vercel: esas variables **deben crearse a mano** en
  *Vercel → Settings → Environment Variables*.
- La lógica de fallback en `src/lib/env.ts` + `repositories/products.ts` es:
  - `isSupabaseConfigured = URL && anonKey` → si es `false`, las **lecturas** devuelven
    `fallbackProducts` (datos demo).
  - `isSupabaseAdminConfigured = URL && serviceRoleKey` → si es `false`,
    `getAdminClient()` **lanza** `Supabase admin client unavailable. Set
    NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.` → **todas las escrituras fallan**.

**Síntoma esperado en producción si falta la service role:**
- Al crear/editar/borrar, el form muestra el error
  `Supabase admin client unavailable…` y nada se guarda.
- El admin muestra el aviso naranja (`AdminNotice`) *"Supabase no está configurado: las
  escrituras están deshabilitadas y se muestran datos de demo."*
- La tienda pública muestra el catálogo demo (5 productos fijos), no el real.

**Nota sobre `NEXT_PUBLIC_*`:** se inlinan **en el build**. Si cambias `NEXT_PUBLIC_SUPABASE_URL`
o `NEXT_PUBLIC_SUPABASE_ANON_KEY` en Vercel, **hay que re-desplegar** para que surta efecto.

### CAUSA B — El código R2 no está commitado (lo que despliega Vercel ≠ lo local)

**Evidencia (`git status --short`):**
```
 M src/app/admin/actions.ts          (cleanup R2 en update/delete)
 M src/app/api/products/[id]/route.ts (cleanup R2 en DELETE)
 M src/components/admin/ProductForm.tsx (usa ImageUploader)
 M src/lib/env.ts                    (r2PublicUrl, isR2Configured)
 M next.config.mjs                   (remotePatterns R2)
 M package.json                      (+ @aws-sdk/client-s3)
?? src/app/api/upload/               (endpoint de subida)  ← UNTRACKED
?? src/lib/r2/                       (cliente + helpers)   ← UNTRACKED
?? src/components/admin/ImageUploader.tsx  ← UNTRACKED
```
- `origin/main` (la rama que Vercel despliega al hacer push) **no contiene** ninguno de los
  archivos R2; además está **3 commits por detrás** del `HEAD` local.
- Consecuencia:
  - **Si el deploy sale de GitHub** → producción corre el **código viejo**: `ProductForm` con
    **textarea** de imágenes (una URL por línea), **sin** `/api/upload`, **sin** `ImageUploader`.
    El CRUD base funciona *si* Supabase está configurado; el upload de archivos **no existe**.
  - **Si se despliega el código local** (p. ej. `vercel deploy` desde la máquina) → corre el
    código nuevo, pero sin las vars `R2_*` en Vercel el upload devuelve
    `503 "R2 no está configurado…"`.

### CAUSA C — Bugs de código (secundarios, no bloquean el CRUD base)

1. **`isR2Configured` inconsistente (dos definiciones):**
   - `src/lib/env.ts:29` → `Boolean(env.r2PublicUrl)` (solo mira `R2_PUBLIC_URL`).
   - `src/lib/r2/client.ts:24` → exige las **5** vars (`R2_BUCKET`, `R2_ACCOUNT_ID`,
     `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL`).
   - `AdminNotice` usa el de `env.ts`: si falta el bucket/keys pero hay `R2_PUBLIC_URL`, **no
     muestra aviso** y el upload falla con 500. `ProductForm.tsx:11` importa `isR2Configured`
     de `env` pero **no lo usa** (import muerta).

2. **Stale-closure en `ImageUploader` (pérdida/reaparición de imágenes):**
   - `handleUpload` hace `onChange([...currentUrls, ...newUrls, ...data.urls])`.
     `currentUrls` es la prop `product?.images` (inmutable tras montar) y `newUrls` es el valor
     del closure.
   - **Bug 1:** si el admin **borra** una imagen original (`removeUrl`) y luego **sube** otra,
     la borrada **reaparece** (porque `currentUrls` no cambió).
   - **Bug 2:** dos subidas **concurrentes** (dos drops rápidos) → el segundo `onChange`
     sobreescribe al primero con `newUrls` stale → las URLs de la primera subida **no entran en
     el hidden input** → el producto se guarda sin esas imágenes.

3. **`deleteImageByPublicUrl` lanza llamadas S3 inválidas para URLs externas:**
   - `src/lib/r2/upload.ts:79-94`: si la URL no es del bucket (Google Drive, Unsplash), el regex
     no matchea y `key` queda siendo **la URL completa** → intenta `DeleteObject` con una key
     inválida. El error se traga con `.catch(() => {})`, pero genera llamadas inútiles y, si
     `R2_PUBLIC_URL` está vacío, `key` = URL completa para **cualquier** imagen.

4. **Menor:** `updateProduct` (repository) escribe `updated_at` a mano **y** el trigger
   `set_updated_at` también lo hace (redundante, no rompe). `generateStaticParams` de
   `products/[slug]` retorna `[]` si falla (silencioso) — en Vercel, si Supabase no está
   configurado en el build, pre-renderiza con slugs de demo.

---

## 4. Checklist de verificación en producción (diagnóstico rápido)

Haz esto **antes** de tocar código, para confirmar la causa:

1. **Vercel → Settings → Environment Variables.** Lista de variables que **deben** existir
   (todas, con el mismo valor que local):
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`,
   `NEXT_PUBLIC_WHATSAPP_PHONE`, `NEXT_PUBLIC_USD_RATE`, `R2_BUCKET`, `R2_ACCOUNT_ID`,
   `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL`.
   → Marca cuáles faltan. **Si falta `SUPABASE_SERVICE_ROLE_KEY`, ahí está el CRUD roto.**
2. **Abrir `/admin` en producción.** ¿Pide login? ¿Aparece algún aviso (`AdminNotice`)?
   - Aviso naranja "Supabase no está configurado" → confirma causa A (service role).
   - Aviso azul "R2 no está configurado" → confirma falta de `R2_*`.
3. **Intentar CREAR un producto.** ¿Qué mensaje de error exacto aparece en el form?
   - `Supabase admin client unavailable…` → falta service role / URL.
   - `R2 no está configurado…` (al subir imagen) → faltan `R2_*`.
   - Validación Zod → el problema es de datos, no de entorno.
4. **`curl https://TU-DOMINIO/api/products`** (sin auth). Si devuelve los 5 productos demo →
   la lectura cae al fallback → faltan `NEXT_PUBLIC_SUPABASE_URL`/`ANON_KEY`.
5. **Vercel → Observability/Logs** de la función del server action / API → busca el stack trace.
6. **Confirmar qué código está en producción:** ¿el `ProductForm` de producción tiene
   **textarea** de imágenes (código viejo) o el **ImageUploader** drag&drop (código nuevo)?
   Esto dice si el deploy incluye o no los cambios R2 (causa B).

---

## 5. Plan de tareas (priorizado)

### Fase 0 — Diagnóstico (≈30 min) · *bloqueante*
- [ ] **T0.1** Ejecutar el checklist de la sección 4 y anotar el resultado de cada punto.
- [ ] **T0.2** Confirmar **cómo** se despliega (GitHub→Vercel auto, o `vercel deploy` manual).
- [ ] **T0.3** Decidir la causa raíz principal (A / B / A+B) con la evidencia recogida.

### Fase 1 — Corregir el entorno en Vercel (≈30 min) · *alta prioridad*
- [ ] **T1.1** Crear/completar las **12** variables de la sección 4.1 en Vercel
  (Production + Preview), copiando los valores de `.env` + `.env.local` locales.
- [ ] **T1.2** Re-desplegar (necesario porque `NEXT_PUBLIC_*` se inlinan en el build).
- [ ] **T1.3** Verificar: crear, editar y borrar un producto en producción; confirmar que la
  tienda pública refleja el cambio (no el demo).

### Fase 2 — Commitar y desplegar el código R2 (≈45 min) · *alta prioridad*
- [ ] **T2.1** Revisar el diff pendiente (`git diff`) de los 6 archivos modificados.
- [ ] **T2.2** `git add` de los archivos R2 untracked + modificados; commit descriptivo
  (p. ej. `feat: R2 image upload + cleanup`).
- [ ] **T2.3** Push a `origin/main` → Vercel auto-despliega.
- [ ] **T2.4** Verificar en producción: subir una imagen (drag&drop), que se guarde la URL R2,
  que se muestre en la tienda, y que al borrar el producto se limpie el objeto en R2.

### Fase 3 — Arreglar bugs de código (≈1–2 h) · *media prioridad (calidad)*
- [ ] **T3.1** Unificar `isR2Configured`: que `env.ts` use la definición completa de
  `r2/client.ts` (las 5 vars) o exporte la de `r2/client.ts`. Eliminar el import muerta en
  `ProductForm.tsx`.
- [ ] **T3.2** Arreglar el stale-closure de `ImageUploader`: mantener una **única** lista
  `urls` en estado (sin separar `currentUrls`/`newUrls`) y calcular `onChange` a partir del
  estado actual (funcional) para que borrar+subir y subidas concurrentes no pierdan/reaparezcan.
- [ ] **T3.3** `deleteImageByPublicUrl`: si la URL no empieza por `R2_PUBLIC_URL`, **retornar
  sin llamar a S3** (evitar keys inválidas).
- [ ] **T3.4** (Opcional) Quitar la escritura manual de `updated_at` en `updateProduct`
  (ya lo hace el trigger) o quitar el trigger — dejar una sola fuente.
- [ ] **T3.5** `npm run typecheck` + `npm run build` limpios; test manual del CRUD completo.

### Fase 4 — Prevención (≈1 h) · *baja prioridad (robustez)*
- [ ] **T4.1** Endpoint `/api/health` que reporte el estado de config (Supabase admin, R2,
  admin-auth) **sin exponer secretos** → facilita diagnosticar en producción.
- [ ] **T4.2** Script/CI que verifique la presencia de las variables requeridas en Vercel
  (o al menos un `npm run check:env` que falle el build si faltan en producción).
- [ ] **T4.3** Actualizar el `README` enfatizando que **todas** las variables (incl. R2) deben
  crearse a mano en Vercel y que `NEXT_PUBLIC_*` requieren re-deploy.
- [ ] **T4.4** (Opcional) Tests de integración del CRUD (crear/editar/borrar) contra Supabase.

---

## 6. Apéndices

### 6.1 Tabla de variables de entorno (qué hace cada una)

| Variable | Prefijo | Dónde se usa | Si falta en prod |
|----------|---------|--------------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | NEXT_PUBLIC | Lecturas + escrituras | Fallback a demo (lecturas) / writes fallan |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | NEXT_PUBLIC | Lecturas (RLS) | Fallback a demo |
| `SUPABASE_SERVICE_ROLE_KEY` | — | **Escrituras** (bypass RLS) | **CRUD de escritura roto** |
| `ADMIN_PASSWORD` | — | Auth de /admin | Panel abierto (sin login) |
| `NEXT_PUBLIC_SITE_URL` | NEXT_PUBLIC | URLs canónicas / WhatsApp | URLs incorrectas |
| `NEXT_PUBLIC_WHATSAPP_PHONE` | NEXT_PUBLIC | CTA WhatsApp | Sin botón de pedido |
| `NEXT_PUBLIC_USD_RATE` | NEXT_PUBLIC | Conversión PEN→USD | Equivalente USD incorrecto |
| `R2_BUCKET` | — | Subida/limpieza R2 | Upload 503 |
| `R2_ACCOUNT_ID` | — | Endpoint S3 de R2 | Upload 503 |
| `R2_ACCESS_KEY_ID` | — | Credencial S3 | Upload 503 |
| `R2_SECRET_ACCESS_KEY` | — | Credencial S3 | Upload 503 |
| `R2_PUBLIC_URL` | — | URLs públicas + `next/image` | Imágenes no se sirven / 503 |

> ⚠️ Los valores reales **no** se incluyen en este informe por seguridad. Están en `.env` y
> `.env.local` locales (gitignored).

### 6.2 Estado git (resumen)
- Rama local `main` = `origin/main` + 3 commits no pushados (`f11820b`, `59f61d2`, `b09b449`).
- Archivos **untracked** (no existen en ningún commit): `src/app/api/upload/`, `src/lib/r2/`,
  `src/components/admin/ImageUploader.tsx`, `scripts/`, `src/lib/utils/site-url.ts`.
- Archivos **modificados sin commit**: `actions.ts`, `[id]/route.ts`, `ProductForm.tsx`,
  `env.ts`, `next.config.mjs`, `package.json`, `package-lock.json`, `image-hosts.ts`,
  `site.ts`, `AdminNotice.tsx`, `ProductTable.tsx`, `layout.tsx`, `products/[slug]/page.tsx`,
  `Hero.tsx`, `Navbar.tsx`, `GlassSurface.css`, `.env.example`, `README.md`.
- `ThemeToggle.tsx` eliminado (sin commit).

### 6.3 Archivos leídos en esta investigación (33)
`package.json`, `README.md`, `.env.example`, `next.config.mjs`, `src/middleware.ts`,
`src/lib/env.ts`, `src/lib/auth/admin.ts`, `src/lib/auth/token.ts`,
`src/lib/supabase/client.ts`, `src/lib/supabase/admin.ts`,
`src/lib/repositories/products.ts`, `src/lib/r2/client.ts`, `src/lib/r2/upload.ts`,
`src/lib/validators/product.ts`, `src/lib/config/image-hosts.ts`,
`src/lib/types/product.ts`, `src/lib/utils/format.ts`,
`src/app/admin/actions.ts`, `src/app/admin/page.tsx`, `src/app/admin/new/page.tsx`,
`src/app/admin/[id]/edit/page.tsx`, `src/app/admin/layout.tsx`,
`src/app/admin/login/page.tsx`, `src/app/admin/login/actions.ts`,
`src/app/api/products/route.ts`, `src/app/api/products/[id]/route.ts`,
`src/app/api/upload/route.ts`, `src/app/page.tsx`, `src/app/products/[slug]/page.tsx`,
`src/components/admin/ProductForm.tsx`, `src/components/admin/ImageUploader.tsx`,
`src/components/admin/ProductTable.tsx`, `src/components/admin/DeleteForm.tsx`,
`src/components/admin/AdminNotice.tsx`, `src/components/ui/SafeImage.tsx`,
`src/components/product/ProductGallery.tsx`, `supabase/schema.sql`,
`scripts/verify-r2.mjs`.
