// 为主背景区域添加炫酷的粒子背景效果
document.addEventListener('DOMContentLoaded', () => {
    // 主背景粒子效果
    const mainCanvas = document.getElementById('mainCanvas');
    if (mainCanvas) {
        const ctx = mainCanvas.getContext('2d');
        if (ctx) {
            function resizeCanvas() {
                mainCanvas.width = window.innerWidth;
                mainCanvas.height = window.innerHeight;
            }
            resizeCanvas();

            const mouse = {
                x: null,
                y: null,
                radius: 120
            };

            window.addEventListener('mousemove', (e) => {
                mouse.x = e.x;
                mouse.y = e.y;
            });

            class Particle {
                constructor() {
                    this.x = Math.random() * mainCanvas.width;
                    this.y = Math.random() * mainCanvas.height;
                    this.size = Math.random() * 4 + 3;
                    this.speedX = Math.random() * 2 - 1;
                    this.speedY = Math.random() * 2 - 1;
                    this.opacity = Math.random() * 0.5 + 0.7;
                }

                update() {
                    this.x += this.speedX;
                    this.y += this.speedY;

                    if (this.x > mainCanvas.width) this.x = 0;
                    if (this.x < 0) this.x = mainCanvas.width;
                    if (this.y > mainCanvas.height) this.y = 0;
                    if (this.y < 0) this.y = mainCanvas.height;

                    if (mouse.x !== null && mouse.y !== null) {
                        const dx = mouse.x - this.x;
                        const dy = mouse.y - this.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < mouse.radius) {
                            const force = (mouse.radius - distance) / mouse.radius;
                            const angle = Math.atan2(dy, dx);
                            const moveX = Math.cos(angle) * force * 3;
                            const moveY = Math.sin(angle) * force * 3;
                            this.x -= moveX;
                            this.y -= moveY;
                        }
                    }
                }

                draw() {
                    ctx.fillStyle = `rgba(255, 248, 220, ${this.opacity})`;
                    ctx.shadowBlur = 15;
                    ctx.shadowColor = 'rgba(255, 248, 220, 0.8)';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }

            const particles = [];
            const particleCount = 200;

            function initParticles() {
                particles.length = 0;
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle());
                }
            }

            initParticles();

            function drawLines() {
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < 150) {
                            const opacity = 0.4 * (1 - distance / 150);
                            ctx.strokeStyle = `rgba(255, 248, 220, ${opacity})`;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.stroke();
                        }
                    }
                }
            }

            function animate() {
                ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                
                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });

                drawLines();

                requestAnimationFrame(animate);
            }

            animate();

            window.addEventListener('resize', () => {
                resizeCanvas();
                initParticles();
            });

            window.addEventListener('mouseout', () => {
                mouse.x = null;
                mouse.y = null;
            });
        }
    }

    // 为黑色区域添加炫酷的粒子背景效果
    const canvas = document.getElementById('rowCanvas');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get 2d context');
        return;
    }

    // 获取 .row 元素的尺寸
    const rowElement = canvas.parentElement;
    if (!rowElement) return;

    function resizeCanvas() {
        const rect = rowElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    
    resizeCanvas();

    // 鼠标位置
    const mouse = {
        x: null,
        y: null,
        radius: 100
    };

    // 监听鼠标移动（相对于 .row 元素）
    rowElement.addEventListener('mousemove', (e) => {
        const rect = rowElement.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    rowElement.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 2;
            this.speedX = Math.random() * 1.5 - 0.75;
            this.speedY = Math.random() * 1.5 - 0.75;
            this.opacity = Math.random() * 0.4 + 0.6;
            this.color = `rgba(85, 107, 47, ${this.opacity})`; // darkolivegreen
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;

            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    const moveX = Math.cos(angle) * force * 2.5;
                    const moveY = Math.sin(angle) * force * 2.5;
                    this.x -= moveX;
                    this.y -= moveY;
                }
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    // 创建粒子数组
    const particles = [];
    const particleCount = 80;

    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    initParticles();

    // 绘制连线
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = 0.3 * (1 - distance / 120);
                    ctx.strokeStyle = `rgba(85, 107, 47, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // 动画循环（将被下面的 animateWithPause 替代）

    // 窗口大小改变时重新调整
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // 使用 Intersection Observer 来优化性能（当元素不在视口中时暂停动画）
    let isAnimating = true;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isAnimating = entry.isIntersecting;
        });
    }, { threshold: 0.1 });

    observer.observe(rowElement);

    // 修改动画函数以支持暂停
    function animateWithPause() {
        if (isAnimating) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            drawLines();
        }
        requestAnimationFrame(animateWithPause);
    }

    // 启动动画
    animateWithPause();
});


