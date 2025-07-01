import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Service } from '../../types';

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  registrationData: Omit<User, 'id' | 'isAdmin'>;
  onRegisterSuccess: (user: User) => void;
}

const CreditCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6.75 2.25h6.75a2.25 2.25 0 002.25-2.25v-1.5a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

export const StripePaymentModal: React.FC<StripePaymentModalProps> = ({ isOpen, onClose, service, registrationData, onRegisterSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePayment = async () => {
        setIsLoading(true);
        setError('');
        // Simulate API call to Stripe
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);

        // On successful payment, register the user
        const newUser: User = {
            id: Date.now().toString(),
            name: registrationData.name,
            email: registrationData.email,
            isAdmin: registrationData.email.includes('admin')
        };
        onRegisterSuccess(newUser);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Pago con Tarjeta (Simulado)">
            <div className="space-y-4">
                <div className="p-4 bg-primary-light/10 rounded-lg border border-primary-light text-center">
                    <h3 className="text-lg font-semibold text-primary">{service.title}</h3>
                    <p className="text-2xl font-bold text-neutral-dark">Total: {service.price}</p>
                </div>
                
                <p className="text-sm text-neutral-default">Estás creando una cuenta para <strong className="text-neutral-dark">{registrationData.email}</strong>. Completa los datos de pago para finalizar.</p>

                <div className="space-y-3">
                    <Input label="Número de Tarjeta" id="cc-number" placeholder="4242 4242 4242 4242" leftIcon={<CreditCardIcon className="h-5 w-5 text-gray-400" />} />
                    <div className="flex space-x-3">
                        <Input label="MM/YY" id="cc-expiry" placeholder="12/26" />
                        <Input label="CVC" id="cc-cvc" placeholder="123" />
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <Button onClick={handlePayment} variant="secondary" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Procesando Pago...' : `Pagar ${service.price} y Finalizar`}
                </Button>

                <p className="text-xs text-center text-neutral-default">
                    Esto es una simulación. No se realizará ningún cargo real.
                </p>
            </div>
        </Modal>
    );
};