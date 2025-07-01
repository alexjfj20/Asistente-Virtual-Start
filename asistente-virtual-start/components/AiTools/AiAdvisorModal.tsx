
import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const PaperAirplaneIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

const UserCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 14.25l-1.25-2.25L13.5 11l2.25-1.25L17 7.5l1.25 2.25L20.5 11l-2.25 1.25z" />
  </svg>
);


export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [chat, setChat] = useState<Chat | null>(null);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize chat when modal opens
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const newChat = ai.chats.create({
          model: 'gemini-2.5-flash-preview-04-17',
          config: {
            systemInstruction: `Eres 'Mentor Virtual Pro', un coach de IA experto y amigable, especializado en guiar a aspirantes a Asistentes Virtuales (AV). Tu misión es ofrecer asesoramiento integral y práctico a usuarios que desean iniciar su carrera como AV, especialmente aquellos sin experiencia previa. Cubre temas como:
1. Identificación y aprovechamiento de habilidades transferibles.
2. Definición de nichos de mercado rentables para AVs.
3. Creación de un portafolio atractivo (incluso sin clientes formales).
4. Estrategias de marketing y promoción de servicios de AV.
5. Métodos efectivos para encontrar los primeros clientes.
6. Cómo establecer tarifas justas y competitivas.
7. Herramientas esenciales (gratuitas y de pago) para AVs.
8. Cómo superar los desafíos comunes al empezar.
Sé alentador, divide los temas complejos en pasos fáciles de entender y proporciona ejemplos cuando sea posible. Evita dar consejos financieros o legales específicos. Si el usuario pregunta específicamente sobre cómo mejorar su hoja de vida, sugiérele amablemente que utilice la herramienta 'Arreglo de Hoja de Vida con IA' para esa tarea específica, ya que tú te enfocas en la asesoría general.
Inicia la conversación preguntando al usuario sobre sus intereses y qué le gustaría aprender sobre ser Asistente Virtual. Mantén las respuestas concisas y directas.`,
          },
        });
        setChat(newChat);
        setMessages([
          { 
            id: 'initial-ai-greeting', 
            text: '¡Hola! Soy Mentor Virtual Pro. ¿Qué te gustaría saber sobre cómo empezar tu carrera como Asistente Virtual o en qué áreas necesitas más orientación?', 
            sender: 'ai',
            timestamp: new Date() 
          }
        ]);
        setUserInput('');
        setError('');

      } catch (e: any) {
        console.error("Error initializing Gemini Chat:", e);
        setError('No se pudo iniciar el Asistente IA. Verifica la configuración de la API Key. Detalles: ' + e.message);
      }
    }
  }, [isOpen]);

  // Scroll to bottom of chat messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !chat) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);
    setError('');

    try {
      const response: GenerateContentResponse = await chat.sendMessage({ message: newUserMessage.text });
      const aiResponseText = response.text;
      
      const newAiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAiMessage]);

    } catch (e: any) {
      console.error("Error sending message to Gemini:", e);
      setError('Hubo un error al obtener respuesta del Asistente IA. Por favor, intenta de nuevo. Detalles: ' + e.message);
       setMessages(prev => [...prev, {
        id: Date.now().toString() + '-error',
        text: 'Lo siento, no pude procesar tu solicitud en este momento.',
        sender: 'ai',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear state on close
  React.useEffect(() => {
    if (!isOpen) {
      setMessages([]);
      setUserInput('');
      setIsLoading(false);
      setError('');
      setChat(null);
    }
  }, [isOpen]);


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asesor IA para Asistentes Virtuales" size="full">
      <div className="flex flex-col h-[75vh]">
        <div 
          ref={chatContainerRef} 
          className="flex-grow space-y-4 p-4 overflow-y-auto bg-neutral-light/50 rounded-lg mb-4 border border-neutral-light"
        >
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.sender === 'ai' && <SparklesIcon className="h-8 w-8 text-primary bg-white rounded-full p-1.5 mr-2 flex-shrink-0 shadow" />}
                {msg.sender === 'user' && <UserCircleIcon className="h-8 w-8 text-secondary bg-white rounded-full p-1.5 ml-2 flex-shrink-0 shadow" />}
                <div
                  className={`px-4 py-3 rounded-xl shadow ${
                    msg.sender === 'user' 
                      ? 'bg-secondary text-white rounded-br-none' 
                      : 'bg-white text-neutral-dark rounded-bl-none border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-pink-200 text-right' : 'text-neutral-default text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
                <div className="flex items-start max-w-[80%] flex-row">
                    <SparklesIcon className="h-8 w-8 text-primary bg-white rounded-full p-1.5 mr-2 flex-shrink-0 shadow" />
                    <div className="px-4 py-3 rounded-xl shadow bg-white text-neutral-dark rounded-bl-none border border-gray-200">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-75"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-150"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-300"></div>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm mb-2 p-2 bg-red-100 rounded-md">{error}</p>}
        
        <div className="flex items-center space-x-2 border-t border-neutral-light pt-4">
          <Input
            id="user-chat-input"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-grow"
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            disabled={isLoading || !chat}
          />
          <Button 
            onClick={handleSendMessage} 
            variant="primary" 
            size="md"
            disabled={isLoading || !userInput.trim() || !chat}
            aria-label="Enviar mensaje"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};
