
import React, { useState } from 'react';
import { User } from '../types';
import { UserIcon, EnvelopeIcon, LockIcon, InstagramIcon, CameraIcon, UserCircleIcon } from './icons/Icons';

interface AuthScreenProps {
  onLogin: (user: User) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isRegistering && !name)) return;

    // Simulation of backend user creation
    const newUser: User = {
      name: isRegistering ? name : 'Visitante',
      email: email,
      photo: isRegistering ? photo : undefined,
    };

    onLogin(newUser);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden animate-in fade-in duration-500">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-20 -left-20 w-80 h-80 bg-brand-pink/20 rounded-full blur-3xl"></div>
         <div className="absolute top-1/2 -right-20 w-80 h-80 bg-brand-lavender/20 rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-brand-pink/10 rounded-full blur-3xl transform -translate-x-1/2"></div>
      </div>

      <div className="w-full max-w-sm z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-brand-lavender-dark tracking-tight mb-2">Jejum Magras Magras</h1>
          <p className="text-gray-500">Transforme sua vida através do jejum.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-soft-lavender p-8 border border-gray-50">
           <div className="flex justify-center mb-8">
              <div className="bg-gray-50 p-1 rounded-full flex">
                 <button 
                   onClick={() => setIsRegistering(false)}
                   className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isRegistering ? 'bg-white shadow-sm text-brand-lavender-dark' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   Entrar
                 </button>
                 <button 
                   onClick={() => setIsRegistering(true)}
                   className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${isRegistering ? 'bg-white shadow-sm text-brand-lavender-dark' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                   Cadastrar
                 </button>
              </div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
              {isRegistering && (
                <div className="space-y-4">
                   {/* Photo Upload */}
                   <div className="flex justify-center mb-6">
                      <div className="relative group">
                        <label className="block w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm cursor-pointer relative bg-gray-50">
                           {photo ? (
                             <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <UserCircleIcon className="w-16 h-16" />
                             </div>
                           )}
                           <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <CameraIcon className="w-8 h-8 text-white" />
                           </div>
                           <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                        {!photo && (
                          <div className="absolute -bottom-1 -right-1 bg-brand-pink text-white p-1.5 rounded-full shadow-md pointer-events-none">
                              <CameraIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                   </div>

                   <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <UserIcon className="h-5 w-5 text-brand-lavender" />
                      </div>
                      <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu Nome"
                        className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all text-brand-dark font-medium"
                        required={isRegistering}
                      />
                   </div>
                </div>
              )}

              <div className="space-y-1">
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                       <EnvelopeIcon className="h-5 w-5 text-brand-lavender" />
                    </div>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Seu E-mail"
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all text-brand-dark font-medium"
                      required
                    />
                 </div>
              </div>

              <div className="space-y-1">
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                       <LockIcon className="h-5 w-5 text-brand-lavender" />
                    </div>
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Senha"
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all text-brand-dark font-medium"
                      required
                    />
                 </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-brand-lavender to-brand-pink text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-pink/30 hover:shadow-xl transition-all active:scale-95 mt-4"
              >
                {isRegistering ? 'Começar Jornada' : 'Acessar'}
              </button>
           </form>
        </div>
        
        <div className="mt-8">
              <a 
                href="https://www.instagram.com/raquelrosa.emagrecimento/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-brand-lavender to-brand-pink text-white py-4 rounded-2xl shadow-lg shadow-brand-pink/30 hover:shadow-xl hover:scale-[1.02] transition-all active:scale-95"
              >
                 <InstagramIcon className="w-6 h-6" />
                 <span className="font-bold text-sm sm:text-base">Siga @raquelrosa.emagrecimento</span>
              </a>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
