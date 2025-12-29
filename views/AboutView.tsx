
import React, { useState, useEffect, useMemo } from 'react';
import { settingsService } from '../services/settingsService';
import { AppSettings } from '../types';

interface AboutViewProps {
  onBack: () => void;
}

const AboutView: React.FC<AboutViewProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const fetchedSettings = await settingsService.getSettings();
      setSettings(fetchedSettings);
    };
    fetchSettings();
  }, []);

  const socialLinks = useMemo(() => {
    if (!settings) return [];
    return [
      {
        name: 'Instagram',
        url: settings.instagramUrl,
        color: 'hover:text-pink-600',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth={2} />
            <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" strokeWidth={2} />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth={2} />
          </svg>
        )
      },
      {
        name: 'TikTok',
        url: settings.tiktokUrl,
        color: 'hover:text-black',
        icon: (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.28-2.26.54-4.5 2.15-6.13 1.51-1.6 3.76-2.48 5.96-2.31.02 1.43-.02 2.85-.02 4.27-1.23-.1-2.48.3-3.41 1.12-.85.73-1.31 1.83-1.24 2.94.02 1.12.56 2.18 1.42 2.87.82.68 1.9 1.05 2.97 1.03 1.12.01 2.19-.41 2.96-1.21.72-.73 1.03-1.74 1.03-2.73V0z" />
          </svg>
        )
      },
      {
        name: 'WhatsApp',
        url: `https://wa.me/${settings.whatsAppNumber}`,
        color: 'hover:text-slate-900',
        icon: (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        )
      },
    ].filter(link => link.url && !link.url.endsWith('/'));
  }, [settings]);

  if (!settings) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="font-bold text-slate-500">Memuat profil...</p>
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 flex flex-col items-center">
      <button 
        onClick={onBack}
        className="group mb-12 self-start inline-flex items-center gap-3 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-[0.25em]"
      >
        <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center bg-white group-hover:border-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </div>
        <span>Kembali</span>
      </button>

      <div className="w-full flex flex-col items-center justify-center space-y-8 animate-view-enter">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-400 to-slate-900 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-white p-2 rounded-[2rem]">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-[1.5rem] overflow-hidden bg-slate-100">
              <img 
                src={settings.storeLogoUrl || "https://via.placeholder.com/600"} 
                alt={settings.storeName || "Store Logo"}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">
            {settings.storeName}
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-[0.3em]">
            {settings.storeTagline}
          </p>
        </div>

        <div className="flex flex-col w-full max-w-sm gap-3 mt-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl group transition-all duration-300 hover:shadow-lg hover:shadow-slate-100 hover:-translate-y-1 ${link.color}`}
            >
              <div className="flex items-center gap-4">
                <span className="text-slate-400 group-hover:text-inherit transition-colors">
                  {link.icon}
                </span>
                <span className="font-black text-slate-900 group-hover:text-inherit transition-colors uppercase text-xs tracking-widest">
                  {link.name}
                </span>
              </div>
              <svg className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          ))}
        </div>

        <p className="max-w-xs text-center text-slate-400 text-[10px] md:text-xs font-medium leading-relaxed mt-8">
          Menghadirkan koleksi tas berkualitas yang memadukan fungsi dan gaya untuk setiap momen Anda.
        </p>
      </div>
    </div>
  );
};

export default AboutView;
