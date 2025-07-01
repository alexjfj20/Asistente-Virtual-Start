import React from 'react';
import { Button } from './ui/Button';
import { WHATSAPP_LINK_BASE } from '../constants';

interface BookingSectionProps {
  id: string;
}

const CalendarDaysIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
   <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
 </svg>
 );
 
const PhoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);


export const BookingSection: React.FC<BookingSectionProps> = ({ id }) => {
  const calendlyLink = "https://calendly.com/tu-usuario/asesoria-virtual"; // Replace with actual Calendly link

  return (
    <section id={id} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <CalendarDaysIcon className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-4">Agenda tu Videollamada de Asesoría</h2>
        <p className="text-lg text-neutral-default max-w-2xl mx-auto mb-8">
          Reserva una sesión de 1 hora para una asesoría completa y personalizada. Organizaremos tu CV y te daremos los mejores consejos para destacar.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Button 
            size="lg" 
            variant="primary" 
            onClick={() => window.open(calendlyLink, '_blank')}
            leftIcon={<CalendarDaysIcon className="h-6 w-6" />}
            className="shadow-lg hover:shadow-xl"
            >
            Ver Disponibilidad (Calendly)
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => window.open(`${WHATSAPP_LINK_BASE}?text=Hola,%20quisiera%20agendar%20una%20asesoría%20completa.`, '_blank')}
            leftIcon={<PhoneIcon className="h-6 w-6" />}
            className="shadow-lg hover:shadow-xl"
          >
            Contactar por WhatsApp
          </Button>
        </div>
        <p className="mt-8 text-sm text-neutral-default">
          Si prefieres, también puedes usar el formulario de contacto o enviarnos un mensaje directo por WhatsApp para coordinar.
        </p>
      </div>
    </section>
  );
};
