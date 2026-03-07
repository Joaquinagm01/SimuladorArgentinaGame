// TEST SIMPLE - Si ves este mensaje, el JS funciona
console.log('🚀 JUEGO CARGANDO...');
alert('JavaScript está funcionando! Ahora cargaré el juego...');

// Configuración de la API
const API_URL = 'http://localhost:5000';
console.log('🔗 API URL:', API_URL);

// Inicialización
window.addEventListener('load', function() {
    console.log('✅ Página cargada completamente');
    
    const startBtn = document.getElementById('start-btn');
    console.log('Botón START:', startBtn);
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            alert('CLICK DETECTADO! Ahora se conectará a la API...');
            console.log('🖱️ CLICK EN START');
            iniciarJuego();
        });
        console.log('✅ Event listener agregado al botón');
    } else {
        console.error('❌ No se encontró el botón START');
    }
});

async function iniciarJuego() {
    try {
        console.log('📡 Intentando conectar a:', API_URL + '/api/new-game');
        
        const response = await fetch(API_URL + '/api/new-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('📥 Respuesta recibida:', response.status);
        const data = await response.json();
        console.log('✅ Datos:', data);
        
        alert('JUEGO INICIADO! Game ID: ' + data.game_id);
        
        // Cambiar pantallas
        document.getElementById('start-screen').classList.remove('active');
        document.getElementById('game-screen').classList.add('active');
        
    } catch (error) {
        console.error('❌ ERROR:', error);
        alert('Error: ' + error.message);
    }
}

console.log('📜 Script cargado completamente');
