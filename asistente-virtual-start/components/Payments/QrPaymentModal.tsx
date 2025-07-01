import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { User, Service } from '../../types';

interface QrPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  registrationData: Omit<User, 'id' | 'isAdmin'>;
  onRegisterSuccess: (user: User) => void;
}

const QrCodeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 15.375a.75.75 0 01.75-.75h2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75v-2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 15.375H15" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15 16.125H15" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15 16.875H15" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.375H15.75" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 16.125H15.75" /> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 16.875H15.75" /> <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 15.375H16.5" /> <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 16.125H16.5" /> <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 16.875H16.5" />
    </svg>
);


export const QrPaymentModal: React.FC<QrPaymentModalProps> = ({ isOpen, onClose, service, registrationData, onRegisterSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handlePaymentConfirmation = async () => {
        setIsLoading(true);
        // Simulate waiting for payment confirmation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);

        const newUser: User = {
            id: Date.now().toString(),
            name: registrationData.name,
            email: registrationData.email,
            isAdmin: registrationData.email.includes('admin')
        };
        onRegisterSuccess(newUser);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Pago con QR (Simulado)">
            <div className="space-y-4 text-center">
                <div className="p-4 bg-primary-light/10 rounded-lg border border-primary-light">
                    <h3 className="text-lg font-semibold text-primary">{service.title}</h3>
                    <p className="text-2xl font-bold text-neutral-dark">Total: {service.price}</p>
                </div>
                
                <p className="text-sm text-neutral-default">
                    Escanea el siguiente código QR con tu app de Nequi, DaviPlata, o la de tu banco para realizar el pago.
                </p>

                <div className="flex justify-center p-4 bg-white rounded-lg border">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Commons_QR_code.png" 
                        alt="Generic QR Code"
                        className="w-48 h-48 object-contain"
                    />
                </div>

                <Button onClick={handlePaymentConfirmation} variant="primary" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Verificando Pago...' : 'He Realizado el Pago'}
                </Button>

                <p className="text-xs text-center text-neutral-default">
                    Una vez realizado el pago, haz clic en el botón de arriba para crear tu cuenta y activar tu servicio.
                </p>
            </div>
        </Modal>
    );
};