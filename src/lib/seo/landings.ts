import type { Product } from "@/lib/types/product";

/**
 * SEO landing pages: one page per search intent ("laptops baratas",
 * "laptops thinkpad"…). Each has an exact-match URL, <title>, <h1> and intro,
 * synonyms spread naturally through unique copy, its own FAQ (FAQPage JSON-LD)
 * and the products that match. Edit the copy here; pages, sitemap and internal
 * links pick it up automatically.
 */

export interface Landing {
  slug: string;
  /** Short label for chips and footer links. */
  label: string;
  /** <title> (≤ 60 chars, exact keyword first). `{min}` = lowest price in stock. */
  title: string;
  /** Meta description (~155 chars). */
  description: string;
  h1: string;
  /** Intro paragraphs (keyword + synonyms in the first sentence). */
  intro: string[];
  /** "Qué buscar" tips: genuinely useful buying advice. */
  tips: { title: string; body: string }[];
  faq: { question: string; answer: string }[];
  /** Which products to show, in which order. */
  select: (products: Product[]) => Product[];
  /** Shown when nothing matches right now (other laptops are listed instead). */
  emptyNote: string;
  /** Related landings for internal links. */
  related: string[];
  keywords: string[];
}

const byPrice = (products: Product[]) => [...products].sort((a, b) => a.price - b.price);
const text = (p: Product) => `${p.brand} ${p.name} ${p.processor ?? ""}`.toLowerCase();
const ramGb = (p: Product) => Number((p.ram ?? "").match(/\d+/)?.[0] ?? 0);
const brandIs = (brand: string) => (products: Product[]) =>
  byPrice(products.filter((p) => text(p).includes(brand)));

