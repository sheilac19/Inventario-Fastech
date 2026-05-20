import React, { useState } from 'react';
import '../App.css'; 

// 🔥 COMPONENTE INTEGRADO: Recibe productos y setProductos como PROPS y sincroniza con MariaDB
function Inventario({ productos = [], setProductos }) {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: '' });
    const [idEdicion, setIdEdicion] = useState(null);

    // Control de modal de borrado en Inventario
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState(null);

    const lanzarAlerta = (mensaje, tipo = 'error') => {
        setAlerta({ mostrar: true, mensaje, tipo });
        setTimeout(() => {
            setAlerta({ mostrar: false, mensaje: '', tipo: '' });
        }, 5000);
    };

    // 🔥 MANEJADOR DE PERSISTENCIA (GUARDAR / EDITAR) EN SERVER-BACKEND
    const handleGuardarProducto = async (e) => {
        e.preventDefault();
        
        // 1. VALIDACIÓN: Campos Vacíos (Ahora se ejecuta libremente sin el bloqueo del navegador)
        if (!nombre.trim() || precio === null || precio === undefined || precio === '' || stock === null || stock === undefined || stock === '') {
            lanzarAlerta("Error de validación: Todos los campos del formulario son estrictamente obligatorios.");
            return;
        }

        const precioNum = parseFloat(precio);
        const stockNum = parseInt(stock, 10);

        // 2. VALIDACIÓN: Precios menores o iguales a 0
        if (isNaN(precioNum) || precioNum <= 0) {
            lanzarAlerta("Operación rechazada: El precio asignado al producto debe ser estrictamente mayor a 0.");
            return;
        }

        // 3. VALIDACIÓN: Stocks negativos
        if (isNaN(stockNum) || stockNum < 0) {
            lanzarAlerta("Operación rechazada: El stock de inventario ingresado no puede ser un número negativo.");
            return;
        }

        if (idEdicion !== null) {
            // ==========================================
            // MODO EDICIÓN: Petición PUT al Servidor
            // ==========================================
            const productoEditado = {
                nombre: nombre.trim(),
                precio: precioNum,
                stock: stockNum
            };

            try {
                const response = await fetch(`http://localhost:5000/api/productos/${idEdicion}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productoEditado)
                });

                if (response.ok) {
                    const productosActualizados = productos.map((prod) => {
                        if (prod.id === idEdicion) {
                            return { 
                                ...prod, 
                                nombre: nombre.trim(), 
                                precio: precioNum.toFixed(2), 
                                stock: stockNum 
                            };
                        }
                        return prod;
                    });
                    setProductos(productosActualizados);
                    setIdEdicion(null);
                    lanzarAlerta("Sistema Fastech: El producto ha sido actualizado exitosamente en la base de datos.", "exito");
                    
                    setNombre(''); setPrecio(''); setStock('');
                } else {
                    lanzarAlerta("Error: No se pudo actualizar el registro en la base de datos MySQL.");
                }
            } catch (error) {
                console.error("Error en la conexión fetch de actualización:", error);
                lanzarAlerta("Error de comunicación: Falla al conectar con el servidor backend.");
            }
        } else {
            // ==========================================
            // MODO CREACIÓN: Petición POST al Servidor
            // ==========================================
            const nuevoProducto = { 
                nombre: nombre.trim(), 
                precio: precioNum, 
                stock: stockNum
            };

            try {
                const response = await fetch('http://localhost:5000/api/productos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoProducto)
                });

                if (response.ok) {
                    const resultadoDB = await response.json();
                    
                    const productoFormateado = {
                        id: resultadoDB.id,
                        nombre: resultadoDB.nombre,
                        precio: resultadoDB.precio,
                        stock: resultadoDB.stock,
                        imagen: resultadoDB.imagen // Mapeo de la imagen
                    };

                    setProductos([productoFormateado, ...productos]);
                    lanzarAlerta("Sistema Fastech: Nuevo producto registrado y almacenado correctamente en MySQL.", "exito");
                    
                    setNombre(''); setPrecio(''); setStock('');
                } else {
                    lanzarAlerta("Error: La base de datos rechazó el almacenamiento del producto.");
                }
            } catch (error) {
                console.error("Error al guardar:", error);
                lanzarAlerta("Error de comunicación: No se pudo establecer conexión con el backend.");
            }
        }
    };

    const iniciarEdicion = (producto) => {
        setIdEdicion(producto.id);
        setNombre(producto.nombre);
        setPrecio(parseFloat(producto.precio));
        setStock(parseInt(producto.stock, 10));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const solicitarEliminacion = (producto) => {
        setProductoAEliminar(producto);
        setShowConfirmDelete(true);
    };

    const ejecutarEliminacionReal = async () => {
        if (productoAEliminar) {
            try {
                const response = await fetch(`http://localhost:5000/api/productos/${productoAEliminar.id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    const listaFiltrada = productos.filter(prod => prod.id !== productoAEliminar.id);
                    setProductos(listaFiltrada);
                    lanzarAlerta(`Sistema Fastech: El producto "${productoAEliminar.nombre}" ha sido removido del servidor y la DB.`, "exito");
                    
                    if (idEdicion === productoAEliminar.id) {
                        setIdEdicion(null);
                        setNombre(''); setPrecio(''); setStock('');
                    }
                } else {
                    lanzarAlerta("Error: No se pudo completar la eliminación en el servidor.");
                }
            } catch (error) {
                console.error("Error al eliminar:", error);
                lanzarAlerta("Error de comunicación: El servidor remoto no responde.");
            }

            setShowConfirmDelete(false);
            setProductoAEliminar(null);
        }
    };

    const cancelarEdicion = () => {
        setIdEdicion(null);
        setNombre(''); setPrecio(''); setStock('');
    };

    const productosFiltrados = productos.filter((producto) => 
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="admin-inventory-container">
            {/* Barra de Navegación Unificada */}
            <nav className="main-navbar">
                <div className="navbar-logo">FASTECH</div>
                <div className="navbar-menu-links">
                    <a href="/dashboard" className="nav-link-btn">🏠 Inicio</a>
                    <a href="/inventario" className="nav-link-btn active">📦 Gestión de Inventario</a>
                    <a href="/" className="nav-link-btn logout-btn" onClick={() => localStorage.clear()}>🚪 Salir</a>
                </div>
            </nav>

            <div className="inventory-dashboard-content">
                {/* Cabecera del Panel */}
                <div className="inventory-header">
                    <div>
                        <h2>Panel de Control: Inventario General</h2>
                        <p className="subtitle">Gestión de stock, precios y catálogo activo de la empresa.</p>
                    </div>
                    <div className="total-badge-box">
                        {busqueda ? 'Productos encontrados: ' : 'Total de productos: '}
                        <span className="badge-count-num">{productosFiltrados.length}</span>
                    </div>
                </div>

                {/* Sistema de Alertas */}
                {alerta.mostrar && (
                    <div className={`fastech-sistema-alerta alert-${alerta.tipo}`}>
                        <div className="alert-icon-box">{alerta.tipo === 'exito' ? '✅' : '⚠️'}</div>
                        <div className="alert-text-box" style={{ color: '#0f172a' }}>{alerta.mensaje}</div>
                    </div>
                )}

                {/* Sección de Herramientas: Buscador + Formulario */}
                <div className="inventory-tools-grid">
                    <div className="search-wrapper-box">
                        <label className="section-small-label">Buscador en Tiempo Real</label>
                        <input 
                            type="text" 
                            placeholder="🔍 Buscar producto por nombre..." 
                            className="inventory-input-search"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    
                    <div className="inventory-form-card">
                        <h3>{idEdicion !== null ? '✏️ Modo Edición Activo' : '🛠️ Registrar Nuevo Artículo'}</h3>
                        <form className="inventory-grid-form" onSubmit={handleGuardarProducto} noValidate>
                            <div className="input-field-group">
                                <label>Nombre del Producto</label>
                                <input 
                                    type="text" 
                                    placeholder="Ej. Teclado Mecánico RGB" 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                />
                            </div>
                            <div className="input-field-group">
                                <label>Precio de Venta ($)</label>
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="0.00" 
                                    value={precio} 
                                    onChange={(e) => setPrecio(e.target.value)} 
                                />
                            </div>
                            <div className="input-field-group">
                                <label>Unidades en Stock</label>
                                <input 
                                    type="number" 
                                    placeholder="0" 
                                    value={stock} 
                                    onChange={(e) => setStock(e.target.value)} 
                                />
                            </div>
                            
                            <div className="form-action-buttons">
                                <button type="submit" className="btn-submit-inventory">
                                    {idEdicion !== null ? 'Actualizar' : 'Guardar Producto'}
                                </button>
                                {idEdicion !== null && (
                                    <button type="button" className="btn-cancel-inventory" onClick={cancelarEdicion}>Cancelar</button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                {/* Tabla de Inventario Unificada con Imágenes Incorporadas */}
                <div className="table-responsive-wrapper">
                    <table className="fastech-premium-table" style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '45%', textAlign: 'left', padding: '16px 20px' }}>PRODUCTO</th>
                                <th style={{ width: '15%', textAlign: 'center', padding: '16px 20px' }}>PRECIO</th>
                                <th style={{ width: '15%', textAlign: 'center', padding: '16px 20px' }}>STOCK</th>
                                <th style={{ width: '25%', textAlign: 'center', padding: '16px 20px' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.length > 0 ? (
                                productosFiltrados.map((producto) => (
                                    <tr key={producto.id}>
                                        <td style={{ width: '45%', padding: '16px 20px', verticalAlign: 'middle' }}>
                                            <div className="product-cell-container" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div className="product-table-img-wrapper" style={{ width: '42px', height: '42px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid #334155' }}>
                                                    <img 
                                                        src={producto.imagen || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=100'} 
                                                        alt={producto.nombre} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=100';
                                                        }}
                                                    />
                                                </div>
                                                <div className="product-cell-name" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <strong style={{ color: '#ffffff', fontSize: '14px' }}>{producto.nombre}</strong>
                                                    <span className="product-id-sub" style={{ color: '#64748b', fontSize: '11px' }}>ID: #{producto.id.toString().slice(-6)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="price-cell-color" style={{ width: '15%', padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                            ${producto.precio}
                                        </td>
                                        
                                        <td style={{ width: '15%', padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                            <span className="stock-status-num" style={{
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                backgroundColor: parseInt(producto.stock, 10) > 10 ? '#10b981' : '#ef4444',
                                                color: '#ffffff'
                                            }}>
                                                {parseInt(producto.stock, 10)} uds
                                            </span>
                                        </td>

                                        <td style={{ width: '25%', padding: '16px 20px', verticalAlign: 'middle', textAlign: 'center' }}>
                                            <div className="actions-cell-gap" style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                                                <button className="table-btn-edit" onClick={() => iniciarEdicion(producto)}>✏️ Editar</button>
                                                <button className="table-btn-delete" onClick={() => solicitarEliminacion(producto)}>🗑️ Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="empty-table-text" style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
                                        No se encontraron productos que coincidan con su criterio de búsqueda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* VENTANA FLOTANTE DE CONFIRMACIÓN DE ELIMINACIÓN */}
            {showConfirmDelete && productoAEliminar && (
                <div className="fastech-formal-modal-overlay">
                    <div className="fastech-formal-modal-box">
                        <div className="fastech-formal-modal-header text-danger">
                            ⚠️ Confirmación de Seguridad
                        </div>
                        <div className="fastech-formal-modal-body">
                            <p>¿Está seguro de que desea remover permanentemente este artículo del inventario global?</p>
                            <blockquote className="fastech-formal-blockquote">
                                <strong>Artículo:</strong> {productoAEliminar.nombre} <br />
                                <strong>Stock Actual:</strong> {productoAEliminar.stock} unidades
                            </blockquote>
                        </div>
                        <div className="fastech-formal-modal-footer">
                            <button className="fastech-btn-modal-cancel" onClick={() => setShowConfirmDelete(false)}>
                                Cancelar
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

export default Inventario;