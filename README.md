# REVOLT — Neobrutalist Laptop Store

E-commerce de laptops reacondicionadas con estética **Neobrutalista**, construido con
**Next.js (App Router)** + **Supabase**, optimizado para desplegarse como **funciones
serverless en Vercel**. Incluye un **CRUD de administración** completo y una tienda
pública. Las pantallas provienen del proyecto de Stitch _"Revolt Neobrutalist Laptop Store"_.

> Diseño 100% tokenizado y modular. Nada de datos quemados en componentes: todo el
> contenido sale de Supabase (o de un dataset de demo de respaldo) y la configuración
> vive en `src/lib/config` + variables de entorno.

---

## ✨ Características

- **Tienda pública**: home con hero + grid de inventario y página de detalle de producto.
- **CRUD admin** (`/admin`): crear, listar, editar y borrar productos.
- **Doble vía de escritura**: Server Actions (panel) **y** API REST serverless (`/api/products`).
- **Supabase** como base de datos con RLS (lectura pública / escritura con service role).
- **Modo demo**: si no configuras Supabase, la tienda funciona con datos de respaldo.
- **WhatsApp checkout**: el CTA arma un enlace `wa.me` con el producto.
- **Design system tokenizado** en `tailwind.config.ts` (colores, tipografías, sombras duras).
- **Auth de admin** simple por contraseña (middleware + cookie), opcional.

## 🧱 Stack

| Capa        | Tecnología                                  |
| ----------- | ------------------------------------------- |
| Framework   | Next.js 16 (App Router, RSC, Server Actions)|
| Lenguaje    | TypeScript                                  |
| UI / estilo | Tailwind CSS v3 (tokens del design system)  |
| Datos       | Supabase (Postgres + RLS)                   |
| Validación  | Zod                                         |
| Deploy      | Vercel (serverless)                         |

## 🖥️ Pantallas (origen Stitch)

Las exportaciones originales (PNG + HTML de referencia) están en [`design/`](design/):
Home (desktop/mobile) y Product Detail (desktop/mobile), además del Design System.

---

## 🚀 Puesta en marcha

### 1. Requisitos

