// 玩家类 - 控制炮塔
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.turretType = 'normal'; // 'normal' 或 'advanced'
        
        // 加载炮塔图像
        this.normalTurretImage = new Image();
        this.normalTurretImage.src = 'assets/images/turret.png';
        
        this.advancedTurretImage = new Image();
        this.advancedTurretImage.src = 'assets/images/advanced-turret.png';
    }
    
    update() {
        // 炮塔的更新逻辑（如果需要）
    }
    
    draw(ctx) {
        const image = this.turretType === 'normal' ? this.normalTurretImage : this.advancedTurretImage;
        
        // 检查图像是否已加载
        if (image.complete) {
            // 绘制炮塔
            ctx.drawImage(
                image,
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );
        } else {
            // 如果图像未加载，绘制一个占位符
            ctx.beginPath();
            ctx.arc(this.x, this.y, 30, 0, Math.PI * 2);
            ctx.fillStyle = this.turretType === 'normal' ? '#00FFFF' : '#FF00FF';
            ctx.fill();
            ctx.closePath();
            
            // 添加图像加载事件
            image.onload = function() {
                ctx.drawImage(
                    image,
                    this.x - this.width / 2,
                    this.y - this.height / 2,
                    this.width,
                    this.height
                );
            }.bind(this);
        }
    }
    
    shoot(targetX, targetY, bullets) {
        // 计算射击方向
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const angle = Math.atan2(dy, dx);
        
        if (this.turretType === 'normal') {
            // 普通炮台 - 发射单个子弹
            bullets.push(new Bullet(this.x, this.y, angle, 'normal'));
        } else {
            // 高级炮台 - 发射三个子弹
            bullets.push(new Bullet(this.x, this.y, angle, 'advanced'));
            bullets.push(new Bullet(this.x, this.y, angle - 0.2, 'advanced'));
            bullets.push(new Bullet(this.x, this.y, angle + 0.2, 'advanced'));
        }
    }
    
    toggleTurretType() {
        this.turretType = this.turretType === 'normal' ? 'advanced' : 'normal';
    }
    
    reset() {
        this.turretType = 'normal';
    }
}