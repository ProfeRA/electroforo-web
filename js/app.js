// Configuración de WhatsApp
const WHATSAPP_NUMBER = '5491122863885'; // Tu número con código de país
const WHATSAPP_MESSAGE_TEMPLATE = 
    'Hola ElectroForo!\n' +
    'Mi nombre es {nombre}.\n' +
    'Servicio solicitado: {servicio}.\n' +
    'Tipo: {tipo}.\n' +
    'Fecha preferida: {fecha}.\n' +
    'Horario: {horario}.\n' +
    'Detalles: {detalle}\n' +
    'Mi teléfono es {telefono}.';

// Manejo del formulario de reservas
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const form = e.target;
    const status = document.getElementById('formStatus');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Deshabilitar botón mientras se procesa
    submitButton.disabled = true;
    submitButton.textContent = 'Preparando WhatsApp...';
    status.textContent = '';
    
    // Recopilar datos del formulario
    const formData = new FormData(form);
    const data = {
        nombre: formData.get('nombre'),
        telefono: formData.get('telefono'),
        email: formData.get('email'),
        tipo: formData.get('tipo'),
        servicio: formData.get('servicio'),
        fecha: formData.get('fecha'),
        horario: formData.get('horario'),
        direccion: formData.get('direccion'),
        detalle: formData.get('detalle')
    };
    
    // Construir mensaje para WhatsApp
    let message = WHATSAPP_MESSAGE_TEMPLATE;
    for (const [key, value] of Object.entries(data)) {
        message = message.replace(`{${key}}`, value || 'No especificado');
    }
    
    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Crear URL de WhatsApp
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Redirigir a WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Mostrar mensaje de éxito
    status.textContent = '✅ ¡Solicitud preparada! Se abrirá WhatsApp con tu mensaje.';
    status.className = 'form-status success';
    
    // Rehabilitar botón después de 3 segundos
    setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar solicitud';
        status.textContent = '';
        status.className = 'form-status';
    }, 3000);
});

// Función para contacto directo rápido
function contactWhatsAppDirect() {
    const message = 'Hola ElectroForo, necesito información sobre sus servicios.';
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
}

// Agregar estilos para WhatsApp
const style = document.createElement('style');
style.textContent = `
    .whatsapp-direct {
        margin-top: 2rem;
        text-align: center;
        padding: 1.5rem;
        border: 2px dashed #25D366;
        border-radius: 12px;
        background-color: rgba(37, 211, 102, 0.05);
    }
    
    .btn-whatsapp {
        background-color: #25D366;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
        margin: 10px 0;
    }
    
    .btn-whatsapp:hover {
        background-color: #128C7E;
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(37, 211, 102, 0.3);
    }
    
    .whatsapp-icon {
        font-size: 1.2rem;
    }
    
    .whatsapp-note {
        font-size: 0.9rem;
        color: #64748b;
        margin-top: 5px;
    }
    
    .divider-text {
        color: #64748b;
        font-size: 0.9rem;
        margin: 1rem 0;
    }
    
    .form-status.success {
        color: #10b981;
        font-weight: bold;
    }
    
    .form-status.error {
        color: #ef4444;
        font-weight: bold;
    }
`;
document.head.appendChild(style);