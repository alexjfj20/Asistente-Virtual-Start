


import React, { useState, useEffect } from 'react';
import { User, ClientService, ModalType, ServiceType } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ApiService, useClientServices } from '../../services/api';

// Icons (Heroicons)
const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const ChatBubbleOvalLeftEllipsisIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.687 19.125l-3.375-3.375a2.25 2.25 0 00-3.182 0l-3.375 3.375a2.25 2.25 0 000 3.182l3.375 3.375a2.25 2.25 0 003.182 0l3.375-3.375a2.25 2.25 0 000-3.182zM21 12a9 9 0 11-18 0 9 9 0 0118 0zM10.5 8.25h.008v.008h-.008V8.25zm0 3.75h.008v.008h-.008v-.008zm0 3.75h.008v.008h-.008V12zm2.25-4.5h.008v.008h-.008V8.25zm0 3.75h.008v.008h-.008v-.008zm0 3.75h.008v.008h-.008V12z" />
  </svg>
);

const PencilSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 14.25l-1.25-2.25L13.5 11l2.25-1.25L17 7.5l1.25 2.25L20.5 11l-2.25 1.25z" />
  </svg>
);

const DocumentArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.158 10.302L12 18.375l3.842-3.843M12 18.375V10.5M12 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const PhoneArrowUpRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-5.18-4.3-9.45-9.75-9.45S0 6.82 0 12c0 4.88 3.58 8.94 8.25 9.45V12m11.25 0a9.45 9.45 0 00-9.75-9.45M19.5 12v.75a8.97 8.97 0 01-8.25 8.7V12m8.25 0h.75a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25-2.25h-1.5a2.25 2.25 0 01-2.25-2.25v-2.25a2.25 2.25 0 012.25-2.25h.75M16.5 4.5l4.5 4.5m0 0l-4.5 4.5m4.5-4.5h-12" />
  </svg>
);

const BriefcaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.098a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25V14.15M12 12.375a3.75 3.75 0 01-3.75-3.75V3h7.5v5.625a3.75 3.75 0 01-3.75 3.75z" />
    </svg>
);


const DocumentCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ArrowDownTrayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);
const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);


interface ClientDashboardSectionProps {
  id: string;
  user: User;
  openModal: (modalType: ModalType, payload?: any) => void;
  newlyOptimizedCvData: ClientService | null;
  onConsumeNewCvData: () => void;
  newlyEvaluatedProfile: ClientService | null;
  onConsumeNewProfile: () => void;
  newlyFreelancerProfileData: ClientService | null;
  onConsumeNewFreelancerProfile: () => void;
}

const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no disponible';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
        return dateString; 
    }
};

const getDefaultServicesForUser = (user: User): ClientService[] => {
  const now = new Date().toISOString();
  if (user.email === 'user@example.com') { 
    return [
      {
        id: 'clientservice-1',
        name: 'Asesoría Completa con IA (Ejemplo)',
        status: 'Pendiente de Agendamiento',
        icon: <ChatBubbleOvalLeftEllipsisIcon className="h-8 w-8 text-secondary" />,
        clientNotes: 'Quiero enfocarme en estrategias para redes sociales y conseguir clientes internacionales.',
        serviceType: ServiceType.ASESORIA,
        lastUpdated: new Date(Date.now() - 86400000 * 2).toISOString(), 
      },
      {
        id: 'clientservice-2',
        name: 'Arreglo de Hoja de Vida (Ejemplo)',
        status: 'CV Entregado',
        icon: <DocumentTextIcon className="h-8 w-8 text-primary" />,
        clientNotes: 'El CV quedó genial, ¡gracias! Solo una duda sobre cómo listar una habilidad específica.',
        serviceType: ServiceType.CV,
        lastUpdated: new Date(Date.now() - 86400000 * 5).toISOString(), 
      },
    ];
  }
  return [
    {
      id: 'clientservice-default-cv',
      name: 'Arreglo de Hoja de Vida (Nuevo)',
      status: 'Pendiente de Agendamiento',
      icon: <DocumentTextIcon className="h-8 w-8 text-primary" />,
      serviceType: ServiceType.CV,
      lastUpdated: now,
    }
  ];
};


