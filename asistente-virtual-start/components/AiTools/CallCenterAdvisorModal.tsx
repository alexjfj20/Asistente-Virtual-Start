import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

interface CallCenterAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileEvaluated: (evaluationText: string) => void;
}

interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

// Icons
const PhoneArrowUpRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-5.18-4.3-9.45-9.75-9.45S0 6.82 0 12c0 4.88 3.58 8.94 8.25 9.45V12m11.25 0a9.45 9.45 0 00-9.75-9.45M19.5 12v.75a8.97 8.97 0 01-8.25 8.7V12m8.25 0h.75a2.25 2.25 0 012.25 2.25v2.25a2.25 2.25 0 01-2.25-2.25h-1.5a2.25 2.25 0 01-2.25-2.25v-2.25a2.25 2.25 0 012.25-2.25h.75M16.5 4.5l4.5 4.5m0 0l-4.5 4.5m4.5-4.5h-12" />
    </svg>
);
const DocumentMagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-4.5l-2.25-2.25a2.25 2.25 0 010-3.182l2.25-2.25a2.25 2.25 0 013.182 0l2.25 2.25a2.25 2.25 0 010 3.182l-2.25 2.25a2.25 2.25 0 01-3.182 0z" />
    </svg>
);
const MicrophoneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 016 0v8.25a3 3 0 01-3 3z" />
    </svg>
);
const InformationCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
);
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


type AdvisorTab = 'evaluation' | 'simulator' | 'resources';

