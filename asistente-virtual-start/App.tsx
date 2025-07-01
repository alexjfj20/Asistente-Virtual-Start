



import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { ServicesSection } from './components/ServicesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AuthModal } from './components/Auth/AuthModal';
import { AiCvHelperModal } from './components/AiTools/AiCvHelperModal';
import { AiAdvisorModal } from './components/AiTools/AiAdvisorModal';
import { CallCenterAdvisorModal } from './components/AiTools/CallCenterAdvisorModal'; // Import new modal
import { FreelancerAdvisorModal } from './components/AiTools/FreelancerAdvisorModal'; // Import new modal
import { ClientDashboardSection } from './components/Dashboard/ClientDashboardSection'; 
import { AdminPanelSection } from './components/Admin/AdminPanelSection'; 
import { RequestServiceUpdateModal } from './components/Dashboard/RequestServiceUpdateModal';
import { StripePaymentModal } from './components/Payments/StripePaymentModal';
import { QrPaymentModal } from './components/Payments/QrPaymentModal';
import { MercadoPagoRedirectModal } from './components/Payments/MercadoPagoRedirectModal';
import { EditServicePlanModal } from './components/Admin/EditServicePlanModal';
import { ConfigurePaymentGatewayModal } from './components/Admin/ConfigurePaymentGatewayModal'; // Import the new modal
import { User, ServiceType, ModalType, NavLink, ClientService, Service, PaymentGateway } from './types';
import { APP_NAME, SERVICES_DATA } from './constants';

