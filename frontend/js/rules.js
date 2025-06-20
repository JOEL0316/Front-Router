// rules.js
const RULES_API_URL = 'http://localhost:3006/api/rules';

async function loadRules() {
    try {
        const response = await authFetch(RULES_API_URL); // Usa authFetch
        const rules = await response.json();
        renderRules(rules);
    } catch (error) {
        console.error('Error loading rules:', error);
        alert('Error al cargar reglas');
    }
}

function renderRules(rules) {
    const tbody = document.getElementById('rules-list');
    tbody.innerHTML = rules.map(rule => `
        <tr>
            <td>${rule.website}</td>
            <td><span class="badge ${rule.blocked ? 'bg-danger' : 'bg-success'}">
                ${rule.blocked ? 'Bloqueado' : 'Permitido'}
            </span></td>
            <td>
                <button class="btn btn-sm ${rule.blocked ? 'btn-success' : 'btn-warning'}" 
                        onclick="toggleRule('${rule.id}', ${rule.blocked})">
                    ${rule.blocked ? 'Permitir' : 'Bloquear'}
                </button>
                <button class="btn btn-sm btn-danger" 
                        onclick="deleteRule('${rule.id}')">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

async function addRule() {
    const website = document.getElementById('new-rule').value.trim();
    if (!website) return alert('Ingresa un sitio web');
    
    try {
        const response = await authFetch(RULES_API_URL, {
            method: 'POST',
            body: JSON.stringify({ website, blocked: true })
        });
        
        if (response.ok) {
            document.getElementById('new-rule').value = '';
            loadRules();
        }
    } catch (error) {
        console.error('Error adding rule:', error);
        alert('Error al agregar regla');
    }
}

async function toggleRule(id, isBlocked) {
    try {
        const response = await authFetch(`${RULES_API_URL}/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ blocked: !isBlocked })
        });
        
        if (response.ok) loadRules();
    } catch (error) {
        console.error('Error toggling rule:', error);
        alert('Error al cambiar estado');
    }
}

async function deleteRule(id) {
    if (!confirm('¿Eliminar esta regla?')) return;
    
    try {
        const response = await authFetch(`${RULES_API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) loadRules();
    } catch (error) {
        console.error('Error deleting rule:', error);
        alert('Error al eliminar regla');
    }
}

// Inicialización
if (document.getElementById('rules-section')) {
    loadRules();
    document.getElementById('add-rule').addEventListener('click', addRule);
}