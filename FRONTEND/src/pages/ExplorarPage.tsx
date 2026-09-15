// src/pages/ExplorarPage.tsx
import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import '../ExplorarPage.css';

const ExplorarPage = ({ products, addToCart, isMaintenance, loading }: any) => {
  const location = useLocation();

  const categoryFromUrl = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('categoria') || 'TODOS').toUpperCase();
  }, [location.search]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const activeCategory = selectedCategory !== null ? selectedCategory : categoryFromUrl;
  const baseProducts = products ? [...products].reverse() : [];
  
  const filtered = baseProducts.filter((p: any) => {
    if (activeCategory === 'TODOS') return true;
    if (activeCategory === 'OFERTAS') return p.on_sale === true;
    
    const productCat = p.category 
      ? p.category.toUpperCase() 
      : (p.categoria ? p.categoria.toUpperCase() : '');
      
    return productCat === activeCategory;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayProducts = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  return (
    // Se ajustó dinámicamente el paddingTop para mobile y desktop
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#121212', paddingTop: '95px', boxSizing: 'border-box' }}>
      
      {/* BARRA DE FILTROS (Se oculta automáticamente en móviles mediante CSS) */}
      <div className="category-filter-bar">
        {[
          { id: 'TODOS', label: '📖 TODO EL MENÚ' },
          { id: 'OFERTAS', label: '🔥 SUGERENCIAS' },
          { id: 'AL_FUEGO', label: '🔥 AL FUEGO' },
          { id: 'BURGUERS', label: '🍔 BURGUERS' },
          { id: 'PIZZAS', label: '🍕 PIZZAS' },
          { id: 'EMPANADAS', label: '🥟 EMPANADAS' },
          { id: 'POSTRES', label: '🍰 POSTRES' },
          { id: 'BEBIDAS', label: '🍷 BEBIDAS' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`category-filter ${activeCategory === cat.id ? 'active' : ''}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* CONTENEDOR ROJO PRINCIPAL CENTRADO */}
      <div style={{ 
        maxWidth: '1100px', 
        margin: '20px auto', 
        backgroundColor: '#8B0000', 
        border: '2px solid #5C0000', 
        borderRadius: '12px', 
        padding: '30px 20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        boxSizing: 'border-box'
      }}>
        
        {/* ENCABEZADO DE CARTA */}
        <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '2px dashed rgba(255,204,128,0.4)', paddingBottom: '15px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#FFCC80', fontSize: '2.2rem', margin: '0 0 5px 0', letterSpacing: '1px' }}>
            LA CARTA DE LA CASA
          </h2>
          <p style={{ fontFamily: 'Playfair Display, serif', color: '#F4F1ED', fontStyle: 'italic', fontSize: '1rem', margin: 0 }}>
            Especialidades artesanales preparadas al fuego y al calor de las brasas
          </p>
        </div>

        {/* GRILLA DE PRODUCTOS */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#FFCC80' }}>
              <p style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '1.4rem' }}>AVIVANDO LAS BRASAS DE LA COCINA...</p>
            </div>
          ) : displayProducts.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '25px',
              justifyContent: 'center'
            }}>
              {displayProducts.map((p: any) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'center' }}>
                  <ProductCard 
                    product={p} 
                    addToCart={addToCart} 
                    isMaintenance={isMaintenance} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#FFCC80', padding: '60px 0' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif' }}>PRONTO MÁS DELICIAS EN ESTA SECCIÓN...</h3>
            </div>
          )}
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 1 && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '20px', 
            marginTop: '45px', 
            paddingTop: '20px', 
            borderTop: '1px dashed rgba(255,204,128,0.3)' 
          }}>
            <button 
              disabled={page === 1} 
              onClick={() => { setPage(page - 1); window.scrollTo(0,0); }}
              style={{ 
                backgroundColor: page === 1 ? 'transparent' : '#1A1A1A', 
                color: page === 1 ? '#555' : '#FFCC80',
                border: '1px solid #FFCC80', 
                padding: '8px 16px', 
                borderRadius: '4px', 
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                fontFamily: 'Playfair Display, serif',
                fontSize: '0.85rem'
              }}
            >
              ◀ HOJA ANTERIOR
            </button>
            <span style={{ color: '#FFCC80', fontFamily: 'Playfair Display, serif', fontWeight: 'bold', fontSize: '0.9rem' }}>
              HOJA {page} DE {totalPages}
            </span>
            <button 
              disabled={page >= totalPages} 
              onClick={() => { setPage(page + 1); window.scrollTo(0,0); }}
              style={{ 
                backgroundColor: page >= totalPages ? 'transparent' : '#1A1A1A', 
                color: page >= totalPages ? '#555' : '#FFCC80',
                border: '1px solid #FFCC80', 
                padding: '8px 16px', 
                borderRadius: '4px', 
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                fontFamily: 'Playfair Display, serif',
                fontSize: '0.85rem'
              }}
            >
              SIGUIENTE HOJA ▶
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExplorarPage;