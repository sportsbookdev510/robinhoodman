/* ============ NAV SHRINK ============ */
const nav = document.getElementById("nav");
addEventListener("scroll", () => {
  nav.classList.toggle("shrink", scrollY > 40);
});

/* ============ GLOW FOLLOWS CURSOR ============ */
const glow = document.querySelector(".bg-glow");
addEventListener("pointermove", (e) => {
  glow.style.setProperty("--mx", (e.clientX / innerWidth) * 100 + "%");
  glow.style.setProperty("--my", (e.clientY / innerHeight) * 100 + "%");
});

/* ============ 3D TILT ============ */
const tilts = document.querySelectorAll("[data-tilt]");
tilts.forEach((el) => {
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${
      -py * 12
    }deg) translateZ(8px)`;
  });
  el.addEventListener("pointerleave", () => {
    el.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
  });
});

/* ============ SCROLL REVEAL ============ */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("in");
        io.unobserve(en.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ============ COPY CONTRACT ============ */
const copyBtn = document.getElementById("copy-ca");
const caText = document.getElementById("ca-text");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(caText.textContent.trim());
      toast("CONTRACT COPIED! 💼");
    } catch {
      toast("COPY FAILED — SELECT MANUALLY");
    }
  });
}
function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ============ FOOTBALL PARTICLE FX ============ */
const canvas = document.getElementById("fx-canvas");
const ctx = canvas.getContext("2d");
let W,
  H,
  balls = [],
  sparks = [];
const EMOJIS = ["💼", "🚀", "💚", "📈", "🔐"];

function resize() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

function spawnBalls() {
  const count = innerWidth < 700 ? 9 : 18;
  for (let i = 0; i < count; i++) {
    balls.push({
      x: Math.random() * W,
      y: Math.random() * H,
      size: 16 + Math.random() * 26,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 0.25 + Math.random() * 0.6,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.04,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      alpha: 0.35 + Math.random() * 0.4,
    });
  }
}
if (!reduce) spawnBalls();

/* burst of sparks on click */
addEventListener("click", (e) => {
  if (reduce) return;
  for (let i = 0; i < 14; i++) {
    const a = (Math.PI * 2 * i) / 14;
    sparks.push({
      x: e.clientX,
      y: e.clientY,
      vx: Math.cos(a) * (2 + Math.random() * 3),
      vy: Math.sin(a) * (2 + Math.random() * 3),
      life: 1,
      size: 3 + Math.random() * 3,
      color: ["#00c805", "#39d353", "#00a004", "#ffffff"][i % 4],
    });
  }
});

function draw() {
  ctx.clearRect(0, 0, W, H);

  balls.forEach((b) => {
    b.x += b.vx;
    b.y += b.vy;
    b.rot += b.vr;
    if (b.y - b.size > H) {
      b.y = -b.size;
      b.x = Math.random() * W;
    }
    if (b.x < -b.size) b.x = W + b.size;
    if (b.x > W + b.size) b.x = -b.size;
    ctx.save();
    ctx.globalAlpha = b.alpha;
    ctx.translate(b.x, b.y);
    ctx.rotate(b.rot);
    ctx.font = `${b.size}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(b.emoji, 0, 0);
    ctx.restore();
  });

  sparks = sparks.filter((s) => s.life > 0);
  sparks.forEach((s) => {
    s.x += s.vx;
    s.y += s.vy;
    s.vy += 0.08;
    s.life -= 0.02;
    ctx.save();
    ctx.globalAlpha = Math.max(s.life, 0);
    ctx.fillStyle = s.color;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  requestAnimationFrame(draw);
}
if (!reduce) draw();