export const landings: Landing[] = [
  {
    slug: "laptops-baratas",
    label: "Laptops baratas",
    title: "Laptops Baratas en Perú | Desde {min} · REVOLT",
    description:
      "Laptops baratas en Perú: equipos Lenovo ThinkPad, Dell y HP reacondicionados, con todo funcional y precios económicos en soles. Envíos a todo el Perú.",
    h1: "Laptops baratas en Perú",
    intro: [
      "Si buscas laptops baratas en Perú que de verdad funcionen bien, aquí las tienes: laptops económicas de marcas empresariales como Lenovo ThinkPad, Dell Latitude y HP EliteBook, reacondicionadas por técnicos y a una fracción del precio de una nueva.",
      "Una laptop barata no tiene que ser una laptop mala. Un equipo corporativo de segunda, revisado y con todo funcional, suele rendir más que una laptop nueva de gama baja al mismo precio: mejor procesador, más memoria RAM, SSD y un chasis hecho para durar años.",
    ],
    tips: [
      { title: "Prioriza SSD y 8–16 GB de RAM", body: "Un disco SSD y al menos 8 GB de RAM marcan más diferencia en la velocidad que la marca o el modelo." },
      { title: "Procesador Intel Core i5 / i7 o Ryzen 5", body: "Para estudiar, trabajar y navegar con muchas pestañas, estos procesadores de generaciones recientes sobran." },
      { title: "Desconfía de lo demasiado barato", body: "Pregunta por el estado de la batería y la pantalla. En REVOLT todo funciona, salvo que se indique lo contrario en la ficha." },
    ],
    faq: [
      { question: "¿Cuál es la laptop más barata que venden?", answer: "El catálogo está ordenado de menor a mayor precio: la primera laptop de esta página es la más económica disponible ahora mismo." },
      { question: "¿Por qué son más baratas que una laptop nueva?", answer: "Son equipos empresariales reacondicionados: ya tuvieron un primer uso, pero se revisan, limpian y prueban antes de venderse, así que pagas mucho menos por la misma calidad." },
      { question: "¿Hacen envíos de laptops baratas a todo el Perú?", answer: "Sí, enviamos a Lima, Arequipa y cualquier ciudad del Perú. Coordinamos el envío por WhatsApp." },
    ],
    select: byPrice,
    emptyNote: "",
    related: ["laptops-economicas-para-estudiantes", "laptops-thinkpad", "laptops-de-segunda"],
    keywords: ["laptops baratas", "laptops baratas perú", "laptops económicas", "laptop barata", "laptops baratas lima", "laptops baratas arequipa", "laptops de bajo precio"],
  },
  {
    slug: "laptops-economicas",
    label: "Laptops económicas",
    title: "Laptops Económicas en Perú | Desde {min} · REVOLT",
    description:
      "Laptops económicas en Perú con buen rendimiento: SSD, Intel Core i5/i7 y marcas empresariales a precio accesible. Todo funcional y envíos a todo el Perú.",
    h1: "Laptops económicas en Perú",
    intro: [
      "Una laptop económica puede rendir como una de gama media si eliges bien. Nuestras laptops económicas son equipos Lenovo, Dell y HP de línea empresarial, reacondicionados y probados, con precios accesibles en soles.",
      "En lugar de comprar una laptop nueva de entrada con poca memoria y disco lento, aquí consigues una computadora portátil con SSD, buena RAM y un procesador potente por el mismo dinero o menos.",
    ],
    tips: [
      { title: "Compara especificaciones, no solo el precio", body: "Dos laptops con el mismo precio pueden rendir muy distinto: revisa procesador, RAM y tipo de disco en cada ficha." },
      { title: "Piensa en para qué la usarás", body: "Para clases, ofimática y navegar basta con 8 GB de RAM; para programar o editar, mejor 16 GB." },
      { title: "Precio bajo, calidad empresarial", body: "Las líneas ThinkPad, Latitude y EliteBook se fabrican para uso intensivo y duran más que las laptops de consumo." },
    ],
    faq: [
      { question: "¿Cuánto cuesta una laptop económica en REVOLT?", answer: "Los precios cambian según el stock; en esta página las verás ordenadas de menor a mayor precio, en soles." },
      { question: "¿Una laptop económica sirve para estudiar y trabajar?", answer: "Sí. Todas tienen procesadores Intel Core o AMD Ryzen y SSD, suficientes para Office, videollamadas y navegación." },
      { question: "¿Cómo compro una laptop económica?", answer: "Elige el equipo, presiona el botón de WhatsApp y coordinamos el pago y el envío a tu ciudad." },
    ],
    select: byPrice,
    emptyNote: "",
    related: ["laptops-baratas", "laptops-economicas-para-estudiantes", "laptops-reacondicionadas"],
    keywords: ["laptops económicas", "laptops economicas perú", "laptop económica", "laptops a buen precio", "computadoras portátiles económicas", "laptops accesibles"],
  },
  {
    slug: "laptops-reacondicionadas",
    label: "Laptops reacondicionadas",
    title: "Laptops Reacondicionadas en Perú | Todo Funcional · REVOLT",
    description:
      "Laptops reacondicionadas en Perú: Lenovo ThinkPad, Dell Latitude y HP EliteBook revisadas por técnicos, con todo funcional y fotos reales. Envíos a todo el Perú.",
    h1: "Laptops reacondicionadas en Perú",
    intro: [
      "Una laptop reacondicionada es un equipo de primer uso empresarial que se revisa, limpia y prueba a fondo antes de volver a venderse. Así obtienes una laptop de gama alta a precio de laptop barata.",
      "En REVOLT cada laptop reacondicionada se entrega con todo funcional, a menos que se especifique lo contrario en su descripción. Publicamos fotos reales de cada equipo para que sepas exactamente lo que recibes.",
    ],
    tips: [
      { title: "Reacondicionada no es lo mismo que usada", body: "Una laptop usada se vende tal cual; una reacondicionada pasa por revisión técnica, limpieza y pruebas de cada componente." },
      { title: "Revisa el estado estético", body: "Indicamos si el equipo está en excelente o buen estado y si tiene marcas de uso." },
      { title: "Comprar reacondicionado es sostenible", body: "Alargar la vida de una laptop reduce residuos electrónicos y te ahorra dinero." },
    ],
    faq: [
      { question: "¿Qué significa que una laptop sea reacondicionada?", answer: "Que fue revisada por técnicos: se prueban pantalla, teclado, batería, puertos, cámara y conectividad, y se limpia por dentro y por fuera." },
      { question: "¿Las laptops reacondicionadas funcionan bien?", answer: "Sí. Se entregan con todo funcional, a menos que se especifique lo contrario en la ficha del producto." },
      { question: "¿De dónde vienen las laptops reacondicionadas?", answer: "Principalmente de renovaciones de equipos en empresas, por eso son modelos de línea empresarial como ThinkPad, Latitude y EliteBook." },
    ],
    select: byPrice,
    emptyNote: "",
    related: ["laptops-de-segunda", "laptops-thinkpad", "laptops-baratas"],
    keywords: ["laptops reacondicionadas", "laptops reacondicionadas perú", "laptop reacondicionada", "laptops refurbished", "laptops reacondicionadas lima", "laptops reacondicionadas arequipa"],
  },
  {
    slug: "laptops-thinkpad",
    label: "Laptops ThinkPad",
    title: "Laptops ThinkPad en Perú | Lenovo ThinkPad Baratas · REVOLT",
    description:
      "Laptops Lenovo ThinkPad en Perú a precio bajo: T14, X1 Carbon, E14, L14 y más, reacondicionadas y con todo funcional. Envíos a todo el Perú.",
    h1: "Laptops ThinkPad en Perú",
    intro: [
      "Las laptops ThinkPad de Lenovo son las favoritas de empresas, programadores y universitarios por su teclado, su resistencia y su durabilidad. Aquí encuentras Lenovo ThinkPad reacondicionadas a precio de laptop económica.",
      "Cada ThinkPad se revisa por completo: teclado, TrackPoint, pantalla, batería, puertos y conectividad. Si algún detalle no está al 100 %, lo indicamos en la descripción.",
    ],
    tips: [
      { title: "Serie T y X: las más premium", body: "La ThinkPad T14 y la X1 Carbon son ligeras, muy resistentes y con mejores pantallas." },
      { title: "Serie E y L: mejor precio", body: "La ThinkPad E14 y la L14 ofrecen la misma calidad de teclado a un precio más bajo." },
      { title: "Fíjate en la generación", body: "Un Intel Core de 10.ª u 11.ª generación (o un Ryzen 5000) rinde de sobra para trabajo y estudios." },
    ],
    faq: [
      { question: "¿Por qué comprar una ThinkPad?", answer: "Por su teclado, su construcción con certificación militar de resistencia y la facilidad para conseguir repuestos. Duran muchos años." },
      { question: "¿Las ThinkPad reacondicionadas funcionan como nuevas?", answer: "Sí. Todas se entregan con todo funcional, a menos que se especifique lo contrario en la ficha del equipo." },
      { question: "¿Tienen ThinkPad con pantalla táctil?", answer: "Depende del stock: revisa las especificaciones de cada laptop o escríbenos por WhatsApp y te contamos qué hay disponible." },
    ],
    select: brandIs("thinkpad"),
    emptyNote: "Ahora mismo no tenemos ThinkPad en stock, pero estas laptops son igual de recomendables:",
    related: ["laptops-lenovo", "laptops-para-programar", "laptops-baratas"],
    keywords: ["laptops thinkpad", "lenovo thinkpad", "thinkpad perú", "thinkpad barata", "thinkpad t14", "thinkpad x1 carbon", "thinkpad reacondicionada"],
  },
  {
    slug: "laptops-lenovo",
    label: "Laptops Lenovo",
    title: "Laptops Lenovo Baratas en Perú | Reacondicionadas · REVOLT",
    description:
      "Laptops Lenovo baratas en Perú: ThinkPad y modelos empresariales reacondicionados, con todo funcional y precios en soles. Envíos a todo el Perú.",
    h1: "Laptops Lenovo en Perú",
    intro: [
      "Encuentra laptops Lenovo baratas en Perú: principalmente modelos ThinkPad de línea empresarial, reacondicionados y listos para estudiar, trabajar o programar.",
      "Lenovo es la marca de laptops más vendida del mundo y su línea ThinkPad es sinónimo de durabilidad. Comprarla reacondicionada es la forma más económica de tener una laptop Lenovo de calidad.",
    ],
    tips: [
      { title: "ThinkPad antes que IdeaPad", body: "A igual precio, una ThinkPad reacondicionada suele estar mejor construida que una IdeaPad nueva de gama baja." },
      { title: "Revisa la RAM ampliable", body: "Muchos modelos Lenovo permiten ampliar la memoria RAM o el SSD más adelante." },
      { title: "Pantalla táctil y 2 en 1", body: "Algunos modelos (como la serie Yoga) se convierten en tablet: ideales para tomar apuntes." },
    ],
    faq: [
      { question: "¿Qué laptop Lenovo me conviene?", answer: "Para estudios y oficina, cualquier ThinkPad con Core i5 o Ryzen 5 y 8–16 GB de RAM. Si programas o usas muchos programas a la vez, busca 16 GB." },
      { question: "¿Las laptops Lenovo son originales?", answer: "Sí, son equipos Lenovo originales de uso corporativo, reacondicionados y probados." },
      { question: "¿Puedo pagar en dólares?", answer: "Sí. Los precios están en soles y mostramos el equivalente en dólares en cada laptop." },
    ],
    select: brandIs("lenovo"),
    emptyNote: "Ahora mismo no tenemos laptops Lenovo en stock. Mira estas alternativas:",
    related: ["laptops-thinkpad", "laptops-baratas", "laptops-dell"],
    keywords: ["laptops lenovo", "laptop lenovo barata", "lenovo perú", "laptops lenovo reacondicionadas"],
  },
  {
    slug: "laptops-dell",
    label: "Laptops Dell",
    title: "Laptops Dell Baratas en Perú | Dell Latitude · REVOLT",
    description:
      "Laptops Dell baratas en Perú: Dell Latitude reacondicionadas con todo funcional, ideales para trabajo y estudios. Precios en soles y envíos a todo el Perú.",
    h1: "Laptops Dell en Perú",
    intro: [
      "Laptops Dell baratas en Perú, principalmente de la línea Dell Latitude: la serie empresarial de Dell, reacondicionada y a precio económico.",
      "Las Dell Latitude son laptops pensadas para jornadas largas de trabajo: buena batería, teclados cómodos y muchos puertos. Reacondicionadas, son una de las mejores compras calidad-precio.",
    ],
    tips: [
      { title: "Latitude 5000 y 7000", body: "La serie 5000 es la más equilibrada en precio; la 7000 es más ligera y premium." },
      { title: "Pantalla de 14\" o 15.6\"", body: "14\" para llevar a todos lados; 15.6\" si trabajas muchas horas con hojas de cálculo." },
      { title: "Busca SSD NVMe", body: "Un SSD NVMe hace que la laptop encienda en segundos y abra los programas al instante." },
    ],
    faq: [
      { question: "¿Las Dell Latitude son buenas?", answer: "Sí, es la línea empresarial de Dell: resistente, con buena batería y pensada para durar años." },
      { question: "¿Las laptops Dell tienen todo funcional?", answer: "Sí, todas se entregan con todo funcional, a menos que se especifique lo contrario en la ficha." },
      { question: "¿Envían laptops Dell a provincias?", answer: "Sí, enviamos a Lima y a cualquier ciudad del Perú." },
    ],
    select: brandIs("dell"),
    emptyNote: "Ahora mismo no tenemos laptops Dell en stock. Estas son igual de buenas para trabajo y estudios:",
    related: ["laptops-hp", "laptops-para-trabajo", "laptops-baratas"],
    keywords: ["laptops dell", "dell latitude", "laptop dell barata", "dell perú"],
  },
  {
    slug: "laptops-hp",
    label: "Laptops HP",
    title: "Laptops HP Baratas en Perú | HP EliteBook · REVOLT",
    description:
      "Laptops HP baratas en Perú: HP EliteBook y ProBook reacondicionadas, con todo funcional. Precios en soles y envíos a todo el Perú.",
    h1: "Laptops HP en Perú",
    intro: [
      "Laptops HP baratas en Perú de las líneas empresariales HP EliteBook y ProBook, reacondicionadas y con todo funcional.",
      "Las HP EliteBook tienen chasis de aluminio, buenas cámaras y funciones de seguridad pensadas para empresas. Reacondicionadas, cuestan mucho menos que una HP nueva de gama media.",
    ],
    tips: [
      { title: "EliteBook = gama alta", body: "Aluminio, mejor pantalla y teclado: la mejor opción de HP para usar a diario." },
      { title: "ProBook = mejor precio", body: "Una alternativa más económica con la misma base empresarial." },
      { title: "Pregunta por la batería", body: "Te indicamos el estado de la batería de cada laptop antes de comprar." },
    ],
    faq: [
      { question: "¿Las HP EliteBook son buenas?", answer: "Sí, son la línea premium empresarial de HP: construcción en aluminio, buena seguridad y gran durabilidad." },
      { question: "¿Tienen laptops HP en stock?", answer: "El stock rota rápido. Si no ves una HP ahora mismo, escríbenos por WhatsApp y te avisamos cuando llegue." },
      { question: "¿Puedo pagar en dólares?", answer: "Sí, mostramos el equivalente en dólares en cada laptop." },
    ],
    select: brandIs("hp "),
    emptyNote: "Ahora mismo no tenemos laptops HP en stock. Mira estas opciones similares:",
    related: ["laptops-dell", "laptops-lenovo", "laptops-baratas"],
    keywords: ["laptops hp", "hp elitebook", "laptop hp barata", "hp perú"],
  },
  {
    slug: "laptops-de-segunda",
    label: "Laptops de segunda",
    title: "Laptops de Segunda y Seminuevas en Perú | REVOLT",
    description:
      "Laptops de segunda y seminuevas en Perú, revisadas por técnicos y con todo funcional. Lenovo, Dell y HP a precios bajos. Envíos a todo el Perú.",
    h1: "Laptops de segunda y seminuevas",
    intro: [
      "¿Buscas laptops de segunda o seminuevas en Perú sin el riesgo de comprarle a un desconocido? Nuestras laptops usadas son equipos empresariales reacondicionados: revisados, limpiados y probados antes de venderse.",
      "La diferencia entre una laptop de segunda mano cualquiera y una reacondicionada es la revisión técnica: aquí sabes exactamente qué compras, con fotos reales y el estado de cada equipo.",
    ],
    tips: [
      { title: "Seminueva vs. usada", body: "«Excelente estado» casi no tiene marcas de uso; «Buen estado» puede tener marcas leves que no afectan el funcionamiento." },
      { title: "Fotos reales", body: "Cada ficha tiene fotos del equipo exacto que recibirás." },
      { title: "Todo funcional", body: "Si algún componente no está al 100 %, lo verás escrito en la descripción." },
    ],
    faq: [
      { question: "¿Es seguro comprar una laptop de segunda?", answer: "Sí, si está revisada. Las nuestras pasan por diagnóstico, limpieza y pruebas, y se entregan con todo funcional salvo que se indique lo contrario." },
      { question: "¿Qué significa laptop seminueva?", answer: "Una laptop con poco uso y en excelente estado estético, que funciona como nueva." },
      { question: "¿Puedo ver más fotos antes de comprar?", answer: "Claro, escríbenos por WhatsApp y te enviamos más fotos o un video del equipo." },
    ],
    select: byPrice,
    emptyNote: "",
    related: ["laptops-baratas", "laptops-thinkpad", "laptops-economicas-para-estudiantes"],
    keywords: ["laptops de segunda", "laptops seminuevas", "laptops usadas", "laptop de segunda mano", "laptops de segunda arequipa", "laptops usadas lima"],
  },
  {
    slug: "laptops-economicas-para-estudiantes",
    label: "Para estudiantes",
    title: "Laptops Económicas para Estudiantes en Perú | REVOLT",
    description:
      "Laptops económicas para estudiantes y universitarios en Perú: rápidas, livianas y con todo funcional. Ideales para clases virtuales, Office y programación.",
    h1: "Laptops económicas para estudiantes",
    intro: [
      "Laptops económicas para estudiantes, universitarios y escolares en Perú: equipos rápidos para clases virtuales, trabajos en Word y Excel, investigación y hasta programación, a un precio que sí entra en el presupuesto.",
      "Para estudiar no necesitas una laptop gamer ni la más cara: necesitas un SSD, 8–16 GB de RAM y una buena batería. Eso es exactamente lo que tienen nuestras laptops empresariales reacondicionadas.",
    ],
    tips: [
      { title: "Liviana para la universidad", body: "Una laptop de 14\" y menos de 1.5 kg se lleva todo el día sin problema." },
      { title: "Cámara y micrófono", body: "Todas tienen cámara web y micrófono funcionando para tus clases virtuales." },
      { title: "Pantalla táctil para apuntes", body: "Los modelos 2 en 1 con lápiz son ideales para tomar apuntes y dibujar." },
    ],
    faq: [
      { question: "¿Qué laptop barata es buena para la universidad?", answer: "Cualquier laptop con SSD, 8–16 GB de RAM y Core i5 / Ryzen 5. Las ThinkPad son las más recomendadas por su teclado y durabilidad." },
      { question: "¿Sirven para programar?", answer: "Sí, especialmente las de 16 GB de RAM. Mira también nuestra sección de laptops para programar." },
      { question: "¿Hacen envíos a provincias?", answer: "Sí, enviamos a todo el Perú." },
    ],
    select: byPrice,
    emptyNote: "",
    related: ["laptops-para-programar", "laptops-baratas", "laptops-thinkpad"],
    keywords: ["laptops para estudiantes", "laptop para universidad", "laptops económicas para estudiantes", "laptop para clases virtuales", "laptop barata para estudiar"],
  },
  {
    slug: "laptops-para-programar",
    label: "Para programar",
    title: "Laptops para Programar Baratas en Perú | 16 GB RAM · REVOLT",
    description:
      "Laptops para programar en Perú con 16 GB de RAM, SSD y procesadores Core i5/i7 o Ryzen. ThinkPad reacondicionadas a precio bajo. Envíos a todo el Perú.",
    h1: "Laptops para programar",
    intro: [
      "Laptops para programar baratas en Perú: equipos con 16 GB de RAM, SSD y procesadores Intel Core i5 / i7 o AMD Ryzen, capaces de mover VS Code, Docker, varios navegadores y bases de datos al mismo tiempo.",
      "Muchos desarrolladores eligen una ThinkPad por su teclado y por lo bien que funciona Linux en ella. Reacondicionada, es la laptop para programar con mejor relación calidad-precio.",
    ],
    tips: [
      { title: "16 GB de RAM como mínimo", body: "Docker, emuladores y el navegador consumen mucha memoria: 16 GB evita que la laptop se cuelgue." },
      { title: "SSD de 256 GB o más", body: "Compilar y abrir proyectos es mucho más rápido con un SSD NVMe." },
      { title: "Teclado cómodo", body: "Vas a escribir horas: el teclado de una ThinkPad o una Latitude se agradece." },
    ],
    faq: [
      { question: "¿Cuánta RAM necesito para programar?", answer: "16 GB es lo recomendado para desarrollo web, móvil o con Docker. Para empezar a aprender, 8 GB puede bastar." },
      { question: "¿Funcionan con Linux?", answer: "Sí, las ThinkPad y Dell Latitude tienen muy buena compatibilidad con Ubuntu y otras distribuciones." },
      { question: "¿Sirven para diseño o videojuegos?", answer: "Para diseño ligero sí. No son laptops gamer: para juegos exigentes se necesita una tarjeta gráfica dedicada." },
    ],
    select: (products) => byPrice(products.filter((p) => ramGb(p) >= 16)),
    emptyNote: "Ahora mismo no hay laptops de 16 GB en stock. Estas también sirven para empezar a programar:",
    related: ["laptops-thinkpad", "laptops-economicas-para-estudiantes", "laptops-para-trabajo"],
    keywords: ["laptops para programar", "laptop para programación", "laptop 16gb ram", "laptop para programar barata"],
  },
  {
    slug: "laptops-para-trabajo",
    label: "Para trabajo y oficina",
    title: "Laptops para Trabajo y Oficina Baratas en Perú | REVOLT",
    description:
      "Laptops para trabajo y oficina en Perú: Lenovo ThinkPad, Dell Latitude y HP EliteBook reacondicionadas, con todo funcional y a precio bajo.",
    h1: "Laptops para trabajo y oficina",
    intro: [
      "Laptops para trabajo y oficina en Perú: las mismas laptops empresariales que usan las grandes compañías, reacondicionadas y a precio económico para profesionales, emprendedores y empresas.",
      "Office, correo, videollamadas y sistemas de la empresa funcionan con fluidez en una laptop con SSD y Core i5 / i7. Si necesitas varias unidades, escríbenos para una cotización.",
    ],
    tips: [
      { title: "Videollamadas sin cortes", body: "Cámara, micrófono, Wi-Fi y audio probados en cada equipo." },
      { title: "Muchos puertos", body: "HDMI, USB y, en muchos modelos, puerto de red RJ45 y USB-C." },
      { title: "Compras por volumen", body: "¿Equipas una oficina? Te armamos una cotización por varias laptops." },
    ],
    faq: [
      { question: "¿Venden laptops para empresas?", answer: "Sí, escríbenos por WhatsApp con la cantidad que necesitas y te enviamos una cotización." },
      { question: "¿Qué laptop es mejor para oficina?", answer: "Una Lenovo ThinkPad, Dell Latitude o HP EliteBook con SSD y 8–16 GB de RAM: hechas para jornadas largas." },
      { question: "¿Hacen envíos a todo el Perú?", answer: "Sí, a Lima y a cualquier ciudad del país." },
    ],
    select: byPrice,
    emptyNote: "",
    related: ["laptops-dell", "laptops-hp", "laptops-thinkpad"],
    keywords: ["laptops para trabajo", "laptops para oficina", "laptops empresariales", "laptops corporativas"],
  },
  {
    slug: "laptops-arequipa",
    label: "Laptops en Arequipa",
    title: "Laptops en Arequipa | Baratas y Reacondicionadas · REVOLT",
    description:
      "Laptops en Arequipa: baratas, reacondicionadas y seminuevas, con todo funcional. Entrega en persona en Arequipa, coordinada por WhatsApp, y envíos a todo el Perú.",
    h1: "Laptops en Arequipa",
    intro: [
      "REVOLT es una tienda online de laptops en Arequipa. Vendemos laptops baratas y reacondicionadas de marcas como Lenovo ThinkPad, Dell y HP, revisadas por técnicos y con todo funcional.",
      "Si estás en Arequipa te la entregamos en persona: la revisas y la pruebas al recibirla. Si estás en otra ciudad, te la enviamos a cualquier parte del Perú.",
    ],
    tips: [
      { title: "Somos 100 % online", body: "No tenemos tienda física: todo se coordina por WhatsApp, rápido y sin colas." },
      { title: "Fotos del equipo real", body: "Lo que ves en la ficha es exactamente la laptop que recibirás." },
      { title: "Te asesoramos antes de comprar", body: "Cuéntanos para qué la necesitas y te recomendamos la laptop adecuada." },
    ],
    faq: [
      { question: "¿Dónde están ubicados?", answer: "Somos una tienda netamente virtual con base en Arequipa. Entregamos en persona dentro de la ciudad y enviamos a todo el Perú." },
      { question: "¿Cómo recibo mi laptop en Arequipa?", answer: "En persona: al comprar por WhatsApp acordamos contigo el punto de entrega dentro de Arequipa." },
      { question: "¿También envían a Lima y otras ciudades?", answer: "Sí, enviamos a Lima, Cusco, Tacna, Puno y cualquier ciudad del Perú." },
    ],
    select: byPrice,
    emptyNote: "",
    related: ["laptops-baratas", "laptops-reacondicionadas", "laptops-thinkpad"],
    keywords: ["laptops arequipa", "laptops en arequipa", "venta de laptops arequipa", "laptops baratas arequipa", "laptops reacondicionadas arequipa", "tienda de laptops arequipa"],
  },
];

export const landingBySlug = (slug: string) => landings.find((landing) => landing.slug === slug);
export const landingPath = (slug: string) => `/${slug}`;
