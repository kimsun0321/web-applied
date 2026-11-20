
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

// 床の設定
const floor = {
  x: 0,
  y: 320,
  w: 640,
  h: 40
};

// 床とぶつかったときの処理
function collideWithFloor() {
  if (player.y + player.h > floor.y) {
    player.y = floor.y - player.h;  // 位置を床の上に戻す
    player.vy = 0;                   // 速さを0にする
  }
}

// 更新処理
function update(dt) {
  player.vy = player.vy + GRAVITY * dt;
  player.y = player.y + player.vy * dt;

  collideWithFloor();
}

// 描画処理
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 床を描く
  ctx.fillStyle = "#203060";
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h);

  // キャラクターを描く
  ctx.fillStyle = "#7ef5e1";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // 現在の速さと位置を表示
  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText(
    "vy = " + player.vy.toFixed(0) +
    "   y = " + player.y.toFixed(0),
    10,
    20
  );
}

// 時間の管理
let last = performance.now();

// ゲームループ
function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.033);

  last = now;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
