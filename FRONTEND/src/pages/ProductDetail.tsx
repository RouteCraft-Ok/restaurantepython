import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = ({ products, addToCart, isMaintenance }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const API_BASE_URL = isLocal ? "http://localhost:5000" : "";

  const product = Array.isArray(products) 
    ? products.find((p: any) => p.id === Number(id)) 
    : null;

  const [displayImage, setDisplayImage] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="product-detail-wrapper" style={{ alignItems: 'center' }}>
        <div style={{ textAlign: 'center', color: '#FFCC80' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2rem' }}>PRODUCTO NO ENCONTRADO</h2>
          <Link to="/" style={{ color: '#E57373', textDecoration: 'underline', marginTop: '15px', display: 'inline-block' }}>
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Helper para arreglar rutas relativas de las imágenes del backend
  const formatImageUrl = (url: string) => {
    if (!url) return 'https://via.placeholder.com/500?text=Sin+Imagen';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const mainImg = formatImageUrl(product.image);
  const currentImg = displayImage || mainImg;

  const basePrice = Number(product.price) || 0;
  const discount = Number(product.discount_percentage) || 0;
  const finalPrice = product.on_sale ? basePrice - (basePrice * (discount / 100)) : basePrice;

  // Normalización de la galería
  let galleryArray: string[] = [];
  if (product.gallery) {
    if (Array.isArray(product.gallery)) {
      galleryArray = product.gallery.map((img: string) => formatImageUrl(img));
    } else if (typeof product.gallery === 'string') {
      galleryArray = product.gallery
        .split(',')
        .filter((img: string) => img.trim() !== '')
        .map((img: string) => formatImageUrl(img.trim()));
    }
  }

  return (
    <div className="product-detail-wrapper">
      <div className="product-detail-card">
        
        {/* LADO IZQUIERDO: VISUALES */}
        <div className="visual-sector">
          <div className="main-image-box">
            <img src={currentImg} alt={product.name} />
          </div>
          
          {/* GALERÍA DE MINIATURAS */}
          <div className="gallery-carousel">
            <img 
              src={mainImg} 
              className={`gallery-thumb ${currentImg === mainImg ? 'active' : ''}`}
              onClick={() => setDisplayImage(mainImg)}
              alt="principal"
            />

            {galleryArray.map((imgUrl: string, index: number) => (
              <img 
                key={index}
                src={imgUrl} 
                className={`gallery-thumb ${currentImg === imgUrl ? 'active' : ''}`}
                onClick={() => setDisplayImage(imgUrl)}
                alt={`galeria-${index}`}
              />
            ))}
          </div>
        </div>

        {/* LADO DERECHO: INFORMACIÓN */}
        <div className="info-sector">
          <span className="product-category-tag">
            {product.category?.replace('_', ' ')}
          </span>

          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-price-box">
            <span className="current-price">
              ${finalPrice.toLocaleString()}
            </span>
            {product.on_sale && (
              <span className="original-price">
                ${basePrice.toLocaleString()}
              </span>
            )}
          </div>

          <p className="product-description-box">
            {product.description || "Receta secreta del Capitán. Preparado con los mejores ingredientes de la región."}
          </p>

          <div className="stock-info">
            <span style={{ color: '#FFCC80', fontWeight: 'bold', fontSize: '0.85rem' }}>DISPONIBILIDAD:</span>
            <span style={{ color: product.stock > 0 ? '#4CAF50' : '#FF5252', fontWeight: 'bold', fontSize: '0.85rem' }}>
              {product.stock > 0 ? `${product.stock} PORCIONES DISPONIBLES` : 'AGOTADO POR HOY'}
            </span>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <button 
            className="btn-add-cart"
            disabled={product.stock <= 0 || isMaintenance}
            onClick={() => addToCart(product)}
          >
            {isMaintenance ? 'COCINA CERRADA' : product.stock > 0 ? '¡PEDIR AHORA!' : 'AGOTADO'}
          </button>
          
          <button className="btn-back" onClick={() => navigate(-1)}>
            ← VOLVER A LA CARTA
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;