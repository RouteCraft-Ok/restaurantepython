// src/pages/LandingPage.tsx
import { Link } from 'react-router-dom';
import '../Landing.css';

const LandingPage = ({ products }: any) => {
  return (
    <div className="landing-wrapper" style={{ backgroundColor: '#1A1A1A', minHeight: '100vh', paddingTop: '110px', paddingBottom: '60px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      {/* SECCIÓN HERO / PORTADA */}
      <div style={{ textAlign: 'center', padding: '40px 16px', maxWidth: '900px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', color: '#FFCC80', fontSize: 'clamp(2rem, 7vw, 3rem)', marginBottom: '15px', lineHeight: '1.2' }}>
          LA COCINA DEL <span style={{ color: '#FF2B2B', fontWeight: 900 }}>CAPITÁN</span>
        </h1>
        <p style={{ fontFamily: 'Playfair Display, serif', color: '#F4F1ED', fontSize: 'clamp(1rem, 4vw, 1.2rem)', fontStyle: 'italic', marginBottom: '30px', lineHeight: '1.6' }}>
          Sabores a leña y tradición de bodegón. Especialidades artesanales preparadas con el calor de las brasas y la mejor compañía.
        </p>
        
        {/* BOTÓN PRINCIPAL */}
        <Link 
          to="/explorar" 
          style={{
            display: 'inline-block',
            backgroundColor: '#8B0000',
            color: '#FFCC80',
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            padding: '14px 32px',
            borderRadius: '30px',
            border: '2px solid #FFCC80',
            textDecoration: 'none',
            boxShadow: '0 6px 20px rgba(139,0,0,0.5)',
            transition: 'all 0.2s ease'
          }}
        >
          📖 VER LA CARTA COMPLETA
        </Link>
      </div>

      {/* SECCIÓN INFORMATIVA / DESTACADOS */}
      <div style={{ width: '100%', maxWidth: '1100px', margin: '20px auto 40px', padding: '0 16px', boxSizing: 'border-box' }}>
        <div style={{ 
          backgroundColor: '#8D0606', 
          border: '3px solid #A01A1A', 
          borderRadius: '16px', 
          padding: '30px 20px',
          textAlign: 'center',
          boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#FFCC80', fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '20px' }}>
            EL FOGÓN DEL CAPITÁN
          </h2>
          <p style={{ fontFamily: 'Playfair Display, serif', color: '#FFF8E1', fontSize: '1rem', lineHeight: '1.7', maxWidth: '750px', margin: '0 auto 25px' }}>
            Cada plato cuenta una historia. Nuestras carnes al fuego lento, pizzas amasadas a la piedra y empanadas cortadas a cuchillo están listas para disfrutarse en familia o con amigos.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap', width: '100%' }}>
            <div style={{ background: '#1A1A1A', padding: '12px 18px', borderRadius: '8px', border: '1px solid #FFCC80', color: '#FFCC80', fontFamily: 'Playfair Display, serif', fontSize: '0.9rem', width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}>
              🕒 <strong>Horarios:</strong> Mar - Dom 11:30 a 15:00 y 19:30 a 23:30
            </div>
            <div style={{ background: '#1A1A1A', padding: '12px 18px', borderRadius: '8px', border: '1px solid #FFCC80', color: '#FFCC80', fontFamily: 'Playfair Display, serif', fontSize: '0.9rem', width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}>
              📍 <strong>Ubicación:</strong> Calle de los Fuegos 1234, AR
            </div>
          </div>
        </div>
      </div>

      {/* BANNERS / PROMOCIONES */}
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '0 16px', boxSizing: 'border-box' }}>
        <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#FFCC80', fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', textAlign: 'center', marginBottom: '25px', letterSpacing: '1px' }}>
          🔥 PROMOCIONES Y NOVEDADES DE LA SEMANA
        </h3>
        
        <div className="landing-promo-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', width: '100%' }}>
          
          {/* PROMO 1 */}
          <div style={{ 
            background: 'linear-gradient(135deg, #5C0000 0%, #8B0000 100%)', 
            border: '2px solid #FFCC80', 
            borderRadius: '12px', 
            padding: '24px 20px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
            boxSizing: 'border-box',
            width: '100%'
          }}>
            <div>
              <span style={{ background: '#FFCC80', color: '#1A1A1A', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'sans-serif' }}>NUEVO LANZAMIENTO</span>
              <h4 style={{ fontFamily: 'Playfair Display, serif', color: '#FFCC80', fontSize: '1.4rem', margin: '15px 0 10px' }}>
                Helados Artesanales & Postres de Autor
              </h4>
              <p style={{ fontFamily: 'Playfair Display, serif', color: '#F4F1ED', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px' }}>
                Dale el cierre perfecto a tu cena con nuestra nueva línea de postres fríos y helados artesanales elaborados en casa. ¡Probá el volcán de chocolate con bocha americana!
              </p>
            </div>
            <Link 
              to="/explorar?categoria=POSTRES" 
              style={{
                alignSelf: 'flex-start',
                backgroundColor: '#1A1A1A',
                color: '#FFCC80',
                border: '1px solid #FFCC80',
                padding: '8px 18px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: 'Playfair Display, serif',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              VER POSTRES ➔
            </Link>
          </div>

          {/* PROMO 2 */}
          <div style={{ 
            background: 'linear-gradient(135deg, #5C0000 0%, #8B0000 100%)', 
            border: '2px solid #FFCC80', 
            borderRadius: '12px', 
            padding: '24px 20px', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
            boxSizing: 'border-box',
            width: '100%'
          }}>
            <div>
              <span style={{ background: '#FF2B2B', color: '#FFF', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold', fontFamily: 'sans-serif' }}>EDICIÓN LIMITADA</span>
              <h4 style={{ fontFamily: 'Playfair Display, serif', color: '#FFCC80', fontSize: '1.4rem', margin: '15px 0 10px' }}>
                Especiales del Capitán con 15% OFF
              </h4>
              <p style={{ fontFamily: 'Playfair Display, serif', color: '#F4F1ED', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px' }}>
                Aprovechá las rebajas exclusivas en nuestras hamburguesas XL y pizzas de fugazzetta rellena al horno de barro. ¡Pedilas online con descuento directo a la mesa!
              </p>
            </div>
            <Link 
              to="/explorar?categoria=OFERTAS" 
              style={{
                alignSelf: 'flex-start',
                backgroundColor: '#1A1A1A',
                color: '#FFCC80',
                border: '1px solid #FFCC80',
                padding: '8px 18px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontFamily: 'Playfair Display, serif',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              VER OFERTAS ➔
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default LandingPage;