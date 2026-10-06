# REVOLT — Laptops reacondicionadas en Arequipa

E-commerce de laptops reacondicionadas orientado a **Arequipa y todo el Perú** (100 % en
español, precios en soles con equivalente en dólares), construido con
**Next.js (App Router)** + **Supabase**, optimizado para desplegarse como **funciones
serverless en Vercel**. Incluye un **CRUD de administración** completo y una tienda
pública. Las pantallas provienen del proyecto de Stitch _"Revolt Neobrutalist Laptop Store"_.

> Diseño 100% tokenizado y modular. Nada de datos quemados en componentes: todo el
> contenido sale de Supabase (o de un dataset de demo de respaldo) y la configuración
> vive en `src/lib/config` + variables de entorno.

---

## ✨ Características

- **Tienda pública**: home (hero, beneficios, catálogo, cómo comprar, nosotros, FAQ),
  ficha de producto en `/laptops/[slug]` y página **Sobre nosotros** en `/nosotros`.
- **Texto enriquecido**: descripción y "Nuestra opinión" se editan con un editor WYSIWYG
  (Tiptap) y se sanitizan en el servidor con lista blanca (`src/lib/rich-text`).
- **SEO**: metadatos en español, canonical, OpenGraph/Twitter, `sitemap.xml`, `robots.txt`,
  manifest, íconos y datos estructurados (ComputerStore, Product/Offer, FAQPage, Breadcrumb).
