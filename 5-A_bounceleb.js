
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

// ボールの位置
let x = 100;
let y = 100;

// ボールの速度
let vx = 180;
let vy = 140;

// ボールの半径
const r = 15;

// 前回の時間
let last = 0;

// ボールの位置を更新する
function update(dt) {
  x = x + vx * dt;
  y = y + vy * dt;

  // 左の壁
  if (x - r < 0) {
    x = r;
    vx = -vx;
  }

  // 右の壁
  if (x + r > canvas.width) {
    x = canvas.width - r;
    vx = -vx;
  }

  // 上の壁
  if (y - r < 0) {
    y = r;
    vy = -vy;
  }

  // 下の壁
  if (y + r > canvas.height) {
    y = canvas.height - r;
    vy = -vy;
  }
}

// ボールを描画する
function draw() {
  // canvasを全部消す
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ボールを描く
  ctx.fillStyle = "yellow";
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

// ゲーム開始
requestAnimationFrame(loop);
