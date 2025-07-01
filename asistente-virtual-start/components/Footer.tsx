import React from 'react';

interface FooterProps {
  appName: string;
}

export const Footer: React.FC<FooterProps> = ({ appName }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-neutral-dark text-neutral-light py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p>&copy; {currentYear} {appName}. Todos los derechos reservados.</p>
        <p className="text-sm mt-2">Diseñado para impulsar tu carrera como Asistente Virtual.</p>
      </div>
    </footer>
  );
};
