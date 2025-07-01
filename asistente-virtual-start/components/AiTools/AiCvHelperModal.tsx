
import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input'; 
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface AiCvHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCvApproved: (optimizedCvText: string) => void; // New prop
}

// Icons
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846-.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 14.25l-1.25-2.25L13.5 11l2.25-1.25L17 7.5l1.25 2.25L20.5 11l-2.25 1.25z" />
  </svg>
);

const DocumentArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.158 10.302L12 18.375l3.842-3.843M12 18.375V10.5M12 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.183m0-4.991v4.99" />
  </svg>
);

type CvHelperStep = 'input' | 'loading' | 'review' | 'completed';

export const AiCvHelperModal: React.FC<AiCvHelperModalProps> = ({ isOpen, onClose, onCvApproved }) => {
  const [currentStep, setCurrentStep] = useState<CvHelperStep>('input');
  const [cvInput, setCvInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setCurrentStep('input');
    setCvInput('');
    setAiResponse('');
    setIsLoading(false);
    setError('');
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      resetState();
    }
  }, [isOpen]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const fileType = file.type;
      const fileSize = file.size; 

      if (fileSize > 2 * 1024 * 1024) { 
        setError('El archivo es demasiado grande. El límite es de 2MB.');
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      if (fileType === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCvInput(e.target?.result as string);
          setError('');
        };
        reader.readAsText(file);
      } else if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(fileType)) {
        setCvInput(''); 
        setError('Para archivos PDF y DOC/DOCX, por favor copia y pega el texto de tu CV en el área de abajo. La extracción automática de texto no está disponible en esta demostración.');
      } else {
        setError('Formato de archivo no soportado. Por favor, sube un .txt o copia y pega el contenido.');
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const handleSubmitToAI = async () => {
    if (!cvInput.trim()) {
      setError('Por favor, ingresa o pega el contenido de tu CV.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAiResponse('');
    setCurrentStep('loading');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const modelName = 'gemini-2.5-flash-preview-04-17';
      
      const prompt = `Actúa como un experto en reclutamiento y optimización de Hojas de Vida (CVs) para Asistentes Virtuales.
Toma el siguiente texto del CV y reescríbelo completamente para maximizar su impacto.
Debes:
1.  Corregir errores gramaticales y de ortografía.
2.  Mejorar la redacción para que sea concisa, profesional y persuasiva.
3.  Destacar habilidades transferibles relevantes para Asistentes Virtuales (organización, comunicación, gestión de tiempo, proactividad, conocimiento de herramientas digitales, etc.).
4.  Optimizar el contenido para sistemas de seguimiento de candidatos (ATS) usando palabras clave relevantes del sector.
5.  Asegurar que el tono sea adecuado para el mercado de trabajo remoto y freelance.
6.  Si la información es muy básica (ej. solo una lista de habilidades), estructúrala en un formato de CV coherente.
Devuelve ÚNICAMENTE el CV optimizado. No incluyas comentarios, saludos, introducciones o explicaciones sobre lo que hiciste. Solo el texto del CV listo para usar.

CV Proporcionado por el usuario:
---
${cvInput}
---
CV Optimizado:`;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
      });
      setAiResponse(response.text);
      setCurrentStep('review');

    } catch (e: any) {
      console.error("Error con Gemini API:", e);
      setError('Hubo un error al contactar al asistente de IA. Por favor, inténtalo de nuevo más tarde. Detalles: ' + e.message);
      setCurrentStep('input'); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = () => {
    if (aiResponse) {
      onCvApproved(aiResponse); // Call the new prop
    }
    setCurrentStep('completed');
  };

  const handleRetry = () => {
    setCvInput(aiResponse); 
    setAiResponse('');
    setCurrentStep('input');
    setError('');
    setFileName(''); 
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 'input':
        return (
          <>
            <p className="text-neutral-default text-sm mb-2">
              Pega el texto de tu CV, o sube un archivo (.txt). Para PDF/DOC, copia y pega el contenido manualmente.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="cv-file-input" className="block text-sm font-medium text-neutral-dark mb-1">
                  Subir archivo de CV (Opcional, preferible .txt)
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        id="cv-file-input"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".txt,.pdf,.doc,.docx"
                        className="block w-full text-sm text-neutral-default file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary-dark hover:file:bg-primary-light/80 cursor-pointer border border-gray-300 rounded-lg"
                    />
                </div>
                {fileName && <p className="text-xs text-neutral-default mt-1">Archivo seleccionado: {fileName}</p>}
              </div>
              <Textarea
                id="cv-input-area"
                label="O pega el texto de tu CV aquí:"
                value={cvInput}
                onChange={(e) => { setCvInput(e.target.value); if (fileName) setFileName(''); if (fileInputRef.current) fileInputRef.current.value = '';}}
                placeholder="Ej: Experiencia en atención al cliente, manejo de redes sociales, buena organización..."
                rows={10}
                disabled={isLoading}
              />
              <Button 
                onClick={handleSubmitToAI} 
                variant="primary" 
                size="lg" 
                className="w-full"
                disabled={isLoading || !cvInput.trim()}
                leftIcon={<SparklesIcon className="h-5 w-5" />}
              >
                Analizar con IA
              </Button>
            </div>
          </>
        );
      case 'loading':
        return (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-dark mx-auto"></div>
            <p className="mt-4 text-lg text-neutral-default">La IA está optimizando tu CV...</p>
            <p className="text-sm text-neutral-default">Esto puede tardar unos momentos.</p>
          </div>
        );
      case 'review':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-primary">Revisa tu CV Optimizado por IA:</h3>
            <div className="p-4 border border-primary-light rounded-lg bg-neutral-light/30 max-h-[40vh] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-neutral-dark">{aiResponse}</pre>
            </div>
            <p className="text-xs text-neutral-default">
              Lee el CV cuidadosamente. Puedes aprobarlo o, si deseas realizar más ajustes, haz clic en "Realizar Cambios" para editarlo y volver a enviarlo.
            </p>
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <Button 
                variant="outline" 
                onClick={handleRetry}
                leftIcon={<ArrowPathIcon className="h-5 w-5" />}
              >
                Realizar Cambios / Volver
              </Button>
              <Button 
                variant="primary" 
                onClick={handleApprove}
                leftIcon={<CheckCircleIcon className="h-5 w-5" />}
              >
                Aprobar y Simular Descarga
              </Button>
            </div>
          </div>
        );
      case 'completed':
        return (
          <div className="text-center py-10 space-y-4">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-semibold text-neutral-dark">¡CV Aprobado!</h3>
            <p className="text-neutral-default">
              Tu CV optimizado se agregará a tu panel. En una aplicación real, también podría descargarse.
            </p>
            <Button variant="primary" onClick={onClose}>Cerrar</Button>
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asistente IA para Optimizar tu Hoja de Vida" size="2xl">
      <div className="p-1">
        {error && <p className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</p>}
        {renderStepContent()}
      </div>
    </Modal>
  );
};