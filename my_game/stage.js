// ステージ：画面と床

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

// 床
const floor = {
  x: 0,
  y: 200,
  w: canvas.width,
  h: 40
};

// ステージを描く
function drawStage() {
  ctx.fillStyle = "#203060";
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h);
}