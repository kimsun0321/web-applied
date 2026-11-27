// プレイヤー：決まった数・今の値・キー・動き・描き方

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;
const MAX_JUMPS = 2;
const FALL_GRAVITY_RATE = 2;

// HPと無敵時間
const MAX_HP = 4;
const HIT_TIME = 1.5;

const player = {
  x: 80,
  y: 20,
  w: 32,
  h: 32,
  vx: 0,
  vy: 0,
  isGrounded: false,
  jumpsLeft: MAX_JUMPS,
  state: "idle",
  frameIndex: 0,
  frameTimer: 0,
  facing: 1,
  hp: MAX_HP,
  hitTimer: 0
};

// プレイヤー画像
const playerImg = new Image();
playerImg.src = "7-3_bird.png";

const FRAME_SIZE = 32;
const FRAME_TIME = 0.12;

// アニメーション設定
const ANIMS = {
  idle: { row: 0, count: 2 },
  run:  { row: 1, count: 4 },
  jump: { row: 2, count: 2 },
  fall: { row: 3, count: 2 }
};

const keys = {};

// キー入力
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;

  if (e.code === "Space") {
    e.preventDefault();

    if (gameState === "playing" && player.jumpsLeft > 0) {
      player.vy = -JUMP_SPEED;
      player.jumpsLeft = player.jumpsLeft - 1;
    }
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// 床との衝突判定
function collideWithFloor() {
  if (player.y + player.h > floor.y) {
    player.y = floor.y - player.h;
    player.vy = 0;
    player.isGrounded = true;
    player.jumpsLeft = MAX_JUMPS;
  } else {
    player.isGrounded = false;
  }
}

// 状態を決める
function decideState() {
  if (!player.isGrounded) {
    if (player.vy < 0) {
      return "jump";
    }
    return "fall";
  }

  if (player.vx !== 0) {
    return "run";
  }

  return "idle";
}

// プレイヤーを動かす
function updatePlayer(dt) {
  player.vx = 0;

  if (keys["ArrowRight"]) {
    player.vx = MOVE_SPEED;
  }

  if (keys["ArrowLeft"]) {
    player.vx = -MOVE_SPEED;
  }

  player.x = player.x + player.vx * dt;

  // 画面外に出ないようにする
  if (player.x < 0) {
    player.x = 0;
  }

  if (player.x + player.w > canvas.width) {
    player.x = canvas.width - player.w;
  }

  // 向きを変える
  if (player.vx > 0) {
    player.facing = 1;
  }

  if (player.vx < 0) {
    player.facing = -1;
  }

  // 重力
  const g = player.vy > 0
    ? GRAVITY * FALL_GRAVITY_RATE
    : GRAVITY;

  player.vy = player.vy + g * dt;
  player.y = player.y + player.vy * dt;

  // 床との衝突判定
  collideWithFloor();

  // 状態を決める
  const newState = decideState();

  if (newState !== player.state) {
    player.state = newState;
    player.frameIndex = 0;
    player.frameTimer = 0;
  }

  // アニメーション
  player.frameTimer = player.frameTimer + dt;

  if (player.frameTimer >= FRAME_TIME) {
    player.frameIndex =
      (player.frameIndex + 1) % ANIMS[player.state].count;

    player.frameTimer = 0;
  }

  // 無敵時間を減らす
  if (player.hitTimer > 0) {
    player.hitTimer = Math.max(0, player.hitTimer - dt);
  }
}

// プレイヤーを描く
function drawPlayer() {
  const sx = player.frameIndex * FRAME_SIZE;
  const sy = ANIMS[player.state].row * FRAME_SIZE;

  ctx.save();

  ctx.translate(
    player.x + player.w / 2,
    player.y + player.h / 2
  );

  ctx.scale(player.facing, 1);

  if (player.hitTimer > 0) {
    ctx.globalAlpha = 0.4;
  }

  ctx.drawImage(
    playerImg,
    sx,
    sy,
    FRAME_SIZE,
    FRAME_SIZE,
    -player.w / 2,
    -player.h / 2,
    player.w,
    player.h
  );

  ctx.restore();

  // プレイヤー情報
  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";

  ctx.fillText(
    "HP = " + player.hp,
    10,
    20
  );
}