import React, { useState } from 'react';
import '../App.css'; 

// 🔥 CORRECCIÓN: Ahora el componente recibe productos y setProductos como PROPS desde el componente padre
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

    const handleGuardarProducto = (e) => {
        e.preventDefault();
        if (!nombre.trim() || !precio.toString().trim() || !stock.toString().trim()) {
            lanzarAlerta("Error de validación: Todos los campos del formulario son estrictamente obligatorios.");
            return;
        }

        const precioNum = parseFloat(precio);
        const stockNum = parseInt(stock, 10);

        if (precioNum <= 0) {
            lanzarAlerta("Operación rechazada: El precio asignado al producto debe ser estrictamente mayor a 0.");
            return;
        }

        if (stockNum < 0) {
            lanzarAlerta("Operación rechazada: El stock de inventario ingresado no puede ser un número negativo.");
            return;
        }

        if (idEdicion !== null) {
            // Actualización de producto existente
            const productosActualizados = productos.map((prod) => {
                if (prod.id === idEdicion) {
                    return { ...prod, nombre: nombre.trim(), precio: precioNum.toFixed(2), stock: stockNum };
                }
                return prod;
            });
            setProductos(productosActualizados);
            setIdEdicion(null);
            lanzarAlerta("Sistema Fastech: El producto ha sido actualizado exitosamente en el inventario.", "exito");
        } else {
            // 🔥 ADICIÓN CORREGIDA: Se inserta al principio del arreglo global
            const nuevoProducto = { 
                id: Date.now(), 
                nombre: nombre.trim(), 
                precio: precioNum.toFixed(2), 
                stock: stockNum,
                // Imagen tecnológica temporal por defecto para la tienda
                imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1770&auto=format&fit=crop" 
            };
            setProductos([nuevoProducto, ...productos]);
            lanzarAlerta("Sistema Fastech: Nuevo producto registrado y almacenado correctamente.", "exito");
        }

        setNombre('');
        setPrecio('');
        setStock('');
    };

    const iniciarEdicion = (producto) => {
        setIdEdicion(producto.id);
        setNombre(producto.nombre);
        setPrecio(producto.precio);
        setStock(producto.stock);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const solicitarEliminacion = (producto) => {
        setProductoAEliminar(producto);
        setShowConfirmDelete(true);
    };

    const ejecutarEliminacionReal = () => {
        if (productoAEliminar) {
            const listaFiltrada = productos.filter(prod => prod.id !== productoAEliminar.id);
            setProductos(listaFiltrada);
            lanzarAlerta(`Sistema Fastech: El producto "${productoAEliminar.nombre}" ha sido removido del registro.`, "exito");
            
            if (idEdicion === productoAEliminar.id) {
                setIdEdicion(null);
                setNombre(''); setPrecio(''); setStock('');
            }

            setShowConfirmDelete(false);
            setProductoAEliminar(null);
        }
    };

    const cancelarEdicion = () => {
        setIdEdicion(null);
        setNombre(''); setPrecio(''); setStock('');
    };

    // Filtrado en tiempo real basado en el arreglo que viene de las props
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
                        <form className="inventory-grid-form" onSubmit={handleGuardarProducto}>
                            <div className="input-field-group">
                                <label>Nombre del Producto</label>
                                <input type="text" placeholder="Ej. Teclado Mecánico RGB" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                            </div>
                            <div className="input-field-group">
                                <label>Precio de Venta ($)</label>
                                <input type="number" step="0.01" placeholder="0.00" value={precio} onChange={(e) => setPrecio(e.target.value)} />
                            </div>
                            <div className="input-field-group">
                                <label>Unidades en Stock</label>
                                <input type="number" placeholder="0" value={stock} onChange={(e) => setStock(e.target.value)} />
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

                {/* Tabla de Inventario de Alto Rendimiento */}
                <div className="table-responsive-wrapper">
                    <table className="fastech-premium-table">
                        <thead>
                            <tr>
                                <th>PRODUCTO</th>
                                <th className="text-center">PRECIO</th>
                                <th className="text-center">STOCK</th>
                                <th className="text-right">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.length > 0 ? (
                                productosFiltrados.map((producto) => (
                                    <tr key={producto.id}>
                                        <td className="product-cell-name">
                                            <strong>{producto.nombre}</strong>
                                            <span className="product-id-sub">ID: #{producto.id.toString().slice(-6)}</span>
                                        </td>
                                        <td className="text-center price-cell-color">${producto.precio}</td>
                                        <td className="text-center">
                                            <span className={`stock-status-indicator ${producto.stock > 10 ? 'stock-ok' : 'stock-low'}`}>
                                                {producto.stock} uds
                                            </span>
                                        </td>
                                        <td className="text-right actions-cell-gap">
                                            <button className="table-btn-edit" onClick={() => iniciarEdicion(producto)}>✏️ Editar</button>
                                            <button className="table-btn-delete" onClick={() => solicitarEliminacion(producto)}>🗑️ Eliminar</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="empty-table-text">
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