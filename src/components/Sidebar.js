import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {

    return (

        <div className='sidebar'>

            <h2>FASTECH</h2>

            <Link to='/dashboard'>Dashboard</Link>

            <Link to='/inventario'>Inventario</Link>

            <Link to='/productos'>Productos</Link>

        </div>

         );
}
