//Please do not steal my code
const template = document.createElement('template');
template.innerHTML = `
  <style>
    .tada-button {
      padding: 1rem 2rem;
      font-size: 1.5rem;
      cursor: pointer;
      border: none;
      border-radius: 5px;
      background-color: #4CAF50;
      color: white;
      transition: transform 0.2s;
      z-index: 1;
    }

    .tada-animation {
      animation: tada 1s ease-in-out;
    }

    @keyframes tada {
      0% {
        transform: scale(1);
      }
      10%, 20% {
        transform: scale(0.9) rotate(-3deg);
      }
      30%, 50%, 70%, 90% {
        transform: scale(1.1) rotate(3deg);
      }
      40%, 60%, 80% {
        transform: scale(1.1) rotate(-3deg);
      }
      100% {
        transform: scale(1) rotate(0);
      }
    }
  </style>
  <button class="tada-button">Click me</button>
`;

class TadaButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.button = this.shadowRoot.querySelector('.tada-button');
    
    const handleClick = () => {
      this.button.classList.add('tada-animation');
      this.button.addEventListener('animationend', () => {
        this.button.classList.remove('tada-animation');
      });
      showMessage();
      launchFireworks();
      updateCounters();
    };

    this.button.addEventListener('click', handleClick);

    this.button.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        handleClick();
    });
  }
}

customElements.define('tada-button', TadaButton);

const canvas = document.getElementById('fireworks-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let fireworks = [];
let rockets = [];

const messageContainer = document.getElementById('message-container');
const totalClicksSpan = document.getElementById('total-clicks');
const maxCpsSpan = document.getElementById('max-cps');
const steveEasterEgg = document.getElementById('steve-easter-egg');

let totalClicks = 0;
let maxCps = 0;
let clicksInSecond = 0;
let lastClickTime = Date.now();
let steveTriggered = false;

function showMessage() {
    messageContainer.style.opacity = 1;
}

function triggerSteveEasterEgg() {
    if (steveTriggered) return;
    steveTriggered = true;

    steveEasterEgg.classList.add('show');
    fireworks.push(new SteveExplosion(canvas.width / 2, canvas.height / 2));

    setTimeout(() => {
        steveEasterEgg.classList.remove('show');
        steveTriggered = false; // Allow it to be triggered again
    }, 3000);
}

function updateCounters() {
    totalClicks++;
    totalClicksSpan.textContent = totalClicks;

    const now = Date.now();
    if (now - lastClickTime < 1000) {
        clicksInSecond++;
    } else {
        clicksInSecond = 1;
        lastClickTime = now;
    }

    if (clicksInSecond > maxCps) {
        maxCps = clicksInSecond;
        maxCpsSpan.textContent = maxCps;
    }

    if (maxCps >= 50) {
        triggerSteveEasterEgg();
    }
}

setInterval(() => {
    // Reset clicksInSecond every second to calculate CPS correctly
    if (Date.now() - lastClickTime > 1000) {
      clicksInSecond = 0;
    }
}, 1000);

class Rocket {
    constructor(x, targetY) {
        this.x = x;
        this.y = canvas.height;
        this.targetY = targetY;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.speed = 5;
    }

    update() {
        this.y -= this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 2, 10);
    }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * 3 + 1;
    this.speed = Math.random() * 5 + 2;
    this.angle = Math.random() * Math.PI * 2;
    this.friction = 0.95;
    this.gravity = 0.5;
    this.alpha = 1;
  }

  update() {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= 0.02;
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.createParticles();
  }

  createParticles() {
    for (let i = 0; i < 100; i++) {
      const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      this.particles.push(new Particle(this.x, this.y, color));
    }
  }

  update() {
    this.particles.forEach(particle => particle.update());
    this.particles = this.particles.filter(particle => particle.alpha > 0);
  }

  draw() {
    this.particles.forEach(particle => particle.draw());
  }
}

class SteveExplosion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.colors = ['#4a2e1a', '#ffffff', '#3d3dff']; // Brown, White, Blue
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < 200; i++) {
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            const particle = new Particle(this.x, this.y, color);
            particle.speed = Math.random() * 10 + 3;
            particle.gravity = 0.3;
            this.particles.push(particle);
        }
    }

    update() {
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.alpha > 0);
    }

    draw() {
        this.particles.forEach(p => p.draw());
    }
}

function launchFireworks() {
    const x = Math.random() * canvas.width;
    const targetY = Math.random() * (canvas.height / 2);
    rockets.push(new Rocket(x, targetY));
}

function animate() {
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1;

  rockets.forEach((rocket, index) => {
      rocket.update();
      rocket.draw();
      if (rocket.y <= rocket.targetY) {
          fireworks.push(new Firework(rocket.x, rocket.y));
          rockets.splice(index, 1);
      }
  });

  fireworks.forEach((firework, index) => {
    firework.update();
    firework.draw();
    if(firework.particles.length === 0) {
        fireworks.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
