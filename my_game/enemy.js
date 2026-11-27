// 敵の設定

// 敵を1体作る
function createEnemy(x, vx) {
  return {
    x: x,
    y: floor.y - 32,
    w: 32,
    h: 32,
    vx: vx,
    alive: true
  };
}

// 敵の配列
let enemies = [];

// 敵を初期状態に戻す
function resetEnemies() {
  enemies = [];

  enemies.push(createEnemy(200, 80));
  enemies.push(createEnemy(380, -120));
  enemies.push(createEnemy(540, 60));

  // プレイヤーに気づく敵
  const special = createEnemy(300, 80);
  special.type = "chase";
  special.normalSpeed = 80;
  special.nearSpeed = 160;

  enemies.push(special);
}

// 最初の敵を作る
resetEnemies();

// 敵を動かす
function updateEnemies(dt) {
  for (const enemy of enemies) {

    // 特殊な敵はプレイヤーとの距離で速さを変える
    if (enemy.type === "chase") {
      const dx =
        (player.x + player.w / 2) -
        (enemy.x + enemy.w / 2);

      const dy =
        (player.y + player.h / 2) -
        (enemy.y + enemy.h / 2);

      const distance = Math.sqrt(dx * dx + dy * dy);
      const direction = enemy.vx >= 0 ? 1 : -1;

      if (distance < 150) {
        enemy.vx = direction * enemy.nearSpeed;
      } else {
        enemy.vx = direction * enemy.normalSpeed;
      }
    }

    // 敵を移動
    enemy.x += enemy.vx * dt;

    // 左端で反転
    if (enemy.x < 0) {
      enemy.x = 0;
      enemy.vx = Math.abs(enemy.vx);
    }

    // 右端で反転
    if (enemy.x + enemy.w > canvas.width) {
      enemy.x = canvas.width - enemy.w;
      enemy.vx = -Math.abs(enemy.vx);
    }
  }
}

// プレイヤーと敵の衝突判定
function collideWithEnemies(prevBottom) {
  for (const enemy of enemies) {
    if (!enemy.alive) {
      continue;
    }

    if (
      aabb(player, enemy) &&
      prevBottom <= enemy.y &&
      player.vy > 0
    ) {
      // 上から踏んだ場合
      enemy.alive = false;
      player.vy = -JUMP_SPEED / 2;
      player.jumpsLeft = MAX_JUMPS;
    } else if (
      aabb(player, enemy) &&
      player.hitTimer <= 0
    ) {
      // 横からぶつかった場合
      player.hp--;
      player.hitTimer = HIT_TIME;
    }
  }

  // 生きている敵だけ残す
  enemies = enemies.filter((enemy) => enemy.alive);
}

// 敵を描く
function drawEnemies() {
  for (const enemy of enemies) {
    if (enemy.type === "chase") {
      ctx.fillStyle = "purple";
    } else {
      ctx.fillStyle = "#ff6b6b";
    }

    ctx.fillRect(
      enemy.x,
      enemy.y,
      enemy.w,
      enemy.h
    );
  }

  ctx.fillStyle = "white";
  ctx.font = "14px monospace";
  ctx.fillText("敵 = " + enemies.length, 10, 40);
}