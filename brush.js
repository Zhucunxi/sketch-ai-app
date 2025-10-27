// Brush.js - 专业笔刷系统架构

/**
 * 笔刷基类 - 管理笔刷状态和行为
 */
class Brush {
    constructor() {
        console.log('==== Brush类初始化 ====');
        // 笔刷基本属性
        this.type = 'pencil';
        this.size = 3;
        this.flow = 100;
        this.hardness = 80;
        this.spacing = 10; // 减小间距以确保线条连续
        this.smoothness = 30; // 降低平滑度避免过度平滑
        this.color = '#000000';
        
        // 绘制状态
        this.lastPoint = null;
        this.points = []; // 用于平滑处理
        this.isDrawing = false;
        
        // 引用外部上下文
        this.ctx = null;
        
        console.log('笔刷初始化完成，默认类型:', this.type);
    }
    
    /**
     * 设置Canvas上下文
     */
    setContext(context) {
        this.ctx = context;
        console.log(`笔刷上下文已设置，当前笔刷类型: ${this.type}`);
        console.log('上下文引用:', !!context);
        // 立即更新上下文属性
        this.updateContextProperties();
    }
    
    /**
     * 设置笔刷类型
     */
    setType(type) {
        if (!this.isValidBrushType(type)) {
            console.warn(`不支持的笔刷类型: ${type}`);
            return;
        }
        // 添加调试输出，跟踪笔刷类型切换
        console.log(`笔刷类型从 ${this.type} 切换到 ${type}`);
        this.type = type;
        // 重置绘制状态，确保新笔刷类型的正确行为
        this.points = [];
        this.particleBuffer = [];
        // 立即更新上下文属性以应用新笔刷类型的设置
        this.updateContextProperties();
    }
    
    /**
     * 验证笔刷类型
     */
    isValidBrushType(type) {
        return ['pencil', 'pen', 'marker', 'watercolor', 'spray'].includes(type);
    }
    
    /**
     * 设置笔刷大小 (1-100px)
     */
    setSize(size) {
        this.size = Math.max(1, Math.min(100, size));
        this.updateContextProperties();
    }
    
    /**
     * 设置笔刷流量 (1-100%)
     */
    setFlow(flow) {
        this.flow = Math.max(1, Math.min(100, flow));
        this.updateContextProperties();
    }
    
    /**
     * 设置笔刷硬度 (0-100%)
     */
    setHardness(hardness) {
        this.hardness = Math.max(0, Math.min(100, hardness));
        this.updateContextProperties();
    }
    
    /**
     * 设置笔刷间距 (1-100%)
     */
    setSpacing(spacing) {
        this.spacing = Math.max(1, Math.min(100, spacing));
    }
    
    /**
     * 设置平滑度 (0-100%)
     */
    setSmoothness(smoothness) {
        this.smoothness = Math.max(0, Math.min(100, smoothness));
    }
    
    /**
     * 设置笔刷颜色
     */
    setColor(color) {
        this.color = color;
        this.updateContextProperties();
    }
    
    /**
     * 更新Canvas上下文属性
     */
    updateContextProperties() {
        if (!this.ctx) {
            console.log('警告: 上下文未设置，无法更新属性');
            return;
        }
        
        console.log(`更新上下文属性，笔刷类型: ${this.type}`);
        
        // 基础属性设置（无论什么笔刷类型都应用）
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.globalAlpha = this.flow / 100;
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.imageSmoothingEnabled = true;
        
        console.log(`上下文属性: strokeStyle=${this.ctx.strokeStyle}, lineWidth=${this.ctx.lineWidth}`);
    }
    
    /**
     * 设置铅笔属性
     */
    setupPencilProperties() {
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.globalAlpha = this.flow / 100;
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.imageSmoothingEnabled = true;
    }
    
    /**
     * 设置钢笔属性
     */
    setupPenProperties() {
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.globalAlpha = this.flow / 100;
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        // 钢笔使用更高的精度和抗锯齿
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }
    
    /**
     * 设置马克笔属性
     */
    setupMarkerProperties() {
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.globalAlpha = this.flow / 100;
        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.imageSmoothingEnabled = true;
    }
    
