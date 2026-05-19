import React, { useState } from 'react';
import '../App.css'; 

function Dashboard() {
    const [productos, setProductos] = useState([
        {
            id: 1,
            nombre: "Laptop Workstation Pro",
            precio: "1450.00",
            imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop",
            descripcion: "Procesador de última generación de 14 núcleos, 32GB de memoria RAM DDR5 y 1TB SSD NVMe. Ideal para desarrollo de software pesado, diseño 3D y entornos virtuales de alto rendimiento."
        },
        {
            id: 2,
            nombre: "Teclado Mecánico RGB",
            precio: "89.99",
            imagen: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1780&auto=format&fit=crop",
            descripcion: "Switches mecánicos personalizados de alta durabilidad, retroiluminación RGB por tecla configurable por software y distribución ISO."
        },
        {
            id: 3,
            nombre: "Mouse Gamer Ultra",
            precio: "55.00",
            imagen: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1965&auto=format&fit=crop",
            descripcion: "Sensor óptico de alta precisión con hasta 16,000 DPI ajustables, switches mecánicos de respuesta inmediata."
        },
        {
            id: 4,
            nombre: "Monitor Curvo 32\"",
            precio: "420.00",
            imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070&auto=format&fit=crop",
            descripcion: "Pantalla curva de 32 pulgadas con resolución Quad HD (2K), tasa de refresco de 165Hz."
        },
        {
            id: 5,
            nombre: "Audífonos Studio",
            precio: "180.00",
            imagen: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=2070&auto=format&fit=crop",
            descripcion: "Audio de alta resolución con cancelación activa de ruido (ANC)."
        },
        {
            id: 6,
            nombre: "Silla Pro Gaming",
            precio: "299.00",
            imagen: "https://images.unsplash.com/photo-1598550476439-6847785fce6e?q=80&w=1770&auto=format&fit=crop",
            descripcion: "Diseño ergonómico con soporte lumbar y cervical ajustable. Reclinación de hasta 180 grados."
        },
        {
            id: 7,
            nombre: "Micrófono Condensador USB",
            precio: "125.00",
            imagen: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1770&auto=format&fit=crop",
            descripcion: "Patrón de captación cardioide ideal para streaming y grabación de voz."
        },
        {
            id: 8,
            nombre: "Cámara Web 4K Ultra",
            precio: "95.00",
            imagen: "https://images.unsplash.com/photo-1603184017968-953f59cd2e37?q=80&w=1770&auto=format&fit=crop",
            descripcion: "Resolución Ultra HD a 30 FPS con corrección automática de iluminación difusa."
        },
        {
            id: 9,
            nombre: "Disco Duro Externo 2TB",
            precio: "75.00",
            imagen: "https://images.unsplash.com/photo-1601524909162-be87252be298?q=80&w=1770&auto=format&fit=crop",
            descripcion: "Almacenamiento masivo portátil con conexión USB 3.2 de alta velocidad."
        },
        {
            id: 10,
            nombre: "Router Wi-Fi 6 Mesh",
            precio: "140.00",
            imagen: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1770&auto=format&fit=crop",
            descripcion: "Tecnología de red de doble banda con velocidades de hasta 3000 Mbps."
        },
        {
            id: 11,
            nombre: "Tarjeta Gráfica RTX 4060",
            precio: "385.00",
            imagen: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1770&auto=format&fit=crop",
            descripcion: "8GB de memoria GDDR6, arquitectura Ada Lovelace y soporte completo para Ray Tracing."
        },
        {
            id: 12,
            nombre: "Gabinete ATX Premium",
            precio: "110.00",
            imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1770&auto=format&fit=crop",
            descripcion: "Chasis con panel lateral de vidrio templado, excelente sistema de gestión de cables."
        }
    ]);

    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [idEdicion, setIdEdicion] = useState(null);

    const [selectedProducto, setSelectedProducto] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: '' });

    // ⭐ NUEVOS ESTADOS: Para controlar el cuadro de confirmación formal
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState(null);

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

    // ⭐ PASO 1: En lugar de eliminar directo, abre el modal formal
    const solicitarEliminacion = (producto) => {
        setProductoAEliminar(producto);
        setShowConfirmDelete(true);
    };

    // ⭐ PASO 2: Confirmación formal ejecutada por el usuario
    const ejecutarEliminacionReal = () => {
        if (productoAEliminar) {
            const listaFiltrada = productos.filter(prod => prod.id !== productoAEliminar.id);
            setProductos(listaFiltrada);
            lanzarAlerta(`Sistema Fastech: El producto "${productoAEliminar.nombre}" ha sido removido con éxito.`, "exito");
            
            if (idEdicion === productoAEliminar.id) cancelarEdicion();
            
            // Cerrar y limpiar estados
            setShowConfirmDelete(false);
            setProductoAEliminar(null);
        }
    };

    const iniciarEdicion = (producto) => {
        setIdEdicion(producto.id);
        setNombre(producto.nombre);
        setPrecio(producto.precio);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleActualizarProducto = (e) => {
        e.preventDefault();
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
            <a href="/dashboard">🏠 Inicio</a>
            <a href="/inventario">📦 Gestión de Inventario</a>
            <a href="/" onClick={() => localStorage.clear()}>🚪 Salir</a>
          </div>
        </nav>

        <div className="dashboard-header-section">
          <h2>Bienvenida, {localStorage.getItem('userName') || 'Sheila'}</h2>
          <span className="admin-badge">{localStorage.getItem('userRole') || 'admin'}</span>
        </div>

        {alerta.mostrar && (
            <div className={`fastech-sistema-alerta alert-${alerta.tipo}`} style={{ margin: '0 40px 20px 40px' }}>
                <div className="alert-icon-box">{alerta.tipo === 'exito' ? '✅' : '⚠️'}</div>
                <div className="alert-text-box">{alerta.mensaje}</div>
            </div>
        )}

        {idEdicion !== null && (
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
                  <button className="action-btn-edit" onClick={() => iniciarEdicion(producto)}>Editar</button>
                  {/* ⭐ MODIFICADO: Llama al modal formal */}
                  <button className="action-btn-delete" onClick={() => solicitarEliminacion(producto)}>Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>

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
                  <button className="modal-action-btn" onClick={cerrarModal}>Cerrar Vista de Detalles</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ⭐ NUEVO: VENTANA FLOTANTE FORMAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
        {showConfirmDelete && productoAEliminar && (
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