const PI2 = 2 * Math.PI;
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const center = { x: 0, y: 0 };
let maxSize = 0;
const elements = [];
let elementsCount = 0;
const elementsPerCircle = 20;
let nextElement = 0;
const radius = 150;
let lastUpdate = Date.now();
const updateTime = 200;

resize();
window.addEventListener('resize', resize);
window.requestAnimationFrame(animate);

function populateOne() {
  createCircle(nextElement);
  nextElement++;
  if (nextElement > elementsPerCircle) {
    nextElement = 0;
  }
}

function createCircle(n) {
  const alpha = n * PI2 / elementsPerCircle;
  const x = center.x + radius * Math.cos(alpha);
  const y = center.y + radius * Math.sin(alpha);
  const color = n % 2 === 0 ? '#40FFDC' : '#1C0021';

  elements.push(new Circle({ x, y }, color));
  elementsCount++;
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  center.x = 0.5 * canvas.width;
  center.y = 0.5 * canvas.height;
  maxSize = 0.7 * canvas.width;
}

function animate() {
  window.requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#1C0021';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let now = Date.now();
  let dt = now - lastUpdate;
  if (dt >= updateTime) {
    populateOne();
    lastUpdate = now;
  }

  for (let i = 0; i < elementsCount; i++) {
    const c = elements[i];

    c.grow();

    if (c.size > maxSize) {
      destroy(i);
      continue;
    }

    ctx.beginPath();
    ctx.fillStyle = c.color;
    ctx.arc(c.x, c.y, c.size, 0, PI2, false);
    ctx.fill();
  }
}

function destroy(i) {
  delete elements[i];
  elements.splice(i, 1);
  elementsCount--;
}

class Circle {
  constructor(position, color) {
    this.color = color;
    this.position = position;
    this.scale = 0;
    this.growSpeed = 0.1;
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  get size() {
    return this.scale * 10;
  }

  grow() {
    this.scale += this.growSpeed;
  }}