
import React, { useState, useEffect } from 'react';
import DashboardView from './admin/DashboardView';
import ProductListView from './admin/ProductListView';
import CategoryListView from './admin/CategoryListView';
import OrderListView from './admin/OrderListView';
import SettingsView from './admin/SettingsView';

type AdminView = 'dashboard' | 'products' | 'categories' | 'orders' | 'settings';

const AdminLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['products', 'categories', 'settings', 'orders'].includes(hash)) {
      setCurrentView(hash as AdminView);
    } else {
      setCurrentView('dashboard');
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      setCurrentView((newHash as AdminView) || 'dashboard');
      setIsSidebarOpen(false);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: AdminView) => {
    window.location.hash = view;
  };

  const NavLink: React.FC<{ view: AdminView; label: string; icon: React.ReactElement }> = ({ view, label, icon }) => (
    <a
      href={`/admin#${view}`}
      onClick={(e) => { e.preventDefault(); navigateTo(view); }}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-bold ${
        currentView === view ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
  
  const viewTitles: Record<AdminView, string> = {
    dashboard: 'Dashboard',
    products: 'Manajemen Produk',
    categories: 'Manajemen Kategori',
    orders: 'Manajemen Pesanan',
    settings: 'Pengaturan Toko',
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 mb-10 px-3">
        <span className="text-xl font-black text-slate-900 tracking-tighter">YMG</span>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l border-slate-200 ml-2 pl-2">Admin</span>
      </div>
      <nav className="flex flex-col gap-2">
        <NavLink view="dashboard" label="Dashboard" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
        <NavLink view="orders" label="Pesanan" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>} />
        <NavLink view="products" label="Produk" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} />
        <NavLink view="categories" label="Kategori" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 8v5a2 2 0 002 2h.01" /></svg>} />
        <NavLink view="settings" label="Pengaturan" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
      </nav>
      <div className="mt-auto px-3">
        <a href="/" className="text-xs font-bold text-slate-400 hover:text-slate-900 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h5a3 3 0 013 3v1" /></svg>
          Kembali ke Toko
        </a>
      </div>
    </>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'products':
        return <ProductListView />;
      case 'categories':
        return <CategoryListView />;
      case 'orders':
        return <OrderListView />;
      case 'settings':
        return <SettingsView />;
      case 'dashboard':
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className={`fixed inset-0 z-50 transform md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="relative z-10 w-64 bg-white h-full p-4 flex flex-col shadow-xl">
          <SidebarContent />
        </div>
        <div onClick={() => setIsSidebarOpen(false)} className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <aside className="w-64 bg-white border-r border-slate-200 p-4 flex-col hidden md:flex">
        <SidebarContent />
      </aside>
      
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="md:hidden flex items-center mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 mr-2 rounded-md hover:bg-slate-100">
            <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          <span className="font-black text-slate-900 text-lg">{viewTitles[currentView]}</span>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminLayout;
