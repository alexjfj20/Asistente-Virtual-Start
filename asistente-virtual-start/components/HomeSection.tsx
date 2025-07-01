import React from 'react';
import { Button } from './ui/Button';

interface HomeSectionProps {
  id: string;
  onStartPlan: () => void;
}

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.562.562 0 01.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.022a.562.562 0 01-.84.622l-4.402-3.32a.563.563 0 00-.664 0l-4.402 3.32a.562.562 0 01-.84-.622l1.285-5.022a.563.563 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988h5.418a.563.563 0 00.475-.31L11.48 3.5z" />
    </svg>
);


export const HomeSection: React.FC<HomeSectionProps> = ({ id, onStartPlan }) => {
  return (
    <section id={id} className="bg-gradient-to-br from-primary-light via-primary to-primary-dark text-white py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Tu Carrera Remota Despega con IA
        </h1>
        <p className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto font-light">
          Accede a todas nuestras herramientas con un solo plan. Optimiza tu CV, prepárate para entrevistas y consigue trabajo freelance, todo en un mismo lugar.
        </p>
        <div className="flex justify-center">
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={onStartPlan}
            className="shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            ✅ Acceder a Todo por $17 USD / mes
          </Button>
        </div>
      </div>
    </section>
  );
};