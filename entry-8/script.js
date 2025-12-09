// 粒子效果 - 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) {
        console.error('Canvas not found');
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
        radius: 120
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
            this.size = Math.random() * 4 + 3;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.7;
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

    // 创建粒子数组
    const particles = [];
    const particleCount = 200;

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

    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawLines();

        requestAnimationFrame(animate);
    }

    // 启动动画
    animate();

    // 窗口大小改变时重新调整
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // 鼠标离开窗口时重置位置
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
});

// 问题和答案的对应关系
const questions = [
    "What is stigma?",
    "What are core stigmatizing?",
    "What is public stigma?",
    "What is self stigma?",
    "What are ways to avoid stigma?"
];

const answers = [
    "Negative attitudes, beliefs, thoughts and behaviors that influences us to fear, reject, avoid, be prejudiced and discriminate against.",
    "Fear/exclusion, authoritarianism, benevolence.",
    "Public viewpoint and beliefs comprised of stereotypes, prejudice and discrimination.",
    "Self-stigma reactions of persons in the stigmatized group that turn the stigma towards themselves; believe the stigma.",
    "1. Self-stigma resulting in decreased self-esteem. 2. Reaction to stigma depends on awareness of having a MD. 3. Depends on perception of the messages from other people, which may be impaired."
];

// 从 URL 参数获取问题编号
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 显示答案
function displayAnswer() {
    const questionNum = getQueryParam('q');
    const questionIndex = parseInt(questionNum) - 1;
    
    const questionTitle = document.getElementById('questionTitle');
    const answerText = document.getElementById('answerText');
    
    if (questionIndex >= 0 && questionIndex < questions.length) {
        questionTitle.textContent = questions[questionIndex];
        answerText.textContent = answers[questionIndex];
    } else {
        // 如果没有有效的参数，显示默认内容
        questionTitle.textContent = "Question";
        answerText.textContent = "Please select a question from the previous page.";
    }
}

// 页面加载时显示答案
document.addEventListener('DOMContentLoaded', () => {
    displayAnswer();
});
