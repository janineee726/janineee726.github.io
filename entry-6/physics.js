
// 物理引擎 - 重力、碰撞、拖动效果
document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.physics-box');
    if (boxes.length === 0) {
        console.error('No physics boxes found!');
        return;
    }
    console.log(`Found ${boxes.length} physics boxes`);

    // 物理参数
    const FLOAT_SPEED = 0.15; // 漂浮速度
    const FLOAT_RANGE_X = 10; // X轴漂浮范围（减小以避免遮挡）
    const FLOAT_RANGE_Y = 20; // Y轴漂浮范围
    const DRAG_DAMPING = 0.95;

    // 获取容器边界
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    
    // 物理对象数组
    const physicsObjects = [];
    let isInitialized = false;
    
    // 获取标题位置，方块应该在标题下方，更靠近标题
    let helpElement = document.querySelector('.help');
    let helpRect = helpElement ? helpElement.getBoundingClientRect() : null;
    // 从标题底部开始，充分利用空白区域
    let physicsAreaTop = helpRect ? helpRect.bottom + 20 : 850; 
    let physicsAreaBottom = physicsAreaTop + 400; // 增加区域高度，充分利用空间

    // 物理对象类
    class PhysicsBox {
        constructor(element, index) {
            this.element = element;
            this.index = index;
            
            // 初始位置（在标题下方区域内均匀分布，间距更大，避免重叠）
            const containerWidth = window.innerWidth;
            const boxWidth = 250;
            const boxHeight = 120;
            const minSpacingX = 300; // X轴最小间距（方块宽度250 + 间距50）
            const minSpacingY = 150; // Y轴最小间距（方块高度120 + 间距30）
            
            // 计算可以放多少列
            const cols = Math.floor((containerWidth - 40) / minSpacingX); // 留出左右边距
            const rows = Math.ceil(boxes.length / cols);
            
            // 计算每列的实际间距
            const actualSpacingX = cols > 1 ? (containerWidth - 40 - boxWidth) / (cols - 1) : 0;
            const col = index % cols;
            const row = Math.floor(index / cols);
            
            // X位置：均匀分布，确保不超出屏幕
            const marginX = 20;
            let startX;
            if (cols === 1) {
                startX = (containerWidth - boxWidth) / 2; // 居中
            } else {
                startX = marginX + col * actualSpacingX;
            }
            startX = Math.max(marginX, Math.min(containerWidth - boxWidth - marginX, startX));
            
            // Y位置：按行分布，确保有足够间距
            const areaHeight = physicsAreaBottom - physicsAreaTop - boxHeight;
            const actualSpacingY = rows > 1 ? areaHeight / (rows - 1) : 0;
            const startY = physicsAreaTop + row * actualSpacingY;
            
            this.x = startX;
            this.y = startY;
            this.width = 250;
            this.height = 120;
            this.mass = 1;
            
            // 漂浮相关（X轴范围很小，Y轴可以稍大，避免相互遮挡）
            this.floatOffsetX = (Math.random() - 0.5) * FLOAT_RANGE_X;
            this.floatOffsetY = (Math.random() - 0.5) * FLOAT_RANGE_Y;
            this.floatSpeedX = (Math.random() - 0.5) * FLOAT_SPEED;
            this.floatSpeedY = (Math.random() - 0.5) * FLOAT_SPEED;
            this.baseX = startX;
            this.baseY = startY;
            this.floatTime = Math.random() * Math.PI * 2; // 随机初始相位
            
            // 拖动相关
            this.isDragging = false;
            this.dragOffsetX = 0;
            this.dragOffsetY = 0;
            
            // 设置初始位置
            this.updatePosition();
            
            // 添加拖动事件
            this.setupDrag();
        }

        setupDrag() {
            this.element.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return; // 只响应左键
                
                const rect = this.element.getBoundingClientRect();
                this.dragOffsetX = e.clientX - rect.left - rect.width / 2;
                this.dragOffsetY = e.clientY - rect.top - rect.height / 2;
                
                this.isDragging = true;
                this.element.classList.add('dragging');
                this.vx = 0;
                this.vy = 0;
                e.preventDefault();
            });
        }

        updatePosition() {
            this.element.style.left = this.x + 'px';
            this.element.style.top = this.y + 'px';
            this.element.style.position = 'absolute';
        }

        update(deltaTime) {
            if (this.isDragging) return;

            // 漂浮效果：使用正弦波创建平滑的漂浮运动
            this.floatTime += deltaTime * 0.05; // 控制漂浮速度
            
            // 计算漂浮偏移
            const floatX = Math.sin(this.floatTime + this.floatSpeedX) * this.floatOffsetX;
            const floatY = Math.cos(this.floatTime + this.floatSpeedY) * this.floatOffsetY;
            
            // 更新位置（基础位置 + 漂浮偏移）
            this.x = this.baseX + floatX;
            this.y = this.baseY + floatY;
            
            // 边界检测（限制在标题下方的区域内，确保不超出屏幕）
            const containerWidth = window.innerWidth;
            const margin = 10; // 边距
            
            // 右边界（确保不超出屏幕）
            if (this.x + this.width > containerWidth - margin) {
                this.x = containerWidth - this.width - margin;
                this.baseX = this.x - floatX;
            }
            
            // 左边界
            if (this.x < margin) {
                this.x = margin;
                this.baseX = this.x - floatX;
            }
            
            // 下边界（限制在指定区域内）
            if (this.y + this.height > physicsAreaBottom) {
                this.y = physicsAreaBottom - this.height;
                this.baseY = this.y - floatY;
            }
            
            // 上边界（标题下方，不能超过标题区域）
            if (this.y < physicsAreaTop) {
                this.y = physicsAreaTop;
                this.baseY = this.y - floatY;
            }
            
            this.updatePosition();
        }

        checkCollision(other) {
            if (this === other || this.isDragging || other.isDragging) return false;
            
            const dx = (this.x + this.width / 2) - (other.x + other.width / 2);
            const dy = (this.y + this.height / 2) - (other.y + other.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 简化的碰撞检测（使用圆形边界）
            const minDist = (this.width + other.width) / 2;
            
            if (distance < minDist && distance > 0) {
                // 计算碰撞角度
                const angle = Math.atan2(dy, dx);
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                
                // 分离物体，调整基础位置以避免重叠
                const overlap = minDist - distance;
                const separationX = cos * overlap * 0.5;
                const separationY = sin * overlap * 0.5;
                
                this.x += separationX;
                this.y += separationY;
                other.x -= separationX;
                other.y -= separationY;
                
                // 更新基础位置，保持漂浮效果
                this.baseX = this.x;
                this.baseY = this.y;
                other.baseX = other.x;
                other.baseY = other.y;
                
                return true;
            }
            
            return false;
        }

        handleDrag(mouseX, mouseY) {
            if (!this.isDragging) return;
            
            this.x = mouseX - this.width / 2 - this.dragOffsetX;
            this.y = mouseY - this.height / 2 - this.dragOffsetY;
            
            // 限制在标题下方的区域内，确保不超出屏幕
            const containerWidth = window.innerWidth;
            const margin = 10; // 边距
            
            this.x = Math.max(margin, Math.min(containerWidth - this.width - margin, this.x));
            this.y = Math.max(physicsAreaTop, Math.min(physicsAreaBottom - this.height, this.y));
            
            // 更新基础位置，这样松开后漂浮会以新位置为中心
            this.baseX = this.x;
            this.baseY = this.y;
            
            this.updatePosition();
        }

        stopDrag() {
            if (this.isDragging) {
                this.isDragging = false;
                this.element.classList.remove('dragging');
                // 更新基础位置为当前位置
                this.baseX = this.x;
                this.baseY = this.y;
            }
        }
    }

    // 初始化所有方块
    boxes.forEach((box, index) => {
        physicsObjects.push(new PhysicsBox(box, index));
    });
    console.log(`Initialized ${physicsObjects.length} physics objects`);

    // 鼠标事件处理
    let isMouseDown = false;
    let currentDragBox = null;

    document.addEventListener('mousemove', (e) => {
        if (isMouseDown && currentDragBox) {
            currentDragBox.handleDrag(e.clientX, e.clientY);
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (currentDragBox) {
            currentDragBox.stopDrag();
            currentDragBox = null;
        }
        isMouseDown = false;
    });

    // 更新拖动目标
    boxes.forEach((box) => {
        box.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isMouseDown = true;
            const physicsBox = physicsObjects.find(obj => obj.element === box);
            if (physicsBox) {
                currentDragBox = physicsBox;
                const rect = box.getBoundingClientRect();
                physicsBox.dragOffsetX = e.clientX - rect.left - rect.width / 2;
                physicsBox.dragOffsetY = e.clientY - rect.top - rect.height / 2;
            }
            e.preventDefault();
        });
    });

    // 动画循环
    let lastTime = null;
    
    function animate(currentTime) {
        if (lastTime === null) {
            lastTime = currentTime;
            requestAnimationFrame(animate);
            return;
        }
        
        const deltaTime = Math.min((currentTime - lastTime) / 16.67, 2); // 限制最大deltaTime，转换为帧率倍数
        lastTime = currentTime;
        
        // 更新所有物理对象
        physicsObjects.forEach(obj => {
            if (!obj.isDragging) {
                obj.update(deltaTime);
            }
        });
        
        requestAnimationFrame(animate);
    }

    // 启动动画
    requestAnimationFrame(animate);

    // 窗口大小改变时重新计算
    window.addEventListener('resize', () => {
        const containerWidth = window.innerWidth;
        
        // 重新计算物理区域
        helpElement = document.querySelector('.help');
        helpRect = helpElement ? helpElement.getBoundingClientRect() : null;
        // 从标题底部开始，充分利用空白区域
        physicsAreaTop = helpRect ? helpRect.bottom + 20 : 850;
        physicsAreaBottom = physicsAreaTop + 400;
        
        physicsObjects.forEach(obj => {
            if (obj.x + obj.width > containerWidth) {
                obj.x = containerWidth - obj.width;
            }
            if (obj.y + obj.height > physicsAreaBottom) {
                obj.y = physicsAreaBottom - obj.height;
            }
            if (obj.y < physicsAreaTop) {
                obj.y = physicsAreaTop;
            }
            obj.updatePosition();
        });
    });
});