- Node.js 18.18+ (recomendado 20/22)
- Una cuenta de [Supabase](https://supabase.com) (opcional para probar en modo demo)

### 2. Instalar dependencias

```bash
npm install
```

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Rellena `.env.local`. **Sin Supabase** la tienda arranca igual (datos de demo). Con
Supabase, copia los valores desde _Project Settings → API_:

| Variable                        | Descripción                                          |
| ------------------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL del proyecto Supabase                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública (lecturas, sujeta a RLS)               |
| `SUPABASE_SERVICE_ROLE_KEY`     | Clave secreta (solo servidor; escrituras del admin)  |
| `ADMIN_PASSWORD`                | Contraseña del panel. Vacío = `/admin` abierto (dev) |
| `NEXT_PUBLIC_SITE_URL`          | URL canónica del sitio                               |
| `NEXT_PUBLIC_WHATSAPP_PHONE`    | Número WhatsApp en E.164 sin `+`                      |
| `R2_BUCKET`                     | Nombre del bucket R2 (ej. `revolt-images`)           |
| `R2_ACCOUNT_ID`                 | Account ID de Cloudflare                             |
| `R2_ACCESS_KEY_ID`              | Access Key del token API de R2                       |
| `R2_SECRET_ACCESS_KEY`          | Secret Key del token API de R2                       |
| `R2_PUBLIC_URL`                 | URL pública del bucket (ej. `https://pub-xxx.r2.dev`) |

### 4. Base de datos (Supabase)

En el **SQL Editor** de Supabase ejecuta, en orden:

1. [`supabase/schema.sql`](supabase/schema.sql) — tabla `products`, índices, trigger y RLS.
2. [`supabase/seed.sql`](supabase/seed.sql) — carga los 5 productos de demo (opcional).

### 5. Desarrollo

```bash
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run typecheck
```

---

## 🔐 Panel de administración

- Entra en **`/admin`** (enlace ⚙️ en la navbar).
- Si definiste `ADMIN_PASSWORD`, el `middleware` te redirige a `/admin/login`.
- Crear/editar/borrar persiste en Supabase mediante Server Actions (service role) y
  revalida la tienda automáticamente (`revalidatePath`).
- Sin `SUPABASE_SERVICE_ROLE_KEY`, el panel muestra datos de demo en **solo lectura**
  y avisa de la configuración faltante.

## 🔌 API REST (serverless)

Todas corren como funciones serverless (`runtime = "nodejs"`).

| Método   | Ruta                 | Auth | Descripción                              |
| -------- | -------------------- | ---- | ---------------------------------------- |
| `GET`    | `/api/products`      | —    | Productos activos                        |
| `GET`    | `/api/products?all=true` | ✅ | Todos los productos                     |
| `POST`   | `/api/products`      | ✅   | Crear producto                           |
| `GET`    | `/api/products/:id`  | ✅   | Obtener uno (incluye inactivos)          |
| `PUT`    | `/api/products/:id`  | ✅   | Actualizar                               |
| `DELETE` | `/api/products/:id`  | ✅   | Borrar                                   |

Auth por header `x-admin-password: <ADMIN_PASSWORD>` o cookie de sesión. Ejemplo:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-admin-password: $ADMIN_PASSWORD" \
  -d '{"name":"ThinkPad T14","slug":"thinkpad-t14","brand":"Lenovo","price":549,"ram":"16GB RAM","storage":"512GB SSD"}'
```

---

## ☁️ Deploy en Vercel

1. Sube el repo a GitHub e **importa** el proyecto en Vercel (framework: Next.js, autodetectado).
2. En **Settings → Environment Variables**, añade las mismas variables de `.env.local`.
3. Deploy. El App Router se despliega como funciones serverless sin configuración extra.

> `next/image` ya permite los hosts de Supabase, de Cloudflare R2 y de las imágenes de demo
> (ver `next.config.mjs`). Si usas otro CDN de imágenes, agrégalo ahí.

---

## 🖼️ Cloudflare R2 (Image hosting)

Las imágenes de productos se almacenan en un bucket de Cloudflare R2 y se sirven a través
de un CDN global. El panel de administración incluye un **ImageUploader** con drag & drop
que sube archivos directamente al bucket vía una función serverless.

### Configuración

1. Crea un bucket en [Cloudflare R2](https://dash.cloudflare.com/r2).
2. Crea un **API Token** con acceso al bucket (o un User con permisos de lectura/escritura).
3. Obtén tu **Account ID** desde el dashboard de Cloudflare.
4. Configura las variables de entorno (ver `.env.example`).

### Flujo de imágenes

1. **Upload**: El admin sube imágenes desde `/admin/new` o `/admin/[id]/edit`.
2. **Storage**: Las imágenes se guardan en `products/{uploadId}/{timestamp}-{fileName}`.
3. **Serve**: `next/image` sirve las imágenes desde `R2_PUBLIC_URL` con optimización automática.
4. **Cleanup**: Al editar un producto, las imágenes reemplazadas se eliminan del bucket. Al borrar un producto, todas sus imágenes se eliminan.

### Endpoint serverless

| Método | Ruta          | Auth | Descripción                           |
| ------ | ------------- | ---- | ------------------------------------- |
| `POST` | `/api/upload` | ✅   | Sube 1-10 imágenes (multipart/form)   |

Respuesta: `{ "urls": ["https://...", ...] }`

---

## 🗂️ Estructura

```
src/
├─ app/
│  ├─ page.tsx                 # Home (hero + inventario)
│  ├─ products/[slug]/page.tsx # Detalle de producto
│  ├─ admin/                   # Panel CRUD (layout, dashboard, new, [id]/edit, login)
│  └─ api/products/            # API REST serverless
├─ components/
│  ├─ ui/                      # Primitivas brutalistas (Button, Card, Badge, form…)
│  ├─ layout/                  # Navbar, Footer
│  ├─ home/                    # Hero
│  ├─ product/                 # ProductCard, ProductGrid, Gallery, SpecBox…
│  └─ admin/                   # ProductForm, ProductTable, DeleteForm, AdminNotice
├─ lib/
│  ├─ config/site.ts           # Marca, navegación, copy, WhatsApp
│  ├─ supabase/                # Clientes public (anon) y admin (service role)
│  ├─ repositories/products.ts # ÚNICA capa de acceso a datos (Supabase ⇄ fallback)
│  ├─ validators/product.ts    # Esquemas Zod + parseo de formularios
│  ├─ services/whatsapp.ts     # Constructor de enlaces wa.me
│  ├─ auth/                    # Token + helpers del gate de admin
│  ├─ types/                   # Tipos de dominio y de BD
│  └─ data/fallback-products.ts# Catálogo de demo
└─ middleware.ts               # Protege /admin
```

## 🎨 Design tokens

`tailwind.config.ts` es la única fuente de verdad del look. Destacados:

- **Colores**: `primary-container #7fffd4` (aqua), `secondary-container #fe5e1e` (naranja),
  `tertiary-container #f7e1ff` (lavanda), `on-background #1b1b1b`.
- **Bordes**: `border-thin` 2px · `border-thick` 6px · `border-heavy` 8px.
- **Sombras duras**: `shadow-neo-xs … shadow-neo-xl` (offset negro, sin blur).
- **Tipografías**: Montserrat (display), Archivo Narrow (body), Space Mono (labels).
