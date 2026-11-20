
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;

// キャラクターの設定
const player = {
  x: 80,
  y: 20,
  w: 32,
  h: 32,
  vy: 0,
  isGrounded: false
};

// 床の設定
const floor = {
  x: 0,
  y: 320,
  w: 640,
  h: 40
};

// 浮いた足場の設定
const plat = {
  x: 300,
  y: 230,
  w: 160,
  h: 16
};

// キー入力の管理
const keys = {};

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;

  // 地面にいるときだけジャンプ
  if (e.code === "Space" && player.isGrounded) {
    player.vy = -JUMP_SPEED;
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// 2つの四角が重なっているか調べる関数（AABB）
function aabb(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}

// 床との当たり判定
function collideWithFloor() {
  if (player.y + player.h > floor.y) {
    player.y = floor.y - player.h;
    player.vy = 0;
    player.isGrounded = true;
  } else {
    player.isGrounded = false;
  }
}

// 足場との当たり判定
function collideWithPlatform(prevBottom) {
  if (aabb(player, plat) && prevBottom <= plat.y && player.vy >= 0) {
    player.y = plat.y - player.h;
    player.vy = 0;
    player.isGrounded = true;
  }
}

// 更新処理
function update(dt) {
  // 動かす前のキャラクターの下の辺を記録
  const prevBottom = player.y + player.h;

  // 右移動
  if (keys["ArrowRight"]) {
    player.x = player.x + MOVE_SPEED * dt;
  }

  // 左移動
  if (keys["ArrowLeft"]) {
    player.x = player.x - MOVE_SPEED * dt;
  }

  // 重力による速さの変化
  player.vy = player.vy + GRAVITY * dt;

  // 速さによる位置の変化
  player.y = player.y + player.vy * dt;

  // 床との当たり判定
  collideWithFloor();

  // 足場との当たり判定
  collideWithPlatform(prevBottom);
}

// 描画処理
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 床を描く
  ctx.fillStyle = "#203060";
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h);

  // 浮いた足場を描く
  ctx.fillStyle = "#2e446e";
  ctx.fillRect(plat.x, plat.y, plat.w, plat.h);

  // 地面にいるときは水色、空中は黄色
  ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  // 状態を表示
  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";

  ctx.fillText(
    "vy = " + player.vy.toFixed(0) +
    "   isGrounded = " + player.isGrounded +
    "   重なり = " + aabb(player, plat),
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
