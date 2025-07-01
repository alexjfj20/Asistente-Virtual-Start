import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { ClientService } from '../../types';

interface RequestServiceUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ClientService | null; // Service being updated
  onSaveNote: (note: string) => void; // Callback to save the note
}

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
);


export const RequestServiceUpdateModal: React.FC<RequestServiceUpdateModalProps> = ({
  isOpen,
  onClose,
  service,
  onSaveNote,
}) => {
  const [note, setNote] = useState('');

  useEffect(() => {
    if (service && isOpen) {
      setNote(service.clientNotes || '');
    }
  }, [service, isOpen]);

  const handleSave = () => {
    if (service) {
      onSaveNote(note);
    }
    onClose(); // Close modal after saving
  };
  
  if (!service) return null; // Should not happen if modal is open with a service

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={`Gestionar: ${service.name}`} 
        size="xl" // Use xl size or 2xl if needed
    >
      <div className="space-y-5">
        <div className="p-4 bg-primary-light/10 rounded-lg border border-primary-light">
            <div className="flex items-center space-x-3">
                {React.cloneElement(service.icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: "h-10 w-10 text-primary" })}
                <div>
                    <h3 className="text-lg font-semibold text-primary">{service.name}</h3>
                    <p className="text-sm text-neutral-default">Estado actual: <span className="font-medium">{service.status}</span></p>
                </div>
            </div>
        </div>

        <div>
          <Textarea
            id="service-note"
            label="Tu Nota / Solicitud de Actualización:"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ej: Quisiera discutir un cambio en el enfoque de mi CV, o preguntar sobre el próximo paso para la asesoría..."
            rows={5}
            labelClassName="text-neutral-dark font-medium"
          />
          <p className="mt-1 text-xs text-neutral-default flex items-center">
            <InfoIcon className="h-4 w-4 mr-1.5 text-blue-500" />
            Tu nota se guardará y será revisada por nuestro equipo. Actualizaremos el estado del servicio si es necesario.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-3 border-t border-gray-200">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} className="w-full sm:w-auto">
            Guardar Nota y Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};