import React, { useState, useEffect } from 'react';
import '../App.css'; 

// 🔥 CORRECCIÓN: Ahora el Dashboard recibe la lista sincronizada por Props
function Dashboard({ productos = [], setProductos }) {
    
    // 🗑️ AQUÍ YA NO DECLARAS EL APARTADO DE: const [productos, setProductos] = useState([...])
    // ¡Bórralo para que no haga conflicto con las props!

    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [idEdicion, setIdEdicion] = useState(null);

    const [selectedProducto, setSelectedProducto] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: '' });

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState(null);

    // Carrito, Pedidos e Intercambio de Vistas
    const [carrito, setCarrito] = useState([]);
    const [pedidos, setPedidos] = useState(JSON.parse(localStorage.getItem('fastech_pedidos') || '[]'));
    const [vistaActual, setVistaActual] = useState('tienda'); 
    const [showCartDropdown, setShowCartDropdown] = useState(false);

    const userRole = localStorage.getItem('userRole') || 'usuario';


    const lanzarAlerta = (mensaje, tipo = 'error') => {
        setAlerta({ mostrar: true, mensaje, tipo });
        setTimeout(() => {
            setAlerta({ mostrar: false, mensaje: '', tipo: '' });
        }, 5000);
    };

    const abrirDetalles = (producto) => {
        setSelectedProducto(producto);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setSelectedProducto(null);
    };

    // 🛒 FUNCIONES DEL CARRITO Y CLIENTE
    const agregarAlCarrito = (producto) => {
        setCarrito([...carrito, producto]);
        lanzarAlerta(`"${producto.nombre}" se agregó al carrito.`, "exito");
    };

    const eliminarDelCarrito = (indexEliminar) => {
        const nuevoCarrito = carrito.filter((_, index) => index !== indexEliminar);
        setCarrito(nuevoCarrito);
    };

    const calcularTotal = () => {
        return carrito.reduce((sum, p) => sum + parseFloat(p.precio), 0).toFixed(2);
    };

    const procesarPago = () => {
        if (carrito.length === 0) {
            lanzarAlerta("El carrito está vacío.");
            return;
        }

        // Crear estructura de un nuevo pedido formal
        const nuevoPedido = {
            id: Math.floor(Math.random() * 90000) + 10000,
            fecha: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            articulos: [...carrito],
            total: calcularTotal()
        };

        const listaPedidosActualizada = [nuevoPedido, ...pedidos];
        setPedidos(listaPedidosActualizada);
        localStorage.setItem('fastech_pedidos', JSON.stringify(listaPedidosActualizada));
        
        // Limpiar el flujo
        setCarrito([]);
        setShowCartDropdown(false);
        lanzarAlerta("¡Pago procesado con éxito! Tu pedido ha sido registrado.", "exito");
        setVistaActual('pedidos'); // Te redirige automáticamente a ver tus compras
    };

    // 🔒 BLOQUEOS LÓGICOS DE ADMINISTRACIÓN
    const solicitarEliminacion = (producto) => {
        if (userRole !== 'admin') {
            lanzarAlerta("Operación rechazada: No posees credenciales administrativas.");
            return;
        }
        setProductoAEliminar(producto);
        setShowConfirmDelete(true);
    };

    const ejecutarEliminacionReal = () => {
        if (userRole !== 'admin') {
            lanzarAlerta("Operación rechazada: Acción restringida de seguridad.");
            return;
        }
        if (productoAEliminar) {
            const listaFiltrada = productos.filter(prod => prod.id !== productoAEliminar.id);
            setProductos(listaFiltrada);
            lanzarAlerta(`Sistema Fastech: El producto "${productoAEliminar.nombre}" ha sido removido con éxito.`, "exito");
            
            if (idEdicion === productoAEliminar.id) cancelarEdicion();
            
            setShowConfirmDelete(false);
            setProductoAEliminar(null);
        }
    };

    const iniciarEdicion = (producto) => {
        if (userRole !== 'admin') {
            lanzarAlerta("Operación rechazada: No posees credenciales administrativas.");
            return;
        }
        setIdEdicion(producto.id);
        setNombre(producto.nombre);
        setPrecio(producto.precio);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleActualizarProducto = (e) => {
        e.preventDefault();
        if (userRole !== 'admin') {
            lanzarAlerta("Operación rechazada.");
            return;
        }
        if (!nombre.trim() || !precio.toString().trim()) {
            lanzarAlerta("Error de validación: Todos los campos modificados son estrictamente obligatorios.");
            return;
        }

        const precioNum = parseFloat(precio);
        if (precioNum <= 0) {
            lanzarAlerta("Operación rechazada: El precio asignado al producto debe ser estrictamente mayor a 0.");
            return;
        }

        const productosActualizados = productos.map((prod) => {
            if (prod.id === idEdicion) {
                return { ...prod, nombre: nombre.trim(), precio: precioNum.toFixed(2) };
            }
            return prod;
        });

        setProductos(productosActualizados);
        cancelarEdicion();
        lanzarAlerta("Sistema Fastech: El producto seleccionado ha sido modificado exitosamente en el Dashboard.", "exito");
    };

    const cancelarEdicion = () => {
        setIdEdicion(null);
        setNombre('');
        setPrecio('');
    };

    return (
      <div className="dashboard-view-container">
        <nav className="main-navbar">
          <div className="navbar-logo">FASTECH</div>
          <div className="navbar-menu-links">
            <button 
                className={`nav-link-btn ${vistaActual === 'tienda' ? 'active' : ''}`} 
                onClick={() => { setVistaActual('tienda'); setShowCartDropdown(false); }}
            >
                🏠 Inicio
            </button>
            
            {/* Solo clientes ven la sección de "Mis Pedidos" */}
            {userRole !== 'admin' && (
                <button 
                    className={`nav-link-btn ${vistaActual === 'pedidos' ? 'active' : ''}`} 
                    onClick={() => { setVistaActual('pedidos'); setShowCartDropdown(false); }}
                >
                    📋 Mis Pedidos <span className="cart-badge-count">{pedidos.length}</span>
                </button>
            )}

            {userRole === 'admin' && (
                <a href="/inventario" className="nav-link-btn">📦 Gestión de Inventario</a>
            )}
            
            {/* Carrito de Compras Desplegable en el menú (Solo para clientes) */}
            {userRole !== 'admin' && (
                <div className="cart-container-menu">
                    <button className="nav-link-btn" onClick={() => setShowCartDropdown(!showCartDropdown)}>
                        🛒 Carrito <span className="cart-badge-count">{carrito.length}</span>
                    </button>
                    
                    {showCartDropdown && (
                        <div className="cart-dropdown-box">
                            <h4>Tu Carrito</h4>
                            {carrito.length === 0 ? (
                                <p className="empty-cart-text">El carrito está vacío</p>
                            ) : (
                                <>
                                    <div className="cart-items-scroll">
                                        {carrito.map((item, idx) => (
                                            <div className="cart-dropdown-item" key={idx}>
                                                <span>{item.nombre}</span>
                                                <strong>${item.precio}</strong>
                                                <button className="btn-remove-item" onClick={() => eliminarDelCarrito(idx)}>&times;</button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="cart-dropdown-footer">
                                        <div className="total-row">
                                            <span>Total:</span>
                                            <strong>${calcularTotal()}</strong>
                                        </div>
                                        <button className="btn-pay-fastech" onClick={procesarPago}>Proceder al Pago</button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            <a href="/" className="nav-link-btn logout-btn" onClick={() => localStorage.clear()}>🚪 Salir</a>
          </div>
        </nav>

        <div className="dashboard-header-section">
  {/* Cambiamos el saludo aquí */}
  <h2>Bienvenid@ {localStorage.getItem('userName') || 'Fastech'}</h2>
  <span className="admin-badge">{userRole}</span>
</div>
        {alerta.mostrar && (
            <div className={`fastech-sistema-alerta alert-${alerta.tipo}`} style={{ margin: '0 40px 20px 40px' }}>
                <div className="alert-icon-box">{alerta.tipo === 'exito' ? '✅' : '⚠️'}</div>
                {/* Forzamos color oscuro para el texto de la alerta si su fondo es claro */}
                <div className="alert-text-box" style={{ color: '#0f172a' }}>{alerta.mensaje}</div>
            </div>
        )}

        {/* MODO PANEL DE EDICIÓN (ADMIN) */}
        {idEdicion !== null && userRole === 'admin' && (
            <div className="dashboard-edit-panel" style={{ margin: '0 40px 25px 40px', padding: '20px', background: '#f8fafc', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 15px 0', color: '#1e293b' }}>⚙️ Modo Edición Activo: Modificando Producto</h4>
                <form onSubmit={handleActualizarProducto} style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <input 
                        type="text" 
                        placeholder="Nombre del producto" 
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        style={{ flex: 2, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                    <input 
                        type="number" 
                        step="0.01"
                        placeholder="Precio" 
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                    />
                    <button type="submit" className="inv-sect-btn-save" style={{ padding: '10px 20px' }}>
                        Actualizar en Dashboard
                    </button>
                    <button type="button" className="inv-sect-btn-cancel" onClick={cancelarEdicion} style={{ padding: '10px 20px' }}>
                        Cancelar
                    </button>
                </form>
            </div>
        )}

        {/* INTERCAMBIO DE VISTAS (TIENDA VS PEDIDOS) */}
        {vistaActual === 'tienda' ? (
            <div className="items-products-grid">
              {productos.map((producto) => (
                <div className="single-product-card" key={producto.id}>
                  <div className="card-image-box">
                    <img src={producto.imagen} alt={producto.nombre} />
                  </div>
                  <div className="card-content-details">
                    <h3>{producto.nombre}</h3>
                    <p className="price-tag">${producto.precio}</p>
                    <div className="card-buttons-wrapper">
                      <button className="action-btn-view" onClick={() => abrirDetalles(producto)}>Ver</button>
                      
                      {/* Si es cliente, ve el botón de Comprar / Agregar */}
                      {userRole !== 'admin' && (
                        <button className="action-btn-buy" onClick={() => agregarAlCarrito(producto)}>🛒 Añadir</button>
                      )}
                      
                      {/* Si es admin, ve Editar y Eliminar */}
                      {userRole === 'admin' && (
                        <>
                          <button className="action-btn-edit" onClick={() => iniciarEdicion(producto)}>Editar</button>
                          <button className="action-btn-delete" onClick={() => solicitarEliminacion(producto)}>Eliminar</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        ) : (
            /* VISTA DE HISTORIAL DE PEDIDOS HECHOS */
            /* VISTA DE HISTORIAL DE PEDIDOS HECHOS OPTIMIZADA */
            <div className="orders-history-container">
                <h3 className="orders-title">📋 Historial de tus Pedidos Realizados</h3>
                {pedidos.length === 0 ? (
                    <p style={{ color: '#64748b', textAlign: 'center', marginTop: '40px' }}>
                        Aún no has realizado ninguna compra en Fastech.
                    </p>
                ) : (
                    pedidos.map((pedido) => (
                        <div className="order-history-card" key={pedido.id}>
                            <div className="order-card-header">
                                <span className="order-id-label">
                                    Código de Orden: <strong>#{pedido.id}</strong>
                                </span>
                                <span className="order-date-label">🗓️ {pedido.fecha}</span>
                            </div>
                            
                            <div className="order-items-list">
                                {pedido.articulos.map((art, i) => (
                                    <div className="order-item-row" key={i}>
                                        <span className="order-item-name">📦 {art.nombre}</span>
                                        <span className="order-item-price">${art.precio}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="order-card-footer">
                                <div className="order-status-badge">
                                    <span className="order-status-dot"></span>
                                    Estado: Pagado
                                </div>
                                <span className="order-total-label">
                                    Total Facturado: <strong className="order-total-amount">${pedido.total}</strong>
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        )}

        {/* Ventana Modal de Detalles */}
        {showModal && selectedProducto && (
          <div className="product-details-modal-overlay" onClick={cerrarModal}>
            <div className="product-details-modal-box" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-btn" onClick={cerrarModal}>&times;</button>
              <div className="modal-layout-content">
                <div className="modal-image-pane">
                  <img src={selectedProducto.imagen} alt={selectedProducto.nombre} />
                </div>
                <div className="modal-info-pane">
                  <span className="modal-category-tag">Dispositivo Fastech</span>
                  <h2>{selectedProducto.nombre}</h2>
                  <p className="modal-price-tag">${selectedProducto.precio}</p>
                  <hr />
                  <h4>Especificaciones Técnicas:</h4>
                  <p className="modal-description-text">{selectedProducto.descripcion}</p>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                     {userRole !== 'admin' && (
                        <button className="modal-action-btn" style={{ background: '#10b981' }} onClick={() => { agregarAlCarrito(selectedProducto); cerrarModal(); }}>Añadir al Carrito</button>
                     )}
                     <button className="modal-action-btn" onClick={cerrarModal}>Cerrar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal confirmación borrado */}
        {showConfirmDelete && productoAEliminar && userRole === 'admin' && (
            <div className="fastech-formal-modal-overlay">
                <div className="fastech-formal-modal-box">
                    <div className="fastech-formal-modal-header text-danger">
                        ⚠️ Confirmación de Seguridad de Sistema
                    </div>
                    <div className="fastech-formal-modal-body">
                        <p>¿Está seguro de que desea remover permanentemente del catálogo el siguiente artículo?</p>
                        <blockquote className="fastech-formal-blockquote">
                            <strong>Artículo:</strong> {productoAEliminar.nombre} <br />
                            <strong>Precio Asignado:</strong> ${productoAEliminar.precio}
                        </blockquote>
                        <p className="fastech-formal-subtext">Esta acción es definitiva y no se podrá revertir de forma automática.</p>
                    </div>
                    <div className="fastech-formal-modal-footer">
                        <button className="fastech-btn-modal-cancel" onClick={() => setShowConfirmDelete(false)}>
                            Cancelar Operación
                        </button>
                        <button className="fastech-btn-modal-confirm" onClick={ejecutarEliminacionReal}>
                            Confirmar Eliminación
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
}

export default Dashboard;  