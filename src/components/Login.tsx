import React, { useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (password: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      onLogin(password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900 selection:bg-black selection:text-white">
      {/* Top Bar - Branding */}
      <div className="p-8 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-black" />
          <span className="text-2xl font-bold tracking-tight">PassVault.</span>
        </div>
        <div className="hidden md:block text-xs text-gray-400 font-semibold tracking-widest uppercase">
          Local Encryption &bull; AES-256
        </div>
      </div>

      {/* Main Content - Centered Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Unlock Vault
            </h1>
            <p className="text-gray-500 text-lg">
              Enter your master password to decrypt your data.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label htmlFor="master-password" className="block text-sm font-semibold uppercase tracking-wider text-gray-400 text-center">
                Master Password
              </label>
              <input
                id="master-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-gray-200 py-4 px-0 text-3xl text-center focus:outline-none focus:border-black transition-colors placeholder-gray-200 bg-transparent"
                placeholder="••••••••"
                required
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              className="w-full group flex items-center justify-center gap-3 bg-black text-white px-8 py-5 rounded-full hover:bg-gray-800 transition-all duration-200 shadow-sm hover:shadow-md mt-8"
            >
              <span className="font-semibold tracking-wide text-lg">Access Vault</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
