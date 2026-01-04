import React, { useState } from 'react';
import NeoButton from './NeoButton';
import { Lock, X, AlertTriangle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // Get password from Env Var, fallback to 'admin123' if not set
  const ADMIN_PASSWORD = (import.meta as any).env.VITE_ADMIN_PASSWORD || 'admin123';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) { 
      onSuccess();
      setPassword('');
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,107,107,1)] md:shadow-[12px_12px_0px_0px_rgba(255,107,107,1)] p-6 max-w-sm w-full relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button: Inside on mobile, Outside on desktop */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 md:-top-6 md:-right-6 bg-white border-2 md:border-4 border-black p-1 md:p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all z-10"
        >
          <X size={20} strokeWidth={4} color="black" className="md:w-6 md:h-6" />
        </button>

        <h3 className="text-xl md:text-2xl font-black mb-6 flex items-center gap-2 uppercase">
          <Lock size={24} strokeWidth={3} className="md:w-7 md:h-7" /> Admin Access
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold font-mono text-xs mb-2">ENTER PASSWORD</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`w-full border-4 ${error ? 'border-[#ff6b6b] bg-red-50' : 'border-black'} p-3 font-mono text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
              autoFocus
              placeholder="••••••"
            />
            {error && (
              <p className="text-[#ff6b6b] font-bold text-xs mt-2 flex items-center gap-1">
                <AlertTriangle size={12} /> WRONG PASSWORD
              </p>
            )}
          </div>

          <NeoButton fullWidth type="submit">
            UNLOCK
          </NeoButton>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;