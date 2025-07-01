
import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PaymentGateway } from '../../types';

interface ConfigurePaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  gateway: PaymentGateway;
  onSave: (updatedGateway: PaymentGateway) => void;
}

const PhotoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);


// Using a single state object for the form data improves maintainability.
interface GatewayFormData extends PaymentGateway {}

export const ConfigurePaymentGatewayModal: React.FC<ConfigurePaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  gateway,
  onSave,
}) => {
  const [formData, setFormData] = useState<GatewayFormData | null>(null);

  useEffect(() => {
    if (gateway && isOpen) {
      // Deep copy to avoid mutating the original prop object
      setFormData(JSON.parse(JSON.stringify(gateway)));
    }
  }, [gateway, isOpen]);
  
  const handleFormValueChange = <K extends keyof GatewayFormData>(key: K, value: GatewayFormData[K]) => {
      setFormData(prev => prev ? { ...prev, [key]: value } : null);
  };
  
  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData(prev => prev ? { ...prev, config: { ...prev.config, [id]: value } } : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldToUpdate: 'logoUrl' | 'qrImageUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (fieldToUpdate === 'logoUrl') {
            handleFormValueChange('logoUrl', result);
        } else { // It's for qrImageUrl
            setFormData(prev => prev ? { ...prev, config: { ...prev.config, qrImageUrl: result } } : null);
        }
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSave = () => {
    if (formData) {
        onSave(formData);
    }
    onClose();
  };

  if (!formData) return null;

  const renderGatewayFields = () => {
    switch (gateway.name) {
      case 'Stripe':
        return (
          <>
            <Input
              label="Clave Pública (Public Key)"
              id="publicKey"
              value={formData.config.publicKey || ''}
              onChange={handleConfigChange}
              placeholder="pk_test_..."
            />
            <Input
              label="Clave Secreta (Secret Key)"
              id="secretKey"
              type="password"
              value={formData.config.secretKey || ''}
              onChange={handleConfigChange}
              placeholder="sk_test_..."
            />
          </>
        );
      case 'MercadoPago':
        return (
          <Input
            label="Access Token"
            id="accessToken"
            type="password"
            value={formData.config.accessToken || ''}
            onChange={handleConfigChange}
            placeholder="APP_USR-..."
          />
        );
      case 'Nequi':
      case 'DaviPlata':
        return (
          <>
            <Input
              label="Número de Teléfono"
              id="phoneNumber"
              value={formData.config.phoneNumber || ''}
              onChange={handleConfigChange}
              placeholder="Ej: 3001234567"
            />
            <Input
              label="Webhook URL (Opcional)"
              id="webhookUrl"
              value={formData.config.webhookUrl || ''}
              onChange={handleConfigChange}
              placeholder="https://tu-api.com/webhook"
            />
          </>
        );
      case 'QR Code':
        return (
          <div className="space-y-4">
            <Input
              label="URL de la imagen QR"
              id="qrImageUrlInput" // Use a different id to avoid conflict with config key
              value={formData.config.qrImageUrl || ''}
              onChange={e => setFormData(prev => prev ? { ...prev, config: { ...prev.config, qrImageUrl: e.target.value } } : null)}
              placeholder="https://ejemplo.com/mi-qr.png"
            />
            <div className="text-center text-sm text-neutral-default my-2">O</div>
            <div>
              <label htmlFor="qr-file-upload" className="block text-sm font-medium text-neutral-dark mb-1">
                Subir archivo de imagen QR
              </label>
              <input
                id="qr-file-upload"
                type="file"
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={(e) => handleFileChange(e, 'qrImageUrl')}
                className="block w-full text-sm text-neutral-default file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-light/80 file:text-primary-dark hover:file:bg-primary-light cursor-pointer border border-gray-300 rounded-lg"
              />
            </div>
            {formData.config.qrImageUrl ? (
              <div className="mt-4">
                <p className="text-sm font-medium text-neutral-dark mb-2">Vista Previa del QR:</p>
                <div className="p-4 border border-dashed border-gray-300 rounded-lg flex justify-center items-center bg-gray-50 h-40">
                   <img src={formData.config.qrImageUrl} alt="Vista previa QR" className="max-w-[150px] max-h-[150px] object-contain rounded" />
                </div>
              </div>
            ) : (
                <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center bg-gray-50 h-40">
                    <PhotoIcon className="h-12 w-12 text-gray-400 mb-2"/>
                    <p className="text-sm text-gray-500">La vista previa aparecerá aquí.</p>
                </div>
            )}
          </div>
        );
      default:
        return <p className="text-sm text-neutral-default">Esta pasarela de pago no requiere configuración adicional.</p>;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Configurar: ${formData.name}`} size="lg">
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <label htmlFor="gateway-status" className="font-medium text-neutral-dark">Estado de la Pasarela</label>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${formData.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>
              {formData.isActive ? 'Activo' : 'Inactivo'}
            </span>
            <button
              type="button"
              id="gateway-status"
              onClick={() => handleFormValueChange('isActive', !formData.isActive)}
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${formData.isActive ? 'bg-primary' : 'bg-gray-300'}`}
            >
              <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-200 pt-5">
            <h4 className="font-semibold text-neutral-dark">Logo de la Pasarela</h4>
            <div className="space-y-4">
                <Input
                  label="URL de la imagen del Logo"
                  id="logoUrlInput"
                  value={formData.logoUrl || ''}
                  onChange={(e) => handleFormValueChange('logoUrl', e.target.value)}
                  placeholder="https://ejemplo.com/logo.png"
                />
                <div className="text-center text-sm text-neutral-default my-2">O</div>
                <div>
                    <label htmlFor="logo-file-upload" className="block text-sm font-medium text-neutral-dark mb-1">
                        Subir archivo de imagen del Logo
                    </label>
                    <input
                        id="logo-file-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={(e) => handleFileChange(e, 'logoUrl')}
                        className="block w-full text-sm text-neutral-default file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-light/80 file:text-primary-dark hover:file:bg-primary-light cursor-pointer border border-gray-300 rounded-lg"
                    />
                </div>
                {formData.logoUrl ? (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-neutral-dark mb-2">Vista Previa del Logo:</p>
                        <div className="p-4 border border-dashed border-gray-300 rounded-lg flex justify-center items-center bg-gray-50 h-40">
                            <img src={formData.logoUrl} alt="Vista previa del Logo" className="max-w-[150px] max-h-[150px] object-contain" />
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 p-4 border border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center bg-gray-50 h-40">
                        <PhotoIcon className="h-12 w-12 text-gray-400 mb-2"/>
                        <p className="text-sm text-gray-500">La vista previa aparecerá aquí.</p>
                    </div>
                )}
            </div>
        </div>

        <div className="space-y-4 border-t border-gray-200 pt-5">
            <h4 className="font-semibold text-neutral-dark">Configuración (Simulada)</h4>
            {renderGatewayFields()}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </Modal>
  );
};
