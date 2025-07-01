import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PAYMENT_METHODS, SERVICES_DATA } from '../../constants';
import { ModalType, Service, PaymentGateway } from '../../types';

interface AdminPanelSectionProps {
  id: string;
  openModal: (modalType: ModalType, payload?: any) => void;
}

// Icons
const CogIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m1.5 0H21m-1.5 0H3m1.5 0H21m-16.5 5.25H6m12 0H18m3 0h-1.5m-15 0H3m1.5-15H6m12 0H18m3 0h-1.5m-15 0H3" />
  </svg>
);
const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.125-.372M4.125 19.128c1.313.313 2.704.372 4.125.372s2.813-.06 4.125-.372m0 0V5.591A9.338 9.338 0 0012 4.5c-1.313 0-2.553.256-3.625.728M4.125 19.128V5.591c1.554-.577 3.298-.928 5.125-.928s3.571.351 5.125.928m0 0c1.828.678 3.22 1.868 4.125 3.372" />
    </svg>
);
const DocumentDuplicateIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
    </svg>
);
const CreditCardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6.75 2.25h6.75a2.25 2.25 0 002.25-2.25v-1.5a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 002.25 2.25z" />
    </svg>
);

type AdminView = 'clients' | 'plans' | 'payments';

export const AdminPanelSection: React.FC<AdminPanelSectionProps> = ({ id, openModal }) => {
  const [activeView, setActiveView] = useState<AdminView>('clients');
  
  // Mock client data
  const mockClients = [
    { id: 'c1', name: 'Ana Pérez', email: 'ana.perez@example.com', services: ['Asesoría Completa'], payments: [{ service: 'Asesoría Completa', amount: '65.000 COP', status: 'Pagado' }] },
    { id: 'c2', name: 'Carlos López', email: 'carlos.lopez@example.com', services: ['Arreglo de Hoja de Vida'], payments: [{ service: 'Arreglo de Hoja de Vida', amount: '35.000 COP', status: 'Pagado' }] },
    { id: 'c3', name: 'Sofía Gómez', email: 'sofia.gomez@example.com', services: [], payments: [] },
  ];

  // Service plan state
  const [servicePlans, setServicePlans] = useState<Service[]>(SERVICES_DATA);

  // Payment gateway state
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>(
    PAYMENT_METHODS.map(p => {
        const baseGateway = {
            id: p.name.toLowerCase().replace(/\s+/g, '-'),
            name: p.name,
            logoUrl: p.logoUrl,
            isActive: true,
            config: {}
        };
        if (p.name === 'QR Code') {
            baseGateway.config = { qrImageUrl: '' };
        }
        return baseGateway;
    })
  );

  const handleSaveGatewayConfig = (updatedGateway: PaymentGateway) => {
    setPaymentGateways(prev => prev.map(gw => gw.id === updatedGateway.id ? updatedGateway : gw));
  };

  const handleManageGatewayClick = (gateway: PaymentGateway) => {
    openModal(ModalType.CONFIGURE_PAYMENT_GATEWAY, {
      gateway,
      onSaveCallback: handleSaveGatewayConfig,
    });
  };

  const handleSaveServicePlan = (updatedService: Service) => {
    setServicePlans(prev => prev.map(s => s.id === updatedService.id ? updatedService : s));
  };
  
  const handleEditServiceClick = (service: Service) => {
    openModal(ModalType.EDIT_SERVICE_PLAN, {
        service,
        onSaveCallback: handleSaveServicePlan,
    });
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'clients':
        return <ClientManagementTable clients={mockClients} />;
      case 'plans':
        return <PlanManagementTable plans={servicePlans} onEdit={handleEditServiceClick} />;
      case 'payments':
        return <PaymentGatewayManagement gateways={paymentGateways} onManage={handleManageGatewayClick} />;
      default:
        return <ClientManagementTable clients={mockClients} />;
    }
  };

  return (
    <section id={id} className="py-12 md:py-20 bg-neutral-dark text-white min-h-[calc(100vh-5rem)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-14">
          <CogIcon className="h-16 w-16 text-primary mx-auto mb-4" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">Panel de Administración</h2>
          <p className="text-lg text-neutral-light/70">Gestión de clientes, servicios y pagos. (Simulación Frontend)</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Vertical Navigation */}
          <aside className="md:w-1/4 lg:w-1/5">
            <nav className="flex flex-row md:flex-col gap-2 p-2 rounded-lg bg-neutral-light/5">
              <NavItem icon={<UsersIcon className="h-5 w-5" />} label="Gestión de Clientes" isActive={activeView === 'clients'} onClick={() => setActiveView('clients')} />
              <NavItem icon={<DocumentDuplicateIcon className="h-5 w-5" />} label="Gestión de Planes" isActive={activeView === 'plans'} onClick={() => setActiveView('plans')} />
              <NavItem icon={<CreditCardIcon className="h-5 w-5" />} label="Gestión de Pagos" isActive={activeView === 'payments'} onClick={() => setActiveView('payments')} />
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-grow md:w-3/4 lg:w-4/5">
            {renderActiveView()}
          </main>
        </div>
      </div>
    </section>
  );
};

