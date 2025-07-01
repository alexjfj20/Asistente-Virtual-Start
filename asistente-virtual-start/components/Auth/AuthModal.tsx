




import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Service } from '../../types';
import { PAYMENT_METHODS } from '../../constants';
import { ApiService } from '../../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onRegisterSuccess?: (user: User) => void;
  onProceedToPayment: (paymentMethod: string, registrationData: Omit<User, 'id' | 'isAdmin'>, service: Service) => void;
  pendingService: Service | null;
}

interface PaymentLogosProps {
    selectedPayment: string | null;
    onSelectPayment: (methodName: string) => void;
  }
  
  const PaymentLogos: React.FC<PaymentLogosProps> = ({ selectedPayment, onSelectPayment }) => {
    return (
      <div className="mt-4 border-t pt-4">
        <p className="text-sm text-neutral-dark font-medium mb-3 text-center">Selecciona tu forma de pago:</p>
        <div className="flex flex-wrap justify-center items-center gap-3">
          {PAYMENT_METHODS.map(method => (
            <button
              key={method.name}
              type="button"
              onClick={() => onSelectPayment(method.name)}
              className={`
                p-2 border-2 rounded-lg transition-all duration-200 ease-in-out 
                focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-dark
                ${selectedPayment === method.name 
                  ? 'border-primary shadow-md' 
                  : 'border-gray-200 hover:border-gray-400'
                }
              `}
              aria-pressed={selectedPayment === method.name}
            >
              <img 
                src={method.logoUrl} 
                alt={method.name} 
                title={method.name} 
                className={`
                  h-8 max-w-[70px] object-contain transition-all duration-200 
                  ${selectedPayment === method.name ? 'grayscale-0' : 'grayscale hover:grayscale-0'}`
                }
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, onRegisterSuccess, onProceedToPayment, pendingService }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  
  const isPurchaseFlow = !isLoginView && pendingService;

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
      setError('');
      setIsLoading(false);
      setSelectedPayment(null);
      setIsLoginView(!pendingService);
    }
  }, [isOpen, pendingService]);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoginView) {
      handleLogin();
    } else {
      handleRegister();
    }
  };
  
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await ApiService.login({ email: email.trim(), password });
      
      // Convertir la respuesta del backend al formato esperado por el frontend
      const user: User = {
        id: response.user.id.toString(),
        name: response.user.fullName,
        email: response.user.email,
        isAdmin: response.user.role === 'admin'
      };

      onLoginSuccess(user);
      
    } catch (error: any) {
      setError(error.message || 'Error al iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Si es flujo de compra, verificar selección de pago
    if (isPurchaseFlow && !selectedPayment) {
      setError('Por favor, selecciona un método de pago.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const userData = {
        email: email.trim(),
        password,
        fullName: name.trim(),
        phone: phone.trim() || undefined
      };

      const response = await ApiService.register(userData);
      
      // Convertir respuesta del backend al formato esperado por el frontend
      const user: User = {
        id: response.user.id.toString(),
        name: response.user.fullName,
        email: response.user.email,
        isAdmin: response.user.role === 'admin'
      };
      
      if (isPurchaseFlow && pendingService && selectedPayment) {
        // Si estamos en flujo de compra, usar onRegisterSuccess si está disponible
        if (onRegisterSuccess) {
          onRegisterSuccess(user);
        }
        
        // Luego proceder al pago
        const paymentUser = {
          name: response.user.fullName,
          email: response.user.email
        };
        onProceedToPayment(selectedPayment, paymentUser, pendingService);
      } else {
        // Registro normal - usar onRegisterSuccess si está disponible, sino onLoginSuccess
        if (onRegisterSuccess) {
          onRegisterSuccess(user);
        } else {
          onLoginSuccess(user);
        }
      }
      
    } catch (error: any) {
      setError(error.message || 'Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleView = () => {
    if (pendingService) {
      setError("Completa la compra o cierra esta ventana para iniciar sesión con otra cuenta.");
      return;
    }
    setIsLoginView(!isLoginView);
    setError('');
  };
  
  const getTitle = () => {
    if (isPurchaseFlow) {
      return "Completa tu Compra y Crea tu Cuenta";
    }
    return isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta';
  };

  const renderPurchaseFlowForm = () => {
    const isPurchaseFormInvalid = isLoading || !name.trim() || !email.trim() || password.length < 6 || !selectedPayment;

    return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Service Summary */}
            <div className="p-4 bg-primary-light/10 rounded-lg border border-primary-light text-center">
                <h3 className="text-lg font-semibold text-primary">{pendingService?.title}</h3>
                <p className="text-2xl font-bold text-neutral-dark">{pendingService?.price}</p>
            </div>
            
            {/* Account Fields */}
            <Input
              label="Nombre Completo" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre completo" required disabled={isLoading}
            />
            <Input
              label="Correo Electrónico" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com" required disabled={isLoading}
            />
            <Input
              label="Teléfono (opcional)" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890" disabled={isLoading}
            />
            <Input
              label="Crea una Contraseña" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres" required disabled={isLoading}
            />

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Payment & Submit */}
            <PaymentLogos selectedPayment={selectedPayment} onSelectPayment={setSelectedPayment} />
            <Button type="submit" variant="secondary" size="lg" className="w-full mt-2" disabled={isPurchaseFormInvalid}>
              {isLoading ? 'Validando...' : 'Proceder al Pago'}
            </Button>
        </form>
    );
  }

  const renderStandardAuthForm = () => (
    <form onSubmit={handleFormSubmit} className="space-y-6">
        {!isLoginView && (
            <>
              <Input label="Nombre Completo" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre completo" required disabled={isLoading} />
              <Input label="Teléfono (opcional)" id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890" disabled={isLoading} />
            </>
        )}
        <Input label="Correo Electrónico" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required disabled={isLoading} />
        <Input label="Contraseña" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isLoginView ? '' : 'Mínimo 6 caracteres'} required disabled={isLoading} />
        
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        
        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? (isLoginView ? 'Ingresando...' : 'Creando...') : (isLoginView ? 'Ingresar' : 'Crear Cuenta')}
        </Button>
    </form>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()}>
      {isPurchaseFlow ? renderPurchaseFlowForm() : renderStandardAuthForm()}

      <p className="mt-6 text-center text-sm">
        {isLoginView ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
        <button 
            onClick={toggleView} 
            className="font-medium text-primary hover:text-primary-dark ml-1 focus:outline-none disabled:text-neutral-default disabled:cursor-not-allowed"
            disabled={!!pendingService} // Disable toggle in purchase flow
        >
            {isLoginView ? 'Regístrate aquí' : 'Inicia sesión aquí'}
        </button>
      </p>

      {isLoginView && (
        <p className="mt-4 text-xs text-center text-neutral-default">
          ¿No tienes cuenta aún? Regístrate arriba. Tu información se guardará de forma segura.
        </p>
      )}
    </Modal>
  );
};