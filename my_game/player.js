// プレイヤーの設定

const GRAVITY = 2000;
const JUMP_SPEED = 700;
const MOVE_SPEED = 240;
const MAX_JUMPS = 2;

// 課題の数値変更
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

const ANIMS = {
  idle: { row: 0, count: 2 },
  run:  { row: 1, count: 4 },
  jump: { row: 2, count: 2 },
  fall: { row: 3, count: 2 }
};

// キー入力の状態
const keys = {};

// キーを押したとき
document.addEventListener("keydown", (e) => {
  if (
    e.code === "ArrowLeft" ||
    e.code === "ArrowRight" ||
    e.code === "Space"
  ) {
    e.preventDefault();
  }

  keys[e.code] = true;

  // ジャンプ
  if (
    e.code === "Space" &&
    !e.repeat &&
    gameState === "playing" &&
    player.jumpsLeft > 0
  ) {
    player.vy = -JUMP_SPEED;
    player.jumpsLeft--;
  }
});

// キーを離したとき
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// 床との衝突判定
function collideWithFloor() {
  if (player.y + player.h >= floor.y) {
    player.y = floor.y - player.h;
    player.vy = 0;
    player.isGrounded = true;
    player.jumpsLeft = MAX_JUMPS;
  } else {
    player.isGrounded = false;
  }
}

// プレイヤーの状態を決める
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

// プレイヤーを更新する
function updatePlayer(dt) {
  player.vx = 0;

  if (keys["ArrowRight"]) {
    player.vx = MOVE_SPEED;
  }

  if (keys["ArrowLeft"]) {
    player.vx = -MOVE_SPEED;
  }

  // 横移動
  player.x += player.vx * dt;

  // 画面外に出ないようにする
  if (player.x < 0) {
    player.x = 0;
  }

  if (player.x + player.w > canvas.width) {
    player.x = canvas.width - player.w;
  }

  // 向き
  if (player.vx > 0) {
    player.facing = 1;
  }

  if (player.vx < 0) {
    player.facing = -1;
  }

  // 重力
  player.vy += GRAVITY * dt;
  player.y += player.vy * dt;

  // 床との衝突
  collideWithFloor();

  // アニメーション状態
  const newState = decideState();

  if (newState !== player.state) {
    player.state = newState;
    player.frameIndex = 0;
    player.frameTimer = 0;
  }

  player.frameTimer += dt;

  if (player.frameTimer >= FRAME_TIME) {
    player.frameIndex =
      (player.frameIndex + 1) % ANIMS[player.state].count;

    player.frameTimer = 0;
  }

  // 無敵時間
  if (player.hitTimer > 0) {
    player.hitTimer = Math.max(0, player.hitTimer - dt);
  }
}

// プレイヤーを描く
function drawPlayer() {
  ctx.save();

  // 無敵時間中は半透明
  if (player.hitTimer > 0) {
    ctx.globalAlpha = 0.4;
  }

  // 画像が読み込まれている場合
  if (playerImg.complete && playerImg.naturalWidth > 0) {
    const sx = player.frameIndex * FRAME_SIZE;
    const sy = ANIMS[player.state].row * FRAME_SIZE;

    ctx.translate(
      player.x + player.w / 2,
      player.y + player.h / 2
    );

    ctx.scale(player.facing, 1);

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
  } else {
    // 画像が読み込めない場合は黄色い四角を表示
    ctx.fillStyle = "#ffd700";
    ctx.fillRect(player.x, player.y, player.w, player.h);
  }

  ctx.restore();

  // HP表示
  ctx.fillStyle = "white";
  ctx.font = "14px monospace";
  ctx.fillText("HP = " + player.hp, 10, 20);
}