type CurrentView = 'main' | 'dashboard' | 'admin';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(ModalType.NONE);
  const [modalPayload, setModalPayload] = useState<any>(null);
  const [selectedServiceForContact, setSelectedServiceForContact] = useState<ServiceType | undefined>(undefined);
  const [currentView, setCurrentView] = useState<CurrentView>('main');
  const [pendingServiceRequest, setPendingServiceRequest] = useState<Service | null>(null);

  const [newlyOptimizedCvData, setNewlyOptimizedCvData] = useState<ClientService | null>(null);
  const [newlyEvaluatedProfile, setNewlyEvaluatedProfile] = useState<ClientService | null>(null);
  const [newlyFreelancerProfileData, setNewlyFreelancerProfileData] = useState<ClientService | null>(null);


  const homeSectionRef = useRef<HTMLDivElement>(null);
  const servicesSectionRef = useRef<HTMLDivElement>(null);
  const testimonialsSectionRef = useRef<HTMLDivElement>(null);
  const blogSectionRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  

  const openModal = (modalType: ModalType, payload?: any) => {
    setActiveModal(modalType);
    if (payload) {
      setModalPayload(payload);
    }
  };
  const closeModal = () => {
    setActiveModal(ModalType.NONE);
    setModalPayload(null);
    if (activeModal !== ModalType.AUTH && activeModal !== ModalType.AI_CV_HELPER && activeModal !== ModalType.AI_ADVISOR && activeModal !== ModalType.CALL_CENTER_ADVISOR && activeModal !== ModalType.FREELANCER_ADVISOR) {
      setPendingServiceRequest(null);
    }
  };

  const navigateToMainAndScroll = (sectionRef: React.RefObject<HTMLDivElement>) => {
    setCurrentView('main');
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50); 
  };
  
  const handleProceedToPayment = (paymentMethod: string, registrationData: Omit<User, 'id' | 'isAdmin'>, service: Service) => {
    const payload = { registrationData, service, onRegisterSuccess: handleRegisterSuccess };
    
    switch (paymentMethod) {
        case 'Stripe':
            openModal(ModalType.STRIPE_PAYMENT, payload);
            break;
        case 'Nequi':
        case 'DaviPlata':
        case 'QR Code':
            openModal(ModalType.QR_PAYMENT, payload);
            break;
        case 'MercadoPago':
            openModal(ModalType.MERCADOPAGO_REDIRECT, payload);
            break;
        default:
            // Fallback or error
            console.error("Payment method not supported for modal flow.");
            break;
    }
};

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    
    if (pendingServiceRequest) {
      // User just completed a purchase of the all-in-one plan. Go to dashboard.
      closeModal();
      setCurrentView('dashboard');
      setPendingServiceRequest(null);
    } else {
        closeModal();
        if (user.isAdmin) {
            setCurrentView('admin');
        } else {
            setCurrentView('dashboard');
        }
    }
  };

  const handleRegisterSuccess = (user: User) => {
    setCurrentUser(user); 
    
    if (pendingServiceRequest) {
        // User just completed a purchase of the all-in-one plan. Go to dashboard.
        closeModal();
        setCurrentView('dashboard');
        setPendingServiceRequest(null);
    } else {
        closeModal();
        setCurrentView('dashboard'); 
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('main');
    setNewlyOptimizedCvData(null);
    setNewlyEvaluatedProfile(null);
    setNewlyFreelancerProfileData(null);
    setPendingServiceRequest(null);
    setTimeout(() => homeSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const scrollToContact = () => {
    navigateToMainAndScroll(contactSectionRef);
  };

  const handleStartPlan = (service?: Service) => {
    // Si se pasa un servicio específico, usarlo. Si no, usar el primero de SERVICES_DATA (compatible con el comportamiento anterior)
    const serviceToOrder = service || SERVICES_DATA[0];
    if (serviceToOrder) {
        if (!currentUser) {
            setPendingServiceRequest(serviceToOrder);
            openModal(ModalType.AUTH);
            return;
        }
        // If user is already logged in, just go to the dashboard.
        setCurrentView('dashboard');
    }
  };

  const handleCvOptimizationApproved = (optimizedCvText: string) => {
    if(!currentUser) return;

    const newCvService: ClientService = {
      id: `cv-opt-${Date.now()}`,
      name: 'Hoja de Vida Optimizada por IA',
      status: 'Aprobado y Listo para Descargar',
      icon: <DocumentCheckIcon className="h-8 w-8 text-green-500" />,
      serviceType: ServiceType.CV,
      optimizedCvText: optimizedCvText,
      clientNotes: 'CV generado y aprobado a través del Asistente IA.',
      lastUpdated: new Date().toISOString(),
    };
    setNewlyOptimizedCvData(newCvService);
  };
  
  const handleCallCenterProfileEvaluated = (evaluationText: string) => {
      if(!currentUser) return;

      const newProfileService: ClientService = {
        id: `cc-eval-${Date.now()}`,
        name: 'Evaluación de Perfil para Call Center',
        status: 'Perfil Evaluado',
        icon: <PhoneArrowUpRightIcon className="h-8 w-8 text-indigo-500" />,
        serviceType: ServiceType.CALL_CENTER,
        clientNotes: evaluationText,
        lastUpdated: new Date().toISOString(),
      };
      setNewlyEvaluatedProfile(newProfileService);
  };

  const handleFreelancerProfileEvaluated = (evaluationText: string) => {
    if(!currentUser) return;

    const newProfileService: ClientService = {
      id: `fl-eval-${Date.now()}`,
      name: 'Evaluación de Perfil Freelance',
      status: 'Perfil Freelance Evaluado',
      icon: <BriefcaseIcon className="h-8 w-8 text-blue-500" />,
      serviceType: ServiceType.FREELANCER,
      clientNotes: evaluationText,
      lastUpdated: new Date().toISOString(),
    };
    setNewlyFreelancerProfileData(newProfileService);
  };

  const clearNewlyOptimizedCvData = () => {
    setNewlyOptimizedCvData(null);
  };

  const clearNewlyEvaluatedProfile = () => {
    setNewlyEvaluatedProfile(null);
  };

  const clearNewlyFreelancerProfileData = () => {
    setNewlyFreelancerProfileData(null);
  };


  const navLinks: NavLink[] = [
    { href: "#inicio", label: "Inicio", action: () => navigateToMainAndScroll(homeSectionRef) },
    { href: "#servicios", label: "Plan", action: () => navigateToMainAndScroll(servicesSectionRef) },
    ...(currentUser
      ? (currentUser.isAdmin
          ? [
              { href: "#admin", label: "Admin", action: () => setCurrentView('admin'), requiresAuth: true },
              { href: "#logout", label: "Cerrar Sesión", action: handleLogout, requiresAuth: true }
            ]
          : [
              { href: "#dashboard", label: "Mi Panel", action: () => setCurrentView('dashboard'), requiresAuth: true },
              { href: "#logout", label: "Cerrar Sesión", action: handleLogout, requiresAuth: true }
            ]
        )
      : [
          { href: "#login", label: "Ingresar/Registrarse", action: () => openModal(ModalType.AUTH), hideWhenAuth: true }
        ]),
    { href: "#testimonios", label: "Testimonios", action: () => navigateToMainAndScroll(testimonialsSectionRef) },
    { href: "#blog", label: "Recursos", action: () => navigateToMainAndScroll(blogSectionRef) },
    { href: "#contacto", label: "Contacto", action: () => scrollToContact() },
  ];

  const DocumentCheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light">
      <Navbar 
        appName={APP_NAME} 
        navLinks={navLinks} 
        currentUser={currentUser} 
        onAuthClick={() => openModal(ModalType.AUTH)} 
        onLogoutClick={handleLogout} 
        onGoHome={() => navigateToMainAndScroll(homeSectionRef)}
      />
      <main className="flex-grow">
        {currentView === 'main' && (
          <>
            <div ref={homeSectionRef}>
              <HomeSection 
                  id="inicio" 
                  onStartPlan={handleStartPlan}
              />
            </div>
            <div ref={servicesSectionRef}>
              <ServicesSection id="servicios" onStartPlan={handleStartPlan} />
            </div>
            <div ref={testimonialsSectionRef}>
              <TestimonialsSection id="testimonios" />
            </div>
            <div ref={blogSectionRef}>
              <BlogSection id="blog" />
            </div>
            <div ref={contactSectionRef}>
            <ContactSection id="contacto" />
            </div>
          </>
        )}

        {currentView === 'dashboard' && currentUser && !currentUser.isAdmin && (
          <ClientDashboardSection 
            id="dashboard" 
            user={currentUser} 
            openModal={openModal}
            newlyOptimizedCvData={newlyOptimizedCvData}
            onConsumeNewCvData={clearNewlyOptimizedCvData}
            newlyEvaluatedProfile={newlyEvaluatedProfile}
            onConsumeNewProfile={clearNewlyEvaluatedProfile}
            newlyFreelancerProfileData={newlyFreelancerProfileData}
            onConsumeNewFreelancerProfile={clearNewlyFreelancerProfileData}
          />
        )}
        
        {currentView === 'admin' && currentUser?.isAdmin && (
          <AdminPanelSection id="admin" openModal={openModal} />
        )}

      </main>
      <Footer appName={APP_NAME} />
      <WhatsAppButton />

      {activeModal === ModalType.AUTH && (
        <AuthModal 
          isOpen={activeModal === ModalType.AUTH} 
          onClose={closeModal} 
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          onProceedToPayment={handleProceedToPayment}
          pendingService={pendingServiceRequest}
        />
      )}
      {activeModal === ModalType.AI_CV_HELPER && (
        <AiCvHelperModal 
          isOpen={activeModal === ModalType.AI_CV_HELPER} 
          onClose={closeModal} 
          onCvApproved={handleCvOptimizationApproved}
        />
      )}
      {activeModal === ModalType.AI_ADVISOR && (
        <AiAdvisorModal 
          isOpen={activeModal === ModalType.AI_ADVISOR} 
          onClose={closeModal} 
        />
      )}
       {activeModal === ModalType.CALL_CENTER_ADVISOR && (
        <CallCenterAdvisorModal 
          isOpen={activeModal === ModalType.CALL_CENTER_ADVISOR} 
          onClose={closeModal}
          onProfileEvaluated={handleCallCenterProfileEvaluated}
        />
      )}
      {activeModal === ModalType.FREELANCER_ADVISOR && (
        <FreelancerAdvisorModal
          isOpen={activeModal === ModalType.FREELANCER_ADVISOR}
          onClose={closeModal}
          onProfileEvaluated={handleFreelancerProfileEvaluated}
        />
      )}
      {activeModal === ModalType.REQUEST_SERVICE_UPDATE && modalPayload && (
        <RequestServiceUpdateModal
          isOpen={activeModal === ModalType.REQUEST_SERVICE_UPDATE}
          onClose={closeModal}
          service={modalPayload as ClientService}
          onSaveNote={modalPayload.onSaveNoteCallback}
        />
      )}
      {activeModal === ModalType.STRIPE_PAYMENT && modalPayload && (
        <StripePaymentModal 
            isOpen={activeModal === ModalType.STRIPE_PAYMENT}
            onClose={closeModal}
            {...modalPayload}
        />
      )}
      {activeModal === ModalType.QR_PAYMENT && modalPayload && (
        <QrPaymentModal 
            isOpen={activeModal === ModalType.QR_PAYMENT}
            onClose={closeModal}
            {...modalPayload}
        />
      )}
      {activeModal === ModalType.MERCADOPAGO_REDIRECT && modalPayload && (
        <MercadoPagoRedirectModal 
            isOpen={activeModal === ModalType.MERCADOPAGO_REDIRECT}
            onClose={closeModal}
            {...modalPayload}
        />
      )}
       {activeModal === ModalType.EDIT_SERVICE_PLAN && modalPayload && (
        <EditServicePlanModal
          isOpen={activeModal === ModalType.EDIT_SERVICE_PLAN}
          onClose={closeModal}
          service={modalPayload.service as Service}
          onSave={modalPayload.onSaveCallback}
        />
      )}
      {activeModal === ModalType.CONFIGURE_PAYMENT_GATEWAY && modalPayload && (
        <ConfigurePaymentGatewayModal
          isOpen={activeModal === ModalType.CONFIGURE_PAYMENT_GATEWAY}
          onClose={closeModal}
          gateway={modalPayload.gateway as PaymentGateway}
          onSave={modalPayload.onSaveCallback}
        />
      )}
    </div>
  );
};

export default App;