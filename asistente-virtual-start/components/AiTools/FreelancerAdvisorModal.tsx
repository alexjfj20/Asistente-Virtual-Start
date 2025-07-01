import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { JobOpportunity } from '../../types';

interface FreelancerAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileEvaluated: (evaluationText: string) => void;
}

// Icons
const BriefcaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.098a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25V14.15M12 12.375a3.75 3.75 0 01-3.75-3.75V3h7.5v5.625a3.75 3.75 0 01-3.75 3.75z" />
    </svg>
);
const DocumentTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);
const MagnifyingGlassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);
const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.184m-1.5.184a6.01 6.01 0 01-1.5-.184m3.75 3.622a2.25 2.25 0 013.296 0 2.25 2.25 0 010 3.296A2.25 2.25 0 0112 21a2.25 2.25 0 01-2.25-2.25 2.25 2.25 0 010-3.296 2.25 2.25 0 013.296 0zM12 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

type AdvisorTab = 'evaluation' | 'proposal' | 'opportunities' | 'strategy';

export const FreelancerAdvisorModal: React.FC<FreelancerAdvisorModalProps> = ({ isOpen, onClose, onProfileEvaluated }) => {
    const [activeTab, setActiveTab] = useState<AdvisorTab>('evaluation');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Evaluation State
    const [profile, setProfile] = useState({ niche: '', portfolio: '', cv: '' });
    const [evaluationResult, setEvaluationResult] = useState('');
    const [evaluationSaved, setEvaluationSaved] = useState(false);

    // Proposal State
    const [jobDescription, setJobDescription] = useState('');
    const [generatedProposal, setGeneratedProposal] = useState('');

    // Opportunities State
    const [opportunities, setOpportunities] = useState<JobOpportunity[]>([]);
    const [favorites, setFavorites] = useState<JobOpportunity[]>([]);
    const [filters, setFilters] = useState({ budget: '', language: '' });

    useEffect(() => {
        if(isOpen) {
            setActiveTab('evaluation');
            setIsLoading(false);
            setError('');
            setProfile({ niche: '', portfolio: '', cv: '' });
            setEvaluationResult('');
            setEvaluationSaved(false);
            setJobDescription('');
            setGeneratedProposal('');
            setOpportunities([]);
            setFavorites([]);
            setFilters({ budget: '', language: '' });
        }
    }, [isOpen]);

    const handleGenerateEvaluation = async () => {
        setIsLoading(true);
        setError('');
        const prompt = `Actúa como un coach de marca personal para freelancers, especializado en Asistentes Virtuales. Analiza el siguiente perfil y proporciona una evaluación estratégica para ayudar al usuario a posicionarse como un experto en su nicho. La evaluación debe ser clara, accionable y organizada en estas secciones exactas (usa los títulos en negrita):

**Análisis de Nicho:**
Evalúa el nicho de especialización. ¿Es claro? ¿Es demandado? Sugiere formas de refinarlo o sub-nichos a explorar.

**Posicionamiento de Marca:**
Ofrece 3-4 estrategias concretas para que el usuario se posicione como un experto en su nicho. Incluye ideas para contenido, branding y comunicación.

**Optimización del Portafolio/CV:**
Da consejos específicos para mejorar el portafolio y CV del usuario para atraer clientes de alto valor en su nicho.

**Siguientes Pasos Accionables:**
Una lista de 3 a 5 pasos claros que el usuario puede tomar en los próximos 7 días para mejorar su perfil.

---
**DATOS DEL FREELANCER:**
*   **Nicho de Especialización:** ${profile.niche || 'Generalista'}
*   **Enlace a Portafolio/CV/LinkedIn:** ${profile.portfolio || 'No proporcionado'}
*   **Texto del CV (opcional):** ${profile.cv || 'No proporcionado'}
---`;
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response: GenerateContentResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash-preview-04-17', contents: prompt });
            setEvaluationResult(response.text);
        } catch (e: any) {
            setError('Error al generar la evaluación: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveEvaluation = () => {
        onProfileEvaluated(evaluationResult);
        setEvaluationSaved(true);
    };

    const handleGenerateProposal = async () => {
        if (!jobDescription.trim()) {
            setError('Por favor, pega la descripción del trabajo.');
            return;
        }
        setIsLoading(true);
        setError('');
        const prompt = `Actúa como un Asistente Virtual freelancer experto redactando propuestas de venta. Usando la información del perfil del freelancer y la descripción del trabajo, crea una propuesta personalizada, persuasiva y profesional. La propuesta debe:
1.  Tener un título atractivo.
2.  Un párrafo inicial que demuestre que has entendido las necesidades del cliente.
3.  Resaltar 2-3 habilidades o experiencias clave del freelancer que son DIRECTAMENTE relevantes para el trabajo.
4.  Explicar brevemente el proceso o enfoque que seguirías.
5.  Terminar con una llamada a la acción clara para discutir el proyecto.
No incluyas placeholders como "[Tu Nombre]". Usa un tono confiado y profesional.

**PERFIL DEL FREELANCER:**
*   **Nicho:** ${profile.niche || 'Asistente Virtual General'}
*   **CV/Experiencia Clave:** ${profile.cv || 'Experiencia en gestión administrativa, redes sociales y atención al cliente.'}

**DESCRIPCIÓN DEL TRABAJO:**
---
${jobDescription}
---`;
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response: GenerateContentResponse = await ai.models.generateContent({ model: 'gemini-2.5-flash-preview-04-17', contents: prompt });
            setGeneratedProposal(response.text);
        } catch (e: any) {
            setError('Error al generar la propuesta: ' + e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFindOpportunities = async () => {
        setIsLoading(true);
        setError('');
        const prompt = `Actúa como un agregador de empleos para freelancers. Basado en el perfil de este Asistente Virtual, genera una lista de 5 oportunidades de trabajo ficticias pero realistas que encajen perfectamente con sus habilidades y nicho. Devuelve la respuesta EXCLUSIVAMENTE como un array de objetos JSON. No incluyas markdown, texto introductorio, ni explicaciones.
El formato de cada objeto debe ser: {"title": "string", "client": "string", "budget": "string", "language": "Español" | "Inglés" | "Bilingüe", "description": "string", "tags": ["string", ...]}.

**PERFIL DEL FREELANCER:**
*   **Nicho:** ${profile.niche || 'Asistente Virtual con experiencia en redes sociales y e-commerce'}
*   **CV/Experiencia Clave:** ${profile.cv || 'Gestión de redes para pequeñas marcas, soporte de Shopify, email marketing.'}`;
        
        let response: GenerateContentResponse | null = null;
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            response = await ai.models.generateContent({ model: 'gemini-2.5-flash-preview-04-17', contents: prompt, config: { responseMimeType: "application/json" } });
            
            let jsonStr = response.text.trim();
            const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
            const match = jsonStr.match(fenceRegex);
            if (match && match[2]) {
              jsonStr = match[2].trim();
            }

            const parsedData: JobOpportunity[] = JSON.parse(jsonStr);
            setOpportunities(parsedData);
        } catch (e: any) {
            setError('Error al buscar oportunidades: ' + e.message);
            console.error("Failed to parse JSON response:", e, response?.text);
        } finally {
            setIsLoading(false);
        }
    };
    
    const filteredOpportunities = opportunities.filter(op => 
        (filters.budget ? parseFloat(op.budget.replace(/[^0-9.-]+/g,"")) >= parseFloat(filters.budget) : true) &&
        (filters.language ? op.language === filters.language : true)
    );

    const renderTabs = () => (
        <div className="border-b border-gray-200 mb-6 overflow-x-auto">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button onClick={() => setActiveTab('evaluation')} className={`shrink-0 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'evaluation' ? 'border-primary text-primary' : 'border-transparent text-neutral-default hover:text-neutral-dark hover:border-gray-300'}`}>Evaluación</button>
                <button onClick={() => setActiveTab('proposal')} className={`shrink-0 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'proposal' ? 'border-primary text-primary' : 'border-transparent text-neutral-default hover:text-neutral-dark hover:border-gray-300'}`}>Propuestas</button>
                <button onClick={() => setActiveTab('opportunities')} className={`shrink-0 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'opportunities' ? 'border-primary text-primary' : 'border-transparent text-neutral-default hover:text-neutral-dark hover:border-gray-300'}`}>Oportunidades IA</button>
                <button onClick={() => setActiveTab('strategy')} className={`shrink-0 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'strategy' ? 'border-primary text-primary' : 'border-transparent text-neutral-default hover:text-neutral-dark hover:border-gray-300'}`}>Estrategias</button>
            </nav>
        </div>
    );

    const renderContent = () => {
        switch(activeTab) {
            case 'evaluation':
                return (
                    <div className="space-y-4">
                        {!evaluationResult ? (
                            <>
                                <Input label="Tu Nicho de Especialización (ej. Asistente para Coaches, E-commerce, etc.)" value={profile.niche} onChange={e => setProfile({...profile, niche: e.target.value})} />
                                <Input label="Enlace a tu Portafolio, CV o LinkedIn" value={profile.portfolio} onChange={e => setProfile({...profile, portfolio: e.target.value})} />
                                <Textarea label="Pega tu experiencia clave o CV resumido (opcional)" value={profile.cv} onChange={e => setProfile({...profile, cv: e.target.value})} rows={5} />
                                <Button onClick={handleGenerateEvaluation} disabled={isLoading} className="w-full" size="lg">
                                    {isLoading ? 'Analizando Perfil...' : 'Evaluar mi Perfil Freelance'}
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-4">
                                 <h3 className="text-xl font-semibold text-primary">Análisis de Posicionamiento</h3>
                                 <div className="p-4 border rounded-lg bg-neutral-light/30 max-h-[40vh] overflow-y-auto">
                                    <pre className="whitespace-pre-wrap text-sm text-neutral-dark">{evaluationResult}</pre>
                                 </div>
                                 <div className="flex justify-end gap-3 pt-3 border-t">
                                    <Button variant="outline" onClick={() => setEvaluationResult('')}>Volver a Evaluar</Button>
                                    <Button variant="primary" onClick={handleSaveEvaluation} disabled={evaluationSaved} leftIcon={evaluationSaved ? <CheckCircleIcon className="h-5 w-5"/> : undefined}>
                                        {evaluationSaved ? 'Guardado' : 'Guardar Análisis'}
                                    </Button>
                                 </div>
                            </div>
                        )}
                    </div>
                );
            case 'proposal':
                return (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Textarea label="Pega la descripción del trabajo aquí" value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={12} />
                            <Button onClick={handleGenerateProposal} disabled={isLoading} className="w-full">
                                {isLoading ? 'Generando...' : 'Generar Propuesta con IA'}
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Propuesta Generada:</h3>
                            <Card className="p-4 bg-neutral-light/30 min-h-[200px] max-h-[50vh] overflow-y-auto">
                                {generatedProposal ? <pre className="whitespace-pre-wrap text-sm">{generatedProposal}</pre> : <p className="text-neutral-default text-sm">Tu propuesta personalizada aparecerá aquí.</p>}
                            </Card>
                        </div>
                    </div>
                );
            case 'opportunities':
                 return (
                    <div className="space-y-4">
                        <Button onClick={handleFindOpportunities} disabled={isLoading} leftIcon={<MagnifyingGlassIcon className="h-5 w-5"/>}>
                            {isLoading ? 'Buscando...' : 'Buscar Nuevas Oportunidades con IA'}
                        </Button>
                        <div className="flex gap-4">
                            <Input label="Presupuesto Mínimo ($)" type="number" value={filters.budget} onChange={e => setFilters({...filters, budget: e.target.value})} />
                            <div className="w-full">
                                <label className="block text-sm font-medium text-neutral-dark mb-1">Idioma</label>
                                <select value={filters.language} onChange={e => setFilters({...filters, language: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition-colors bg-white">
                                    <option value="">Todos</option>
                                    <option value="Español">Español</option>
                                    <option value="Inglés">Inglés</option>
                                    <option value="Bilingüe">Bilingüe</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2">
                        {filteredOpportunities.map((op, i) => (
                            <Card key={i} className="p-4">
                                <h4 className="font-bold text-primary">{op.title}</h4>
                                <p className="text-sm font-medium">{op.client} - {op.budget}</p>
                                <p className="text-sm text-neutral-default mt-2">{op.description}</p>
                                <div className="flex gap-2 mt-2">
                                    {op.tags.map(tag => <span key={tag} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{tag}</span>)}
                                </div>
                            </Card>
                        ))}
                        </div>
                    </div>
                );
            case 'strategy':
                return (
                     <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 text-sm text-neutral-default">
                        <h3 className="text-lg font-semibold text-primary">Plataformas Recomendadas para Freelancing Avanzado</h3>
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong>Upwork:</strong> La plataforma más grande. Clave: un perfil muy especializado y excelentes propuestas.</li>
                            <li><strong>Fiverr Pro:</strong> Si puedes entrar, te da acceso a clientes de mayor calibre.</li>
                            <li><strong>Toptal:</strong> Exclusiva para el top 3% del talento. Proceso de selección riguroso pero muy bien pagado.</li>
                            <li><strong>Workana:</strong> Fuerte en el mercado de habla hispana.</li>
                        </ul>
                        <h3 className="text-lg font-semibold text-primary">Estrategias de Tarifas</h3>
                        <p>No cobres por hora, cobra por proyecto o con un retainer mensual. Esto te desliga de vender tiempo y te permite vender resultados y valor. Investiga tarifas de tu nicho y nunca compitas por ser el más barato.</p>
                        <h3 className="text-lg font-semibold text-primary">Construcción de Marca Personal</h3>
                        <p>Define tu propuesta única de valor (PUV). ¿Qué te hace diferente? Publica contenido de valor en LinkedIn o un blog sobre tu nicho. Esto atrae clientes en lugar de tener que cazarlos.</p>
                    </div>
                );
        }
    }
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Asesor Freelance Pro" size="full">
            {renderTabs()}
            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md my-4 text-sm">{error}</p>}
            <div className="mt-4">
                {renderContent()}
            </div>
        </Modal>
    );
};