    /**
     * 设置水彩属性
     */
    setupWatercolorProperties() {
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.globalAlpha = (this.flow / 100) * 0.7;
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.imageSmoothingEnabled = true;
    }
    
    /**
     * 设置喷枪属性
     */
    setupSprayProperties() {
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = this.flow / 100;
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.imageSmoothingEnabled = true;
    }
    
    /**
     * 开始绘制
     */
    startDrawing(x, y) {
        console.log(`==== 开始绘制, 位置: (${x}, ${y}) ====`);
        
        if (!this.ctx) {
            console.log('错误: 上下文未设置，无法开始绘制');
            return;
        }
        
        this.isDrawing = true;
        this.lastPoint = { x, y };
        this.points = [{ x, y }];
        
        console.log('绘制状态已设置，lastPoint:', this.lastPoint);
        
        // 保存当前上下文状态
        this.ctx.save();
        
        // 简单的通用开始绘制逻辑
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        
        // 绘制起始点的一个小点
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.size / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        
        console.log('起始点绘制完成');
    }
    
    /**
     * 计算速度 - 辅助方法
     */
    calculateVelocity(x, y) {
        if (!this.lastTimestamp) return;
        
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.lastTimestamp;
        if (elapsedTime > 0) {
            const dx = x - this.lastPoint.x;
            const dy = y - this.lastPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            this.currentVelocity = distance / elapsedTime;
            // 限制最大速度
            this.currentVelocity = Math.min(this.currentVelocity, this.maxVelocity);
        }
        this.lastTimestamp = currentTime;
    }
    
    /**
     * 主绘制方法 - 简化版，直接画线
     */
    draw(x, y) {
        console.log(`绘制, 位置: (${x}, ${y})`);
        
        if (!this.ctx || !this.isDrawing || !this.lastPoint) {
            console.log('无法绘制: 上下文未设置或不在绘制状态或没有上一个点');
            console.log('- ctx存在:', !!this.ctx);
            console.log('- isDrawing:', this.isDrawing);
            console.log('- lastPoint:', !!this.lastPoint);
            return;
        }
        
        // 记录点
        this.points.push({ x, y });
        
        // 简化的直接绘制逻辑，不使用复杂的平滑或特效
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
        this.ctx.lineTo(x, y);
        
        // 确保正确设置了绘制属性
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.globalAlpha = this.flow / 100;
        
        this.ctx.stroke();
        
        // 更新最后一个点
        this.lastPoint = { x, y };
        
        console.log('绘制线段完成');
    }
    
    /**
     * 计算绘制速度（用于压感模拟）
     */
    calculateVelocity(x, y) {
        const currentTime = Date.now();
        
        if (this.lastTimestamp) {
            const timeDiff = currentTime - this.lastTimestamp;
            const dx = x - this.lastPoint.x;
            const dy = y - this.lastPoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // 计算速度（像素/毫秒）
            this.currentVelocity = Math.min(distance / Math.max(timeDiff, 1), this.maxVelocity);
        }
        
        this.lastTimestamp = currentTime;
    }
    
    /**
     * 应用平滑算法
     */
    applySmoothing(points) {
        if (points.length < 3) return points;
        
        // 贝塞尔曲线平滑
        const smoothed = [];
        const smoothFactor = this.smoothness / 100;
        
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = i > 0 ? points[i - 1] : points[i];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = i < points.length - 2 ? points[i + 2] : points[i + 1];
            
            // 计算控制点
            const cp1x = p1.x + (p2.x - p0.x) * 0.1 * smoothFactor;
            const cp1y = p1.y + (p2.y - p0.y) * 0.1 * smoothFactor;
            const cp2x = p2.x - (p3.x - p1.x) * 0.1 * smoothFactor;
            const cp2y = p2.y - (p3.y - p1.y) * 0.1 * smoothFactor;
            
            smoothed.push({
                x: cp1x,
                y: cp1y
            });
        }
        
