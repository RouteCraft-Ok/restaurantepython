// src/components/Navbar.tsx
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ setShowNavMenu, showNavMenu, menuRef, cartCount, onSearch, searchTerm, cartTotal = 0 }: any) => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('gentleman-user');
  let user = null;
  if (userJson && userJson !== "undefined") {
    try { user = JSON.parse(userJson); } catch (e) { console.error(e); }
  }

  const handleLogout = () => {
    localStorage.removeItem('gentleman-user');
    navigate('/');
    window.location.reload();
  };

  const obtenerSaludoUsuario = () => {
    if (!user || !user.email) return "";
    const email = user.email;
    if (email.includes("@")) {
      const parteNombre = email.split("@")[0];
      return parteNombre.charAt(0).toUpperCase() + parteNombre.slice(1);
    }
    return email;
  };

  const nombreSaludo = obtenerSaludoUsuario();

  return (
    <nav className="top-nav">
      <div className="nav-container">
        
        {/* --- IZQUIERDA: LOGO Y MENÚ CARTA --- */}
        <div className="nav-left-section">
          <Link to="/" className="nav-logo-link">
            <h1 className="nav-logo">
              LA COCINA DEL <span>CAPITÁN</span>
            </h1>
          </Link>

          <div className="nav-dropdown-wrapper" ref={menuRef}>
            <button 
              className="nav-explore-btn"
              onClick={() => setShowNavMenu(!showNavMenu)}
            >
              📖 ÍNDICE CARTA ▾
            </button>

            {showNavMenu && (
              <div className="nav-mega-menu">
                <Link to="/explorar?categoria=OFERTAS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🔥 SUGERENCIAS DEL DÍA</Link>
                <Link to="/explorar?categoria=AL_FUEGO" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🔥 AL FUEGO Y A LA LEÑA</Link>
                <Link to="/explorar?categoria=BURGUERS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🍔 BURGUER ARTESANAL</Link>
                <Link to="/explorar?categoria=PIZZAS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🍕 PIZZAS A LA PIEDRA</Link>
                <Link to="/explorar?categoria=EMPANADAS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🥟 EMPANADAS CASERAS</Link>
                <Link to="/explorar?categoria=POSTRES" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🍰 POSTRES DE LA CASA</Link>
                <Link to="/explorar?categoria=BEBIDAS" className="menu-category-item" onClick={() => setShowNavMenu(false)}>🍷 BEBIDAS Y VINOS</Link>
                <div className="menu-divider"></div>
                <Link to="/explorar?categoria=TODOS" className="menu-category-item menu-all-item" onClick={() => setShowNavMenu(false)}>VER CARTA COMPLETA</Link>
              </div>
            )}
          </div>
        </div>

        {/* --- CENTRO: BUSCADOR --- */}
        <div className="nav-search-container">
          <input 
            type="text" 
            placeholder="¿Qué se te antoja hoy? Buscá un plato..." 
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="nav-search-input"
          />
        </div>

        {/* --- DERECHA: PANEL, COMANDA Y SALIR --- */}
        <div className="nav-right-section">
          {user && (
            <Link to="/admin" className="nav-admin-link">
              COCINA / ADMIN
            </Link>
          )}

          {/* LIBRETA DE MESA / COMANDA EN LUGAR DE CARRITO */}
          <Link to="/checkout" className="cart-icon-wrapper comanda-badge-btn" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.1rem' }}>📝</span>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.1', textAlign: 'left' }}>
              <span style={{ fontSize: '10px', color: '#FFCC80', fontWeight: 'bold' }}>MI MESA</span>
              <span style={{ fontSize: '12px', color: '#FFF', fontWeight: '900' }}>
                {cartCount > 0 ? `${cartCount} plato(s) · $${cartTotal.toLocaleString()}` : 'Vacía'}
              </span>
            </div>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <div className="auth-btns">
            {user ? (
              <div className="user-nav-info">
                <span className="user-name">
                  HOLA, {nombreSaludo.toUpperCase()}
                </span>
                <button onClick={handleLogout} className="nav-btn btn-exit">
                  SALIR
                </button>
              </div>
            ) : (
              <Link to="/auth?mode=login" className="nav-btn btn-login">
                ACCEDER
              </Link>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;