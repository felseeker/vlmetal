const panel=document.querySelector('[data-index-panel]');
const toggles=document.querySelectorAll('[data-index-toggle]');
function setPanel(open){panel.classList.toggle('is-open',open);panel.setAttribute('aria-hidden',String(!open));toggles.forEach((toggle)=>toggle.setAttribute('aria-expanded',String(open)));}
toggles.forEach((toggle)=>toggle.addEventListener('click',()=>setPanel(!panel.classList.contains('is-open'))));
document.addEventListener('keydown',(event)=>{if(event.key==='Escape')setPanel(false);});
