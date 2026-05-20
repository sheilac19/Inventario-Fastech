import React, { useState, useEffect } from 'react'; // 🔥 Importamos useEffect
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Productos from './pages/Productos';

function App() {
    // Arreglo base inicial por si el almacenamiento está vacío
    const productosIniciales = [
        {
            id: 1,
            nombre: "Laptop Workstation Pro",
            precio: "1450.00",
            stock: 8,
            imagen: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926&auto=format&fit=crop",
            descripcion: "Procesador de última generación de 14 núcleos, 32GB de memoria RAM DDR5 y 1TB SSD NVMe. Ideal para desarrollo de software pesado, diseño 3D y entornos virtuales de alto rendimiento."
        },
        {
            id: 2,
            nombre: "Teclado Mecánico RGB",
            precio: "89.99",
            stock: 20,
            imagen: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1780&auto=format&fit=crop",
            descripcion: "Switches mecánicos personalizados de alta durabilidad, retroiluminación RGB por tecla configurable por software y distribución ISO."
        },
        {
            id: 3,
            nombre: "Mouse Gamer Ultra",
            precio: "55.00",
            stock: 15,
            imagen: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=1965&auto=format&fit=crop",
            descripcion: "Sensor óptico de alta precisión con hasta 16,000 DPI ajustables, switches mecánicos de respuesta inmediata."
        },
        {
            id: 4,
            nombre: "Monitor Curvo 32\"",
            precio: "420.00",
            stock: 5,
            imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070&auto=format&fit=crop",
            descripcion: "Pantalla curva de 32 pulgadas con resolución Quad HD (2K), tasa de refresco de 165Hz."
        },
        {
            id: 5,
            nombre: "Audífonos Studio",
            precio: "180.00",
            stock: 12,
            imagen: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=2070&auto=format&fit=crop",
            descripcion: "Audio de alta resolución con cancelación activa de ruido (ANC)."
        },
        {
            id: 7,
            nombre: "Micrófono Condensador USB",
            precio: "125.00",
            stock: 10,
            imagen: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1770&auto=format&fit=crop",
            descripcion: "Patrón de captación cardioide ideal para streaming y grabación de voz."
        },
        {
            id: 8,
            nombre: "Cámara Web 4K Ultra",
            precio: "95.00",
            stock: 14,
            imagen: "https://images.unsplash.com/photo-1603184017968-953f59cd2e37?q=80&w=1770&auto=format&fit=crop",
            descripcion: "Resolución Ultra HD a 30 FPS con corrección automática de iluminación difusa."
        },
        {
            id: 10,
            nombre: "Router Wi-Fi 6 Mesh",
            precio: "140.00",
            stock: 7,
            imagen: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1770&auto=format&fit=crop",
            descripcion: "Tecnología de red de doble banda con velocidades de hasta 3000 Mbps."
        },
        {
            id: 11,
            nombre: "Tarjeta Gráfica RTX 4060",
            precio: "385.00",
            stock: 4,
            imagen: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1770&auto=format&fit=crop",
            descripcion: "8GB de memoria GDDR6, arquitectura Ada Lovelace y soporte completo para Ray Tracing."
        },
        {
            id: 12,
            nombre: "Gabinete ATX Premium",
            precio: "110.00",
            stock: 9,
            imagen: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=1770&auto=format&fit=crop",
            descripcion: "Chasis con panel lateral de vidrio templado, excelente sistema de gestión de cables."
        }
    ];

    // 🔥 CORRECCIÓN: Intentar leer del localStorage primero al iniciar la app
    const [productos, setProductos] = useState(() => {
        const guardados = localStorage.getItem('fastech_productos');
        return guardados ? JSON.parse(guardados) : productosIniciales;
    });

    // 🔥 NUEVO: Guardar en localStorage de forma automática cada vez que cambie algo
    useEffect(() => {
        localStorage.setItem('fastech_productos', JSON.stringify(productos));
    }, [productos]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/dashboard' element={<Dashboard productos={productos} setProductos={setProductos} />} />
                <Route path='/inventario' element={<Inventario productos={productos} setProductos={setProductos} />} />
                <Route path='/productos' element={<Productos />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;