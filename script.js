'use strict';
const root = document.documentElement;
const experience = document.querySelector('.unboxing');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let scheduled = false;
function draw() {
  const rect = experience.getBoundingClientRect();
  const p = Math.max(0, Math.min(1, -rect.top / (experience.offsetHeight - innerHeight)));
  const o = Math.max(0, Math.min(1, (p - .09) / .46));
  const l = Math.max(0, Math.min(1, (p - .35) / .5));
  root.style.setProperty('--p', p.toFixed(4));
  root.style.setProperty('--open', o.toFixed(4));
  root.style.setProperty('--lift', l.toFixed(4));
  const renderJar = document.querySelector('.realistic-jar');
  const frame = reduced ? 0 : Math.round(Math.max(0, Math.min(1, (p-.32)/.66))*35);
  if(renderJar) renderJar.style.backgroundPosition = ((frame%6)*20)+'% '+(Math.floor(frame/6)*20)+'%';
  document.querySelector('#chapter-number').textContent = p < .35 ? '01' : p < .75 ? '02' : '03';
  document.querySelector('#chapter-name').textContent = p < .35 ? 'البداية' : p < .75 ? 'الاكتشاف' : 'العناية';
  document.querySelector('.mobile-order').classList.toggle('show', rect.bottom < innerHeight * .4);
  scheduled = false;
}
addEventListener('scroll', () => { if(!scheduled) { scheduled = true; requestAnimationFrame(draw); } }, {passive:true});
addEventListener('resize', draw, {passive:true});
draw();
if ('IntersectionObserver' in window && !reduced) {
  document.body.classList.add('js-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}), {threshold:.08});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const ar = n => n.toLocaleString('ar-JO');
let quantity = 1, cartCount = 0;
const cart = document.querySelector('#cart');
const renderQuantity = () => {document.querySelector('#qty').textContent=ar(quantity); document.querySelector('#minus').disabled=quantity===1; document.querySelector('#plus').disabled=quantity===9;};
document.querySelector('#minus').onclick=()=>{quantity=Math.max(1,quantity-1);renderQuantity();};
document.querySelector('#plus').onclick=()=>{quantity=Math.min(9,quantity+1);renderQuantity();};
function renderCart(){
  document.querySelectorAll('.bag-count').forEach(el=>el.textContent=ar(cartCount));
  document.querySelector('#cart-quantity').textContent=cartCount ? 'الكمية: '+ar(cartCount)+' · ٢٠ دينار للعبوة' : 'السلة فارغة';
  document.querySelector('#cart-total').textContent=ar(cartCount*20)+' دينار';
}
document.querySelectorAll('.add-cart').forEach(button=>button.onclick=()=>{cartCount=Math.min(99,cartCount+quantity);renderCart();cart.showModal();});
document.querySelectorAll('.bag').forEach(button=>button.onclick=()=>cart.showModal());
document.querySelector('#remove-cart').onclick=()=>{cartCount=0;renderCart();};
document.querySelector('#close-cart').onclick=()=>cart.close();
document.querySelector('#continue-shopping').onclick=()=>cart.close();
cart.addEventListener('click',event=>{if(event.target===cart){const r=cart.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)cart.close();}});
renderQuantity();renderCart();
// Small, scroll-linked interface details, independent of the packaging animation.
const interfaceTick = () => root.style.setProperty('--page-progress', (scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 100).toFixed(2) + '%');
addEventListener('scroll', interfaceTick, {passive:true});
document.querySelectorAll('.benefit').forEach((row,index)=>{row.style.transitionDelay=(index%4)*35+'ms';row.tabIndex=0;row.addEventListener('click',()=>{document.querySelectorAll('.benefit').forEach(x=>x.classList.remove('active'));row.classList.add('active');});row.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();row.click();}});});
interfaceTick();
