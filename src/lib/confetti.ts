export function triggerConfetti(intensity: "small" | "large" = "large") {
  if (typeof window === "undefined") return;

  // Prevent multiple full-screen canvases from stacking up excessively
  let canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "confetti-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  interface Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    shape: "circle" | "square" | "triangle";
  }

  const particles: Particle[] = [];
  const colors = ["#22c55e", "#3b82f6", "#a855f7", "#ec4899", "#f59e0b", "#ef4444", "#06b6d4"];

  // Read accent color dynamically if available
  const style = getComputedStyle(document.documentElement);
  const accent = style.getPropertyValue("--color-accent").trim();
  if (accent) {
    colors.unshift(accent);
  }

  const particleCount = intensity === "large" ? 140 : 45;

  for (let i = 0; i < particleCount; i++) {
    const isLarge = intensity === "large";
    const x = isLarge
      ? Math.random() * width
      : width / 2 + (Math.random() - 0.5) * 100;
    const y = isLarge ? -20 : height / 2 + (Math.random() - 0.5) * 60;

    const speedX = isLarge
      ? (Math.random() - 0.5) * 6
      : (Math.random() - 0.5) * 8;
    const speedY = isLarge
      ? Math.random() * 8 + 4
      : (Math.random() - 0.5) * 10 - 2;

    const shapeSeed = Math.random();
    const shape =
      shapeSeed < 0.33 ? "circle" : shapeSeed < 0.66 ? "square" : "triangle";

    particles.push({
      x,
      y,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX,
      speedY,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      opacity: 1,
      shape,
    });
  }

  function update() {
    ctx!.clearRect(0, 0, width, height);

    let active = false;

    for (const p of particles) {
      if (p.opacity <= 0.01) continue;

      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += 0.2; // Gravity
      p.speedX *= 0.98; // Drag
      p.rotation += p.rotationSpeed;

      // Fade out as it nears the bottom or ages
      if (p.y > height - 100) {
        p.opacity -= 0.02;
      } else if (intensity === "small") {
        p.opacity -= 0.015;
      }

      if (p.opacity > 0) {
        active = true;
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate(p.rotation);
        ctx!.globalAlpha = p.opacity;
        ctx!.fillStyle = p.color;

        ctx!.beginPath();
        if (p.shape === "circle") {
          ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        } else if (p.shape === "square") {
          ctx!.rect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          ctx!.moveTo(0, -p.size / 2);
          ctx!.lineTo(p.size / 2, p.size / 2);
          ctx!.lineTo(-p.size / 2, p.size / 2);
          ctx!.closePath();
        }
        ctx!.fill();
        ctx!.restore();
      }
    }

    if (active) {
      requestAnimationFrame(update);
    } else {
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  update();
}
