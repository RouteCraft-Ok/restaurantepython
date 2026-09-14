from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# CONFIGURACIÓN PARA VERCEL: Usamos /tmp en producción porque el resto del sistema es Read-Only
if os.environ.get('VERCEL'):
    UPLOAD_FOLDER = '/tmp/uploads'
else:
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# === 1. BASE DE DATOS EN MEMORIA ===
MENU_DB = [
    {
        "id": 1,
        "name": "Asado de Tira con Papas",
        "description": "Corte seleccionado cocinado lentamente a las brasas de leña dura, acompañado de papas rústicas al pimentón.",
        "price": 7650.00,
        "category": "AL_FUEGO",
        "image": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800",
        "gallery": [],
        "secondary_category": "OFERTAS",
        "is_vegetarian": False,
        "is_spicy": False,
        "available": True,
        "on_sale": True,
        "discount_percentage": 10,
        "stock": 10,
        "new_until_days": 7
    },
    {
        "id": 2,
        "name": "Burguer Doble Cheddar",
        "description": "Medallones de carne 100% vacuna a la parrilla, doble cheddar fundido, panceta crujiente y salsa especial de la casa en pan brioche artesanal.",
        "price": 4200.00,
        "category": "BURGUERS",
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
        "gallery": [],
        "secondary_category": "TODOS",
        "is_vegetarian": False,
        "is_spicy": False,
        "available": True,
        "on_sale": False,
        "discount_percentage": 0,
        "stock": 20,
        "new_until_days": 7
    },
    {
        "id": 3,
        "name": "Burguer del Capitán XL",
        "description": "Triple carne, aros de cebolla rebozados, abundante queso gouda, morrones asados a la leña y alioli ahumado.",
        "price": 5400.00,
        "category": "BURGUERS",
        "image": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800",
        "gallery": [],
        "secondary_category": "OFERTAS",
        "is_vegetarian": False,
        "is_spicy": False,
        "available": True,
        "on_sale": True,
        "discount_percentage": 10,
        "stock": 15,
        "new_until_days": 7
    },
    {
        "id": 4,
        "name": "Bife de Chorizo a la Leña",
        "description": "Corte jugoso de 400g a las brasas con chimichurri tradicional de campo y vegetales asados.",
        "price": 8900.00,
        "category": "AL_FUEGO",
        "image": "https://media-cdn.tripadvisor.com/media/photo-s/12/67/70/f9/assado-de-tiras.jpg",
        "gallery": [],
        "secondary_category": "TODOS",
        "is_vegetarian": False,
        "is_spicy": False,
        "available": True,
        "on_sale": False,
        "discount_percentage": 0,
        "stock": 8,
        "new_until_days": 7
    },
    {
        "id": 5,
        "name": "Pizza Mozzarella Especial a la Piedra",
        "description": "Masa madre de fermentación lenta horneada a la piedra, abundante mozzarella, aceitunas negras y toque de orégano fresco.",
        "price": 5200.00,
        "category": "PIZZAS",
        "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
        "gallery": [],
        "secondary_category": "TODOS",
        "is_vegetarian": True,
        "is_spicy": False,
        "available": True,
        "on_sale": False,
        "discount_percentage": 0,
        "stock": 15,
        "new_until_days": 7
    },
    {
        "id": 6,
        "name": "Pizza Fugazzeta Rellena",
        "description": "Doble masa rellena de jamón y muzza, cubierta con abundante cebolla caramelizada y provolone gratinado.",
        "price": 6100.00,
        "category": "PIZZAS",
        "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
        "gallery": [],
        "secondary_category": "OFERTAS",
        "is_vegetarian": True,
        "is_spicy": False,
        "available": True,
        "on_sale": True,
        "discount_percentage": 15,
        "stock": 10,
        "new_until_days": 7
    },
    {
        "id": 7,
        "name": "Docena de Empanadas Cortadas a Cuchillo",
        "description": "Jugosas empanadas de carne vacuna cortada a cuchillo, cebolla de verdeo, huevo y comino en masa casera al horno de barro.",
        "price": 7800.00,
        "category": "EMPANADAS",
        "image": "https://images.unsplash.com/photo-1619895092538-128341789043?w=800",
        "gallery": [],
        "secondary_category": "TODOS",
        "is_vegetarian": False,
        "is_spicy": False,
        "available": True,
        "on_sale": False,
        "discount_percentage": 0,
        "stock": 25,
        "new_until_days": 7
    },
    {
        "id": 8,
        "name": "Flan Mixto del Capitán",
        "description": "Flan casero tradicional de vainilla cocinado a baño María, acompañado de dulce de leche colonial y crema batida.",
        "price": 2500.00,
        "category": "POSTRES",
        "image": "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=800",
        "gallery": [],
        "secondary_category": "TODOS",
        "is_vegetarian": True,
        "is_spicy": False,
        "available": True,
        "on_sale": False,
        "discount_percentage": 0,
        "stock": 14,
        "new_until_days": 7
    },
    {
        "id": 9,
        "name": "Porción de Chocotorta Artesanal",
        "description": "Capas de galletitas chocolinas humedecidas en chocolatada con suave mezcla de dulce de leche y queso crema.",
        "price": 2800.00,
        "category": "POSTRES",
        "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
        "gallery": [],
        "secondary_category": "OFERTAS",
        "is_vegetarian": True,
        "is_spicy": False,
        "available": True,
        "on_sale": True,
        "discount_percentage": 5,
        "stock": 12,
        "new_until_days": 7
    },
    {
        "id": 10,
        "name": "Cerveza Artesanal IPA Tirada (Pinta 500ml)",
        "description": "Cerveza rubia tirada de fuerte amargor lupulado y notas cítricas refrescantes.",
        "price": 2200.00,
        "category": "BEBIDAS",
        "image": "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800",
        "gallery": [],
        "secondary_category": "TODOS",
        "is_vegetarian": True,
        "is_spicy": False,
        "available": True,
        "on_sale": False,
        "discount_percentage": 0,
        "stock": 40,
        "new_until_days": 7
    }
]

