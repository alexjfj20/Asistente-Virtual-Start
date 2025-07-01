import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Service } from '../../types';

interface EditServicePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  onSave: (updatedService: Service) => void;
}

export const EditServicePlanModal: React.FC<EditServicePlanModalProps> = ({
  isOpen,
  onClose,
  service,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState('');

  useEffect(() => {
    if (service && isOpen) {
      setTitle(service.title);
      setPrice(service.price);
      setFeatures(service.features.join('\n'));
    }
  }, [service, isOpen]);

  const handleSave = () => {
    const updatedService: Service = {
      ...service,
      title,
      price,
      features: features.split('\n').filter(f => f.trim() !== ''),
    };
    onSave(updatedService);
    onClose();
  };

  if (!service) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Editar Plan: ${service.title}`} size="lg">
      <div className="space-y-6">
        <Input
          label="Título del Plan"
          id="service-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Asesoría Completa con IA"
        />
        <Input
          label="Precio"
          id="service-price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ej: 65.000 COP"
        />
        <Textarea
          label="Características (una por línea)"
          id="service-features"
          value={features}
          onChange={(e) => setFeatures(e.target.value)}
          rows={6}
          placeholder="Ej: Asesoramiento integral por IA\nConsejos personalizados para destacar"
        />
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
