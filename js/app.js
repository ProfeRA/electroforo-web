const products = [
  {id:1,name:'SSD 480 GB',desc:'Almacenamiento SATA para acelerar tu PC.',price:65000,icon:'▣'},
  {id:2,name:'Memoria RAM 8 GB',desc:'DDR4 para ampliar el rendimiento.',price:48000,icon:'▤'},
  {id:3,name:'Fuente 600 W',desc:'Fuente para equipos de uso general.',price:72000,icon:'⚡'},
  {id:4,name:'Mouse inalámbrico',desc:'Conectividad 2.4 GHz y diseño ergonómico.',price:18000,icon:'⌁'},
  {id:5,name:'Teclado USB',desc:'Teclado completo para oficina y hogar.',price:22000,icon:'⌨'},
  {id:6,name:'Router Wi‑Fi',desc:'Conectividad estable para tu hogar.',price:52000,icon:'◉'},
  {id:7,name:'Pendrive 64 GB',desc:'Almacenamiento portátil USB.',price:16000,icon:'▰'},
  {id:8,name:'Pasta térmica',desc:'Para mantenimiento y transferencia térmica.',price:9000,icon:'●'}
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