- **Analíticas**: Vercel Web Analytics + Speed Insights (y evento `whatsapp_click`).
- **CRUD admin** (`/admin`): crear, listar, editar y borrar productos.
- **Doble vía de escritura**: Server Actions (panel) **y** API REST serverless (`/api/products`).
- **Supabase** como base de datos con RLS (lectura pública / escritura con service role).
- **Modo demo**: si no configuras Supabase, la tienda funciona con datos de respaldo.
- **WhatsApp checkout**: el CTA arma un enlace `wa.me` con el producto.
- **Design system tokenizado** en `tailwind.config.ts` + `globals.css` (colores, tipografías, sombras).
- **Auth de admin** simple por contraseña (proxy + cookie), opcional.

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
| `NEXT_PUBLIC_SITE_URL`          | URL canónica del sitio (en producción: el dominio propio, p. ej. `https://revolt.pe`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | (Opcional) token de Google Search Console      |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION`   | (Opcional) token de Bing Webmaster Tools       |
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

- Entra en **`/admin`** (enlace "Administración" al pie de la página).
- La descripción y "Nuestra opinión" usan un editor de **texto enriquecido**: negritas,
  cursivas, subtítulos, listas, citas y enlaces. El HTML se sanitiza antes de guardarse.
  Las descripciones antiguas en texto plano se convierten solas a párrafos y listas.
- Si definiste `ADMIN_PASSWORD`, el `proxy` te redirige a `/admin/login`.
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
4. **Analíticas**: en el proyecto de Vercel → pestaña **Analytics** → *Enable* (y en
   **Speed Insights** → *Enable*). El código ya incluye `<Analytics />` y `<SpeedInsights />`;
   las visitas aparecen tras el siguiente deploy.
5. **Dominio propio**: Settings → Domains → agrega el dominio (y `www` redirigiendo al dominio
   principal). Luego cambia `NEXT_PUBLIC_SITE_URL` a `https://tu-dominio` y vuelve a desplegar.

### 🔎 Checklist SEO tras el lanzamiento

- Verifica el dominio en **Google Search Console** y envía `https://tu-dominio/sitemap.xml`.
- Crea/actualiza el **Perfil de Empresa de Google** (Google Maps) en Arequipa con el mismo
  nombre, WhatsApp y web: es lo que más pesa para búsquedas locales ("laptops Arequipa").
- Si tienes dirección física, complétala en `siteConfig.business.streetAddress`.
- Agrega las redes sociales reales en `siteConfig.socials` (se ocultan si están vacías).

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
│  ├─ page.tsx                 # Home (hero, beneficios, catálogo, pasos, nosotros, FAQ)
│  ├─ laptops/[slug]/page.tsx  # Ficha de producto (/products/* redirige aquí con 308)
│  ├─ nosotros/page.tsx        # Sobre nosotros
│  ├─ sitemap.ts · robots.ts · manifest.ts · opengraph-image.tsx · icon.png
│  ├─ admin/                   # Panel CRUD (layout, dashboard, new, [id]/edit, login)
│  └─ api/products/            # API REST serverless
├─ components/
│  ├─ ui/                      # Primitivas (Button, Icon, RichText, SectionHeading, form…)
│  ├─ layout/                  # Navbar, Footer, PageBackground
│  ├─ home/                    # Hero, Benefits, HowToBuy, AboutTeaser, Faq, FinalCta
│  ├─ product/                 # ProductCard, ProductGrid, Gallery, StockStatus…
│  ├─ seo/ · analytics/        # JSON-LD y enlaces de WhatsApp con tracking
│  └─ admin/                   # ProductForm, RichTextEditor, ProductTable, DeleteForm…
├─ lib/
│  ├─ config/site.ts           # Marca, navegación, todos los textos, FAQ, SEO, WhatsApp
│  ├─ seo/structured-data.ts   # Generadores schema.org
│  ├─ rich-text/               # Conversión (cliente) y sanitización (servidor) de HTML
│  ├─ utils/localize.ts        # Traduce etiquetas antiguas en inglés al mostrarlas
│  ├─ supabase/                # Clientes public (anon) y admin (service role)
│  ├─ repositories/products.ts # ÚNICA capa de acceso a datos (Supabase ⇄ fallback)
│  ├─ validators/product.ts    # Esquemas Zod + parseo de formularios
│  ├─ services/whatsapp.ts     # Constructor de enlaces wa.me
│  ├─ auth/                    # Token + helpers del gate de admin
│  ├─ types/                   # Tipos de dominio y de BD
│  └─ data/fallback-products.ts# Catálogo de demo
└─ proxy.ts                    # Protege /admin
```

## 🎨 Diseño

Sistema de diseño guiado por las skills **ui-ux-pro-max** y **emil-design-eng** (Emil Kowalski).
`tailwind.config.ts` + `src/app/globals.css` son la única fuente de verdad del look:

- **Colores**: `primary #12B480` (verde del logo) sobre negro AMOLED; `deal` naranja para descuentos.
- **Glassmorphism**: manchas de luz animadas (`PageBackground`), fondo aurora fijo y superficies `.glass`.
- **Tipografía**: Archivo Narrow (condensada, cuadrada) para títulos y texto, autoalojada con `next/font`.
- **Íconos**: SVG de `lucide-react`.
- **Movimiento**: solo CSS o componentes que respetan `prefers-reduced-motion`; curvas `--ease-out`.
- **Pantallas grandes**: desde 1920 px el tamaño base escala con el viewport (2K se ve como Full HD, más grande).

### Componentes de React Bits

Instalados con `npx shadcn@latest add @react-bits/<Nombre>-TS-TW` (registro en `components.json`)
y adaptados (rendimiento y accesibilidad) en `src/components/`:

| Componente | Uso |
| --- | --- |
| `GlassSurface` | Navbar de vidrio (respaldo oscuro para Safari/Firefox) |
| `ElectricLogo` | Rayos sobre el isotipo del hero (solo escritorio; shader precompilado en paralelo) |
| `ShinyText` | Título "Laptops reacondicionadas en Arequipa" |
| `SpotlightCard` | Tarjetas de producto (luz que sigue al mouse) |
| `ClickSpark` | Chispas en los botones de compra / WhatsApp |

### Probar desde el celular u otra PC

`next.config.mjs` agrega automáticamente las IP de la red local a `allowedDevOrigins`, así que puedes
abrir `http://<IP-de-esta-PC>:3000` en otro dispositivo durante el desarrollo.
