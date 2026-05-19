import React from 'react';

export default function ProductCard({ producto }) {

    return (

        <div className='product-card'>

            <img
                src={`http://localhost:5000/uploads/${producto.imagen}`}
                alt={producto.nombre}
            />

            <h3>{producto.nombre}</h3>

            <p>${producto.precio}</p>

            <p>{producto.descripcion}</p>

            <span>{producto.categoria}</span>

        </div>
    );
}