export const CallCenterAdvisorModal: React.FC<CallCenterAdvisorModalProps> = ({ isOpen, onClose, onProfileEvaluated }) => {
    const [activeTab, setActiveTab] = useState<AdvisorTab>('evaluation');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Evaluation state
    const [evaluationData, setEvaluationData] = useState({
        experience: '',
        languages: '',
        cvText: '',
        connectionSpeed: '',
    });
    const [evaluationResult, setEvaluationResult] = useState('');
    const [evaluationSaved, setEvaluationSaved] = useState(false);

    // Simulator state
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Reset all states when modal opens
    useEffect(() => {
        if(isOpen) {
            setActiveTab('evaluation');
            setIsLoading(false);
            setError('');
            setEvaluationData({ experience: '', languages: '', cvText: '', connectionSpeed: '' });
            setEvaluationResult('');
            setEvaluationSaved(false);
            setMessages([]);
            setUserInput('');
            initializeChat();
        }
    }, [isOpen]);
    
    // Scroll chat to bottom
    useEffect(() => {
        if (activeTab === 'simulator' && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, activeTab]);

    const initializeChat = () => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const newChat = ai.chats.create({
                model: 'gemini-2.5-flash-preview-04-17',
                config: {
                    systemInstruction: `Eres un entrevistador de RRHH muy experimentado y amable, especializado en contratar para puestos de call center remotos. Tu objetivo es simular una entrevista realista pero constructiva.
1.  Comienza presentándote y dando la bienvenida al candidato a la entrevista.
2.  Haz preguntas típicas de entrevistas para call centers, como: "Háblame de tu experiencia en atención al cliente", "¿Cómo manejas a un cliente difícil o enojado?", "Describe una situación en la que tuviste que resolver un problema complejo para un cliente", "¿Qué harías si no supieras la respuesta a la pregunta de un cliente?", y preguntas de comportamiento (STAR).
3.  Después de la sesión de preguntas y respuestas, proporciona al usuario guiones de práctica (scripts) para que pueda practicar su entonación, claridad y acento. Por ejemplo, scripts de bienvenida, scripts para resolver problemas, scripts de ventas, etc.
4.  Mantén un tono profesional pero alentador.`,
                },
            });
            setChat(newChat);
             setMessages([{ 
                id: 'initial-greeting', 
                text: '¡Hola! Soy tu simulador de entrevistas. Gracias por tu interés en el puesto de agente de call center. ¿Estás listo/a para comenzar con algunas preguntas?', 
                sender: 'ai', 
                timestamp: new Date() 
            }]);
        } catch (e: any) {
            console.error("Error initializing Gemini Chat:", e);
            setError('No se pudo iniciar el simulador de entrevista.');
        }
    };

    const handleEvaluationSubmit = async () => {
        setIsLoading(true);
        setError('');
        setEvaluationResult('');

        const { experience, languages, cvText, connectionSpeed } = evaluationData;
        const prompt = `Actúa como un coach de carrera experto en trabajos remotos para call centers. Analiza el siguiente perfil de un candidato y proporciona una evaluación detallada y constructiva. La evaluación debe estar en formato de texto plano y organizada en las siguientes secciones (usa los títulos exactos en negrita):

**Resumen del Perfil:**
Un párrafo breve resumiendo las capacidades del candidato.

**Puntos Fuertes:**
Una lista (usando guiones) de las fortalezas más destacadas para un puesto de call center (ej. experiencia relevante, idiomas, habilidades blandas evidentes).

**Áreas de Mejora:**
Una lista (usando guiones) con sugerencias concretas para mejorar el perfil. Por ejemplo, cómo describir mejor su experiencia, qué habilidades resaltar en el CV, si la velocidad de conexión es un problema, o qué tipo de roles buscar.

**Sugerencias para el CV:**
Consejos específicos para optimizar el CV para ATS y reclutadores de call centers.

---
**DATOS DEL CANDIDATO:**
*   **Experiencia Relevante:** ${experience || 'No proporcionada'}
*   **Idiomas (y nivel):** ${languages || 'No proporcionado'}
*   **Texto del CV:** ${cvText || 'No proporcionado'}
*   **Velocidad de Conexión a Internet:** ${connectionSpeed || 'No proporcionada'}
---

Proporciona solo el texto de la evaluación, sin saludos ni comentarios adicionales.`;
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response: GenerateContentResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash-preview-04-17', contents: prompt });
            setEvaluationResult(response.text);
        } catch (e: any) {
            console.error(e);
            setError('Error al generar la evaluación: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveEvaluation = () => {
        onProfileEvaluated(evaluationResult);
        setEvaluationSaved(true);
    };

    const handleSendMessage = async () => {
        if (!userInput.trim() || !chat || isLoading) return;
    
        const newUserMessage: ChatMessage = { id: Date.now().toString(), text: userInput, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);
    
        try {
            const response = await chat.sendMessage({ message: newUserMessage.text });
            const newAiMessage: ChatMessage = { id: Date.now().toString() + '-ai', text: response.text, sender: 'ai', timestamp: new Date() };
            setMessages(prev => [...prev, newAiMessage]);
        } catch (e: any) {
            console.error("Error sending message:", e);
            setError('No se pudo obtener respuesta del simulador.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderTabs = () => (
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button onClick={() => setActiveTab('evaluation')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'evaluation' ? 'border-primary text-primary' : 'border-transparent text-neutral-default hover:text-neutral-dark hover:border-gray-300'}`}>
                    Evaluación de Perfil
                </button>
                <button onClick={() => setActiveTab('simulator')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'simulator' ? 'border-primary text-primary' : 'border-transparent text-neutral-default hover:text-neutral-dark hover:border-gray-300'}`}>
                    Simulador de Entrevista
                </button>
                 <button onClick={() => setActiveTab('resources')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'resources' ? 'border-primary text-primary' : 'border-transparent text-neutral-default hover:text-neutral-dark hover:border-gray-300'}`}>
                    Recursos y Plataformas
                </button>
            </nav>
        </div>
    );
    
    const renderEvaluationTab = () => (
        <div>
            {!evaluationResult ? (
                 <div className="space-y-4">
                    <Textarea label="Describe tu experiencia relevante (atención al cliente, ventas, soporte, etc.)" value={evaluationData.experience} onChange={e => setEvaluationData({...evaluationData, experience: e.target.value})} rows={3} />
                    <Input label="Idiomas que hablas y tu nivel (ej. Inglés B2, Español Nativo)" value={evaluationData.languages} onChange={e => setEvaluationData({...evaluationData, languages: e.target.value})} />
                    <Textarea label="Pega el texto de tu CV (opcional)" value={evaluationData.cvText} onChange={e => setEvaluationData({...evaluationData, cvText: e.target.value})} rows={5} />
                    <Input label="Velocidad de tu conexión a internet (ej. 50 Mbps de bajada, 10 Mbps de subida)" value={evaluationData.connectionSpeed} onChange={e => setEvaluationData({...evaluationData, connectionSpeed: e.target.value})} />
                    <Button onClick={handleEvaluationSubmit} disabled={isLoading} className="w-full" size="lg" variant="primary">
                        {isLoading ? 'Analizando...' : 'Evaluar mi Perfil con IA'}
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                     <h3 className="text-xl font-semibold text-primary">Resultado de tu Evaluación</h3>
                     <div className="p-4 border border-primary-light rounded-lg bg-neutral-light/30 max-h-[40vh] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-neutral-dark">{evaluationResult}</pre>
                     </div>
                     <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3 border-t">
                        <Button variant="outline" onClick={() => setEvaluationResult('')} disabled={evaluationSaved}>Volver a Evaluar</Button>
                        <Button variant="primary" onClick={handleSaveEvaluation} disabled={evaluationSaved} leftIcon={evaluationSaved ? <CheckCircleIcon className="h-5 w-5"/> : undefined}>
                            {evaluationSaved ? 'Guardado en tu Panel' : 'Guardar Resultado'}
                        </Button>
                     </div>
                </div>
            )}
        </div>
    );

    const renderSimulatorTab = () => (
        <div className="flex flex-col h-[60vh]">
            <div ref={chatContainerRef} className="flex-grow space-y-4 p-4 overflow-y-auto bg-neutral-light/50 rounded-lg mb-4 border">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <PhoneArrowUpRightIcon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />}
                        <p className={`px-4 py-2 rounded-lg max-w-[80%] whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-secondary text-white' : 'bg-white text-neutral-dark'}`}>{msg.text}</p>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                        <PhoneArrowUpRightIcon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                        <div className="px-4 py-2 rounded-lg bg-white text-neutral-dark">...</div>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-2 border-t pt-4">
                <Input id="chat-input" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Escribe tu respuesta..." className="flex-grow" disabled={isLoading || !chat}/>
                <Button onClick={handleSendMessage} disabled={isLoading || !chat || !userInput.trim()}>Enviar</Button>
            </div>
        </div>
    );

    const renderResourcesTab = () => (
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Plataformas para Encontrar Empleo Remoto</h3>
                 <ul className="list-disc list-inside space-y-1 text-neutral-default">
                    <li><strong>Upwork:</strong> Ideal para freelancers, muchos proyectos por hora o fijos.</li>
                    <li><strong>LinkedIn:</strong> Usa los filtros de "remoto" y "a distancia" para encontrar ofertas.</li>
                    <li><strong>Indeed / Glassdoor:</strong> Portales de empleo masivos con muchas vacantes remotas.</li>
                    <li><strong>We Work Remotely:</strong> Especializado en trabajos 100% remotos.</li>
                     <li><strong>Jobgether:</strong> Plataforma que conecta talento con empresas que ofrecen flexibilidad.</li>
                </ul>
            </div>
             <div>
                <h3 className="text-lg font-semibold text-primary mb-2">Equipo Esencial</h3>
                 <ul className="list-disc list-inside space-y-1 text-neutral-default">
                    <li><strong>Conexión a Internet Estable:</strong> Mínimo 20-30 Mbps de bajada y 5-10 Mbps de subida.</li>
                    <li><strong>Auriculares con Micrófono de Calidad:</strong> La cancelación de ruido es un gran plus.</li>
                    <li><strong>Computadora Confiable:</strong> Que pueda manejar múltiples pestañas y aplicaciones sin problemas.</li>
                    <li><strong>Espacio de Trabajo Silencioso:</strong> Fundamental para la concentración y profesionalismo.</li>
                </ul>
            </div>
        </div>
    );
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Asesor IA para Call Centers" size="full">
            {renderTabs()}
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md my-4 text-sm">{error}</p>}
            <div className="mt-4">
                {activeTab === 'evaluation' && renderEvaluationTab()}
                {activeTab === 'simulator' && renderSimulatorTab()}
                {activeTab === 'resources' && renderResourcesTab()}
            </div>
        </Modal>
    );
};
