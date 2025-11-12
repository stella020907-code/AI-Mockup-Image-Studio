import React, { useState, useCallback } from 'react';
import { MOCKUP_TEMPLATES } from './constants';
import { createMockup, generateImage } from './services/geminiService';
import { AspectRatio, ImageData, MockupTemplate } from './types';

import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Loader from './components/Loader';
import TabButton from './components/TabButton';

type ActiveTab = 'mockup' | 'generate';

const urlToBase64 = async (url: string): Promise<ImageData> => {
    // Use a CORS proxy for Pexels images
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image from ${url}. Status: ${response.status}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];
            resolve({ data: base64Data, mimeType: blob.type });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
    });
};

const MockupCreator: React.FC = () => {
    const [logo, setLogo] = useState<ImageData | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<MockupTemplate | null>(MOCKUP_TEMPLATES[0]);
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateMockup = useCallback(async () => {
        if (!logo || !selectedTemplate) {
            setError('Please upload a logo and select a product template.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const productBase64 = await urlToBase64(selectedTemplate.url);
            const result = await createMockup(logo, productBase64, prompt);
            setGeneratedImage(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [logo, selectedTemplate, prompt]);
    
    return (
        <div className="grid lg:grid-cols-12 gap-6 p-4 md:p-6">
            <div className="lg:col-span-4 space-y-6">
                 <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3 text-sky-400">1. Upload Logo</h2>
                    <FileUpload onFileSelect={setLogo} label="Click to upload logo"/>
                </div>
                 <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3 text-sky-400">2. Select Product</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {MOCKUP_TEMPLATES.map(template => (
                            <div key={template.id} onClick={() => setSelectedTemplate(template)} className={`cursor-pointer rounded-md overflow-hidden ring-2 ring-offset-2 ring-offset-slate-800 transition-all ${selectedTemplate?.id === template.id ? 'ring-sky-400' : 'ring-transparent hover:ring-slate-600'}`}>
                                <img src={template.url} alt={template.name} className="w-full h-24 object-cover"/>
                                <p className="text-center text-xs p-1 bg-slate-700">{template.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3 text-sky-400">3. Add Instructions (Optional)</h2>
                     <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'Change t-shirt to black', 'Add a vintage feel'"
                        className="w-full h-24 p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                    />
                </div>
                <button onClick={handleGenerateMockup} disabled={!logo || !selectedTemplate || isLoading} className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                    {isLoading ? <><Loader size="sm" /> Generating...</> : '✨ Generate Mockup'}
                </button>
            </div>
             <div className="lg:col-span-8 bg-slate-800/50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-3 text-fuchsia-400">Result</h2>
                <div className="w-full h-[60vh] bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
                    {isLoading && <div className="flex flex-col items-center gap-4"><Loader /><p className="text-slate-400">AI is creating your masterpiece...</p></div>}
                    {error && <p className="text-red-400 text-center max-w-md">{error}</p>}
                    {generatedImage && <img src={generatedImage} alt="Generated Mockup" className="max-h-full max-w-full object-contain"/>}
                    {!isLoading && !error && !generatedImage && <p className="text-slate-500">Your generated mockup will appear here</p>}
                </div>
            </div>
        </div>
    );
};

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleGenerate = async () => {
        if (!prompt) {
            setError("Please enter a prompt to generate an image.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const result = await generateImage(prompt, aspectRatio);
            setGeneratedImage(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-12 gap-6 p-4 md:p-6">
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                    <h2 className="text-lg font-semibold mb-3 text-sky-400">1. Describe Your Image</h2>
                     <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., 'A photorealistic image of a cat wearing sunglasses, studio lighting'"
                        className="w-full h-40 p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
                    />
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg">
                     <h2 className="text-lg font-semibold mb-3 text-sky-400">2. Select Aspect Ratio</h2>
                     <select 
                        value={aspectRatio}
                        onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none transition">
                         <option value="1:1">Square (1:1)</option>
                         <option value="16:9">Landscape (16:9)</option>
                         <option value="9:16">Portrait (9:16)</option>
                         <option value="4:3">Standard (4:3)</option>
                         <option value="3:4">Tall (3:4)</option>
                     </select>
                </div>
                 <button onClick={handleGenerate} disabled={!prompt || isLoading} className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                    {isLoading ? <><Loader size="sm" /> Generating...</> : '🎨 Generate Image'}
                </button>
            </div>
             <div className="lg:col-span-8 bg-slate-800/50 p-4 rounded-lg">
                 <h2 className="text-lg font-semibold mb-3 text-fuchsia-400">Result</h2>
                <div className="w-full h-[60vh] bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden">
                    {isLoading && <div className="flex flex-col items-center gap-4"><Loader /><p className="text-slate-400">Conjuring pixels from pure imagination...</p></div>}
                    {error && <p className="text-red-400 text-center max-w-md">{error}</p>}
                    {generatedImage && <img src={generatedImage} alt="Generated from prompt" className="max-h-full max-w-full object-contain"/>}
                    {!isLoading && !error && !generatedImage && <p className="text-slate-500">Your generated image will appear here</p>}
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mockup');

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="container mx-auto px-2">
        <div className="border-b border-slate-700 mt-4 flex">
            <TabButton 
                label="Mockup Creator" 
                isActive={activeTab === 'mockup'} 
                onClick={() => setActiveTab('mockup')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" /></svg>}
            />
            <TabButton 
                label="Image Generator" 
                isActive={activeTab === 'generate'} 
                onClick={() => setActiveTab('generate')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>}
            />
        </div>
        {activeTab === 'mockup' ? <MockupCreator /> : <ImageGenerator />}
      </main>
    </div>
  );
};

export default App;
