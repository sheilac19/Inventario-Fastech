import React, { useState } from 'react';
import '../App.css'; 

function Inventario() {
    const [productos, setProductos] = useState([
        { id: 1, nombre: "Laptop Workstation Pro", precio: "1450.00", stock: 8 },
        { id: 2, nombre: "Teclado Mecánico RGB", precio: "89.99", stock: 20 },
        { id: 3, nombre: "Mouse Gamer Ultra", precio: "55.00", stock: 15 },
        { id: 4, nombre: "Monitor Curvo 32\"", precio: "420.00", stock: 5 },
        { id: 5, nombre: "Audífonos Studio", precio: "180.00", stock: 12 }
    ]);

    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [alerta, setAlerta] = useState({ mostrar: false, mensaje: '', tipo: '' });
    const [idEdicion, setIdEdicion] = useState(null);

    // ⭐ NUEVOS ESTADOS: Control de modal de borrado en Inventario
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
            const nuevoProducto = { id: Date.now(), nombre: nombre.trim(), precio: precioNum.toFixed(2), stock: stockNum };
            setProductos([...productos, nuevoProducto]);
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

    // ⭐ PASO 1: Disparador formal en inventario
    const solicitarEliminacion = (producto) => {
        setProductoAEliminar(producto);
        setShowConfirmDelete(true);
    };

    // ⭐ PASO 2: Borrado seguro desde el modal
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

    const productosFiltrados = productos.filter((producto) => 
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="inv-sect-container">
            <nav className="main-navbar">
                <div className="navbar-logo">FASTECH</div>
                <div className="navbar-menu-links">
                    <a href="/dashboard">🏠 Inicio</a>
                    <a href="/inventario">📦 Gestión de Inventario</a>
                    <a href="/" onClick={() => localStorage.clear()}>🚪 Salir</a>
                </div>
            </nav>

            <div className="inv-sect-content">
                <h2>Inventario</h2>
                <p className="inv-sect-counter">
                    {busqueda ? 'Productos encontrados: ' : 'Total de productos: '}
                    <strong>{productosFiltrados.length}</strong>
                </p>

                {alerta.mostrar && (
                    <div className={`fastech-sistema-alerta alert-${alerta.tipo}`}>
                        <div className="alert-icon-box">{alerta.tipo === 'exito' ? '✅' : '⚠️'}</div>
                        <div className="alert-text-box">{alerta.mensaje}</div>
                    </div>
                )}

                <div className="inv-sect-toolbar">
                    <input 
                        type="text" 
                        placeholder="🔍 Buscar producto por nombre..." 
                        className="inv-sect-search"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    
                    <form className="inv-sect-form" onSubmit={handleGuardarProducto}>
                        <input type="text" placeholder="Nombre del producto" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        <input type="number" step="0.01" placeholder="Precio" value={precio} onChange={(e) => setPrecio(e.target.value)} />
                        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} />
                        <button type="submit" className="inv-sect-btn-save">
                            {idEdicion !== null ? 'Actualizar Producto' : 'Guardar Producto'}
                        </button>
                        {idEdicion !== null && (
                            <button type="button" className="inv-sect-btn-cancel" onClick={cancelarEdicion}>Cancelar</button>
                        )}
                    </form>
                </div>

                <div className="inv-sect-table-card">
                    <table className="inv-sect-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.length > 0 ? (
                                productosFiltrados.map((producto) => (
                                    <tr key={producto.id}>
                                        <td>{producto.nombre}</td>
                                        <td className="inv-sect-price">${producto.precio}</td>
                                        <td className="inv-sect-stock">{producto.stock}</td>
                                        <td>
                                            <div className="inv-sect-actions">
                                                <button className="inv-sect-btn-edit" onClick={() => iniciarEdicion(producto)}>Editar</button>
                                                {/* ⭐ MODIFICADO: Llama al modal formal */}
                                                <button className="inv-sect-btn-delete" onClick={() => solicitarEliminacion(producto)}>Eliminar</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                                        No se encontraron productos que coincidan con "{busqueda}".
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ⭐ NUEVO: VENTANA FLOTANTE FORMAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
            {showConfirmDelete && productoAEliminar && (
                <div className="fastech-formal-modal-overlay">
                    <div className="fastech-formal-modal-box">
                        <div className="fastech-formal-modal-header text-danger">
                            ⚠️ Confirmación de Seguridad de Sistema
                        </div>
                        <div className="fastech-formal-modal-body">
                            <p>¿Está seguro de que desea remover permanentemente del registro el siguiente artículo?</p>
                            <blockquote className="fastech-formal-blockquote">
                                <strong>Artículo:</strong> {productoAEliminar.nombre} <br />
                                <strong>Inventario Actual:</strong> {productoAEliminar.stock ?? 'N/A'} uds.
                            </blockquote>
                            <p className="fastech-formal-subtext">Esta acción alterará el estado global del sistema de inventario de Fastech.</p>
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

export default Inventario;