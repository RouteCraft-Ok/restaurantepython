import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/client'; 
import './AuthPage.css'; // Importamos los estilos limpios

interface AuthPageProps {
  onLogin?: (email: string, password: string) => Promise<void>;
}

const AuthPage = ({ onLogin }: AuthPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');
    if (mode === 'register') setIsLogin(false);
    else setIsLogin(true);
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const userData = { email, password };

    try {
      if (!isLogin) {
        const response = await api.post('/register', userData);
        localStorage.setItem('gentleman-user', JSON.stringify(response.data));
        alert("¡CUENTA CREADA EXITOSAMENTE!");
        navigate('/');
        window.location.reload(); 
      } else {
        if (onLogin) {
          await onLogin(email, password);
        } else {
          const response = await api.post('/token', {
              username: email,
              password: password
          });
          
          localStorage.setItem('gentleman-user', JSON.stringify({
              token: response.data.access,
              email: email,
              is_admin: true
          }));
          
          alert("¡BIENVENIDO DE VUELTA!");
          navigate('/');
          window.location.reload(); 
        }
      }
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Error en las credenciales";
      alert("ERROR: " + msg);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        
        <div className="auth-icon-container">
          <svg className="auth-icon" width="50" height="50" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>

        <h2 className="auth-title">
          {isLogin ? 'INICIAR SESIÓN' : 'REGISTRARSE'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label className="auth-label">EMAIL</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com" 
              required
              className="auth-input"
            />
          </div>

          <div className="auth-form-group" style={{ marginBottom: '25px' }}>
            <label className="auth-label">CONTRASEÑA</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********" 
              required
              className="auth-input"
            />
          </div>

          <button type="submit" className="auth-btn-submit">
            {isLogin ? 'ENTRAR' : 'CREAR CUENTA'}
          </button>
        </form>

        <div className="auth-toggle-box">
          <p 
            className="auth-toggle-text"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Loguéate'}
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;