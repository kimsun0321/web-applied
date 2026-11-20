
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

let x = 40;
let y = 40;          // 縦の位置（状態）

// 状態を少し変える
function update() {
  x = x + 2;
  y = y + 1;
}

// 全部消して、今の状態で描き直す
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#7aa2ff";
  ctx.fillRect(x, y, 40, 40);
}

// ゲームループ
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// 最初の1回を頼む
requestAnimationFrame(loop);
