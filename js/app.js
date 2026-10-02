const products = [
  {id:1,name:'SSD 480 GB',desc:'Almacenamiento SATA para acelerar tu PC.',price:159999,icon:'▣'},
  {id:2,name:'Memoria RAM 8 GB',desc:'DDR4 para ampliar el rendimiento.',price:179999,icon:'▤'},
  {id:3,name:'Fuente 600 W',desc:'Fuente para equipos de uso general.',price:24999,icon:'⚡'},
  {id:4,name:'Mouse inalámbrico',desc:'Conectividad 2.4 GHz y diseño ergonómico.',price:12000,icon:'⌁'},
  {id:5,name:'Teclado USB',desc:'Teclado completo para oficina y hogar.',price:15999,icon:'⌨'},
  {id:6,name:'Repetidor Wi‑Fi TP-Link',desc:'Conectividad estable para tu hogar.',price:47999,icon:'◉'},
  {id:7,name:'Pendrive 64 GB',desc:'Almacenamiento portátil USB.',price:20999,icon:'▰'},
  {id:8,name:'Pasta térmica Arctic MX-4 4g',desc:'Para mantenimiento y transferencia térmica.',price:9999,icon:'●'}
];

const money = n => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
let cart = JSON.parse(localStorage.getItem('electroforo_cart') || '[]');

const productGrid = document.getElementById('productGrid');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

function renderProducts(){
  productGrid.innerHTML = products.map(p => `
    <article class="product">
      <div class="product-img" aria-hidden="true">${p.icon}</div>
      <div class="product-body">
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="price">${money(p.price)}</div>
        <button class="add-product" data-id="${p.id}">Agregar al carrito</button>
      </div>
    </article>`).join('');
  document.querySelectorAll('.add-product').forEach(btn=>btn.addEventListener('click',()=>addToCart(Number(btn.dataset.id))));
}
function saveCart(){localStorage.setItem('electroforo_cart',JSON.stringify(cart));renderCart()}
function addToCart(id){
  const item=cart.find(x=>x.id===id); if(item)item.qty++; else cart.push({id,qty:1}); saveCart(); openCart();
}
function changeQty(id,delta){const item=cart.find(x=>x.id===id); if(!item)return; item.qty+=delta; if(item.qty<=0)cart=cart.filter(x=>x.id!==id); saveCart()}
function renderCart(){
  const totalQty=cart.reduce((s,x)=>s+x.qty,0); cartCount.textContent=totalQty;
  if(!cart.length){cartItems.innerHTML='<p class="empty-cart">Todavía no agregaste productos.</p>';cartTotal.textContent=money(0);return}
  let total=0;
  cartItems.innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);total+=p.price*x.qty;return `<div class="cart-line"><div><strong>${p.name}</strong><br><small>${money(p.price)} · ${x.qty} unidad(es)</small></div><div class="qty"><button data-minus="${p.id}">−</button><span>${x.qty}</span><button data-plus="${p.id}">+</button></div></div>`}).join('');
  cartTotal.textContent=money(total);
  document.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>changeQty(Number(b.dataset.minus),-1));
  document.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>changeQty(Number(b.dataset.plus),1));
}
function openCart(){cartDrawer.classList.add('open');overlay.classList.add('show');cartDrawer.setAttribute('aria-hidden','false')}
function closeCart(){cartDrawer.classList.remove('open');overlay.classList.remove('show');cartDrawer.setAttribute('aria-hidden','true')}

document.getElementById('cartButton').onclick=openCart;
document.getElementById('closeCart').onclick=closeCart;
overlay.onclick=closeCart;
document.getElementById('checkoutButton').onclick=()=>{
  if(!cart.length)return alert('Agregá al menos un producto al carrito.');
  const text=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `${x.qty} x ${p.name}`}).join(', ');
  alert(`Consulta preparada: ${text}.\n\nPodés conectar este botón con WhatsApp o una pasarela de pago cuando tengas el número comercial.`);
};

const menuToggle=document.getElementById('menuToggle'); const navLinks=document.getElementById('navLinks');
menuToggle.onclick=()=>{const open=navLinks.classList.toggle('open');menuToggle.setAttribute('aria-expanded',open)};
navLinks.querySelectorAll('a').forEach(a=>a.onclick=()=>navLinks.classList.remove('open'));

document.querySelectorAll('[data-service]').forEach(btn=>btn.addEventListener('click',()=>{
  document.getElementById('serviceSelect').value=btn.dataset.service;
  document.getElementById('requestType').value=btn.dataset.service==='Visita a domicilio'?'Visita a domicilio':btn.dataset.service==='Solicitud de presupuesto'?'Solicitud de presupuesto':'Reparación / diagnóstico';
  document.getElementById('reservas').scrollIntoView({behavior:'smooth'});
}));

const dateInput=document.getElementById('dateInput');
dateInput.min=new Date().toISOString().split('T')[0];

document.getElementById('bookingForm').addEventListener('submit',e=>{
  e.preventDefault();
  const data=new FormData(e.target); const status=document.getElementById('formStatus');
  const summary=`Solicitud de ${data.get('tipo')} para ${data.get('servicio')}. Nombre: ${data.get('nombre')}. Teléfono: ${data.get('telefono')}.`;
  status.textContent='Solicitud registrada en esta demo. Para producción, conectaremos el formulario con WhatsApp, email o una base de datos.';
  console.log(summary,Object.fromEntries(data.entries()));
  e.target.reset(); dateInput.min=new Date().toISOString().split('T')[0];
});

document.getElementById('year').textContent=new Date().getFullYear();
renderProducts(); renderCart();


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