export const ClientDashboardSection: React.FC<ClientDashboardSectionProps> = ({ 
    id, 
    user, 
    openModal, 
    newlyOptimizedCvData, 
    onConsumeNewCvData,
    newlyEvaluatedProfile,
    onConsumeNewProfile,
    newlyFreelancerProfileData,
    onConsumeNewFreelancerProfile
}) => {
  // Usar el hook para cargar servicios del backend
  const { clientServices: backendServices, loading: servicesLoading, error: servicesError, refetch } = useClientServices();
  
  // Estado local para servicios (mantener compatibilidad con funciones existentes)
  const [localServices, setLocalServices] = useState<ClientService[]>(() => getDefaultServicesForUser(user));
  
  // Combinar servicios del backend con servicios locales
  const [clientServices, setClientServices] = useState<ClientService[]>([]);

  useEffect(() => {
    if (!servicesLoading && !servicesError) {
      // Si tenemos servicios del backend, usarlos
      if (backendServices && backendServices.length > 0) {
        // Convertir servicios del backend al formato local
        const convertedServices = backendServices.map(service => ({
          id: service.id.toString(),
          name: service.service_type,
          status: service.status,
          icon: <DocumentTextIcon className="h-8 w-8 text-primary" />,
          serviceType: ServiceType.CV, // Mapear según sea necesario
          clientNotes: service.notes || 'Sin notas adicionales',
          lastUpdated: service.updated_at,
          paymentStatus: service.payment_status,
          price: service.price,
          estimatedDeliveryDate: service.estimated_delivery_date
        }));
        setClientServices([...convertedServices, ...localServices]);
      } else {
        // Si no hay servicios del backend, usar los por defecto
        setClientServices(getDefaultServicesForUser(user));
      }
    } else if (servicesError) {
      // En caso de error, usar servicios por defecto
      setClientServices(getDefaultServicesForUser(user));
    }
  }, [backendServices, servicesLoading, servicesError, user, localServices]);

  useEffect(() => {
    if (newlyOptimizedCvData) {
      const cvTextFromPayload = newlyOptimizedCvData.optimizedCvText;

      if (cvTextFromPayload && cvTextFromPayload.trim() !== "") {
        const newServiceEntry: ClientService = {
          id: newlyOptimizedCvData.id,
          name: newlyOptimizedCvData.name || 'Hoja de Vida Optimizada por IA',
          status: 'Aprobado y Listo para Descargar',
          icon: newlyOptimizedCvData.icon || <DocumentCheckIcon className="h-8 w-8 text-green-500" />,
          serviceType: newlyOptimizedCvData.serviceType, 
          optimizedCvText: cvTextFromPayload,
          clientNotes: newlyOptimizedCvData.clientNotes || 'CV generado y aprobado a través del Asistente IA.',
          lastUpdated: newlyOptimizedCvData.lastUpdated
        };
        
        setClientServices(prevServices => {
          const otherServices = prevServices.filter(s => s.id !== newServiceEntry.id);
          return [newServiceEntry, ...otherServices];
        });
      } else {
        alert("Se intentó agregar un CV optimizado, pero el contenido del texto está vacío. Por favor, intente la optimización de nuevo.");
      }
      onConsumeNewCvData(); 
    }
  }, [newlyOptimizedCvData, onConsumeNewCvData]);
  
  useEffect(() => {
      if(newlyEvaluatedProfile) {
        setClientServices(prev => [newlyEvaluatedProfile, ...prev]);
        onConsumeNewProfile();
      }
  }, [newlyEvaluatedProfile, onConsumeNewProfile]);
  
  useEffect(() => {
      if(newlyFreelancerProfileData) {
        setClientServices(prev => [newlyFreelancerProfileData, ...prev]);
        onConsumeNewFreelancerProfile();
      }
  }, [newlyFreelancerProfileData, onConsumeNewFreelancerProfile]);


  const handleSaveServiceNote = (serviceId: string, note: string) => {
    setClientServices(prevServices =>
      prevServices.map(s =>
        s.id === serviceId ? { ...s, clientNotes: note, status: 'Requiere Atención', lastUpdated: new Date().toISOString() } : s
      )
    );
  };
  
  const handleOpenUpdateModal = (service: ClientService) => {
    const payload = {
      ...service, 
      onSaveNoteCallback: (note: string) => handleSaveServiceNote(service.id, note)
    };
    openModal(ModalType.REQUEST_SERVICE_UPDATE, payload);
  };

  const handleSimulatedDownload = (cvTextFromService: string | undefined) => {
    if (cvTextFromService && cvTextFromService.trim() !== "") {
      alert("CV Optimizado (Simulación de Descarga):\n\n" + cvTextFromService);
    } else {
      alert("No hay contenido de CV optimizado para este servicio o el contenido está vacío.");
    }
  };

  const handleDeleteService = (serviceId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.")) {
        setClientServices(prevServices => prevServices.filter(s => s.id !== serviceId));
    }
  };


  return (
    <section id={id} className="py-12 md:py-20 bg-gradient-to-br from-neutral-light to-gray-200 min-h-[calc(100vh-10rem)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 md:mb-14 p-6 bg-white shadow-lg rounded-xl">
          <div className="flex items-center space-x-4">
            <UserCircleIcon className="h-16 w-16 md:h-20 md:w-20 text-primary p-1 border-2 border-primary-light rounded-full" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-dark">
                Panel de Cliente: {user.name}
              </h1>
              <p className="text-md text-neutral-default">
                Bienvenido/a a tu espacio personal. Aquí gestionas tus servicios.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 md:gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-dark px-1 mb-4">Mis Servicios Contratados</h2>
            
            {/* Estado de carga */}
            {servicesLoading && (
              <Card className="p-6 text-center" shadow="lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-neutral-default">Cargando servicios...</p>
              </Card>
            )}
            
            {/* Error del backend */}
            {servicesError && !servicesLoading && (
              <Card className="p-6 text-center border-red-200" shadow="lg">
                <p className="text-red-500 mb-2">No se pudieron cargar los servicios del servidor</p>
                <p className="text-sm text-neutral-default mb-4">Mostrando servicios de ejemplo</p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => refetch()}
                  className="text-sm"
                >
                  Reintentar conexión
                </Button>
              </Card>
            )}
            
            {!servicesLoading && clientServices.length > 0 ? (
              clientServices.map((service) => (
                <Card key={service.id} className="p-5 md:p-6 mb-4" shadow="lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <div className="md:col-span-2 flex items-start space-x-4">
                      <div className="mt-1 mr-0 p-2 bg-primary-light/20 rounded-lg">{service.icon}</div>
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-primary">{service.name}</h3>
                        <span className={`text-xs font-medium px-2 py-0.5 inline-block rounded-full ${
                          service.status === 'Completada' || service.status === 'CV Entregado' ? 'bg-green-100 text-green-700' :
                          service.status === 'En Progreso' ? 'bg-yellow-100 text-yellow-700' :
                          service.status === 'Requiere Atención' ? 'bg-red-100 text-red-700' :
                          service.status === 'Aprobado y Listo para Descargar' ? 'bg-teal-100 text-teal-700' :
                          service.status === 'Perfil Evaluado' ? 'bg-indigo-100 text-indigo-700' :
                          service.status === 'Perfil Freelance Evaluado' ? 'bg-blue-100 text-blue-700' :
                          'bg-blue-100 text-blue-700' 
                        }`}>
                          {service.status}
                        </span>
                        <p className="text-xs text-neutral-default mt-1">Última Actualización: {formatDate(service.lastUpdated)}</p>
                      </div>
                    </div>

                    <div className="md:col-span-1 flex flex-col sm:flex-row md:flex-col items-stretch md:items-end space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-0 md:space-y-2 w-full">
                      {service.status === 'Aprobado y Listo para Descargar' ? (
                          <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleSimulatedDownload(service.optimizedCvText)}
                              leftIcon={<ArrowDownTrayIcon className="h-4 w-4" />}
                              className="w-full"
                          >
                              Descargar CV (Simulado)
                          </Button>
                      ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenUpdateModal(service)}
                            leftIcon={<PencilSquareIcon className="h-4 w-4"/>}
                            className="w-full"
                          >
                            Editar / Ver Notas
                          </Button>
                      )}
                      <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteService(service.id)}
                          leftIcon={<TrashIcon className="h-4 w-4 text-red-500"/>}
                          className="w-full text-red-500 hover:bg-red-100"
                        >
                          Eliminar
                      </Button>
                    </div>
                  </div>

                  {service.clientNotes && (
                    <div className="mt-4 pt-3 border-t border-neutral-light/50">
                      <h4 className="text-sm font-semibold text-neutral-dark mb-1">Última nota / Detalle:</h4>
                      <p className="text-sm text-neutral-default italic bg-neutral-light/30 p-3 rounded-md whitespace-pre-wrap">"{service.clientNotes}"</p>
                    </div>
                  )}
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center" shadow="md">
                <DocumentTextIcon className="h-12 w-12 text-neutral-default mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">No tienes servicios activos</h3>
                <p className="text-neutral-default mb-4">
                  Explora nuestros servicios y comienza tu camino como Asistente Virtual.
                </p>
              </Card>
            )}
             <p className="mt-2 text-xs text-neutral-default text-center">
                (Funcionalidad de gestión de servicios y pagos completa estaría disponible con un backend).
              </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-300">
            <h2 className="text-2xl font-semibold text-neutral-dark px-1 mb-6 text-center sm:text-left">
              Potencia tu Carrera con IA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card shadow="lg" hoverEffect className="p-6 flex flex-col items-center text-center bg-gradient-to-br from-secondary/5 via-white to-white">
                <SparklesIcon className="h-12 w-12 text-secondary mb-4" />
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">Asesoría IA Personalizada</h3>
                <p className="text-neutral-default text-sm mb-4 flex-grow">
                  Obtén consejos estratégicos y respuestas a tus dudas para impulsar tu inicio como Asistente Virtual.
                </p>
                <Button 
                  variant="secondary" 
                  onClick={() => openModal(ModalType.AI_ADVISOR)}
                  className="w-full"
                >
                  Iniciar Nueva Asesoría IA
                </Button>
              </Card>
              <Card shadow="lg" hoverEffect className="p-6 flex flex-col items-center text-center bg-gradient-to-br from-primary-light/5 via-white to-white">
                <DocumentArrowUpIcon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">Optimiza tu CV con IA</h3>
                <p className="text-neutral-default text-sm mb-4 flex-grow">
                  Sube o pega tu CV y deja que nuestra IA lo transforme en un documento profesional y atractivo.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => openModal(ModalType.AI_CV_HELPER)}
                  className="w-full"
                >
                  Optimizar un Nuevo CV con IA
                </Button>
              </Card>
               <Card shadow="lg" hoverEffect className="p-6 flex flex-col items-center text-center bg-gradient-to-br from-indigo-500/5 via-white to-white">
                <PhoneArrowUpRightIcon className="h-12 w-12 text-indigo-500 mb-4" />
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">Asesor de Call Center</h3>
                <p className="text-neutral-default text-sm mb-4 flex-grow">
                  Obtén una evaluación de tu perfil, simula entrevistas y accede a recursos para trabajos remotos en call centers.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => openModal(ModalType.CALL_CENTER_ADVISOR)}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-500"
                >
                  Iniciar Asesoría de Call Center
                </Button>
              </Card>
               <Card shadow="lg" hoverEffect className="p-6 flex flex-col items-center text-center bg-gradient-to-br from-blue-500/5 via-white to-white">
                <BriefcaseIcon className="h-12 w-12 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">Asesor Freelance Pro</h3>
                <p className="text-neutral-default text-sm mb-4 flex-grow">
                  Genera propuestas, encuentra oportunidades y obtén estrategias para posicionarte como un freelancer experto.
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => openModal(ModalType.FREELANCER_ADVISOR)}
                  className="w-full bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                >
                  Desbloquear Asesor Pro
                </Button>
              </Card>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};