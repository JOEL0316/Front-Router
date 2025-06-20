// devices.js
const DEVICES_API_URL = 'https://tu-backend-en-render.com/api';

async function loadDevices() {
    try {
        const response = await authFetch(DEVICES_API_URL); // Usa authFetch
        const devices = await response.json();
        renderDevices(devices);
    } catch (error) {
        console.error('Error loading devices:', error);
        alert('Error al cargar dispositivos');
    }
}

function renderDevices(devices) {
    const tbody = document.getElementById('devices-list');
    tbody.innerHTML = devices.map(device => `
        <tr>
            <td>${device.name || 'Desconocido'}</td>
            <td>${device.ip}</td>
            <td><span class="badge ${device.blocked ? 'bg-danger' : 'bg-success'}">
                ${device.blocked ? 'Bloqueado' : 'Activo'}
            </span></td>
            <td>
                <button class="btn btn-sm ${device.blocked ? 'btn-success' : 'btn-warning'}" 
                        onclick="toggleDevice('${device.id}', ${device.blocked})">
                    ${device.blocked ? 'Permitir' : 'Bloquear'}
                </button>
            </td>
        </tr>
    `).join('');
}

async function toggleDevice(id, isBlocked) {
    try {
        const response = await authFetch(`${DEVICES_API_URL}/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ blocked: !isBlocked })
        });
        
        if (response.ok) loadDevices();
    } catch (error) {
        console.error('Error toggling device:', error);
        alert('Error al cambiar estado');
    }
}

// Inicialización
if (document.getElementById('devices-section')) {
    loadDevices();
    document.getElementById('refresh-devices').addEventListener('click', loadDevices);
}