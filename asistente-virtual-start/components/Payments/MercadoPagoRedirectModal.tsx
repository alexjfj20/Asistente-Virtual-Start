import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { User, Service } from '../../types';

interface MercadoPagoRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  registrationData: Omit<User, 'id' | 'isAdmin'>;
  onRegisterSuccess: (user: User) => void;
}

export const MercadoPagoRedirectModal: React.FC<MercadoPagoRedirectModalProps> = ({ isOpen, onClose, service, registrationData, onRegisterSuccess }) => {
    
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                const newUser: User = {
                    id: Date.now().toString(),
                    name: registrationData.name,
                    email: registrationData.email,
                    isAdmin: registrationData.email.includes('admin')
                };
                onRegisterSuccess(newUser);
            }, 3500); // Simulate redirect and callback time

            return () => clearTimeout(timer);
        }
    }, [isOpen, registrationData, onRegisterSuccess]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Redirigiendo a MercadoPago">
            <div className="space-y-4 text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto"></div>

                <img 
                    src="https://img.stackshare.io/service/2721/mercadopago.png" 
                    alt="MercadoPago"
                    className="h-12 mx-auto object-contain mt-6"
                />
                
                <h3 className="text-xl font-semibold text-neutral-dark pt-4">Serás redirigido a MercadoPago para completar tu pago de forma segura.</h3>
                
                <p className="text-neutral-default">
                    Una vez completado el pago, volverás a nuestra página automáticamente para activar tu servicio de <strong className="text-neutral-dark">{service.title}</strong>.
                </p>
                
                <p className="text-xs text-neutral-default">(Esto es una simulación. Serás redirigido en unos segundos...)</p>
            </div>
        </Modal>
    );
};