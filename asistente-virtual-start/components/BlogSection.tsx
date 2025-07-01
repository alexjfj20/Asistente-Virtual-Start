import React from 'react';
import { BLOG_POSTS_DATA } from '../constants';
import { BlogPost } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const NewspaperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.875c0-.621.504-1.125 1.125-1.125H6.75M12 7.5V9m0 3V9m0 3v2.25m0 3v-2.25m0 0V9m0-4.5h.008v.008H12V3.75z" />
  </svg>
);

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

export const BlogSection: React.FC<{ id: string }> = ({ id }) => {
  return (
    <section id={id} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <NewspaperIcon className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-dark mb-4">Blog y Recursos Gratuitos</h2>
          <p className="text-lg text-neutral-default max-w-2xl mx-auto">
            Consejos, herramientas y guías para ayudarte a tener éxito como Asistente Virtual.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS_DATA.map((post: BlogPost) => (
            <Card key={post.id} className="flex flex-col" shadow="lg" hoverEffect>
              {post.imageUrl && (
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-neutral-dark mb-3">{post.title}</h3>
                <p className="text-neutral-default mb-4 flex-grow">{post.summary}</p>
                {post.link && (
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(post.link, '_blank')}
                    className="self-start"
                    rightIcon={<ArrowRightIcon className="h-4 w-4" />}
                  >
                    Leer más
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
