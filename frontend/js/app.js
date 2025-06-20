document.addEventListener('DOMContentLoaded', function () {
    // Solo ejecutar en la página principal
    if (!document.getElementById('devices-section')) return;

    // Configurar navegación entre pestañas
    const devicesTab = document.getElementById('devices-tab');
    const rulesTab = document.getElementById('rules-tab');
    const schedulesTab = document.getElementById('schedules-tab');

    const devicesSection = document.getElementById('devices-section');
    const rulesSection = document.getElementById('rules-section');
    const schedulesSection = document.getElementById('schedules-section');

    // Mostrar dispositivos por defecto
    showSection('devices');

    // Configurar eventos de los tabs
    devicesTab.addEventListener('click', () => showSection('devices'));
    rulesTab.addEventListener('click', () => showSection('rules'));
    schedulesTab.addEventListener('click', () => showSection('schedules'));

    function showSection(section) {
        devicesSection.classList.add('d-none');
        rulesSection.classList.add('d-none');
        schedulesSection.classList.add('d-none');

        devicesTab.classList.remove('active');
        rulesTab.classList.remove('active');
        schedulesTab.classList.remove('active');

        switch (section) {
            case 'devices':
                devicesSection.classList.remove('d-none');
                devicesTab.classList.add('active');
                break;
            case 'rules':
                rulesSection.classList.remove('d-none');
                rulesTab.classList.add('active');
                break;
            case 'schedules':
                schedulesSection.classList.remove('d-none');
                schedulesTab.classList.add('active');
                break;
        }
    }

    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then(registration => {
                    console.log('SW registrado:', registration.scope);
                })
                .catch(error => {
                    console.error('Error SW:', error);
                });
        });
    }
});
