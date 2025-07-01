import React, { useState, useEffect } from 'react';
import { PAYMENT_METHODS } from '../constants';
import { Service } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { ApiService, useServices } from '../services/api';

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WrenchScrewdriverIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.75 3.75 0 00-5.303-5.303L6.25 9.75M11.42 15.17L6.25 9.75m5.17 5.42l-2.472 2.472a3.75 3.75 0 01-5.303-5.303L9.75 6.25m5.17 5.42l2.472-2.472a3.75 3.75 0 00-5.303-5.303L9.75 6.25" />
    </svg>
);


const PaymentLogos: React.FC = () => (
  <div className="mt-6">
    <p className="text-xs text-neutral-default mb-2">Aceptamos todos los métodos de pago:</p>
    <div className="flex flex-wrap justify-center items-center gap-2 grayscale opacity-75">
      {PAYMENT_METHODS.map(method => (
        <img key={method.name} src={method.logoUrl} alt={method.name} title={method.name} className="h-6 max-w-[60px] object-contain"/>
      ))}
    </div>
  </div>
);

interface ServicesSectionProps {
  id: string;
  onStartPlan: (service?: any) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ id, onStartPlan }) => {
  const { services, loading, error } = useServices();

  if (loading) {
    return (
      <section id={id} className="py-16 md:py-24 bg-neutral-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-default">Cargando servicios...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id={id} className="py-16 md:py-24 bg-neutral-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error cargando servicios: {error}</p>
            <p className="text-neutral-default">Por favor, verifica que el backend esté ejecutándose.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={id} className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-neutral-default max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades profesionales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service) => (
            <Card key={service.id} className="flex flex-col h-full" shadow="lg" hoverEffect>
              <div className="p-6 flex-grow">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-primary mb-2">{service.name}</h3>
                  <div className="text-3xl font-bold text-neutral-dark mb-2">
                    ${service.price}
                  </div>
                  <p className="text-sm text-neutral-default">{service.duration}</p>
                </div>
                
                <p className="text-neutral-default mb-6 text-center">{service.description}</p>
                
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-neutral-default">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-b-xl">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-full"
                  onClick={() => onStartPlan(service)}
                >
                  Contratar Ahora
                </Button>
                
                {service.category === 'Premium' && (
                  <div className="mt-3 text-center">
                    <span className="inline-block bg-primary text-white text-xs px-3 py-1 rounded-full">
                      ¡Más Popular!
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <PaymentLogos />
          <p className="mt-6 text-sm text-neutral-default">
            ¿No estás seguro qué plan elegir? 
            <button 
              className="text-primary hover:text-primary-dark ml-1 underline"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contáctanos
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};