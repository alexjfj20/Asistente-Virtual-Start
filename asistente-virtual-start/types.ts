import React from 'react';

export interface Service {
  id: string;
  title: string;
  price: string;
  description?: string;
  features: string[];
  supportNote?: string;
  ctaText: string;
  type: ServiceType;
  aiServiceType?: 'cv' | 'advisor' | 'call_center' | 'freelancer_pro' | 'all_in_one'; // New field for AI services
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  image?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  imageUrl?: string;
  link?: string;
}

export enum ServiceType {
  ALL_IN_ONE = "Plan Todo en Uno – Potenciado por IA",
  CV = "Arreglo de Hoja de Vida",
  ASESORIA = "Asesoría Completa",
  CALL_CENTER = "Asesoría Call Center",
  FREELANCER = "Asesoría Freelance Pro",
}

export interface NavLink {
  href: string;
  label: string;
  action?: () => void; // For dynamic actions like opening modals
  requiresAuth?: boolean;
  hideWhenAuth?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface ClientService {
  id: string;
  name: string;
  status: 'Pendiente de Agendamiento' | 'En Progreso' | 'Completada' | 'CV Entregado' | 'Requiere Atención' | 'Aprobado y Listo para Descargar' | 'Perfil Evaluado' | 'Perfil Freelance Evaluado'; // Added new status
  clientNotes?: string;
  icon: React.ReactNode;
  serviceType: ServiceType; // Para referencia o lógica futura
  optimizedCvText?: string; // Added to store optimized CV text
  lastUpdated: string; // Added to store the date of last update/creation
}

export interface PaymentGateway {
    id: string;
    name: string;
    logoUrl: string;
    isActive: boolean;
    config: {
        publicKey?: string;
        secretKey?: string;
        accessToken?: string;
        phoneNumber?: string;
        webhookUrl?: string;
        qrImageUrl?: string; // For QR Code gateway
    };
}

export interface JobOpportunity {
    title: string;
    client: string;
    budget: string;
    language: 'Español' | 'Inglés' | 'Bilingüe';
    description: string;
    tags: string[];
}

export enum ModalType {
  NONE,
  AUTH,
  AI_CV_HELPER,
  AI_ADVISOR,
  REQUEST_SERVICE_UPDATE,
  STRIPE_PAYMENT,
  QR_PAYMENT,
  MERCADOPAGO_REDIRECT,
  EDIT_SERVICE_PLAN,
  CONFIGURE_PAYMENT_GATEWAY,
  CALL_CENTER_ADVISOR, 
  FREELANCER_ADVISOR, // Added for the new module
}