import React, { useEffect, useState } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import Sidebar from '../components/Sidebar';

export default function Productos() {

    const [productos, setProductos] = useState([]);

    useEffect(() => {

        obtenerProductos();

    }, []);

    const obtenerProductos = async () => {

        const res = await API.get('/productos');

        setProductos(res.data);
    };

    return (

        <div className='dashboard'>

            <Sidebar />

            <div className='contenido'>

                <h1>Catálogo de Productos</h1>

                <div className='productos-grid'>

                    {productos.map(producto => (

                        <ProductCard
                            key={producto.id}
                            producto={producto}
                        />

                    ))}

                </div>

            </div>

        </div>

        );
}