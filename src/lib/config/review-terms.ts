import { siteConfig } from "@/lib/config/site";

/**
 * Términos que el cliente acepta al dejar su opinión (los dos formularios de
 * /opinar). Si los cambias, cambia también la versión.
 */
export const REVIEW_TERMS_VERSION = "2026-11";

export const reviewTerms = {
  title: "Términos de publicación de opiniones",
  items: [
    {
      title: "Qué publicamos",
      body: "Tu calificación, tu comentario, el nombre que escribas en este formulario (te sugerimos tu primer nombre y la inicial de tu apellido), el modelo de tu laptop, la ciudad o distrito de entrega y el mes de compra.",
    },
    {
      title: "Qué nunca publicamos",
      body: "Tu apellido completo, DNI, celular, correo, dirección ni código de pedido. Si mostramos fotos de tu envío, estos datos aparecen ocultos.",
    },
    {
      title: "Uso con fines promocionales",
      body: `Autorizas a ${siteConfig.name} a mostrar tu opinión, sin costo ni compensación, en su web, redes sociales, anuncios y materiales promocionales. Podemos citarla tal cual o resumirla sin cambiar su sentido.`,
    },
    {
      title: "Moderación",
      body: "Podemos no publicar o retirar opiniones con insultos, datos personales de terceros o contenido que no trate sobre la compra.",
    },
    {
      title: "Tus derechos",
      body: `Puedes pedirnos por WhatsApp (${siteConfig.whatsapp.display}) que corrijamos o retiremos tu opinión en cualquier momento: la quitamos de la web y dejamos de usarla en materiales nuevos. Tratamos tus datos conforme a la Ley N.° 29733, Ley de Protección de Datos Personales.`,
    },
    {
      title: "Veracidad",
      body: "Declaras que tu opinión corresponde a una compra real y refleja tu experiencia.",
    },
  ],
} as const;
