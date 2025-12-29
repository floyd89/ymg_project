
import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { bannerService } from '../../services/bannerService';
import { AppSettings, Banner } from '../../types';
import { fileToBase64 } from '../../utils/imageConverter';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({ whatsAppNumber: '' });
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeTab, setActiveTab] = useState<'general' | 'banners'>('general');

  useEffect(() => {
    setSettings(settingsService.getSettings());
    setBanners(bannerService.getBanners());
  }, []);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = () => {
    settingsService.saveSettings(settings);
    alert('Pengaturan umum berhasil disimpan!');
  };

  const handleBannerChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newBanners = [...banners];
    newBanners[index] = { ...newBanners[index], [name]: value };
    setBanners(newBanners);
  };
  
  const handleBannerImageChange = async (index: number, file: File | null) => {
      if (!file) return;
      try {
        const base64Image = await fileToBase64(file);
        const newBanners = [...banners];
        newBanners[index].imgUrl = base64Image;
        setBanners(newBanners);
      } catch (error) {
          console.error("Gagal mengubah gambar:", error);
          alert("Gagal memproses gambar. Coba lagi.");
      }
  };

  const handleSaveBanners = () => {
    bannerService.saveBanners(banners);
    alert('Pengaturan banner berhasil disimpan!');
  };

  return (
    <div className="animate-view-enter">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900">Pengaturan Toko</h1>
        <p className="text-slate-500 mt-1">Atur informasi umum dan tampilan toko Anda.</p>
      </div>

      <div className="border-b border-slate-200 mb-6">
        <nav className="-mb-px flex gap-6">
          <button onClick={() => setActiveTab('general')} className={`py-3 px-1 border-b-2 font-bold text-sm ${activeTab === 'general' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300'}`}>Umum</button>
          <button onClick={() => setActiveTab('banners')} className={`py-3 px-1 border-b-2 font-bold text-sm ${activeTab === 'banners' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300'}`}>Banner</button>
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200">
          <div className="max-w-md space-y-4">
            <div>
              <label htmlFor="whatsAppNumber" className="text-sm font-bold text-slate-700">Nomor WhatsApp</label>
              <p className="text-xs text-slate-400 mb-2">Nomor yang akan dihubungi pelanggan. Gunakan format negara (e.g., 62812...)</p>
              <input type="text" id="whatsAppNumber" name="whatsAppNumber" value={settings.whatsAppNumber} onChange={handleSettingsChange} className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
            </div>
          </div>
          <div className="mt-6">
            <button onClick={handleSaveSettings} className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-700">Simpan Pengaturan</button>
          </div>
        </div>
      )}

      {/* Banner Settings */}
      {activeTab === 'banners' && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200">
           <div className="space-y-6">
             {banners.map((banner, index) => (
                <div key={banner.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-slate-200 rounded-xl">
                    <div className="flex flex-col items-start">
                         <img src={banner.imgUrl} alt="Banner preview" className="w-full aspect-video object-cover rounded-lg mb-2 bg-slate-100" />
                         <input type="file" accept="image/*" className="text-xs" onChange={(e) => handleBannerImageChange(index, e.target.files?.[0] ?? null)} />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                         <input type="text" name="title" value={banner.title} placeholder="Judul Banner" onChange={(e) => handleBannerChange(index, e)} className="w-full p-2 bg-slate-50 rounded-md border border-slate-200 font-bold" />
                         <input type="text" name="subtitle" value={banner.subtitle} placeholder="Subjudul Banner" onChange={(e) => handleBannerChange(index, e)} className="w-full p-2 bg-slate-50 rounded-md border border-slate-200" />
                    </div>
                </div>
             ))}
           </div>
           <div className="mt-6">
            <button onClick={handleSaveBanners} className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-700">Simpan Banner</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsView;
