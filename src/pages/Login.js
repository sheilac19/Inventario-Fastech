import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Si usas iconos de alguna librería, impórtalos aquí. Si no, usaremos texto.

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para el ojo
    const [loading, setLoading] = useState(false); // Estado para el botón
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Empezamos a cargar

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.auth) {
                localStorage.setItem('userName', data.user.nombre);
                localStorage.setItem('userRole', data.user.rol);
                navigate('/dashboard');
            } else {
                alert("Correo o contraseña incorrectos");
            }
        } catch (error) {
            alert("Error de conexión con el servidor");
        } finally {
            setLoading(false); // Terminamos de cargar pase lo que pase
        }
    };

    return (
        <div className="login-screen">
            <div className="login-box">
                <h1>Fastech System</h1>
                <p>Ingresa tus credenciales para continuar</p>
                
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            placeholder="users@hotmail" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Contraseña</label>
                        <div className="password-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} // Cambia el tipo
                                placeholder="contraseña" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                            />
                            <button 
                                type="button" 
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={`login-button ${loading ? 'btn-loading' : ''}`}
                        disabled={loading} // Evita doble clic
                    >
                        {loading ? "Verificando..." : "Entrar al Sistema"}
                    </button>
                </form>

                <div className="login-footer">
                    <label><input type="checkbox" /> Recordarme</label>
                    <a href="#">¿Olvidaste tu clave?</a>
                </div>
            </div>
        </div>
    );
}

export default Login;