
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingBottomNav from './components/FloatingBottomNav';
import HomeView from './views/HomeView';
import DetailView from './views/DetailView';
import AboutView from './views/AboutView';
import AdminLayout from './views/AdminView';
import { View, Product, ProductVariant } from './types';
import { productService } from './services/productService';
import { supabase } from './lib/supabaseClient';

const App: React.FC = () => {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setPathname(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange); // This handles browser back/forward for /admin path
    return () => {
      window.removeEventListener('popstate', onLocationChange);
    };
  }, []);

  if (pathname.startsWith('/admin')) {
    return <AdminLayout />;
  }

  // Storefront Logic
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  
  const handleBackNavigation = () => window.history.back();

  // Effect to handle browser history (back/forward buttons)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state || { view: 'home', productId: null };
      setCurrentView(state.view);
      setSelectedProductId(state.productId);
      setSelectedVariant(null);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Effect to set initial view based on URL hash
  useEffect(() => {
    const hash = window.location.hash;
    const parts = hash.split('/');
    if (parts[0] === '#detail' && parts[1]) {
      setCurrentView('detail');
      setSelectedProductId(parts[1]);
      history.replaceState({ view: 'detail', productId: parts[1] }, '', hash);
    } else if (hash === '#about') {
      setCurrentView('about');
      history.replaceState({ view: 'about' }, '', '#about');
    } else {
      setCurrentView('home');
      history.replaceState({ view: 'home' }, '', window.location.pathname);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setError(null);
    try {
      const fetchedProducts = await productService.getProducts();
      setProducts(fetchedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat produk.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        console.log('Perubahan terdeteksi di storefront!', payload);
        loadProducts();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadProducts]);

  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId) || null;
  }, [selectedProductId, products]);
  
  const navigateTo = (view: View, productId?: string) => {
    let hash = '';
    let state: any = { view };

    if (view === 'detail' && productId) {
      hash = `#detail/${productId}`;
      state.productId = productId;
    } else if (view === 'about') {
      hash = '#about';
    }

    if (window.location.hash !== hash || window.location.pathname !== '/') {
        history.pushState(state, '', hash || '/');
    }
    
    setCurrentView(view);
    setSelectedProductId(productId || null);
    setSelectedVariant(null);
    window.scrollTo(0, 0);
  };

  const handleProductClick = (id: string) => {
    if (products.find(p => p.id === id)) {
      navigateTo('detail', id);
    }
  };

  const navigateToHome = () => navigateTo('home');
  const navigateToAbout = () => navigateTo('about');

  const navigateToProductsSection = () => {
    navigateTo('home');
    setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const renderContent = () => {
    if (loading) return (
      <div className="flex-grow flex items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
      </div>
    );
    if (error) return <div className="flex-grow flex items-center justify-center min-h-[50vh]"><p className="text-red-500 font-bold bg-red-50 p-4 rounded-lg">{error}</p></div>;

    switch (currentView) {
      case 'home': return <HomeView products={products} onProductClick={handleProductClick} onGoProducts={navigateToProductsSection} />;
      case 'detail': return selectedProduct && <DetailView product={selectedProduct} selectedVariant={selectedVariant} onVariantChange={setSelectedVariant} onBack={handleBackNavigation} />;
      case 'about': return <AboutView onBack={handleBackNavigation} />;
      default: return <HomeView products={products} onProductClick={handleProductClick} onGoProducts={navigateToProductsSection} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onGoHome={navigateToHome} onGoProducts={navigateToProductsSection} onGoAbout={navigateToAbout} />
      <main key={currentView} className="flex-grow animate-view-enter pb-24 md:pb-0">
        {renderContent()}
      </main>
      <FloatingBottomNav 
        onHomeClick={navigateToHome} 
        onAboutClick={navigateToAbout}
        activeProduct={currentView === 'detail' ? selectedProduct : null}
        activeVariant={currentView === 'detail' ? selectedVariant : null}
      />
      <Footer 
        product={currentView === 'detail' ? selectedProduct : null}
        variant={currentView === 'detail' ? selectedVariant : null}
      />
    </div>
  );
};

export default App;
