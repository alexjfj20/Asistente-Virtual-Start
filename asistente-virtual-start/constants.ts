import { Service, Testimonial, BlogPost, ServiceType, NavLink } from './types';

export const WHATSAPP_PHONE_NUMBER = "573507954764"; // Colombian number
export const WHATSAPP_LINK_BASE = `https://wa.me/${WHATSAPP_PHONE_NUMBER}`;
export const APP_NAME = "Asistente Virtual Start";

export const SERVICES_DATA: Service[] = [
  {
    id: "all-in-one",
    title: "Plan Todo en Uno – Potenciado por IA",
    price: "$17 USD / mes",
    description: "Accede a todos los servicios inteligentes desde un solo plan. Sin confusión, sin paquetes separados. Todo lo que necesitas para trabajar en remoto, desde un solo lugar.",
    features: [
      "Optimización automática de tu hoja de vida (PDF o DOC)",
      "Asesoría personalizada con IA para destacar tu perfil",
      "Simulacros de entrevistas remotas para Call Center",
      "Entrenamiento de voz y análisis de acento con IA",
      "Generador de propuestas freelance + buscador inteligente de oportunidades",
      "Panel de usuario con historial, favoritos y progreso guardado",
      "Acceso 24/7 desde cualquier dispositivo",
    ],
    supportNote: "🔧 Incluye soporte técnico exclusivo sobre el uso de la aplicación.\n(No se ofrece soporte ni asesoría individual sobre plataformas externas o procesos de contratación reales.)",
    ctaText: "✅ Acceder a Todo por $17 USD / mes",
    type: ServiceType.ALL_IN_ONE,
    aiServiceType: 'all_in_one',
  },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: "t1",
    quote: "¡Gracias a Asistente Virtual Start conseguí mi primer cliente en menos de una semana! La asesoría fue clave y el CV quedó espectacular.",
    author: "Ana Pérez",
    role: "Asistente Virtual Freelancer",
    image: "https://picsum.photos/seed/testimonial1/100/100"
  },
  {
    id: "t2",
    quote: "El arreglo de mi hoja de vida fue increíble. Recibí muchas más respuestas de las que esperaba. ¡Totalmente recomendado!",
    author: "Carlos López",
    role: "Emprendedor Digital",
    image: "https://picsum.photos/seed/testimonial2/100/100"
  },
  {
    id: "t3",
    quote: "No sabía por dónde empezar y esta plataforma me dio todas las herramientas y la confianza. ¡Súper agradecida!",
    author: "Sofía Gómez",
    role: "Nueva Asistente Virtual",
    image: "https://picsum.photos/seed/testimonial3/100/100"
  },
];

export const BLOG_POSTS_DATA: BlogPost[] = [
  {
    id: "b1",
    title: "5 Plataformas Esenciales para Encontrar Empleo Remoto como AV",
    summary: "Descubre las mejores plataformas y cómo usarlas para iniciar tu búsqueda de trabajo como asistente virtual.",
    imageUrl: "https://picsum.photos/seed/blog1/400/250",
    link: "#!" // Placeholder link
  },
  {
    id: "b2",
    title: "Cómo Prepararte para tu Primera Entrevista de Asistente Virtual",
    summary: "Consejos prácticos para destacar en tus entrevistas, mostrar tu potencial y superar los nervios.",
    imageUrl: "https://picsum.photos/seed/blog2/400/250",
    link: "#!" // Placeholder link
  },
  {
    id: "b3",
    title: "Herramientas Gratuitas Imprescindibles para Asistentes Virtuales Eficientes",
    summary: "Optimiza tu trabajo y productividad con estas herramientas gratuitas que te ayudarán a ser más eficiente desde el día uno.",
    imageUrl: "https://picsum.photos/seed/blog3/400/250",
    link: "#!" // Placeholder link
  },
];

// NAV_LINKS_DATA will be dynamically generated in App.tsx based on auth state
// export const NAV_LINKS_DATA: NavLink[] = [
//   { href: "#inicio", label: "Inicio" },
//   { href: "#servicios", label: "Servicios" },
//   { href: "#agendar", label: "Agendar" },
//   { href: "#testimonios", label: "Testimonios" },
//   { href: "#blog", label: "Recursos" },
//   { href: "#contacto", label: "Contacto" },
// ];

export const PAYMENT_METHODS = [
    { name: "Stripe", logoUrl: "https://js.stripe.com/v3/fingerprinted/img/stripe-logo-blurple.svg" }, // Example, use actual or generic icons
    { name: "MercadoPago", logoUrl: "https://img.stackshare.io/service/2721/mercadopago.png" },
    { name: "Nequi", logoUrl: "https://seeklogo.com/images/N/nequi-logo-5177A0F7E0-seeklogo.com.png" },
    { name: "DaviPlata", logoUrl: "https://seeklogo.com/images/D/daviplata-logo-5465C0C14D-seeklogo.com.png" },
    { name: "QR Code", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"},
];