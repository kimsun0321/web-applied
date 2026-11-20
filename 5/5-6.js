
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

// 画像を読み込む
const img = new Image();
img.src = "5-5_player.png";

let x = 100;          // 画像の左上の位置
let y = 160;
const size = 48;      // 画像の大きさ
const speed = 240;    // 速さ：1秒に240px

const keys = {};      // 押されているキーを覚える

// キーを押したとき
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

// キーを離したとき
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// 押されているキーを見て位置を変える
function update(dt) {
  if (keys["ArrowRight"]) {
    x = x + speed * dt;
  }
  if (keys["ArrowLeft"]) {
    x = x - speed * dt;
  }
  if (keys["ArrowDown"]) {
    y = y + speed * dt;
  }
  if (keys["ArrowUp"]) {
    y = y - speed * dt;
  }

  // 画面の端で止める
  if (x < 0) {
    x = 0;
  }
  if (x > canvas.width - size) {
    x = canvas.width - size;
  }
  if (y < 0) {
    y = 0;
  }
  if (y > canvas.height - size) {
    y = canvas.height - size;
  }
}

// 画像を描く
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, x, y, size, size);
}

// 前回の時刻
let last = performance.now();

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
