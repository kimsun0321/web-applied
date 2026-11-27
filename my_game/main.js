// ゲーム全体の更新と描画

let gameState = "title";
let survivalTime = 0;

// ゲームを最初から始める
function resetGame() {
  player.x = 80;
  player.y = 20;
  player.vx = 0;
  player.vy = 0;
  player.isGrounded = false;
  player.jumpsLeft = MAX_JUMPS;
  player.state = "idle";
  player.frameIndex = 0;
  player.frameTimer = 0;
  player.facing = 1;
  player.hp = MAX_HP;
  player.hitTimer = 0;

  // キー入力をリセット
  for (const key in keys) {
    keys[key] = false;
  }

  resetEnemies();

  survivalTime = 0;
  gameState = "playing";
}

// Enterキーで開始・再挑戦
document.addEventListener("keydown", (e) => {
  if (
    e.code === "Enter" &&
    (gameState === "title" || gameState === "gameover")
  ) {
    resetGame();
  }
});

// ゲームの更新
function update(dt) {
  if (gameState !== "playing") {
    return;
  }

  survivalTime += dt;

  const prevBottom = player.y + player.h;

  updatePlayer(dt);
  updateEnemies(dt);

  collideWithEnemies(prevBottom);

  // HPが0になったら終了
  if (player.hp <= 0) {
    player.hp = 0;
    gameState = "gameover";
  }
}

// 中央に文字を表示
function drawCenteredMessage(message, y, size) {
  ctx.fillStyle = "white";
  ctx.font = "bold " + size + "px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, y);
  ctx.textAlign = "left";
}

// 描画
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStage();

  if (gameState === "title") {
    drawCenteredMessage("気づく敵ランナー", 75, 30);
    drawCenteredMessage("近づく敵を避けて生き残れ！", 115, 18);
    drawCenteredMessage("← →：移動   Space：ジャンプ", 155, 16);
    drawCenteredMessage("Enterキーでスタート", 190, 18);
    return;
  }

  drawEnemies();
  drawPlayer();

  ctx.fillStyle = "white";
  ctx.font = "14px monospace";
  ctx.fillText(
    "TIME = " + survivalTime.toFixed(1) + "秒",
    440,
    20
  );

  if (gameState === "gameover") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawCenteredMessage("GAME OVER", 85, 32);
    drawCenteredMessage(
      "生存時間：" + survivalTime.toFixed(1) + "秒",
      125,
      20
    );
    drawCenteredMessage("Enterキーでもう一度遊ぶ", 170, 18);
  }
}

// ゲームループ
let last = performance.now();

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.033);
  last = now;

  // 次のフレームを先に予約する
  requestAnimationFrame(loop);

  update(dt);
  draw();
}

// ゲーム開始
requestAnimationFrame(loop);