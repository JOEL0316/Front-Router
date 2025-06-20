// schedules.js - Corrige al inicio del archivo
const SCHEDULES_API_URL = 'http://localhost:3006/api/schedules';
const DEVICES_API_FOR_SCHEDULES = 'http://localhost:3006/api/devices'; // Nombre diferente

async function loadSchedules() {
    try {
        const response = await authFetch(SCHEDULES_API_URL);
        const schedules = await response.json();
        renderSchedules(schedules);
    } catch (error) {
        console.error('Error loading schedules:', error);
        alert('Error al cargar horarios');
    }
}

async function loadDevicesForSchedule() {
    try {
        const response = await authFetch(DEVICES_API_URL);
        const devices = await response.json();
        renderDeviceOptions(devices);
    } catch (error) {
        console.error('Error loading devices:', error);
    }
}

function renderSchedules(schedules) {
    const tbody = document.getElementById('schedules-list');
    tbody.innerHTML = schedules.map(schedule => `
        <tr>
            <td>${schedule.name}</td>
            <td>${schedule.targetType === 'device' ? 
                `${schedule.deviceName || 'Dispositivo'} (${schedule.deviceIp || 'IP'})` : 
                schedule.website}</td>
            <td>${schedule.startTime} - ${schedule.endTime}</td>
            <td>${schedule.action === 'block' ? 'Bloquear' : 'Permitir'}</td>
            <td><span class="badge ${schedule.active ? 'bg-success' : 'bg-secondary'}">
                ${schedule.active ? 'Activo' : 'Inactivo'}
            </span></td>
            <td>
                <button class="btn btn-sm ${schedule.active ? 'btn-warning' : 'btn-success'}" 
                        onclick="toggleSchedule('${schedule.id}', ${schedule.active})">
                    ${schedule.active ? 'Desactivar' : 'Activar'}
                </button>
                <button class="btn btn-sm btn-danger" 
                        onclick="deleteSchedule('${schedule.id}')">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

function renderDeviceOptions(devices) {
    const select = document.getElementById('device-target');
    select.innerHTML = devices.map(device => `
        <option value="${device.id}">${device.name || 'Dispositivo'} (${device.ip})</option>
    `).join('');
}

async function saveSchedule() {
    const formData = {
        name: document.getElementById('rule-name').value,
        targetType: document.getElementById('target-type').value,
        deviceId: document.getElementById('device-target').value,
        website: document.getElementById('website-target').value,
        startTime: document.getElementById('start-time').value,
        endTime: document.getElementById('end-time').value,
        action: document.getElementById('action-type').value,
        active: document.getElementById('active-rule').checked
    };
    
    try {
        const response = await authFetch(SCHEDULES_API_URL, {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            $('#scheduleModal').modal('hide');
            loadSchedules();
        }
    } catch (error) {
        console.error('Error saving schedule:', error);
        alert('Error al guardar horario');
    }
}

async function toggleSchedule(id, isActive) {
    try {
        const response = await authFetch(`${SCHEDULES_API_URL}/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ active: !isActive })
        });
        
        if (response.ok) loadSchedules();
    } catch (error) {
        console.error('Error toggling schedule:', error);
        alert('Error al cambiar estado');
    }
}

async function deleteSchedule(id) {
    if (!confirm('¿Eliminar este horario?')) return;
    
    try {
        const response = await authFetch(`${SCHEDULES_API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) loadSchedules();
    } catch (error) {
        console.error('Error deleting schedule:', error);
        alert('Error al eliminar horario');
    }
}

// Inicialización
if (document.getElementById('schedules-section')) {
    loadSchedules();
    loadDevicesForSchedule();
    document.getElementById('save-schedule').addEventListener('click', saveSchedule);
    document.getElementById('target-type').addEventListener('change', function() {
        document.getElementById('device-target-container').classList.toggle('d-none', this.value !== 'device');
        document.getElementById('website-target-container').classList.toggle('d-none', this.value === 'device');
    });
}