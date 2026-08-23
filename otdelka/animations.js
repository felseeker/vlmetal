/* Reveal animations and scroll effects for the interior page. */
import { inView, animate, scroll } from 'https://esm.sh/motion@11';

/* Reveal elements as they enter viewport. */
function initRevealAnimations() {
  const reveals = document.querySelectorAll('.ot-hero__content, .ot-hero__image, #pricelist .ot-label, #pricelist .ot-section__title, .shared-contact');
  
  reveals.forEach((element, index) => {
    const delay = index * 0.08;
    
    /* Set initial state. */
    element.style.opacity = '0';
    element.style.transform = 'translateY(24px)';
    
    /* Trigger when in view. */
    inView(element, () => {
      animate(
        element,
        { opacity: 1, transform: 'translateY(0)' },
        { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
      );
    }, { amount: 0.2 });
  });
  
  /* Separate animation for price cards with stagger. */
  const priceCards = document.querySelectorAll('.ot-ptab-panel--active .ot-price-card');
  priceCards.forEach((card, index) => {
    inView(card, () => {
      animate(
        card,
        { opacity: [0, 1], transform: ['translateY(16px)', 'translateY(0)'] },
        { duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }
      );
    }, { amount: 0.15 });
  });
}

/* Parallax effect for hero image. */
function initParallax() {
  const heroImage = document.querySelector('.ot-hero__carousel');
  if (!heroImage) return;
  
  scroll(
    animate(heroImage, { transform: ['translateY(0px)', 'translateY(-40px)'] }),
    {
      target: document.querySelector('.ot-hero'),
      offset: ['start end', 'end start']
    }
  );
}

/* Sparks effect for the price section. */
function initSparks() {
  const priceSection = document.querySelector('#pricelist');
  if (!priceSection) return;
  
  const canvas = document.createElement('canvas');
  canvas.className = 'sparks-canvas';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.4;mix-blend-mode:screen;';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  const sparks = [];
  const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
  
  class Spark {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.life = Math.random() * 60 + 40;
      this.maxLife = this.life;
      this.size = Math.random() * 2 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life--;
      
      if (this.life <= 0) {
        this.reset();
      }
    }
    
    draw() {
      const alpha = this.life / this.maxLife;
      ctx.fillStyle = accentColor.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  }
  
  for (let i = 0; i < 30; i++) {
    sparks.push(new Spark());
  }
  
  function animateSparks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sparks.forEach(spark => {
      spark.update();
      spark.draw();
    });
    requestAnimationFrame(animateSparks);
  }
  
  /* Only animate when price section is in view. */
  let isAnimating = false;
  inView(priceSection, () => {
    if (!isAnimating) {
      isAnimating = true;
      animateSparks();
    }
  }, { amount: 0.1 });
  
  /* Handle resize. */
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

/* Initialize all animations when DOM is ready. */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initRevealAnimations();
    initParallax();
    initSparks();
  });
} else {
  initRevealAnimations();
  initParallax();
  initSparks();
}
