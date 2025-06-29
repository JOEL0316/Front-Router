
// Configuración dinámica para desarrollo/producción
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3006/api'
    : 'https://tu-backend.onrender.com/api';

const AUTH_API_URL = `${API_BASE_URL}/auth`;

const auth = {
    setToken(token) {
        localStorage.setItem('jwt_token', token);
    },
    getToken() {
        return localStorage.getItem('jwt_token');
    },
    removeToken() {
        localStorage.removeItem('jwt_token');
    },
    isAuthenticated() {
        return !!this.getToken();
    }
};

async function authFetch(url, options = {}) {
    const token = auth.getToken();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...options.headers
            }
        });

        if (response.status === 401) {
            auth.removeToken();
            window.location.href = 'login.html';
            return;
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.remove('d-none');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${AUTH_API_URL}/login`, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error en el servidor' }));
            throw new Error(error.message);
        }

        const data = await response.json();
        auth.setToken(data.token);
        window.location.href = 'index.html';
    } catch (error) {
        showError('login-error', error.message);
    }
}

// Modifica la función handleRegister en auth.js
async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;

    if (password !== confirmPassword) {
        showError('register-error', 'Las contraseñas no coinciden');
        return;
    }

    try {
        const response = await fetch(`${AUTH_API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error en el registro' }));
            throw new Error(error.message);
        }

        // Muestra mensaje de éxito y redirige al login
        showError('register-error', '¡Registro exitoso! Redirigiendo...');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);

    } catch (error) {
        showError('register-error', error.message);
    }
}

function checkAuth() {
    const authPages = ['login.html', 'register.html'];
    const isAuthPage = authPages.some(page => window.location.pathname.includes(page));

    if (!auth.isAuthenticated() && !isAuthPage) {
        window.location.replace('login.html');
        return false;
    }

    if (auth.isAuthenticated() && isAuthPage) {
        window.location.replace('index.html');
        return false;
    }

    return true;
}

function handleLogout() {
    auth.removeToken();
    window.location.replace('login.html');
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    setTimeout(checkAuth, 100);
});

// auth.js - Agrega esto al final del archivo
async function authFetch(url, options = {}) {
    const token = auth.getToken();
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            },
            credentials: 'include'
        });

        if (response.status === 401) {
            auth.removeToken();
            window.location.href = 'login.html';
            return;
        }

        return response;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Exporta la función si usas módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { auth, authFetch };
}