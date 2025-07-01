import React from 'react';
import { TESTIMONIALS_DATA } from '../constants';
import { Testimonial } from '../types';
import { Card } from './ui/Card';

const ChatBubbleLeftEllipsisIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.861 8.25-8.625 8.25S3.75 16.556 3.75 12 7.611 3.75 12.375 3.75 21 7.444 21 12z" />
  </svg>
);


export const TestimonialsSection: React.FC<{ id: string }> = ({ id }) => {
  return (
    <section id={id} className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <ChatBubbleLeftEllipsisIcon className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-lg text-neutral-default max-w-2xl mx-auto">
            Personas como tú ya están comenzando su camino como Asistentes Virtuales con nuestra ayuda.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((testimonial: Testimonial) => (
            <Card key={testimonial.id} className="p-8 flex flex-col items-center text-center" shadow="lg" hoverEffect>
              {testimonial.image && (
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="w-24 h-24 rounded-full mb-6 object-cover shadow-md"
                />
              )}
              <p className="text-neutral-default italic mb-6 flex-grow">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold text-primary">{testimonial.author}</p>
                {testimonial.role && <p className="text-sm text-neutral-default">{testimonial.role}</p>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
