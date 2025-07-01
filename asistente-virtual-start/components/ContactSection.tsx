import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { WHATSAPP_LINK_BASE } from '../constants';

interface ContactSectionProps {
  id: string;
}

const EnvelopeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);


export const ContactSection: React.FC<ContactSectionProps> = ({ id }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameText = name ? `Mi nombre es ${name}. ` : '';
    const emailText = email ? `Mi correo es ${email}. ` : '';
    const customMessageText = message ? `Mensaje: ${message}` : 'Tengo una consulta sobre el plan.';

    const fullMessage = encodeURIComponent(
      `Hola! ${nameText}${emailText}${customMessageText}`.trim()
    );
    
    const whatsappUrl = `${WHATSAPP_LINK_BASE}?text=${fullMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id={id} className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <EnvelopeIcon className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-4">Contáctanos</h2>
          <p className="text-lg text-neutral-default max-w-2xl mx-auto">
            ¿Listo para empezar o tienes alguna pregunta? Completa el formulario y te contactaremos.
          </p>
        </div>
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-dark mb-1">
                Nombre Completo
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors"
                placeholder="tu@correo.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-dark mb-1">
                Mensaje
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors"
                placeholder="Escribe tu consulta aquí..."
                required
              />
            </div>
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Enviar Mensaje por WhatsApp
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};