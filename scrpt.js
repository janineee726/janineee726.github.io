// 粒子效果 - 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2d context');
        return;
    }

    // 设置canvas尺寸
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    // 鼠标位置
    const mouse = {
        x: null,
        y: null,
        radius: 100
    };

    // 监听鼠标移动
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 2;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            // 使用更亮的颜色，在深色背景上更明显
            const opacity = Math.random() * 0.4 + 0.6;
            this.color = `rgba(255, 248, 220, ${opacity})`; // cornsilk - 更亮的颜色
        }

        update() {
            // 粒子移动
            this.x += this.speedX;
            this.y += this.speedY;

            // 边界检测
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            // 鼠标交互
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    const moveX = Math.cos(angle) * force * 2;
                    const moveY = Math.sin(angle) * force * 2;
                    this.x -= moveX;
                    this.y -= moveY;
                }
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // 创建粒子数组
    const particles = [];
    const particleCount = 150;

    // 初始化粒子
    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // 初始化粒子
    initParticles();

    // 绘制连线
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    ctx.strokeStyle = `rgba(255, 248, 220, ${0.3 * (1 - distance / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 更新和绘制粒子
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // 绘制连线
        drawLines();

        requestAnimationFrame(animate);
    }

    // 启动动画
    animate();

    // 窗口大小改变时重新调整
    window.addEventListener('resize', () => {
        resizeCanvas();
        // 重新初始化粒子以适应新尺寸
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    });

    // 鼠标离开窗口时重置位置
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
});

// 消息切换功能
document.addEventListener('DOMContentLoaded', () => {
    const messageBtn = document.getElementById('messageBtn');
    const messageDisplay = document.getElementById('messageDisplay');
    
    const messages = [
        "I Love You",
        "Thanks for opening up to me.",
        "I'm here for you when you need me.",
        "How are you feeling today?",
        "I'm here for you when you need me.",
        "People do get better.",
        "Thanks for opening up to me."
    ];
    
    let currentIndex = -1;
    
    if (messageBtn && messageDisplay) {
        messageBtn.addEventListener('click', () => {
            // 切换到下一条消息
            currentIndex = (currentIndex + 1) % messages.length;
            messageDisplay.textContent = messages[currentIndex];
            messageDisplay.classList.add('show');
        });
    }
});