// Navigation Item Component
const NavItem: React.FC<{icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
            isActive
                ? 'bg-primary/90 text-white shadow-md'
                : 'text-neutral-light hover:bg-neutral-light/10 hover:text-white'
        }`}
    >
        {icon}
        <span className="flex-grow text-left">{label}</span>
    </button>
);


// Sub-components for different views
const ClientManagementTable: React.FC<{clients: any[]}> = ({ clients }) => (
    <Card className="p-6 md:p-8 bg-neutral-light/10 backdrop-blur-sm" shadow="xl">
        <h3 className="text-2xl font-semibold text-white mb-6">Gestión de Clientes</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-light/20">
                {/* Table head */}
                <thead className="bg-neutral-light/5">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Nombre</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Servicios Activos</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Estado de Pago</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                {/* Table body */}
                <tbody className="bg-neutral-dark/50 divide-y divide-neutral-light/20">
                    {clients.map((client) => (
                        <tr key={client.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{client.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-light">{client.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-light">{client.services.length > 0 ? client.services.join(', ') : 'Ninguno'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{client.payments.length > 0 ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-light/30 text-primary-light">Pagado</span> : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-500/30 text-gray-300">No Registrado</span>}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><Button size="sm" variant="ghost" className="text-primary-light hover:text-primary" onClick={() => alert(`Gestionar cliente: ${client.name} (simulado)`)}>Gestionar</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <p className="mt-6 text-xs text-neutral-light/70 text-center">Esta es una simulación. La gestión real de datos requeriría un backend.</p>
    </Card>
);

const PlanManagementTable: React.FC<{plans: Service[], onEdit: (service: Service) => void}> = ({ plans, onEdit }) => (
    <Card className="p-6 md:p-8 bg-neutral-light/10 backdrop-blur-sm" shadow="xl">
        <h3 className="text-2xl font-semibold text-white mb-6">Gestión de Planes y Precios</h3>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-light/20">
                {/* Table head */}
                <thead className="bg-neutral-light/5">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Nombre del Plan</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Precio</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                {/* Table body */}
                <tbody className="bg-neutral-dark/50 divide-y divide-neutral-light/20">
                    {plans.map((plan) => (
                        <tr key={plan.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{plan.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-light">{plan.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><Button size="sm" variant="ghost" className="text-primary-light hover:text-primary" onClick={() => onEdit(plan)}>Gestionar</Button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
);


const PaymentGatewayManagement: React.FC<{gateways: PaymentGateway[], onManage: (gateway: PaymentGateway) => void}> = ({ gateways, onManage }) => (
    <Card className="p-6 md:p-8 bg-neutral-light/10 backdrop-blur-sm" shadow="xl">
        <h3 className="text-2xl font-semibold text-white mb-6">Gestión de Pasarelas de Pago</h3>
        <div className="space-y-4">
            {gateways.map(gateway => (
                <div key={gateway.id} className="flex items-center justify-between p-4 bg-neutral-dark/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <img src={gateway.logoUrl} alt={gateway.name} className="h-8 w-auto bg-white p-1 rounded-md object-contain"/>
                        <span className="font-medium text-white">{gateway.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${gateway.isActive ? 'bg-primary-light/30 text-primary-light' : 'bg-gray-500/30 text-gray-300'}`}>{gateway.isActive ? 'Activo' : 'Inactivo'}</span>
                         <Button size="sm" variant="ghost" className="text-primary-light hover:text-primary" onClick={() => onManage(gateway)}>Gestionar</Button>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);