USERS_DB = {
    "admin@admin.com": "admin123"
}

SALES_DB = [] 
MAINTENANCE_STATUS = {"value": False}

# Helper para calcular la URL base dinámicamente
def get_base_url():
    return f"https://{request.host}" if os.environ.get('VERCEL') else "http://localhost:5000"

# Servir los archivos desde la carpeta temporal de subidas
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# === 2. AUTENTICACIÓN ===
@app.route('/api/token', methods=['POST'])
@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.get_json() or {}
    email = data.get('email') or data.get('username')
    password = data.get('password')
    if email in USERS_DB and USERS_DB[email] == password:
        return jsonify({
            'access': f"mock-jwt-token-for-{email}",
            'email': email,
            'is_admin': True
        }), 200
    return jsonify({'detail': 'Usuario o contraseña incorrectos'}), 401

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if email in USERS_DB:
        return jsonify({'detail': 'Este correo ya está registrado'}), 400
    USERS_DB[email] = password
    return jsonify({'access': f"mock-jwt-token-for-{email}", 'email': email, 'is_admin': True}), 201

# === 3. MANEJO DE PLATOS ===
@app.route('/api/platos', methods=['GET', 'POST'])
@app.route('/api/platos/<int:plato_id>', methods=['PUT', 'DELETE'])
def gestionar_platos(plato_id=None):
    global MENU_DB
    base_url = get_base_url()
    
    if request.method == 'GET':
        productos_normalizados = []
        for p in MENU_DB:
            precio_seguro = float(p.get("price") or 0)
            productos_normalizados.append({
                "id": p.get("id"), 
                "name": p.get("name"), 
                "description": p.get("description"), 
                "price": precio_seguro, 
                "category": p.get("category"), 
                "secondary_category": p.get("secondary_category") or "",
                "image": p.get("image"), 
                "gallery": p.get("gallery") or [],
                "is_vegetarian": p.get("is_vegetarian") or False, 
                "is_spicy": p.get("is_spicy") or False, 
                "available": p.get("available") if p.get("available") is not None else True, 
                "on_sale": p.get("on_sale") or False,
                "discount_percentage": int(p.get("discount_percentage") or 0),
                "stock": int(p.get("stock") or 10),
                "new_until_days": int(p.get("new_until_days") or 7)
            })
        return jsonify(productos_normalizados)
        
    elif request.method == 'POST':
        if request.is_json:
            data = request.get_json() or {}
        else:
            data = request.form.to_dict()

        url_imagen_principal = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600"
        if 'image' in request.files:
            file_principal = request.files['image']
            if file_principal and file_principal.filename != '':
                filename = secure_filename(f"main_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}_{file_principal.filename}")
                file_principal.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                url_imagen_principal = f"{base_url}/uploads/{filename}"

        urls_galeria = []
        if 'gallery' in request.files:
            archivos_galeria = request.files.getlist('gallery')
            for index, file_galeria in enumerate(archivos_galeria):
                if file_galeria and file_galeria.filename != '':
                    filename = secure_filename(f"gal_{index}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}_{file_galeria.filename}")
                    file_galeria.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                    urls_galeria.append(f"{base_url}/uploads/{filename}")

        precio = float(data.get("price") or 0)
        nuevo = {
            "id": max([p["id"] for p in MENU_DB]) + 1 if MENU_DB else 1,
            "name": data.get("name") or "Nuevo Plato",
            "description": data.get("description") or "",
            "price": precio,
            "category": data.get("category") or "AL_FUEGO",
            "secondary_category": data.get("secondary_category") or "",
            "image": url_imagen_principal,
            "gallery": urls_galeria,
            "is_vegetarian": False, 
            "is_spicy": False, 
            "available": True,
            "on_sale": data.get("on_sale") == 'true',
            "discount_percentage": int(data.get("discount_percentage") or 0),
            "stock": int(data.get("stock") or 10),
            "new_until_days": int(data.get("new_until_days") or 7)
        }
        MENU_DB.append(nuevo)
        return jsonify(nuevo), 201

    elif request.method == 'PUT' and plato_id:
        if request.is_json:
            data = request.get_json() or {}
        else:
            data = request.form.to_dict()
            
        for p in MENU_DB:
            if p["id"] == plato_id:
                p["name"] = data.get("name", p["name"])
                p["price"] = float(data.get("price", p["price"]))
                p["stock"] = int(data.get("stock", p["stock"]))
                p["description"] = data.get("description", p["description"])
                p["category"] = data.get("category", p["category"])
                p["secondary_category"] = data.get("secondary_category", p["secondary_category"])
                p["on_sale"] = data.get("on_sale") == 'true'
                p["discount_percentage"] = int(data.get("discount_percentage", p["discount_percentage"]))
                p["new_until_days"] = int(data.get("new_until_days", p["new_until_days"]))
                
                if 'image' in request.files:
                    file_principal = request.files['image']
                    if file_principal and file_principal.filename != '':
                        filename = secure_filename(f"main_{plato_id}_{file_principal.filename}")
                        file_principal.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                        p["image"] = f"{base_url}/uploads/{filename}"
                        
                if 'gallery' in request.files:
                    archivos_galeria = request.files.getlist('gallery')
                    urls_galeria = []
                    for index, file_galeria in enumerate(archivos_galeria):
                        if file_galeria and file_galeria.filename != '':
                            filename = secure_filename(f"gal_{plato_id}_{index}_{file_galeria.filename}")
                            file_galeria.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                            urls_galeria.append(f"{base_url}/uploads/{filename}")
                    p["gallery"] = urls_galeria
                    
                return jsonify(p), 200
        return jsonify({"detail": "No encontrado"}), 404

    elif request.method == 'DELETE' and plato_id:
        MENU_DB = [p for p in MENU_DB if p["id"] != plato_id]
        return jsonify({"success": True}), 200

