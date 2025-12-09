

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
});