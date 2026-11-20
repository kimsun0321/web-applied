
const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");

let x = 40;
let last = performance.now();

// 状態を少し変える
function update() {
  x = x + 2;
}

// 全部消して、今の状態で描き直す
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#7aa2ff";
  ctx.fillRect(x, 160, 40, 40);
}

// ゲームループ
function loop(now) {
  const dt = (now - last) / 1000;
  last = now;

  info.textContent = "dt：" + dt.toFixed(4) + " 秒　／　1秒に約 " + (1 / dt).toFixed(0) + " 回";

  update();
  draw();
  requestAnimationFrame(loop);
}

// 最初の1回を頼む
requestAnimationFrame(loop);
