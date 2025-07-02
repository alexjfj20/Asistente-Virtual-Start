export const APP_NAME = 'Asistente Virtual Start';

export const WHATSAPP_LINK_BASE = 'https://wa.me/1234567890'; // Cambiar por tu número real

export const PAYMENT_METHODS = [
  {
    name: 'Stripe',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg'
  },
  {
    name: 'MercadoPago',
    logoUrl: 'https://img.stackshare.io/service/2721/mercadopago.png'
  },
  {
    name: 'Nequi',
    logoUrl: 'https://seeklogo.com/images/N/nequi-logo-85F39E2F5E-seeklogo.com.png'
  },
  {
    name: 'DaviPlata',
    logoUrl: 'https://seeklogo.com/images/D/daviplata-logo-6F3E1E5E5E-seeklogo.com.png'
  },
  {
    name: 'QR Code',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg'
  }
];

export const SERVICES_DATA = [
  {
    id: 'service-1',
    title: 'Plan Todo-en-Uno - Carrera Remota',
    price: '$17 USD/mes',
    description: 'Acceso completo a todas nuestras herramientas y servicios de IA para impulsar tu carrera como Asistente Virtual.',
    features: [
      'Optimización de CV con IA',
      'Preparación para entrevistas',
      'Búsqueda activa de empleo',
      'Evaluación de perfil freelance',
      'Evaluación para call centers',
      'Coaching profesional personalizado',
      'Acceso a todas las herramientas IA',
      'Soporte prioritario 24/7'
    ],
    supportNote: 'Incluye soporte completo y actualizaciones',
    ctaText: 'Comenzar Ahora',
    type: 'ALL_IN_ONE' as const,
    aiServiceType: 'all_in_one' as const
  }
];

export const TESTIMONIALS_DATA = [
  {
    id: 'testimonial-1',
    quote: 'Gracias a este servicio conseguí mi primer trabajo como asistente virtual en menos de un mes. El CV optimizado por IA fue clave.',
    author: 'María González',
    role: 'Asistente Virtual',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 'testimonial-2',
    quote: 'La asesoría personalizada me ayudó a enfocar mi búsqueda y ahora trabajo con clientes internacionales.',
    author: 'Carlos Ruiz',
    role: 'Freelancer',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: 'testimonial-3',
    quote: 'Excelente servicio. Me prepararon perfectamente para las entrevistas y ahora tengo un trabajo estable remoto.',
    author: 'Ana Martínez',
    role: 'Especialista en Atención al Cliente',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

export const BLOG_POSTS_DATA = [
  {
    id: 'blog-1',
    title: 'Cómo Optimizar tu CV para Trabajos Remotos',
    summary: 'Descubre las claves para crear un currículum que destaque en el mercado de trabajo remoto y capture la atención de los reclutadores.',
    imageUrl: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    link: '#'
  },
  {
    id: 'blog-2',
    title: 'Las Mejores Plataformas para Encontrar Trabajo como Asistente Virtual',
    summary: 'Una guía completa de las plataformas más efectivas para conseguir clientes y proyectos como asistente virtual freelance.',
    imageUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    link: '#'
  },
  {
    id: 'blog-3',
    title: 'Herramientas Esenciales para Asistentes Virtuales',
    summary: 'Conoce las herramientas digitales indispensables que todo asistente virtual profesional debe dominar.',
    imageUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1',
    link: '#'
  }
];