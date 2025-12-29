
import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import { bannerService } from '../../services/bannerService';
import { AppSettings, Banner } from '../../types';
import { uploadImage } from '../../utils/imageConverter';
import AdminNotice from '../../components/admin/AdminNotice';
import SetupNotice from '../../components/admin/SetupNotice';
import SettingsSchemaNotice from '../../components/admin/SettingsSchemaNotice';

const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({ whatsAppNumber: '' });
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeTab, setActiveTab] = useState<'general' | 'banners' | 'profile'>('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState<Record<string, boolean>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fetchedSettings, fetchedBanners] = await Promise.all([
          settingsService.getSettings(),
          bannerService.getBanners()
        ]);
        setSettings(fetchedSettings);
        setBanners(fetchedBanners);
      } catch (error) {
        alert("Gagal memuat pengaturan dari server.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLogoUpload = async (file: File | null) => {
    if (!file) return;
    setIsUploading(prev => ({ ...prev, logo: true }));
    try {
      const imageUrl = await uploadImage(file);
      setSettings(prev => ({ ...prev, storeLogoUrl: imageUrl }));
      setUploadError(null);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Bucket not found')) {
        setUploadError('BUCKET_NOT_FOUND');
      } else {
        alert("Gagal mengunggah logo.");
        console.error(error);
      }
    } finally {
      setIsUploading(prev => ({ ...prev, logo: false }));
    }
  };

  const handleSaveSettings = async () => {
    setSaveError(null);
    try {
      await settingsService.saveSettings(settings);
      alert('Pengaturan berhasil disimpan!');
    } catch (err) {
      if (err instanceof Error && err.message.includes("column of 'settings' in the schema cache")) {
        setSaveError('SCHEMA_MISMATCH_SETTINGS');
      } else {
        alert(err instanceof Error ? err.message : 'Gagal menyimpan pengaturan.');
      }
    }
  };

  const handleBannerChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newBanners = [...banners];
    newBanners[index] = { ...newBanners[index], [name]: value };
    setBanners(newBanners);
  };
  
  const handleBannerImageChange = async (index: number, file: File | null) => {
      if (!file) return;
      const uploadKey = `banner-${index}`;
      setIsUploading(prev => ({...prev, [uploadKey]: true}));
      try {
        const imageUrl = await uploadImage(file);
        const newBanners = [...banners];
        newBanners[index].imgUrl = imageUrl;
        setBanners(newBanners);
        setUploadError(null);
      } catch (error) {
          if (error instanceof Error && error.message.includes('Bucket not found')) {
              setUploadError('BUCKET_NOT_FOUND');
          } else {
              console.error("Gagal mengunggah gambar:", error);
              alert("Gagal memproses gambar. Pastikan bucket storage Anda 'store-images' sudah publik.");
          }
      } finally {
        setIsUploading(prev => ({...prev, [uploadKey]: false}));
      }
  };

  const handleSaveBanners = async () => {
    try {
      await bannerService.saveBanners(banners);
      alert('Pengaturan banner berhasil disimpan!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menyimpan banner.');
    }
  };

  return (
    <div className="animate-view-enter">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900">Pengaturan Toko</h1>
        <p className="text-slate-500 mt-1">Atur informasi umum dan tampilan toko Anda.</p>
      </div>
      
      <AdminNotice />
      
      {uploadError === 'BUCKET_NOT_FOUND' && <SetupNotice onDismiss={() => setUploadError(null)} />}
      {saveError === 'SCHEMA_MISMATCH_SETTINGS' && <SettingsSchemaNotice onDismiss={() => setSaveError(null)} />}


      <div className="border-b border-slate-200 mb-6 mt-6">
        <nav className="-mb-px flex gap-6 overflow-x-auto no-scrollbar">
          <button onClick={() => setActiveTab('general')} className={`shrink-0 py-3 px-1 border-b-2 font-bold text-sm ${activeTab === 'general' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300'}`}>Umum</button>
          <button onClick={() => setActiveTab('profile')} className={`shrink-0 py-3 px-1 border-b-2 font-bold text-sm ${activeTab === 'profile' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300'}`}>Profil</button>
          <button onClick={() => setActiveTab('banners')} className={`shrink-0 py-3 px-1 border-b-2 font-bold text-sm ${activeTab === 'banners' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300'}`}>Banner</button>
        </nav>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center p-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        </div>
      )}

      {!isLoading && activeTab === 'general' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200">
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

      {!isLoading && activeTab === 'profile' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200">
          <div className="max-w-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <img src={settings.storeLogoUrl || 'https://via.placeholder.com/100'} alt="Logo Toko" className="w-24 h-24 object-cover rounded-full bg-slate-100" />
                <div>
                  <label htmlFor="logo-upload" className="text-sm font-bold text-slate-700">Logo Toko</label>
                  <p className="text-xs text-slate-400 mb-2">Rekomendasi ukuran: 512x512 piksel.</p>
                  <input type="file" accept="image/*" id="logo-upload" className="hidden" onChange={(e) => handleLogoUpload(e.target.files?.[0] ?? null)} />
                  <label htmlFor="logo-upload" className="px-4 py-2 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-200 cursor-pointer">{isUploading['logo'] ? 'Mengunggah...' : 'Pilih Gambar'}</label>
                </div>
            </div>
            <div>
              <label htmlFor="storeName" className="text-sm font-bold text-slate-700">Nama Toko</label>
              <input type="text" id="storeName" name="storeName" value={settings.storeName || ''} onChange={handleSettingsChange} className="w-full p-3 mt-2 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
            </div>
             <div>
              <label htmlFor="storeTagline" className="text-sm font-bold text-slate-700">Tagline/Slogan Toko</label>
              <input type="text" id="storeTagline" name="storeTagline" value={settings.storeTagline || ''} onChange={handleSettingsChange} className="w-full p-3 mt-2 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
            </div>
            <div>
              <label htmlFor="instagramUrl" className="text-sm font-bold text-slate-700">URL Instagram</label>
              <input type="text" id="instagramUrl" name="instagramUrl" value={settings.instagramUrl || ''} onChange={handleSettingsChange} placeholder="https://instagram.com/username" className="w-full p-3 mt-2 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
              <p className="text-xs text-slate-400 mt-1">Contoh: https://instagram.com/ymgstore</p>
            </div>
            <div>
              <label htmlFor="tiktokUrl" className="text-sm font-bold text-slate-700">URL TikTok</label>
              <input type="text" id="tiktokUrl" name="tiktokUrl" value={settings.tiktokUrl || ''} onChange={handleSettingsChange} placeholder="https://tiktok.com/@username" className="w-full p-3 mt-2 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
              <p className="text-xs text-slate-400 mt-1">Contoh: https://tiktok.com/@ymgstore</p>
            </div>
            <div>
              <label htmlFor="facebookUrl" className="text-sm font-bold text-slate-700">URL Facebook</label>
              <input type="text" id="facebookUrl" name="facebookUrl" value={settings.facebookUrl || ''} onChange={handleSettingsChange} placeholder="https://facebook.com/username" className="w-full p-3 mt-2 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
              <p className="text-xs text-slate-400 mt-1">Contoh: https://facebook.com/ymgstore</p>
            </div>
             <div>
              <label htmlFor="telegramUrl" className="text-sm font-bold text-slate-700">URL Telegram</label>
              <input type="text" id="telegramUrl" name="telegramUrl" value={settings.telegramUrl || ''} onChange={handleSettingsChange} placeholder="https://t.me/username" className="w-full p-3 mt-2 bg-slate-50 rounded-lg border border-slate-200 font-bold focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none" />
              <p className="text-xs text-slate-400 mt-1">Contoh: https://t.me/ymgstore</p>
            </div>
          </div>
          <div className="mt-8">
            <button onClick={handleSaveSettings} className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-700">Simpan Profil</button>
          </div>
        </div>
      )}

      {!isLoading && activeTab === 'banners' && (
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200">
           <div className="space-y-6">
             {banners.map((banner, index) => (
                <div key={banner.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-slate-200 rounded-xl">
                    <div className="flex flex-col items-start">
                         <img src={banner.imgUrl} alt="Banner preview" className="w-full aspect-video object-cover rounded-lg mb-2 bg-slate-100" />
                         <input type="file" accept="image/*" id={`banner-upload-${index}`} className="hidden" onChange={(e) => handleBannerImageChange(index, e.target.files?.[0] ?? null)} />
                         <label htmlFor={`banner-upload-${index}`} className="text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer">{isUploading[`banner-${index}`] ? 'Mengunggah...' : 'Ubah Gambar'}</label>
                         <p className="text-xs text-slate-400 mt-1">Rekomendasi ukuran: 1200x600 piksel.</p>
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
