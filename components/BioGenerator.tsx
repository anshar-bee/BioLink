import React, { useState } from 'react';
import NeoButton from './NeoButton';
import { generateBrutalistBio } from '../services/geminiService';
import { Wand2, X, Loader2 } from 'lucide-react';

interface BioGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onBioGenerated: (bio: string) => void;
}

const BioGenerator: React.FC<BioGeneratorProps> = ({ isOpen, onClose, onBioGenerated }) => {
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    setIsLoading(true);
    const bio = await generateBrutalistBio(keywords);
    onBioGenerated(bio);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,144,232,1)] md:shadow-[12px_12px_0px_0px_rgba(255,144,232,1)] p-6 max-w-md w-full relative animate-in fade-in zoom-in duration-300">
        
        {/* Close Button: Inside on mobile, Outside on desktop */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 md:-top-6 md:-right-6 bg-[#ff6b6b] border-2 md:border-4 border-black p-1 md:p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all z-10"
        >
          <X size={20} strokeWidth={4} color="black" className="md:w-6 md:h-6" />
        </button>

        <h3 className="text-xl md:text-2xl font-black mb-4 flex items-center gap-2">
          <Wand2 size={24} className="md:w-8 md:h-8" /> AI BIO_GEN
        </h3>
        
        <p className="font-mono text-xs md:text-sm mb-4 border-b-4 border-black pb-4">
          ENTER KEYWORDS ABOUT YOU. GET A BRUTAL BIO.
        </p>

        <textarea
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g. Designer, Coffee lover, Tokyo, Skateboarding..."
          className="w-full h-24 md:h-32 p-4 font-mono border-4 border-black mb-6 bg-gray-50 focus:bg-[#ccff00] focus:outline-none transition-colors placeholder:text-gray-500 text-sm md:text-base"
        />

        <NeoButton 
          fullWidth 
          onClick={handleGenerate} 
          disabled={isLoading}
          colorClass="bg-[#23a6d5]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" /> GENERATING...
            </span>
          ) : (
            "GENERATE NOW"
          )}
        </NeoButton>
      </div>
    </div>
  );
};

export default BioGenerator;