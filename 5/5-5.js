
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

let x = 100;          // 画像の中心の位置
let y = 80;
let vx = 180;         // 横の速さ（1秒に180px）
let vy = 140;         // 縦の速さ（1秒に140px）
const r = 24;         // 半径（画像は48×48）
let last = performance.now();

// ① 画像を入れる入れ物を作る
const img = new Image();

// ② 読み込む画像ファイルを指定する
img.src = "5-5_player.png";

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

// ③ 画像を描く
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, x - r, y - r, r * 2, r * 2);
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
