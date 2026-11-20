
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

let x = 100;          // 丸の中心の位置
let y = 80;
let vx = 180;         // 横の速さ（1秒に180px）
let vy = 140;         // 縦の速さ（1秒に140px）
const r = 14;         // 半径
let last = performance.now();

// 状態を少し変える
function update(dt) {
  x = x + vx * dt;
  y = y + vy * dt;

  // 左右の壁
  if (x + r > canvas.width) {
    x = canvas.width - r;
    vx = -vx;
  }
  if (x - r < 0) {
    x = r;
    vx = -vx;
  }

  // 上下の壁
  if (y + r > canvas.height) {
    y = canvas.height - r;
    vy = -vy;
  }
  if (y - r < 0) {
    y = r;
    vy = -vy;
  }
}

// ボールを描く
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// ゲームループ
function loop(now) {
  const dt = (now - last) / 1000;
  last = now;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

// 最初の1回を頼む
requestAnimationFrame(loop);
