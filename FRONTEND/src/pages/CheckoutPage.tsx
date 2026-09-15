import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPage = ({ cart, removeFromCart, clearCart, fetchProducts }: any) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [metodoEntrega, setMetodoEntrega] = useState<'MESA' | 'LOCAL' | 'ENVIO'>('MESA');
  const [numeroMesa, setNumeroMesa] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigate = useNavigate();
  
  // FIX: Se incluye 127.0.0.1 para que detecte el servidor local de Node en el puerto 5000
  const isLocal = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'
  );
  const API_BASE_URL = isLocal ? "http://127.0.0.1:5000" : "";

  const subtotal = cart.reduce((acc: number, item: any) => {
    const basePrice = Number(item.price) || 0;
    const discount = Number(item.discount_percentage) || 0;
    const precioFinal = item.on_sale === true ? basePrice - (basePrice * discount / 100) : basePrice;
    return acc + (precioFinal * (item.quantity || 1));
  }, 0);

  const recargoEnvio = metodoEntrega === 'ENVIO' ? subtotal * 0.15 : 0;
  const totalFinal = subtotal + recargoEnvio;

  const procesarCompra = async (metodoPago: 'MP' | 'WA') => {
    if (metodoEntrega === 'MESA' && !numeroMesa) {
      alert("⚠️ Por favor, ingresa el número de tu mesa.");
      return;
    }
    if (metodoEntrega === 'ENVIO' && (!direccion || !telefono)) {
      alert("⚠️ Por favor, completa la dirección y el teléfono para el envío.");
      return;
    }

    setIsProcessing(true);

    try {
      const textoEntrega = 
        metodoEntrega === 'MESA' ? `Consumo en Salón - Mesa N° ${numeroMesa}` :
        metodoEntrega === 'ENVIO' ? `Envío a domicilio (${direccion})` : 
        'Retiro en mostrador';

      if (metodoPago === 'WA') {
        const mensaje = `¡Hola! Nueva comanda:\n${cart.map((i: any) => `- ${i.quantity || 1}x ${i.name}`).join('\n')}\nTotal: $${totalFinal.toLocaleString()}\nModalidad: ${textoEntrega}`;
        
        window.open(`https://wa.me/5493794123456?text=${encodeURIComponent(mensaje)}`, '_blank');
        
        clearCart();
        navigate('/explorar');
      } else {
        const response = await axios.post(`${API_BASE_URL}/api/checkout`, {
          items: cart.map((item: any) => ({
            id: item.id,
            quantity: item.quantity || 1
          })),
          metodo: metodoPago,
          entrega: metodoEntrega,
          detalles_entrega: {
            mesa: metodoEntrega === 'MESA' ? numeroMesa : null,
            direccion: metodoEntrega === 'ENVIO' ? direccion : 'No aplica',
            telefono: telefono,
          },
          total: totalFinal
        });

        if (response.status === 200 || response.status === 201) {
          alert("✅ ¡COMANDA ENVIADA A COCINA! El Capitán ya está avivando el fuego.");
          
          clearCart(); 
          
          if (typeof fetchProducts === 'function') {
            await fetchProducts(); 
          }

          navigate('/explorar');
        }
      }
    } catch (error: any) {
      console.error("Error en la comanda:", error);
      alert(error.response?.data?.error || "Error en la cocina. Intente nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-container-empty">
        <h2 className="checkout-empty-title">TU COMANDA ESTÁ VACÍA</h2>
        <p className="checkout-empty-subtitle">EL CAPITÁN ESTÁ ESPERANDO TUS ÓRDENES</p>
        <Link to="/explorar" className="btn-empty-cart">VER LA CARTA</Link>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper">
      <div className="checkout-center-container">
        <div className="checkout-main-card">
          
          <div className="checkout-left-col">
            <h2 className="checkout-section-title">DETALLE DE LA COMANDA</h2>
            
            <div className="cart-items-list">
              {cart.map((item: any) => {
                const basePrice = Number(item.price) || 0;
                const discount = Number(item.discount_percentage) || 0;
                const precioUnitario = item.on_sale === true ? basePrice - (basePrice * discount / 100) : basePrice;
                const imageSrc = item.image || 'https://via.placeholder.com/150';

                return (
                  <div key={item.id} className="cart-item-row">
                    <div className="cart-item-img">
                      <img src={imageSrc} alt={item.name} />
                    </div>
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>{item.quantity || 1} x ${precioUnitario.toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="btn-remove-item">X</button>
                  </div>
                );
              })}
            </div>

            <div className="checkout-totals-box">
               <div className="checkout-total-row">
                 <span>Subtotal:</span>
                 <span>${subtotal.toLocaleString()}</span>
               </div>
               {metodoEntrega === 'ENVIO' && (
                 <div className="checkout-total-row" style={{ color: '#E57373' }}>
                   <span>Recargo Envío (15%):</span>
                   <span>${recargoEnvio.toLocaleString()}</span>
                 </div>
               )}
               <div className="checkout-total-final">
                 <span className="checkout-total-label">TOTAL:</span>
                 <span className="checkout-total-amount">${totalFinal.toLocaleString()}</span>
               </div>
            </div>
          </div>

          <div className="checkout-right-col">
            <h2 className="checkout-right-title">MODALIDAD Y PAGO</h2>
            
            <div className="form-group-select">
              <label className="form-label">TIPO DE ATENCIÓN</label>
              <select 
                value={metodoEntrega} 
                onChange={(e: any) => setMetodoEntrega(e.target.value)}
                className="select-delivery"
              >
                <option value="MESA">🍽️ CONSUMIR EN SALÓN (N° DE MESA)</option>
                <option value="LOCAL">🏃 RETIRAR POR MOSTRADOR</option>
                <option value="ENVIO">🛵 ENVÍO A DOMICILIO (+15%)</option>
              </select>
            </div>

            {metodoEntrega === 'MESA' && (
              <div className="delivery-inputs-container">
                <input 
                  placeholder="NÚMERO DE MESA (Ej: 4)" 
                  value={numeroMesa}
                  onChange={(e) => setNumeroMesa(e.target.value)}
                  className="input-delivery"
                />
              </div>
            )}

            {metodoEntrega === 'ENVIO' && (
              <div className="delivery-inputs-container">
                <input 
                  placeholder="DIRECCIÓN DE ENTREGA (Calle, N°, Depto)" 
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  className="input-delivery"
                />
                <input 
                  placeholder="TELÉFONO DE CONTACTO" 
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="input-delivery"
                />
              </div>
            )}

            {isProcessing ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', color: '#FFCC80' }}>AVIVANDO EL FUEGO...</p>
              </div>
            ) : (
              <div className="payment-actions">
                <p style={{ color: '#FFCC80', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>SELECCIONÁ MÉTODO DE PAGO</p>
                <button onClick={() => procesarCompra('MP')} className="btn-pay-mp">
                  MERCADO PAGO (ONLINE)
                </button>
                <button onClick={() => procesarCompra('WA')} className="btn-pay-wa">
                  ENVIAR PEDIDO POR WHATSAPP
                </button>
                <button onClick={() => navigate(-1)} className="btn-continue-shopping">
                  SEGUIR TRAYENDO MÁS PLATOS
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;