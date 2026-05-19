import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventario from './pages/Inventario';
import Productos from './pages/Productos';

function App() {

    return (

        <BrowserRouter>

            <Routes>
              <Route path='/' element={<Login />} />

                <Route path='/dashboard' element={<Dashboard />} />

                <Route path='/inventario' element={<Inventario />} />

                <Route path='/productos' element={<Productos />} />

            </Routes>

             </BrowserRouter>
    );
}

export default App;