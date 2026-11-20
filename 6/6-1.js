
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 2000;

// キャラクターの位置・大きさ・縦方向の速さ
const player = {
  x: 80,
  y: 20,
  w: 32,
  h: 32,
  vy: 0
};

// 更新処理
function update(dt) {
  player.vy = player.vy + GRAVITY * dt;  // ① 加速度が速さを変える
  player.y = player.y + player.vy * dt;  // ② 速さが位置を変える
}

// 描画処理
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#7ef5e1";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // 現在の速さを表示
  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText("vy = " + player.vy.toFixed(0), 10, 20);
}

// 時間の管理
let last = performance.now();

// ゲームループ
function loop(now) {
  const dt = (now - last) / 1000;
  last = now;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