        smoothed.push(points[points.length - 1]);
        return smoothed;
    }
    
    /**
     * 结束绘制
     */
    endDrawing() {
        console.log('==== 结束绘制 ====');
        
        if (!this.ctx || !this.isDrawing) {
            console.log('无法结束绘制: 上下文未设置或不在绘制状态');
            return;
        }
        
        // 恢复上下文状态
        this.ctx.restore();
        
        // 重置状态
        this.isDrawing = false;
        this.lastPoint = null;
        this.points = [];
        
        console.log('绘制状态已重置');
    }
    
    // 暂时注释掉特定笔刷实现，使用通用绘制方法
    // 铅笔笔刷具体实现暂时不需要，使用简化版通用绘制
    
    drawPencilPoint(x, y, size) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
    
    // 钢笔笔刷具体实现
    penStart(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        // 钢笔起始点更精确
        this.ctx.arc(x, y, this.size / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
    
    penDraw(x, y) {
        console.log('钢笔模式绘制');
        const dx = x - this.lastPoint.x;
        const dy = y - this.lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 钢笔使用较小的间距，确保线条连续和平滑
        const spacingDistance = this.size * (this.spacing / 200);
        
        if (distance >= spacingDistance || this.points.length >= 8) {
            // 保存当前上下文状态
            this.ctx.save();
            
            // 确保钢笔使用source-over混合模式
            this.ctx.globalCompositeOperation = 'source-over';
            // 设置高质量图像平滑，这是钢笔的核心特性
            this.ctx.imageSmoothingEnabled = true;
            this.ctx.imageSmoothingQuality = 'high';
            
            // 钢笔使用更高精度的平滑算法
            const smoothedPoints = this.applyAdvancedSmoothing(this.points);
            
            // 使用贝塞尔曲线创建平滑的钢笔线条
            this.ctx.beginPath();
            this.ctx.moveTo(smoothedPoints[0].x, smoothedPoints[0].y);
            
            for (let i = 1; i < smoothedPoints.length - 1; i++) {
                const p0 = smoothedPoints[i - 1];
                const p1 = smoothedPoints[i];
                const p2 = smoothedPoints[i + 1];
                
                // 使用三次贝塞尔曲线获得更平滑的效果
                const cp1x = p1.x + (p2.x - p0.x) * 0.15;
                const cp1y = p1.y + (p2.y - p0.y) * 0.15;
                
                this.ctx.bezierCurveTo(
                    p1.x, p1.y,
                    cp1x, cp1y,
                    p2.x, p2.y
                );
            }
            
            this.ctx.stroke();
            
            // 恢复上下文状态
            this.ctx.restore();
            
            // 重置点数组，包含timestamp
            this.points = [{ x, y, timestamp: Date.now() }];
        }
    }
    
    penEnd() {
        // 钢笔结束时确保线条完整连接
        if (this.points.length > 1) {
            const smoothedPoints = this.applyAdvancedSmoothing(this.points);
            
            this.ctx.beginPath();
            this.ctx.moveTo(smoothedPoints[0].x, smoothedPoints[0].y);
            
            // 绘制剩余的曲线段
            for (let i = 1; i < smoothedPoints.length - 1; i++) {
                const cp1x = (smoothedPoints[i].x + smoothedPoints[i + 1].x) / 2;
                const cp1y = (smoothedPoints[i].y + smoothedPoints[i + 1].y) / 2;
                this.ctx.quadraticCurveTo(
                    smoothedPoints[i].x, smoothedPoints[i].y,
                    cp1x, cp1y
                );
            }
            
            // 连接到最后一个点
            this.ctx.lineTo(smoothedPoints[smoothedPoints.length - 1].x, 
                          smoothedPoints[smoothedPoints.length - 1].y);
            this.ctx.stroke();
        }
    }
    
    // 马克笔笔刷具体实现
    markerStart(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        // 马克笔起始点有轻微的扩散效果
        this.drawMarkerPoint(x, y, this.size);
    }
    
    markerDraw(x, y) {
        console.log('马克笔模式绘制');
        const dx = x - this.lastPoint.x;
        const dy = y - this.lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 马克笔使用中等间距
        const spacingDistance = this.size * (this.spacing / 150);
        
        if (distance >= spacingDistance || this.points.length >= 8) {
            // 保存当前上下文状态，确保混合模式正确应用
            this.ctx.save();
            
            // 确保马克笔使用multiply混合模式，这是其核心特性
            this.ctx.globalCompositeOperation = 'multiply';
            
            const smoothedPoints = this.applySmoothing(this.points);
            
            // 马克笔效果：使用multiply混合模式，有轻微的纹理变化
            this.ctx.beginPath();
            this.ctx.moveTo(smoothedPoints[0].x, smoothedPoints[0].y);
            
            for (let i = 1; i < smoothedPoints.length; i++) {
                // 马克笔可以根据压力（模拟为速度）调整粗细
                const pressureFactor = 1 - Math.min(this.currentVelocity / this.maxVelocity, 0.5);
                const currentWidth = this.size * pressureFactor;
                
                // 保存当前状态以调整线宽
                this.ctx.save();
                this.ctx.lineWidth = currentWidth;
                this.ctx.lineTo(smoothedPoints[i].x, smoothedPoints[i].y);
                this.ctx.stroke();
                this.ctx.restore();
            }
            
            // 恢复上下文状态
            this.ctx.restore();
            
            // 重置点数组，包含timestamp
            this.points = [{ x, y, timestamp: Date.now() }];
        }
    }
    
    markerEnd() {
        // 马克笔结束时添加收尾渐变效果
        if (this.points.length > 1) {
            const smoothedPoints = this.applySmoothing(this.points);
            const lastPoint = smoothedPoints[smoothedPoints.length - 1];
            
            // 创建渐变收尾
            const gradient = this.ctx.createLinearGradient(
                lastPoint.x - this.size, lastPoint.y,
                lastPoint.x + this.size, lastPoint.y
            );
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.save();
            this.ctx.strokeStyle = gradient;
            this.ctx.beginPath();
            this.ctx.moveTo(lastPoint.x, lastPoint.y);
            this.ctx.lineTo(lastPoint.x + this.size * 2, lastPoint.y);
            this.ctx.stroke();
            this.ctx.restore();
        }
    }
    
    drawMarkerPoint(x, y, size) {
        // 马克笔点有轻微的不规则形状
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha *= 0.9;
        this.ctx.fill();
        
        // 添加轻微的扩散效果
        this.ctx.beginPath();
        this.ctx.arc(x + (Math.random() - 0.5) * size * 0.3, 
                    y + (Math.random() - 0.5) * size * 0.3, 
                    size / 3, 0, Math.PI * 2);
        this.ctx.globalAlpha *= 0.7;
        this.ctx.fill();
    }
    
    // 水彩笔刷具体实现
    watercolorStart(x, y) {
        // 水彩起始点有扩散的水彩色块
        this.drawWatercolorSplash(x, y, this.size);
    }
    
    watercolorDraw(x, y) {
        console.log('水彩模式绘制');
        const dx = x - this.lastPoint.x;
        const dy = y - this.lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 水彩使用较大的间距，允许颜色混合
        const spacingDistance = this.size * (this.spacing / 100);
        
        if (distance >= spacingDistance || this.points.length >= 6) {
            // 保存当前上下文状态，确保混合模式正确应用
            this.ctx.save();
            
            // 确保水彩使用overlay混合模式
            this.ctx.globalCompositeOperation = 'overlay';
            
            // 水彩线条更松散，允许颜色扩散和混合
            for (let i = 1; i < this.points.length; i++) {
                const p = this.points[i];
                const prevP = this.points[i - 1];
                
                // 水彩效果：绘制多个重叠的不规则形状
                this.drawWatercolorStroke(prevP.x, prevP.y, p.x, p.y);
            }
            
            // 恢复上下文状态
            this.ctx.restore();
            
            // 重置点数组
            this.points = [{ x, y, timestamp: Date.now() }];
        }
    }
    
    watercolorEnd() {
        // 水彩结束时添加额外的扩散效果
        if (this.points.length > 0) {
            const lastPoint = this.points[this.points.length - 1];
            // 额外的水彩扩散效果
            this.drawWatercolorSplash(lastPoint.x, lastPoint.y, this.size * 0.7);
        }
    }
    
    drawWatercolorStroke(startX, startY, endX, endY) {
        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.ceil(distance / (this.size * 0.3));
        
        for (let i = 0; i < steps; i++) {
            const progress = i / steps;
            const x = startX + dx * progress;
            const y = startY + dy * progress;
            
            // 添加随机偏移，模拟水彩的不规则流动
            const offsetX = (Math.random() - 0.5) * this.size * 0.6;
            const offsetY = (Math.random() - 0.5) * this.size * 0.6;
            
            // 根据硬度调整水彩扩散程度
            const spreadFactor = (100 - this.hardness) / 100;
            
            // 绘制不规则的水彩斑点
            this.ctx.beginPath();
            this.ctx.arc(x + offsetX, y + offsetY, 
                        this.size * (0.3 + Math.random() * 0.5) * spreadFactor, 
                        0, Math.PI * 2);
            
            // 随机透明度，模拟水彩的自然效果
            this.ctx.globalAlpha = (this.flow / 100) * (0.5 + Math.random() * 0.5) * 0.7;
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }
    
    drawWatercolorSplash(x, y, size) {
        // 绘制多个重叠的水彩斑点，创造溅射效果
        const splashCount = 5 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < splashCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * size * 0.7;
            const spotSize = size * (0.2 + Math.random() * 0.4);
            
            const spotX = x + Math.cos(angle) * radius;
            const spotY = y + Math.sin(angle) * radius;
            
            // 不规则的水彩斑点
            this.ctx.beginPath();
            // 创建轻微不规则的圆形
            for (let j = 0; j < 8; j++) {
                const jitterRadius = spotSize * (0.8 + Math.random() * 0.4);
                const jitterAngle = angle + (j / 8) * Math.PI * 2;
                const px = spotX + Math.cos(jitterAngle) * jitterRadius;
                const py = spotY + Math.sin(jitterAngle) * jitterRadius;
                
                if (j === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            }
            this.ctx.closePath();
            
            // 随机透明度
            this.ctx.globalAlpha = (this.flow / 100) * (0.4 + Math.random() * 0.4) * 0.7;
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }
    
    // 喷枪笔刷具体实现
    sprayStart(x, y) {
        // 喷枪立即开始生成粒子
        this.generateSprayParticles(x, y, this.size, this.flow);
    }
    
    sprayDraw(x, y) {
        console.log('喷枪模式绘制');
        // 保存当前上下文状态
        this.ctx.save();
        
        // 确保喷枪使用source-over混合模式
        this.ctx.globalCompositeOperation = 'source-over';
        
        // 根据速度调整喷枪密度
        const speedFactor = Math.max(1 - this.currentVelocity / this.maxVelocity, 0.3);
        const adjustedFlow = this.flow * speedFactor;
        
        // 喷枪持续生成粒子 - 增加粒子数量以增强效果
        this.generateSprayParticles(x, y, this.size, adjustedFlow * 1.2);
        
        // 恢复上下文状态
        this.ctx.restore();
    }
    
    sprayEnd() {
        // 喷枪结束时可以添加一些收尾粒子
        if (this.lastPoint) {
            this.generateSprayParticles(this.lastPoint.x, this.lastPoint.y, 
                                      this.size * 0.7, this.flow * 0.5);
        }
    }
    
    generateSprayParticles(x, y, size, flow) {
        // 使用径向渐变创建柔和的喷枪效果
        const gradientCanvas = document.createElement('canvas');
        const gradientCtx = gradientCanvas.getContext('2d');
        const gradientSize = size * 2;
        
        gradientCanvas.width = gradientSize;
        gradientCanvas.height = gradientSize;
        
        // 创建径向渐变
        const gradient = gradientCtx.createRadialGradient(
            size, size, 0,        // 内圆中心和半径
            size, size, size      // 外圆中心和半径
        );
        gradient.addColorStop(0, `${this.color}ff`);      // 完全不透明
        gradient.addColorStop(0.5, `${this.color}80`);    // 半透明
        gradient.addColorStop(1, `${this.color}00`);      // 完全透明
        
        // 根据流量计算粒子数量
        const particleCount = Math.floor(size * 3 * (flow / 100));
        
        for (let i = 0; i < particleCount; i++) {
            // 随机角度和半径，使用高斯分布让粒子更集中在中心
            const angle = Math.random() * Math.PI * 2;
            const radius = size * Math.sqrt(Math.random()); // 高斯分布
            
            // 计算粒子位置
            const particleX = x + Math.cos(angle) * radius;
            const particleY = y + Math.sin(angle) * radius;
            
            // 随机粒子大小
            const particleSize = Math.random() * size * 0.6 + 0.5;
            
            // 根据距离调整不透明度
            const distanceFromCenter = Math.sqrt(
                (particleX - x) ** 2 + (particleY - y) ** 2
            );
            const opacity = (flow / 100) * (1 - distanceFromCenter / size);
            
            // 绘制单个粒子
            this.ctx.save();
            this.ctx.globalAlpha = opacity;
            this.ctx.fillStyle = this.color;
            
            // 创建柔和的圆形粒子
            this.ctx.beginPath();
            this.ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    /**
     * 应用平滑算法
     */
    applySmoothing(points) {
        if (points.length < 3) return points;
        
        const smoothFactor = this.smoothness / 100;
        const result = [];
        
        // 保留第一个点
        result.push(points[0]);
        
        // 对中间的点应用平滑
        for (let i = 1; i < points.length - 1; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1];
            
            const smoothedX = curr.x + smoothFactor * 0.5 * (prev.x - 2 * curr.x + next.x);
            const smoothedY = curr.y + smoothFactor * 0.5 * (prev.y - 2 * curr.y + next.y);
            
            result.push({ x: smoothedX, y: smoothedY });
        }
        
        // 保留最后一个点
        result.push(points[points.length - 1]);
        
        return result;
    }
    
    /**
     * 应用高级平滑算法（用于钢笔）
     */
    applyAdvancedSmoothing(points) {
        if (points.length < 4) return this.applySmoothing(points);
        
        const smoothFactor = this.smoothness / 100 * 0.8;
        const result = [];
        
        // 保留第一个点
        result.push(points[0]);
        
        // 使用三次平滑算法
        for (let i = 1; i < points.length - 1; i++) {
            const prev = i > 1 ? points[i - 2] : points[0];
            const currPrev = points[i - 1];
            const curr = points[i];
            const currNext = i < points.length - 2 ? points[i + 1] : points[i];
            
            // Catmull-Rom 样条曲线平滑
            const smoothedX = 0.5 * (2 * curr.x + 
                                   smoothFactor * (-currPrev.x + currNext.x) +
                                   0.2 * smoothFactor * (2 * currPrev.x - 5 * curr.x + 4 * currNext.x - prev.x));
            const smoothedY = 0.5 * (2 * curr.y + 
                                   smoothFactor * (-currPrev.y + currNext.y) +
                                   0.2 * smoothFactor * (2 * currPrev.y - 5 * curr.y + 4 * currNext.y - prev.y));
            
            result.push({ x: smoothedX, y: smoothedY });
        }
        
        // 保留最后一个点
        result.push(points[points.length - 1]);
        
        return result;
    }
    
    /**
     * 应用笔刷预设
     */
    applyPreset(preset) {
        if (!preset) return;
        
        if (preset.type) this.setType(preset.type);
        if (preset.size) this.setSize(preset.size);
        if (preset.flow) this.setFlow(preset.flow);
        if (preset.hardness) this.setHardness(preset.hardness);
        if (preset.spacing) this.setSpacing(preset.spacing);
        if (preset.smoothness !== undefined) this.setSmoothness(preset.smoothness);
        if (preset.color) this.setColor(preset.color);
    }
    
    /**
     * 导出当前笔刷设置
     */
    exportSettings() {
        return {
            type: this.type,
            size: this.size,
            flow: this.flow,
            hardness: this.hardness,
            spacing: this.spacing,
            smoothness: this.smoothness,
            color: this.color
        };
    }
    
    /**
     * 生成笔刷预览
     */
    generatePreview(previewCanvas) {
        if (!previewCanvas) return;
        
        const previewCtx = previewCanvas.getContext('2d');
        const width = previewCanvas.width;
        const height = previewCanvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        
        // 清空预览画布
        previewCtx.clearRect(0, 0, width, height);
        
        // 设置预览背景
        previewCtx.fillStyle = '#0f0f23';
        previewCtx.fillRect(0, 0, width, height);
        
        // 保存当前笔刷状态
        const originalCtx = this.ctx;
        this.ctx = previewCtx;
        
        // 保存当前上下文状态
        previewCtx.save();
        
        // 设置预览属性
        previewCtx.strokeStyle = this.color;
        // 限制预览大小
        const previewSize = Math.min(this.size, 20);
        previewCtx.lineWidth = previewSize;
        previewCtx.globalAlpha = this.flow / 100;
        
        // 复制当前笔刷的绘制属性
        this.updateContextProperties();
        
        if (this.type === 'spray') {
            // 绘制喷枪效果
            const particleCount = Math.floor(previewSize * 2 * (this.flow / 100));
            previewCtx.globalAlpha = this.flow / 200;
            
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * previewSize;
                const particleX = centerX + Math.cos(angle) * radius;
                const particleY = centerY + Math.sin(angle) * radius;
                const particleSize = Math.random() * previewSize * 0.5 + 0.5;
                
                previewCtx.fillStyle = this.color;
                previewCtx.beginPath();
                previewCtx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
                previewCtx.fill();
            }
        } else {
            // 绘制线条和圆点预览
            // 1. 绘制一条横线显示笔刷效果
            previewCtx.beginPath();
            previewCtx.moveTo(centerX - 40, centerY);
            previewCtx.lineTo(centerX + 40, centerY);
            previewCtx.stroke();
            
            // 2. 绘制圆点显示笔刷形状
            previewCtx.beginPath();
            previewCtx.arc(centerX, centerY, previewSize / 2, 0, Math.PI * 2);
            previewCtx.stroke();
            
            // 对于水彩笔刷，额外添加纹理效果
            if (this.type === 'watercolor') {
                previewCtx.globalAlpha = 0.3;
                previewCtx.fillStyle = this.color;
                for (let i = 0; i < 5; i++) {
                    const offsetX = (Math.random() - 0.5) * 10;
                    const offsetY = (Math.random() - 0.5) * 10;
                    previewCtx.beginPath();
                    previewCtx.arc(centerX + offsetX, centerY + offsetY, previewSize / 3, 0, Math.PI * 2);
                    previewCtx.fill();
                }
            }
        }
        
        // 恢复上下文状态
        previewCtx.restore();
        
        // 恢复原始上下文
        this.ctx = originalCtx;
    }
}

/**
 * 笔刷管理器 - 管理预设和用户设置
 */
class BrushManager {
    constructor() {
        this.brush = new Brush();
        this.presets = this.getDefaultPresets();
        this.loadSavedPresets();
    }
    
    /**
     * 获取默认笔刷预设
     */
    getDefaultPresets() {
        return {
            'fine-line': { 
                name: '细线铅笔',
                type: 'pencil', 
                size: 2, 
                flow: 100, 
                hardness: 100, 
                spacing: 10, 
                smoothness: 30,
                icon: '✏️'
            },
            'sketch-pencil': {
                name: '草图铅笔',
                type: 'pencil',
                size: 4,
                flow: 90,
                hardness: 70,
                spacing: 20,
                smoothness: 50,
                icon: '✎'
            },
            'ink-pen': { 
                name: '钢笔', 
                type: 'pen', 
                size: 3, 
                flow: 100, 
                hardness: 90, 
                spacing: 5, 
                smoothness: 70,
                icon: '🖋️'
            },
            'thick-ink': {
                name: '粗钢笔',
                type: 'pen',
                size: 8,
                flow: 100,
                hardness: 90,
                spacing: 5,
                smoothness: 70,
                icon: '🖊️'
            },
            'soft-marker': { 
                name: '软马克笔', 
                type: 'marker', 
                size: 15, 
                flow: 75, 
                hardness: 40, 
                spacing: 30, 
                smoothness: 60,
                icon: '🧪'
            },
            'bold-marker': {
                name: '粗马克笔',
                type: 'marker',
                size: 25,
                flow: 90,
                hardness: 60,
                spacing: 20,
                smoothness: 40,
                icon: '📏'
            },
            'watercolor-light': { 
                name: '水彩（轻）', 
                type: 'watercolor', 
                size: 20, 
                flow: 50, 
                hardness: 20, 
                spacing: 40, 
                smoothness: 80,
                icon: '💧'
            },
            'watercolor-bold': {
                name: '水彩（重）',
                type: 'watercolor',
                size: 30,
                flow: 80,
                hardness: 30,
                spacing: 30,
                smoothness: 70,
                icon: '🎨'
            },
            'soft-spray': { 
                name: '软喷枪', 
                type: 'spray', 
                size: 25, 
                flow: 60, 
                spacing: 10, 
                smoothness: 100,
                icon: '💨'
            },
            'textured-spray': {
                name: '纹理喷枪',
                type: 'spray',
                size: 15,
                flow: 85,
                spacing: 20,
                smoothness: 100,
                icon: '🌫️'
            }
        };
    }
    
    /**
     * 从本地存储加载预设
     */
    loadSavedPresets() {
        try {
            const savedPresets = localStorage.getItem('brushPresets');
            if (savedPresets) {
                const userPresets = JSON.parse(savedPresets);
                // 合并用户预设，不覆盖默认预设
                Object.assign(this.presets, userPresets);
            }
        } catch (error) {
            console.error('加载笔刷预设失败:', error);
        }
    }
    
    /**
     * 保存预设到本地存储
     */
    savePresets() {
        try {
            // 只保存用户自定义的预设，排除默认预设
            const userPresets = {};
            const defaultPresetKeys = Object.keys(this.getDefaultPresets());
            
            Object.keys(this.presets).forEach(key => {
                if (!defaultPresetKeys.includes(key)) {
                    userPresets[key] = this.presets[key];
                }
            });
            
            localStorage.setItem('brushPresets', JSON.stringify(userPresets));
            return true;
        } catch (error) {
            console.error('保存笔刷预设失败:', error);
            return false;
        }
    }
    
    /**
     * 保存当前笔刷设置为预设
     */
    saveCurrentAsPreset(name, id) {
        const presetId = id || 'custom-' + Date.now();
        
        this.presets[presetId] = {
            name: name,
            ...this.brush.exportSettings(),
            icon: '⭐'
        };
        
        return this.savePresets() ? presetId : null;
    }
    
    /**
     * 删除预设
     */
    deletePreset(id) {
        // 不允许删除默认预设
        const defaultPresetKeys = Object.keys(this.getDefaultPresets());
        if (defaultPresetKeys.includes(id)) {
            return false;
        }
        
        if (this.presets[id]) {
            delete this.presets[id];
            return this.savePresets();
        }
        return false;
    }
    
    /**
     * 保存当前笔刷设置到指定的预设槽位
     */
    saveToSlot(slotNumber, name) {
        const presetId = `custom_${slotNumber}`;
        
        this.presets[presetId] = {
            name: name,
            ...this.brush.exportSettings(),
            icon: '⭐'
        };
        
        return this.savePresets() ? presetId : null;
    }
    
    /**
     * 重置所有预设为默认值
     */
    resetToDefaults() {
        try {
            // 清除本地存储中的用户预设
            localStorage.removeItem('brushPresets');
            
            // 重新初始化预设，只保留默认预设
            this.presets = this.getDefaultPresets();
            
            return true;
        } catch (error) {
            console.error('重置预设失败:', error);
            return false;
        }
    }
    
    /**
     * 应用预设
     */
    applyPreset(id) {
        if (this.presets[id]) {
            this.brush.applyPreset(this.presets[id]);
            return true;
        }
        return false;
    }
    
    /**
     * 获取所有预设
     */
    getAllPresets() {
        return this.presets;
    }
    
    /**
     * 获取分类后的预设
     */
    getPresetsByCategory() {
        const categories = {
            default: {},
            custom: {}
        };
        
        const defaultPresetKeys = Object.keys(this.getDefaultPresets());
        
        Object.keys(this.presets).forEach(key => {
            if (defaultPresetKeys.includes(key)) {
                categories.default[key] = this.presets[key];
            } else {
                categories.custom[key] = this.presets[key];
            }
        });
        
        return categories;
    }
}

// 导出Brush类和BrushManager类
export { Brush, BrushManager };