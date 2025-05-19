// 子弹类
class Bullet {
    constructor(x, y, angle, type) {
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.speed = 7;
        this.angle = angle;
        this.type = type; // 'normal' 或 'advanced'
        this.color = type === 'normal' ? '#00FFFF' : '#FF00FF';
        this.subBullets = [];
        this.hasSpawned = false;
        
        // 计算速度向量
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        
        // 加载子弹图像
        this.image = new Image();
        this.image.src = 'assets/images/bullet.png';
    }
    
    update() {
        // 更新子弹位置
        this.x += this.vx;
        this.y += this.vy;
        
        // 高级子弹在飞行一段距离后分裂
        if (this.type === 'advanced' && !this.hasSpawned && this.y < 400) {
            this.spawnSubBullets();
            this.hasSpawned = true;
        }
        
        // 更新子弹的子弹
        for (let i = this.subBullets.length - 1; i >= 0; i--) {
            const subBullet = this.subBullets[i];
            subBullet.update();
            
            // 移除超出屏幕的子弹
            if (subBullet.y < 0 || subBullet.y > 600 || 
                subBullet.x < 0 || subBullet.x > 800) {
                this.subBullets.splice(i, 1);
            }
        }
    }
    
    draw(ctx) {
        // 绘制子弹
        ctx.drawImage(
            this.image,
            this.x - this.radius,
            this.y - this.radius,
            this.radius * 2,
            this.radius * 2
        );
        
        // 如果图像未加载，则绘制一个圆形作为替代
        if (!this.image.complete) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
        
        // 绘制子弹的子弹
        for (const subBullet of this.subBullets) {
            subBullet.draw(ctx);
        }
    }
    
    spawnSubBullets() {
        // 高级子弹分裂成多个小子弹
        for (let i = 0; i < 5; i++) {
            const angle = this.angle + (i - 2) * 0.3;
            const subBullet = new Bullet(this.x, this.y, angle, 'normal');
            subBullet.radius = 3;
            subBullet.speed = 5;
            subBullet.vx = Math.cos(angle) * subBullet.speed;
            subBullet.vy = Math.sin(angle) * subBullet.speed;
            this.subBullets.push(subBullet);
        }
    }
}