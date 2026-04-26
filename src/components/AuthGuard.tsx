import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ArrowRight } from 'lucide-react';

const CORRECT_PASSWORD = '@user91';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Verificar si ya inició sesión anteriormente
    const auth = localStorage.getItem('paninicards_auth_token');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      localStorage.setItem('paninicards_auth_token', 'true');
      setIsAuthenticated(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPassword('');
    }
  };

  if (isAuthenticated === null) return null; // Loading state

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,rgba(8,145,178,0.15)_0%,rgba(0,0,0,1)_80%)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Decorative background grid */}
        <div className="w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      <div className="relative w-full max-w-md z-10">
        <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(8,145,178,0.1)]">
          <div className="flex justify-center mb-8">
            <div className={`p-4 rounded-full transition-all duration-500 ${error ? 'bg-red-500/10 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-cyan-500/10 text-cyan-400 shadow-[0_0_30px_rgba(8,145,178,0.2)]'}`}>
              {error ? <Unlock size={32} /> : <Lock size={32} />}
            </div>
          </div>
          
          <h1 className="text-xl font-black text-center text-white mb-8 uppercase tracking-widest font-['Montserrat']">
            Solo ingrese su clave
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la clave de acceso"
                className={`w-full bg-black/50 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-neutral-800 focus:border-cyan-500'} rounded-xl px-4 py-4 text-white placeholder:text-neutral-600 outline-none transition-colors text-center tracking-widest font-mono`}
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group tracking-widest uppercase text-xs"
            >
              Entrar
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {error && (
            <p className="text-red-400 text-xs text-center mt-4 tracking-wider animate-pulse">
              Contraseña incorrecta
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthGuard;
