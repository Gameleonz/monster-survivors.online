// 爆炸效果类
class Explosion {
    constructor(x, y, type, isAdvanced) {
        this.x = x;
        this.y = y;
        this.type = type; // 'normal' 或 'advanced'
        this.isAdvanced = isAdvanced; // 是否由高级炮台发射的子弹引起
        this.radius = 0;
        this.maxRadius = type === 'advanced' ? 300 : 200;
        this.expandSpeed = 10;
        this.particles = [];
        this.alpha = 1;
        this.fadeSpeed = 0.02;
        
        // 创建爆炸粒子
        this.createParticles();
    }
    
    createParticles() {
        // 减少粒子数量以提高性能
        const particleCount = this.isAdvanced ? 60 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 2;
            const size = Math.random() * 4 + 2;
            const life = Math.random() * 50 + 30;
            
            // 为高级爆炸创建更多颜色
            let color;
            if (this.isAdvanced) {
                const colors = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF'];
                color = colors[Math.floor(Math.random() * colors.length)];
            } else {
                const colors = ['#FF0000', '#FF8800', '#FFFF00'];
                color = colors[Math.floor(Math.random() * colors.length)];
            }
            
            this.particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                life: life,
                maxLife: life
            });
        }
    }
    
    update() {
        // 扩大爆炸半径
        if (this.radius < this.maxRadius) {
            this.radius += this.expandSpeed;
        } else {
            this.alpha -= this.fadeSpeed;
        }
        
        // 更新粒子 - 优化性能
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            // 移除已经消失的粒子以提高性能
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    draw(ctx) {
        // 绘制爆炸圆环
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.isAdvanced ? 
            `rgba(255, 0, 255, ${this.alpha})` : 
            `rgba(255, 165, 0, ${this.alpha})`;
        ctx.lineWidth = 5;
        ctx.stroke();
        
        // 绘制爆炸中心光芒
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.radius
        );
        
        if (this.isAdvanced) {
            gradient.addColorStop(0, `rgba(255, 0, 255, ${this.alpha * 0.8})`);
            gradient.addColorStop(0.4, `rgba(128, 0, 255, ${this.alpha * 0.4})`);
            gradient.addColorStop(1, `rgba(64, 0, 128, 0)`);
        } else {
            gradient.addColorStop(0, `rgba(255, 255, 0, ${this.alpha * 0.8})`);
            gradient.addColorStop(0.4, `rgba(255, 128, 0, ${this.alpha * 0.4})`);
            gradient.addColorStop(1, `rgba(255, 0, 0, 0)`);
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // 绘制粒子
        for (const particle of this.particles) {
            if (particle.life > 0) {
                const alpha = particle.life / particle.maxLife;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
                ctx.fill();
                ctx.closePath();
            }
        }
        
        // 高级炮台的烟花效果 - 优化性能
        if (this.isAdvanced && this.radius > this.maxRadius / 2 && this.alpha > 0.3) {
            this.drawFireworks(ctx);
        }
    }
    
    drawFireworks(ctx) {
        // 绘制烟花效果 - 减少烟花数量以提高性能
        const fireworkCount = 3;
        const angleStep = (Math.PI * 2) / fireworkCount;
        
        for (let i = 0; i < fireworkCount; i++) {
            const angle = i * angleStep;
            const x = this.x + Math.cos(angle) * this.radius * 0.7;
            const y = this.y + Math.sin(angle) * this.radius * 0.7;
            const size = 20 * this.alpha;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.8})`;
            ctx.fill();
            ctx.closePath();
            
            // 绘制光线 - 减少光线数量以提高性能
            for (let j = 0; j < 6; j++) {
                const rayAngle = j * Math.PI / 3;
                const rayLength = size * 2;
                
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(
                    x + Math.cos(rayAngle) * rayLength,
                    y + Math.sin(rayAngle) * rayLength
                );
                ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha * 0.5})`;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
    
    isFinished() {
        return this.alpha <= 0;
    }
}