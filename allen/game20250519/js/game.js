// 游戏主逻辑
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const beeCountElement = document.getElementById('beeCount');
const bigBeeCountElement = document.getElementById('bigBeeCount');
const turretTypeElement = document.getElementById('turretType');

// 设置画布大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 游戏状态
const gameState = {
    score: 0,
    beeCount: 0,
    bigBeeCount: 0,
    maxBeeCount: 160,
    maxBigBeeCount: 3,
    beesKilled: 0,
    gameOver: false,
    lastBeeSpawnTime: 0,
    beeSpawnInterval: 1500, // 1.5秒生成一个蜜蜂
    enemies: [],
    bullets: [],
    explosions: []
};

// 创建玩家
const player = new Player(canvas.width / 2, canvas.height - 100);

// 添加窗口大小变化监听
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 重新定位玩家到屏幕底部中央
    player.x = canvas.width / 2;
    player.y = canvas.height - 100;
});

// 游戏循环
function gameLoop(timestamp) {
    if (!gameState.gameOver) {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 生成敌人
        if (timestamp - gameState.lastBeeSpawnTime > gameState.beeSpawnInterval && 
            gameState.beeCount < gameState.maxBeeCount) {
            spawnEnemy();
            gameState.lastBeeSpawnTime = timestamp;
        }
        
        // 更新和绘制玩家
        player.update();
        player.draw(ctx);
        
        // 更新和绘制敌人
        updateEnemies();
        
        // 更新和绘制子弹
        updateBullets();
        
        // 更新和绘制爆炸效果
        updateExplosions();
        
        // 检测碰撞
        checkCollisions();
        
        // 检查游戏结束条件
        checkGameOver();
        
        // 更新UI
        updateUI();
        
        // 继续游戏循环
        requestAnimationFrame(gameLoop);
    } else {
        // 游戏结束显示
        drawGameOver();
    }
}

// 生成敌人
function spawnEnemy() {
    // 每60个小蜜蜂生成一个大蜜蜂
    if (gameState.beesKilled > 0 && gameState.beesKilled % 60 === 0 && 
        gameState.bigBeeCount < gameState.maxBigBeeCount) {
        const bigBee = new Enemy(
            Math.random() * (canvas.width - 60) + 30,
            -50,
            'big'
        );
        gameState.enemies.push(bigBee);
        gameState.bigBeeCount++;
    } else {
        const bee = new Enemy(
            Math.random() * (canvas.width - 40) + 20,
            -30,
            'small'
        );
        gameState.enemies.push(bee);
        gameState.beeCount++;
    }
}

// 更新敌人
function updateEnemies() {
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.enemies[i];
        enemy.update();
        enemy.draw(ctx);
        
        // 检查敌人是否到达底部
        if (enemy.y > canvas.height) {
            gameState.enemies.splice(i, 1);
        }
    }
}

// 更新子弹
function updateBullets() {
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        bullet.update();
        bullet.draw(ctx);
        
        // 移除超出屏幕的子弹
        if (bullet.y < -bullet.radius) {
            gameState.bullets.splice(i, 1);
        }
    }
}

// 更新爆炸效果
function updateExplosions() {
    for (let i = gameState.explosions.length - 1; i >= 0; i--) {
        const explosion = gameState.explosions[i];
        explosion.update();
        explosion.draw(ctx);
        
        // 移除已完成的爆炸效果
        if (explosion.isFinished()) {
            gameState.explosions.splice(i, 1);
        }
    }
}

// 检测碰撞
function checkCollisions() {
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        
        for (let j = gameState.enemies.length - 1; j >= 0; j--) {
            const enemy = gameState.enemies[j];
            
            // 检查子弹和敌人的碰撞
            const dx = bullet.x - enemy.x;
            const dy = bullet.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < bullet.radius + enemy.radius) {
                // 创建爆炸效果
                const explosion = new Explosion(
                    enemy.x,
                    enemy.y,
                    enemy.type === 'big' ? 'advanced' : 'normal',
                    player.turretType === 'advanced'
                );
                gameState.explosions.push(explosion);
                
                // 移除子弹和敌人
                gameState.bullets.splice(i, 1);
                gameState.enemies.splice(j, 1);
                
                // 更新分数
                gameState.score += enemy.type === 'big' ? 100 : 10;
                gameState.beesKilled++;
                
                // 跳出内循环，因为这个子弹已经被移除
                break;
            }
        }
    }
}

// 检查游戏结束条件
function checkGameOver() {
    if (gameState.beeCount >= gameState.maxBeeCount && 
        gameState.bigBeeCount >= gameState.maxBigBeeCount) {
        gameState.gameOver = true;
    }
}

// 更新UI
function updateUI() {
    scoreElement.textContent = `分数: ${gameState.score}`;
    beeCountElement.textContent = `小蜜蜂: ${gameState.beeCount}/${gameState.maxBeeCount}`;
    bigBeeCountElement.textContent = `大蜜蜂: ${gameState.bigBeeCount}/${gameState.maxBigBeeCount}`;
    turretTypeElement.textContent = `${player.turretType === 'normal' ? '普通炮台' : '高级炮台'} (按F1切换)`;
}

// 绘制游戏结束画面
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('游戏结束!', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.font = '24px Arial';
    ctx.fillText(`最终分数: ${gameState.score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText('按R键重新开始', canvas.width / 2, canvas.height / 2 + 50);
}

// 鼠标点击事件 - 发射子弹
canvas.addEventListener('click', (event) => {
    if (!gameState.gameOver) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        
        player.shoot(mouseX, mouseY, gameState.bullets);
    }
});

// 键盘事件
window.addEventListener('keydown', (event) => {
    // F1键切换炮台类型
    if (event.key === 'F1') {
        player.toggleTurretType();
        event.preventDefault(); // 阻止F1的默认行为
    }
    
    // R键重新开始游戏
    if (event.key === 'r' || event.key === 'R') {
        if (gameState.gameOver) {
            resetGame();
        }
    }
});

// 重置游戏
function resetGame() {
    gameState.score = 0;
    gameState.beeCount = 0;
    gameState.bigBeeCount = 0;
    gameState.beesKilled = 0;
    gameState.gameOver = false;
    gameState.lastBeeSpawnTime = 0;
    gameState.enemies = [];
    gameState.bullets = [];
    gameState.explosions = [];
    
    player.reset();
    
    // 重新开始游戏循环
    requestAnimationFrame(gameLoop);
}

// 开始游戏
requestAnimationFrame(gameLoop);