# === 4. PROCESAR COMPRAS ===
@app.route('/api/checkout', methods=['POST', 'OPTIONS'])
def procesar_checkout():
    if request.method == 'OPTIONS':
        return '', 200
        
    global SALES_DB, MENU_DB
    data = request.get_json() or {}
    
    cart_items = data.get('items', [])
    total_compra = data.get('total', 0)
    metodo_pago = data.get('metodo', 'MP')
    metodo_entrega = data.get('entrega', 'LOCAL')
    detalles_entrega = data.get('detalles_entrega', {})
    
    for item in cart_items:
        plato_id = item.get('id')
        cantidad = int(item.get('quantity', 1))
        for p in MENU_DB:
            if p["id"] == plato_id:
                p["stock"] = max(0, p["stock"] - cantidad)

    nueva_venta = {
        "id": len(SALES_DB) + 1,
        "items": cart_items,
        "total": float(total_compra),
        "metodo_pago": metodo_pago,
        "entrega": metodo_entrega,
        "detalles_entrega": detalles_entrega,
        "estado": "PENDIENTE",
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    SALES_DB.append(nueva_venta)
    
    return jsonify({
        "success": True, 
        "message": "¡Pedido abonado y recibido en la cocina del Capitán!", 
        "sale_id": nueva_venta["id"]
    }), 201

@app.route('/api/sales', methods=['GET'])
def get_sales():
    return jsonify(SALES_DB)

# === 5. MANTENIMIENTO (AÑADIDO PARA SOLUCIONAR EL ERROR 404) ===
@app.route('/api/toggle-maintenance', methods=['GET', 'POST'])
def toggle_maintenance():
    global MAINTENANCE_STATUS
    if request.method == 'POST':
        data = request.get_json() or {}
        if 'value' in data:
            MAINTENANCE_STATUS["value"] = bool(data['value'])
        else:
            MAINTENANCE_STATUS["value"] = not MAINTENANCE_STATUS["value"]
            
    return jsonify(MAINTENANCE_STATUS), 200

# Bloque necesario para correr localmente con python app.py
if __name__ == '__main__':
    app.run(debug=True, port=5000)