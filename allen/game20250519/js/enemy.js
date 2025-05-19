// 敌人类 - 蜜蜂
class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'small' 或 'big'
        
        // 根据类型设置属性
        if (type === 'small') {
            this.radius = 15;
            this.speed = 0.5; // 较慢的速度
            this.color = 'yellow';
        } else {
            this.radius = 30;
            this.speed = 0.3; // 更慢的速度
            this.color = 'orange';
        }
        
        // 加载蜜蜂图像
        this.image = new Image();
        this.image.src = type === 'small' ? 'assets/images/bee.png' : 'assets/images/big-bee.png';
    }
    
    update() {
        // 蜜蜂向下移动
        this.y += this.speed;
    }
    
    draw(ctx) {
        // 绘制蜜蜂图像
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
    }
}