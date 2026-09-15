// src/components/ProductCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: any;
  addToCart: (product: any, size?: string) => void; 
  isMaintenance?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, isMaintenance }) => {
  const p = product;
  const [qty, setQty] = useState(1);

  const basePrice = Number(p.price) || Number(p.precio) || 0;
  const discount = Number(p.discount_percentage) || Number(p.porcentaje_descuento) || 0;
  const hasDiscount = p.on_sale && discount > 0;
  const finalPrice = hasDiscount ? basePrice - (basePrice * discount / 100) : basePrice;
  
  const stockReal = Number(p.stock);
  const sinStockReal = !isNaN(stockReal) && stockReal <= 0;
  const stockEscaso = !isNaN(stockReal) && stockReal > 0 && stockReal <= 3; // Alerta de pocas porciones

  const imagenURL = p.image && p.image.startsWith('http') 
    ? p.image 
    : (p.imagen && p.imagen.startsWith('http') ? p.imagen : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600");

  const handleAddMultiple = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(p, "Único");
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#FFF8E1', 
      borderRadius: '12px', 
      overflow: 'hidden', 
      boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '460px', 
      width: '100%',
      boxSizing: 'border-box',
      border: '1px solid #E6D5B8'
    }}>
      
      {/* BADGE DE DESCUENTO O PROMOCIÓN */}
      {hasDiscount && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: '#B71C1C',
          color: '#FFF8E1',
          padding: '4px 10px',
          borderRadius: '4px',
          fontWeight: '900',
          fontSize: '0.75rem',
          zIndex: 10,
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          border: '1px solid #FFCC80',
          letterSpacing: '1px',
          fontFamily: 'Playfair Display, serif'
        }}>
          PROMO {discount}% OFF
        </div>
      )}

      {/* CONTENIDO SUPERIOR */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* CONTENEDOR IMAGEN */}
        <Link to={`/producto/${p.id}`} style={{ display: 'block', height: '170px', width: '100%', overflow: 'hidden' }}>
          <img 
            src={imagenURL} 
            alt={p.name || p.nombre} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
          />
        </Link>
        
        {/* DETALLES Y TEXTOS */}
        <div style={{ textAlign: 'center', padding: '12px 14px 0 14px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
          
          <div>
            <span style={{ color: '#D84315', fontSize: '10px', letterSpacing: '1.5px', fontWeight: '800', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
              ✦ {p.category || p.categoria || 'Especialidad'} ✦
            </span>

            {/* TÍTULO */}
            <h3 style={{ 
              fontFamily: 'Playfair Display, serif', 
              fontSize: '1.15rem', 
              margin: '6px 0 4px 0', 
              color: '#3E2723',
              minHeight: '2.6rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '1.25',
              fontWeight: '700'
            }}>
              {p.name || p.nombre}
            </h3>

            {/* LEYENDA GASTRONÓMICA & ALERTA DE STOCK REAL */}
            <p style={{ fontSize: '11px', color: '#795548', fontStyle: 'italic', margin: '0 0 4px 0', fontFamily: 'Playfair Display, serif' }}>
              Cocinado a la leña de quebracho • 20 min
            </p>

            {stockEscaso && !sinStockReal && (
              <p style={{ fontSize: '10px', color: '#C62828', fontWeight: 'bold', margin: '0 0 6px 0', fontFamily: 'Inter, sans-serif' }}>
                🔥 ¡Quedan solo {stockReal} porciones!
              </p>
            )}
          </div>
          
          {/* BLOQUE DE PRECIO */}
          <div style={{ 
            margin: '4px 0', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'baseline', 
            gap: '8px', 
            height: '32px', 
            boxSizing: 'border-box'
          }}>
            {hasDiscount ? (
              <>
                <span style={{ textDecoration: 'line-through', color: '#8D6E63', fontSize: '0.85rem', fontWeight: '600' }}>
                  ${basePrice.toLocaleString()}
                </span>
                <span style={{ fontWeight: '900', color: '#B71C1C', fontSize: '1.3rem', fontFamily: 'Playfair Display, serif' }}>
                  ${finalPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span style={{ fontWeight: '900', color: '#B71C1C', fontSize: '1.3rem', fontFamily: 'Playfair Display, serif' }}>
                ${basePrice.toLocaleString()}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* SELECTOR DE CANTIDAD + BOTÓN SUMAR A LA MESA */}
      <div style={{ padding: '0 12px 12px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        
        {!sinStockReal && !isMaintenance && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={() => setQty(Math.max(1, qty - 1))}
              style={{ background: '#E6D5B8', border: 'none', borderRadius: '4px', width: '28px', height: '28px', fontWeight: 'bold', cursor: 'pointer', color: '#3E2723' }}
            >
              -
            </button>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold', color: '#3E2723', fontSize: '0.95rem', minWidth: '20px', textAlign: 'center' }}>
              {qty}
            </span>
            <button 
              onClick={() => setQty(qty + 1)}
              style={{ background: '#E6D5B8', border: 'none', borderRadius: '4px', width: '28px', height: '28px', fontWeight: 'bold', cursor: 'pointer', color: '#3E2723' }}
            >
              +
            </button>
          </div>
        )}

        <button 
          onClick={handleAddMultiple}
          disabled={sinStockReal || isMaintenance} 
          style={{
            background: sinStockReal || isMaintenance ? '#B0BEC5' : '#8B0000', 
            color: '#FFF8E1', 
            borderRadius: '6px', 
            width: '100%', 
            padding: '10px', 
            border: '1px solid #FFCC80', 
            fontWeight: 'bold', 
            fontSize: '0.85rem',
            cursor: sinStockReal || isMaintenance ? 'not-allowed' : 'pointer',
            fontFamily: 'Playfair Display, serif',
            letterSpacing: '0.5px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            transition: 'background 0.2s'
          }}
        >
          {isMaintenance ? '🛠️ EN PREPARACIÓN' : sinStockReal ? '🔴 AGOTADO EN COCINA' : `➕ SUMAR A LA MESA (${qty})`}
        </button>
      </div>

    </div>
  );
};
