const adjectives = ['sparkly', 'tiny', 'giant', 'fluffy', 'angry', 'silent', 'neon', 'rusty', 'purple', 'ancient', 'glowing', 'bouncy', 'whispery', 'explosive', 'dreamy'];
const nouns = ['robot', 'pizza', 'cat', 'socks', 'cloud', 'banana', 'lamp', 'bicycle', 'shoe', 'dragon', 'pancake', 'umbrella', 'toaster', 'penguin', 'balloon'];
const verbs = ['dances', 'whispers', 'explodes', 'flies', 'sings', 'juggles', 'paints', 'builds', 'hugs', 'chases', 'glows', 'spins', 'melts', 'bounces', 'dreams'];
const places = ['on Mars', 'in a bathtub', 'underwater', 'at midnight', 'in a tree', 'while sleeping', 'with a spoon', 'backwards', 'upside down', 'in your pocket'];

const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let count = 0;
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const generateBtn = document.getElementById('generateBtn');
const promptText = document.getElementById('promptText');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const countEl = document.getElementById('count');

function generatePrompt() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const place = places[Math.floor(Math.random() * places.length)];
  return `${adj} ${noun} that ${verb} ${place}`;
}

function explodeConfetti() {
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -12 - 8,
      size: Math.random() * 6 + 3,
      hue: Math.random() * 360,
      alpha: 1
    });
  }
}

function updateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach((p, i) => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.vx * 0.01);
    
    ctx.fillStyle = `hsl(${p.hue}, 70%, 60%)`;
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
    
    ctx.restore();
    
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.3;
    p.alpha -= 0.008;
    p.hue += 2;
    
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  });
  
  requestAnimationFrame(updateConfetti);
}

function copyPrompt() {
  navigator.clipboard.writeText(promptText.textContent).then(() => {
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = 'Copy', 1500);
  });
}

function sharePrompt() {
  if (navigator.share) {
    navigator.share({
      title: 'Cosmic Nonsense',
      text: promptText.textContent
    });
  } else {
    navigator.clipboard.writeText(promptText.textContent);
  }
}

generateBtn.addEventListener('click', () => {
  promptText.textContent = generatePrompt();
  explodeConfetti();
  count++;
  countEl.textContent = count;
});

copyBtn.addEventListener('click', copyPrompt);
shareBtn.addEventListener('click', sharePrompt);

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', current);
  localStorage.setItem('theme', current);
  themeToggle.textContent = current === 'dark' ? '☀️' : '🌙';
});

if (localStorage.getItem('theme') === 'light') {
  root.setAttribute('data-theme', 'light');
  themeToggle.textContent = '🌙';
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js');
}

updateConfetti();