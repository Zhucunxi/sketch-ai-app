// 移除模块导入以恢复基础功能

// 笔刷系统定义 - 直接包含在script.js中以确保浏览器兼容性

/**
 * 笔刷基类 - 管理笔刷状态和行为
 */
class Brush {
    constructor() {
        // 笔刷基本属性
        this.type = 'pencil';
        this.size = 3;
        this.flow = 100;
        this.hardness = 80;
        this.spacing = 20;
        this.smoothness = 50; // 平滑度属性
        this.scatter = 0; // 散布属性
        this.blendMode = 'source-over'; // 混合模式
        this.texture = null; // 纹理属性
        this.color = '#000000';
        
        // 绘制状态
        this.lastPoint = null;
        this.particleBuffer = [];
        this.points = []; // 用于平滑处理
        this.isDrawing = false;
        
        // 速度计算相关
        this.lastTimestamp = null;
        this.currentVelocity = 0;
        this.maxVelocity = 10; // 最大速度参考值
        
        // 引用外部上下文
        this.ctx = null;
    }
    
    /**
     * 设置Canvas上下文
     */
    setContext(context) {
        // 优先使用离屏画布上下文以支持双缓冲
        this.ctx = offscreenCtx || context;
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
        this.type = type;
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
     * 设置散布 (0-100%)
     */
    setScatter(scatter) {
        this.scatter = Math.max(0, Math.min(100, scatter));
    }
    
    /**
     * 设置混合模式
     */
    setBlendMode(mode) {
        this.blendMode = mode;
        if (this.ctx) {
            this.ctx.globalCompositeOperation = mode;
        }
    }
    
    /**
     * 设置纹理
     */
    setTexture(texture) {
        this.texture = texture;
        // 这里可以添加纹理实现逻辑
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
     * 应用平滑算法 - 优化版
     */
    applySmoothing(points) {
        // 如果点数不足，直接返回
        if (points.length < 3) return points;
        
        // 性能优化：限制点的数量以避免过度计算
        const maxPoints = 100; // 设置最大点数限制
        let processPoints = points;
        
        // 如果点数过多，进行下采样
        if (points.length > maxPoints) {
            const step = Math.ceil(points.length / maxPoints);
            processPoints = [];
            for (let i = 0; i < points.length; i += step) {
                processPoints.push(points[i]);
            }
            // 确保包含最后一个点
            if (processPoints[processPoints.length - 1] !== points[points.length - 1]) {
                processPoints.push(points[points.length - 1]);
            }
        }
        
        // 简化的贝塞尔曲线平滑算法
        const smoothed = [];
        const smoothFactor = this.smoothness / 200; // 调整平滑因子范围
        
        // 添加第一个点
        smoothed.push(processPoints[0]);
        
        // 对中间的点应用平滑
        for (let i = 1; i < processPoints.length - 1; i++) {
            const p0 = processPoints[i - 1];
            const p1 = processPoints[i];
            const p2 = processPoints[i + 1];
            
            // 简化的控制点计算
            const cp1x = p1.x + (p2.x - p0.x) * smoothFactor;
            const cp1y = p1.y + (p2.y - p0.y) * smoothFactor;
            
            smoothed.push({
                x: cp1x,
                y: cp1y
            });
        }
        
        // 添加最后一个点
        smoothed.push(processPoints[processPoints.length - 1]);
        
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
    
    // 铅笔笔刷具体实现
    pencilStart(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        // 铅笔起始点有轻微的压感效果
        this.drawPencilPoint(x, y, this.size);
    }
    
    pencilDraw(x, y) {
        // 性能优化：限制点数组大小
        if (this.points.length > 50) {
            // 保留最近的30个点，避免内存占用过高
            this.points = this.points.slice(-30);
        }
        
        const dx = x - this.lastPoint.x;
        const dy = y - this.lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 根据间距计算是否需要绘制
        const spacingDistance = this.size * (this.spacing / 100);
        
        // 性能优化：只在必要时绘制，增加距离阈值
        if (distance >= spacingDistance || this.points.length >= 15) {
            // 应用平滑算法 - 优化版本已在applySmoothing中实现
            const smoothedPoints = this.applySmoothing(this.points);
            
            // 只在有足够点时进行绘制
            if (smoothedPoints.length > 1) {
                // 铅笔效果：轻微的不完美感
                this.ctx.beginPath();
                this.ctx.moveTo(smoothedPoints[0].x, smoothedPoints[0].y);
                
                // 性能优化：根据笔刷大小调整抖动强度
                const jitterStrength = Math.max(0.1, this.size * 0.2);
                
                // 批量绘制线段，减少context API调用
                for (let i = 1; i < smoothedPoints.length; i++) {
                    // 性能优化：减少随机数生成频率，使用伪随机
                    const jitterX = (i % 3 === 0) ? (Math.random() - 0.5) * jitterStrength : 0;
                    const jitterY = (i % 3 === 0) ? (Math.random() - 0.5) * jitterStrength : 0;
                    this.ctx.lineTo(smoothedPoints[i].x + jitterX, smoothedPoints[i].y + jitterY);
                }
                
                // 一次性描边，提高性能
                this.ctx.stroke();
            }
            
            // 重置点数组，保留最后一个点
            this.points = [{ x, y }];
        }
    }
    
    pencilEnd() {
        // 铅笔结束绘制时不需要特殊处理
        this.ctx.stroke();
    }
    
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
        // 性能优化：限制点数组大小
        if (this.points.length > 40) {
            // 保留最近的25个点
            this.points = this.points.slice(-25);
        }
        
        const dx = x - this.lastPoint.x;
        const dy = y - this.lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 钢笔使用较小的间距以获得更平滑的线条
        const spacingDistance = this.size * (this.spacing / 200);
        
        // 性能优化：动态调整间距阈值
        const adjustedSpacing = Math.max(1, spacingDistance);
        
        if (distance >= adjustedSpacing || this.points.length >= 20) {
            // 应用优化后的平滑算法
            const smoothedPoints = this.applySmoothing(this.points);
            
            // 只在有足够点时进行绘制
            if (smoothedPoints.length > 2) {
                // 钢笔效果：精确的线条
                this.ctx.beginPath();
                this.ctx.moveTo(smoothedPoints[0].x, smoothedPoints[0].y);
                
                // 性能优化：减少贝塞尔曲线计算量
                // 对于较长的路径，使用更少的曲线段
                const step = Math.max(1, Math.floor(smoothedPoints.length / 50));
                
                for (let i = 1; i < smoothedPoints.length - 1; i += step) {
                    const nextIndex = Math.min(i + step, smoothedPoints.length - 1);
                    const cpX = (smoothedPoints[i].x + smoothedPoints[nextIndex].x) / 2;
                    const cpY = (smoothedPoints[i].y + smoothedPoints[nextIndex].y) / 2;
                    this.ctx.quadraticCurveTo(smoothedPoints[i].x, smoothedPoints[i].y, cpX, cpY);
                }
                
                // 连接到最后一个点
                if (smoothedPoints.length > 1) {
                    const lastPoint = smoothedPoints[smoothedPoints.length - 1];
                    this.ctx.lineTo(lastPoint.x, lastPoint.y);
                }
                
                // 一次性描边
                this.ctx.stroke();
            }
            
            // 重置点数组，保留最后一个点
            this.points = [{ x, y }];
        }
    }
    
    penEnd() {
        // 钢笔结束时确保线条闭合
        this.ctx.stroke();
    }
    
    // 马克笔笔刷具体实现
    markerStart(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        // 马克笔起始点有轻微的扩散效果
        this.drawMarkerPoint(x, y, this.size);
    }
    
    markerDraw(x, y) {
        const dx = x - this.lastPoint.x;
        const dy = y - this.lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 马克笔使用中等间距
        const spacingDistance = this.size * (this.spacing / 150);
        
        if (distance >= spacingDistance || this.points.length >= 8) {
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
            
            // 重置点数组
            this.points = [{ x, y }];
        }
    }
    
    markerEnd() {
        this.ctx.stroke();
    }
    
    drawMarkerPoint(x, y, size) {
        // 绘制轻微扩散的圆形
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        
        // 创建径向渐变以模拟扩散效果
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size / 2);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }
    
    // 水彩笔刷具体实现
    watercolorStart(x, y) {
        // 水彩起始点有扩散的水彩色块
        this.drawWatercolorSplash(x, y, this.size);
    }
    
    watercolorDraw(x, y) {
        const dx = x - this.lastPoint.x;
        const dy = y - this.lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 水彩使用较大的间距，允许颜色混合
        const spacingDistance = this.size * (this.spacing / 100);
        
        if (distance >= spacingDistance || this.points.length >= 6) {
            // 水彩线条更松散，允许颜色扩散和混合
            for (let i = 1; i < this.points.length; i++) {
                const p = this.points[i];
                const prevP = this.points[i - 1];
                
                // 水彩效果：绘制多个重叠的不规则形状
                this.drawWatercolorStroke(prevP.x, prevP.y, p.x, p.y);
            }
            
            // 重置点数组
            this.points = [{ x, y }];
        }
    }
    
    watercolorEnd() {
        // 水彩结束时可以添加额外的扩散效果
        if (this.lastPoint) {
            this.drawWatercolorSplash(this.lastPoint.x, this.lastPoint.y, this.size * 0.5);
        }
    }
    
    drawWatercolorSplash(x, y, size) {
        // 绘制多个重叠的不规则形状来模拟水彩扩散
        const shapeCount = Math.floor(size / 5);
        
        for (let i = 0; i < shapeCount; i++) {
            const radius = size * 0.1 + Math.random() * size * 0.4;
            const offsetX = (Math.random() - 0.5) * size * 0.3;
            const offsetY = (Math.random() - 0.5) * size * 0.3;
            
            this.ctx.beginPath();
            // 不规则圆形
            for (let j = 0; j < 8; j++) {
                const angle = (Math.PI * 2 / 8) * j;
                const variation = 0.8 + Math.random() * 0.4; // 半径变化
                const px = x + offsetX + Math.cos(angle) * radius * variation;
                const py = y + offsetY + Math.sin(angle) * radius * variation;
                
                if (j === 0) {
                    this.ctx.moveTo(px, py);
                } else {
                    this.ctx.lineTo(px, py);
                }
            }
            
            this.ctx.closePath();
            
            // 随机透明度以创建层次感
            const alpha = (0.2 + Math.random() * 0.3) * (this.flow / 100);
            // 安全地创建带透明度的颜色
            const colorHex = this.color.replace('#', '');
            const r = parseInt(colorHex.substring(0, 2), 16);
            const g = parseInt(colorHex.substring(2, 4), 16);
            const b = parseInt(colorHex.substring(4, 6), 16);
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            this.ctx.fill();
        }
    }
    
    drawWatercolorStroke(startX, startY, endX, endY) {
        // 计算方向和距离
        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        
        // 沿线绘制多个不规则形状
        const stepCount = Math.ceil(distance / (this.size * 0.3));
        
        for (let i = 0; i < stepCount; i++) {
            const progress = i / stepCount;
            const x = startX + dx * progress + (Math.random() - 0.5) * this.size * 0.4;
            const y = startY + dy * progress + (Math.random() - 0.5) * this.size * 0.4;
            
            // 绘制水彩斑点
            this.drawWatercolorSplash(x, y, this.size * 0.6);
        }
    }
    
    // 喷枪笔刷具体实现
    sprayStart(x, y) {
        // 喷枪立即开始生成粒子
        this.generateSprayParticles(x, y, this.size, this.flow);
    }
    
    sprayDraw(x, y) {
        // 根据速度调整喷枪密度
        const speedFactor = Math.max(1 - this.currentVelocity / this.maxVelocity, 0.3);
        const adjustedFlow = this.flow * speedFactor;
        
        // 喷枪持续生成粒子
        this.generateSprayParticles(x, y, this.size, adjustedFlow);
    }
    
    sprayEnd() {
        // 喷枪结束时不需要特殊处理
    }
    
    generateSprayParticles(x, y, size, flow) {
        // 计算粒子数量
        const particleCount = Math.floor(size * 1.5 * (flow / 100));
        
        // 保存当前状态
        this.ctx.save();
        
        // 随机生成多个粒子
        for (let i = 0; i < particleCount; i++) {
            // 随机角度和距离
            const angle = Math.random() * Math.PI * 2;
            // 添加散布效果
            const scatterFactor = 1 + (this.scatter / 100) * 0.5;
            const distance = Math.random() * size * 0.5 * scatterFactor;
            
            // 计算粒子位置
            const px = x + Math.cos(angle) * distance;
            const py = y + Math.sin(angle) * distance;
            
            // 粒子大小随机变化
            const particleSize = 0.5 + Math.random() * 1.5;
            
            // 随机透明度
            const alpha = 0.3 + Math.random() * 0.7;
            
            // 安全地创建带透明度的颜色
            const colorHex = this.color.replace('#', '');
            const r = parseInt(colorHex.substring(0, 2), 16);
            const g = parseInt(colorHex.substring(2, 4), 16);
            const b = parseInt(colorHex.substring(4, 6), 16);
            
            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(px, py, particleSize, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            this.ctx.fill();
        }
        
        // 恢复状态
        this.ctx.restore();
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
                const distance = Math.random() * previewSize * 0.8;
                const offsetX = Math.cos(angle) * distance;
                const offsetY = Math.sin(angle) * distance;
                const particleSize = 0.5 + Math.random() * 1.5;
                
                previewCtx.beginPath();
                previewCtx.arc(centerX + offsetX, centerY + offsetY, particleSize, 0, Math.PI * 2);
                previewCtx.fill();
            }
        } else {
            // 绘制其他笔刷类型的预览
            const startAngle = Math.PI * 0.75;
            const endAngle = Math.PI * 2.25;
            const radius = Math.min(width, height) * 0.3;
            
            previewCtx.beginPath();
            
            // 绘制一条曲线作为预览
            previewCtx.arc(centerX, centerY, radius, startAngle, endAngle, false);
            previewCtx.stroke();
            
            // 如果是水彩，添加额外的斑点效果
            if (this.type === 'watercolor') {
                for (let i = 0; i < 5; i++) {
                    const angle = startAngle + (endAngle - startAngle) * (i / 4);
                    const x = centerX + Math.cos(angle) * radius * 0.8;
                    const y = centerY + Math.sin(angle) * radius * 0.8;
                    
                    // 小的水彩斑点
                    this.drawWatercolorSplash(x, y, previewSize * 0.5);
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
     * 从localStorage加载保存的预设
     */
    loadSavedPresets() {
        try {
            const savedPresets = localStorage.getItem('brushPresets');
            if (savedPresets) {
                const customPresets = JSON.parse(savedPresets);
                // 合并默认预设和自定义预设
                this.presets = { ...this.getDefaultPresets(), ...customPresets };
            }
        } catch (error) {
            console.error('加载预设失败:', error);
        }
    }
    
    /**
     * 保存预设到localStorage
     */
    savePresets() {
        try {
            // 只保存自定义预设（过滤掉默认预设）
            const defaultPresets = this.getDefaultPresets();
            const customPresets = {};
            
            Object.keys(this.presets).forEach(key => {
                if (!defaultPresets[key]) {
                    customPresets[key] = this.presets[key];
                }
            });
            
            localStorage.setItem('brushPresets', JSON.stringify(customPresets));
            return true;
        } catch (error) {
            console.error('保存预设失败:', error);
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
     * 获取所有预设
     */
    getAllPresets() {
        return this.presets;
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

// 获取DOM元素
const canvas = document.getElementById('sketchCanvas');
const ctx = canvas.getContext('2d');

// 创建离屏画布用于双缓冲技术
const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d');

// 双缓冲绘制函数
function drawToCanvas() {
    console.log('==== 绘制到主画布 ====');
    
    // 一次性将离屏画布内容绘制到主画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreenCanvas, 0, 0);
    
    console.log('绘制完成，离屏画布尺寸:', offscreenCanvas.width, 'x', offscreenCanvas.height);
}

// 设置离屏画布尺寸
function setOffscreenCanvasSize(width, height) {
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
}

const colorPicker = document.getElementById('colorPicker');
const clearCanvas = document.getElementById('clearCanvas');
const saveImage = document.getElementById('saveImage');
const undoBtn = document.getElementById('undo');
const redoBtn = document.getElementById('redo');
const toolTip = document.getElementById('toolTip');
const canvasSize = document.getElementById('canvasSize');
const zoomLevel = document.getElementById('zoomLevel');

// 笔刷系统DOM元素
const brushTypeBtns = document.querySelectorAll('.brush-type-btn');
const brushSize = document.getElementById('brushSize');
const brushSizeValue = document.getElementById('brushSizeValue');
const brushFlow = document.getElementById('brushFlow');
const brushFlowValue = document.getElementById('brushFlowValue');
const brushHardness = document.getElementById('brushHardness');
const brushHardnessValue = document.getElementById('brushHardnessValue');
const brushSpacing = document.getElementById('brushSpacing');
const brushSpacingValue = document.getElementById('brushSpacingValue');
const brushScatter = document.getElementById('brushScatter');
const brushScatterValue = document.getElementById('brushScatterValue');
const brushSmoothness = document.getElementById('brushSmoothness');
const brushSmoothnessValue = document.getElementById('brushSmoothnessValue');
const brushPreviewCanvas = document.getElementById('brushPreviewCanvas');
const previewContainer = document.querySelector('.preview-container');
const currentBrushName = document.getElementById('currentBrushName');
const currentBrushIcon = document.getElementById('currentBrushIcon');
const savePresetBtn = document.getElementById('savePresetBtn');
const resetPresetBtn = document.getElementById('resetPresetBtn');
const presetSlots = document.querySelectorAll('.preset-slot');
const toggleAdvancedOptions = document.getElementById('toggleAdvancedOptions');
const advancedContent = document.querySelector('.advanced-content');
const blendMode = document.getElementById('blendMode');
const textureOption = document.getElementById('textureOption');

// 工具按钮
const brushTool = document.getElementById('brushTool');
const eraserTool = document.getElementById('eraserTool');
const shapeTool = document.getElementById('shapeTool');
const layerTool = document.getElementById('layerTool');
const aiTool = document.getElementById('aiTool');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');

// AI参数控件
const aiPrecision = document.getElementById('aiPrecision');
const aiPrecisionValue = document.getElementById('aiPrecisionValue');
const aiStyle = document.getElementById('aiStyle');

// 创建笔刷管理器实例
const brushManager = new BrushManager();
const brush = brushManager.brush;

// 为笔刷设置Canvas上下文
brush.setContext(ctx);

// 应用状态管理对象
const appState = {
    isDrawing: false,
    currentTool: 'brush',
    zoomFactor: 1.0,
    isMouseInsideCanvas: false,
    isUserIntendingToDraw: false,
    historyStack: [],
    redoStack: [],
    currentHistoryIndex: -1,
    
    // 保存状态到localStorage
    saveToStorage() {
        try {
            const stateToSave = {
                currentTool: this.currentTool,
                zoomFactor: this.zoomFactor,
                brushSettings: brush.exportSettings()
            };
            localStorage.setItem('sketchAppState', JSON.stringify(stateToSave));
        } catch (error) {
            console.error('保存应用状态失败:', error);
        }
    },
    
    // 从localStorage加载状态
    loadFromStorage() {
        try {
            const savedState = localStorage.getItem('sketchAppState');
            if (savedState) {
                const state = JSON.parse(savedState);
                this.currentTool = state.currentTool || 'brush';
                this.zoomFactor = state.zoomFactor || 1.0;
                
                // 应用笔刷设置
                if (state.brushSettings && brush.applyPreset) {
                    brush.applyPreset(state.brushSettings);
                }
                
                return true;
            }
        } catch (error) {
            console.error('加载应用状态失败:', error);
        }
        return false;
    }
};

// 渲染笔刷预设按钮
function renderBrushPresets() {
    if (!presetContainer) return;
    
    // 清空现有预设按钮
    presetContainer.innerHTML = '';
    
    // 获取分类后的预设
    const categories = brushManager.getPresetsByCategory();
    
    // 渲染默认预设
    if (Object.keys(categories.default).length > 0) {
        const defaultSection = document.createElement('div');
        defaultSection.className = 'preset-section';
        
        const defaultHeader = document.createElement('div');
        defaultHeader.className = 'preset-section-header';
        defaultHeader.textContent = '默认预设';
        defaultSection.appendChild(defaultHeader);
        
        Object.entries(categories.default).forEach(([id, preset]) => {
            const btn = createPresetButton(id, preset);
            defaultSection.appendChild(btn);
        });
        
        presetContainer.appendChild(defaultSection);
    }
    
    // 渲染自定义预设
    if (Object.keys(categories.custom).length > 0) {
        const customSection = document.createElement('div');
        customSection.className = 'preset-section';
        
        const customHeader = document.createElement('div');
        customHeader.className = 'preset-section-header';
        customHeader.textContent = '自定义预设';
        customSection.appendChild(customHeader);
        
        Object.entries(categories.custom).forEach(([id, preset]) => {
            const btn = createPresetButton(id, preset, true);
            customSection.appendChild(btn);
        });
        
        presetContainer.appendChild(customSection);
    }
    
    // 添加保存预设按钮
    if (savePresetBtn) {
        presetContainer.appendChild(savePresetBtn);
    }
}

// 创建预设按钮
function createPresetButton(id, preset, isCustom = false) {
    const btn = document.createElement('button');
    btn.className = 'preset-btn';
    btn.dataset.preset = id;
    
    // 按钮内容包含图标和名称
    btn.innerHTML = `
        <span class="preset-icon">${preset.icon || '🖌️'}</span>
        <span class="preset-name">${preset.name || id}</span>
        ${isCustom ? '<span class="preset-delete" data-id="' + id + '">×</span>' : ''}
    `;
    
    // 点击事件
    btn.addEventListener('click', (e) => {
        // 阻止删除按钮的冒泡事件
        if (e.target.classList.contains('preset-delete')) return;
        
        // 应用预设
        brushManager.applyPreset(id);
        updateBrushUI();
        updateBrushPreview();
        
        // 更新按钮状态
        document.querySelectorAll('.preset-btn').forEach(b => {
            b.classList.remove('active');
        });
        btn.classList.add('active');
    });
    
    // 删除按钮事件（仅自定义预设）
    if (isCustom) {
        const deleteBtn = btn.querySelector('.preset-delete');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('确定要删除这个预设吗？')) {
                if (brushManager.deletePreset(id)) {
                    renderBrushPresets(); // 重新渲染预设列表
                }
            }
        });
    }
    
    return btn;
}

// 初始化笔刷控件事件
function initBrushControls() {
    // 笔刷类型选择
    brushTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
        // 更新按钮状态
        brushTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // 设置笔刷类型
        const brushType = btn.dataset.type;
        brush.setType(brushType);
        
        // 更新当前笔刷信息显示
        updateCurrentBrushInfo(brushType);
        
        // 更新性能监控中的活跃笔刷
        if (window.performanceMonitor) {
            window.performanceMonitor.updateActiveBrush(brushType);
        }
            updateBrushPreview();
            
            // 保存笔刷设置到localStorage
            appState.saveToStorage();
        });
    });
    
    // 笔刷预览区域点击切换笔刷类型
    if (previewContainer) {
        previewContainer.addEventListener('click', () => {
            const activeBtn = document.querySelector('.brush-type-btn.active');
            const btns = Array.from(brushTypeBtns);
            const currentIndex = btns.indexOf(activeBtn);
            const nextIndex = (currentIndex + 1) % btns.length;
            btns[nextIndex].click();
        });
    }
    
    // 笔刷大小控制
    brushSize.addEventListener('input', () => {
        const size = parseInt(brushSize.value);
        brushSizeValue.textContent = `${size}px`;
        brush.setSize(size);
        updateBrushPreview();
        
        // 保存笔刷设置到localStorage
        appState.saveToStorage();
    });
    
    // 笔刷流量控制
    brushFlow.addEventListener('input', () => {
        const flow = parseInt(brushFlow.value);
        brushFlowValue.textContent = `${flow}%`;
        brush.setFlow(flow);
        updateBrushPreview();
        
        // 保存笔刷设置到localStorage
        appState.saveToStorage();
    });
    
    // 笔刷硬度控制
    brushHardness.addEventListener('input', () => {
        const hardness = parseInt(brushHardness.value);
        brushHardnessValue.textContent = `${hardness}%`;
        brush.setHardness(hardness);
        updateBrushPreview();
        
        // 保存笔刷设置到localStorage
        appState.saveToStorage();
    });
    
    // 笔刷间距控制
    brushSpacing.addEventListener('input', () => {
        const spacing = parseInt(brushSpacing.value);
        brushSpacingValue.textContent = `${spacing}%`;
        brush.setSpacing(spacing);
        updateBrushPreview();
        
        // 保存笔刷设置到localStorage
        appState.saveToStorage();
    });
    
    // 笔刷平滑度控制
    if (brushSmoothness) {
        brushSmoothness.addEventListener('input', () => {
            const smoothness = parseInt(brushSmoothness.value);
            brushSmoothnessValue.textContent = `${smoothness}%`;
            if (brush.setSmoothness) {
                brush.setSmoothness(smoothness);
            }
            updateBrushPreview();
            
            // 保存笔刷设置到localStorage
            appState.saveToStorage();
        });
    }
    
    // 笔刷散布控制（现在放在高级选项中）
    if (brushScatter) {
        brushScatter.addEventListener('input', () => {
            const scatter = parseInt(brushScatter.value);
            brushScatterValue.textContent = `${scatter}%`;
            if (brush.setScatter) {
                brush.setScatter(scatter);
            }
            updateBrushPreview();
            
            // 保存笔刷设置到localStorage
            appState.saveToStorage();
        });
    }
    
    // 混合模式控制
    if (blendMode) {
        blendMode.addEventListener('change', () => {
            if (brush.setBlendMode) {
                brush.setBlendMode(blendMode.value);
            }
            updateBrushPreview();
            
            // 保存笔刷设置到localStorage
            appState.saveToStorage();
        });
    }
    
    // 纹理选项控制
    if (textureOption) {
        textureOption.addEventListener('change', () => {
            if (brush.setTexture) {
                brush.setTexture(textureOption.value);
            }
            updateBrushPreview();
            
            // 保存笔刷设置到localStorage
            appState.saveToStorage();
        });
    }
    
    // 颜色选择
    colorPicker.addEventListener('input', () => {
        brush.setColor(colorPicker.value);
        updateBrushPreview();
        
        // 保存笔刷设置到localStorage
        appState.saveToStorage();
    });
    
    // 保存预设
    savePresetBtn.addEventListener('click', () => {
        const presetName = prompt('请输入预设名称:', '我的笔刷预设');
        if (presetName && presetName.trim()) {
            const presetId = brushManager.saveCurrentAsPreset(presetName.trim());
            if (presetId) {
                updatePresetSlots();
                alert('预设已保存！');
            } else {
                alert('保存预设失败，请重试。');
            }
        }
    });
    
    // 重置预设
    resetPresetBtn.addEventListener('click', () => {
        if (confirm('确定要重置所有预设为默认值吗？')) {
            if (brushManager.resetToDefaults) {
                brushManager.resetToDefaults();
            }
            updatePresetSlots();
            alert('预设已重置为默认值！');
        }
    });
    
    // 预设槽位点击事件
    presetSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const slotNum = slot.dataset.slot;
            const presetId = `custom_${slotNum}`;
            
            // 检查是否有保存的预设
            const presets = brushManager.getAllPresets ? brushManager.getAllPresets() : {};
            if (presets[presetId]) {
                // 应用预设
                brushManager.applyPreset(presetId);
                updateBrushUI();
                updateBrushPreview();
                
                // 更新槽位选中状态
                presetSlots.forEach(s => s.classList.remove('active'));
                slot.classList.add('active');
            } else {
                // 如果没有预设，提示保存当前设置
                if (confirm('该槽位没有保存的预设，是否保存当前笔刷设置？')) {
                    const presetName = prompt('请输入预设名称:', `预设 ${slotNum}`);
                    if (presetName && presetName.trim()) {
                        // 保存到特定槽位
                        if (brushManager.saveToSlot) {
                            brushManager.saveToSlot(slotNum, presetName.trim());
                        }
                        updatePresetSlots();
                        slot.classList.add('active');
                    }
                }
            }
        });
    });
    
    // 高级选项折叠/展开
    if (toggleAdvancedOptions && advancedContent) {
        toggleAdvancedOptions.addEventListener('click', () => {
            const isVisible = advancedContent.style.display !== 'none';
            advancedContent.style.display = isVisible ? 'none' : 'block';
            toggleAdvancedOptions.classList.toggle('active', !isVisible);
        });
    }
}

// 更新当前笔刷信息显示
function updateCurrentBrushInfo(brushType) {
    const brushNames = {
        pencil: '铅笔',
        pen: '钢笔',
        marker: '马克笔',
        watercolor: '水彩',
        spray: '喷枪'
    };
    
    const brushIcons = {
        pencil: 'fa-pencil-alt',
        pen: 'fa-pen',
        marker: 'fa-highlighter',
        watercolor: 'fa-tint',
        spray: 'fa-wind'
    };
    
    if (currentBrushName) {
        currentBrushName.textContent = brushNames[brushType] || brushType;
    }
    
    if (currentBrushIcon) {
        // 移除所有图标类
        currentBrushIcon.className = 'fas brush-icon';
        // 添加新图标
        currentBrushIcon.classList.add(brushIcons[brushType] || 'fa-paint-brush');
    }
}

// 更新预设槽位显示
function updatePresetSlots() {
    const presets = brushManager.getAllPresets ? brushManager.getAllPresets() : {};
    
    presetSlots.forEach(slot => {
        const slotNum = slot.dataset.slot;
        const presetId = `custom_${slotNum}`;
        const preset = presets[presetId];
        
        const previewEl = slot.querySelector('.preset-preview');
        const labelEl = slot.querySelector('.preset-label');
        
        if (preset) {
            // 有保存的预设
            labelEl.textContent = preset.name || `预设 ${slotNum}`;
            
            // 创建简单的预览效果
            if (previewEl) {
                // 根据笔刷类型设置预览样式
                if (preset.type === 'pencil' || preset.type === 'pen') {
                    previewEl.style.background = `linear-gradient(90deg, ${preset.color || '#000000'} 0%, transparent 100%)`;
                } else if (preset.type === 'marker') {
                    previewEl.style.background = `linear-gradient(90deg, ${preset.color || '#000000'}55 0%, transparent 100%)`;
                } else if (preset.type === 'watercolor') {
                    previewEl.style.background = `radial-gradient(circle, ${preset.color || '#000000'}33 0%, transparent 100%)`;
                } else if (preset.type === 'spray') {
                    previewEl.style.background = `repeating-radial-gradient(circle, ${preset.color || '#000000'}55 0%, transparent 5px)`;
                }
            }
        } else {
            // 没有保存的预设
            labelEl.textContent = `预设 ${slotNum}`;
            if (previewEl) {
                previewEl.style.background = 'var(--primary-dark)';
            }
        }
    });
}

// 更新笔刷UI控件
function updateBrushUI() {
    // 更新笔刷类型按钮
    if (brushTypeBtns) {
        brushTypeBtns.forEach(btn => {
            if (btn.dataset.type === brush.type) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // 更新滑块值
    if (brushSize) brushSize.value = brush.size || 3;
    if (brushSizeValue) brushSizeValue.textContent = `${brush.size || 3}px`;
    
    if (brushFlow) brushFlow.value = brush.flow || 100;
    if (brushFlowValue) brushFlowValue.textContent = `${brush.flow || 100}%`;
    
    if (brushHardness) brushHardness.value = brush.hardness || 80;
    if (brushHardnessValue) brushHardnessValue.textContent = `${brush.hardness || 80}%`;
    
    if (brushSpacing) brushSpacing.value = brush.spacing || 20;
    if (brushSpacingValue) brushSpacingValue.textContent = `${brush.spacing || 20}%`;
    
    // 更新平滑度值
    if (brushSmoothness && brushSmoothnessValue) {
        const smoothness = brush.smoothness !== undefined ? brush.smoothness : 50;
        brushSmoothness.value = smoothness;
        brushSmoothnessValue.textContent = `${smoothness}%`;
    }
    
    // 更新散布值
    if (brushScatter && brushScatterValue) {
        const scatter = brush.scatter !== undefined ? brush.scatter : 0;
        brushScatter.value = scatter;
        brushScatterValue.textContent = `${scatter}%`;
    }
    
    // 更新混合模式
    if (blendMode && brush.blendMode) {
        blendMode.value = brush.blendMode;
    }
    
    // 更新纹理选项
    if (textureOption && brush.texture) {
        textureOption.value = brush.texture;
    }
    
    // 更新颜色
    if (colorPicker) colorPicker.value = brush.color || '#000000';
    
    // 更新当前笔刷信息显示
    updateCurrentBrushInfo(brush.type);
}

// 绘制预览
function updateBrushPreview() {
    // 使用Brush类的generatePreview方法
    brush.generatePreview(brushPreviewCanvas);
}

// 获取鼠标在画布上的位置
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    // 基础实现：直接计算鼠标在画布上的坐标
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 考虑设备像素比，确保正确的绘制坐标
    const dpr = window.devicePixelRatio || 1;
    const scaledX = x / dpr;
    const scaledY = y / dpr;
    
    console.log('鼠标事件坐标:', e.clientX, e.clientY, '转换后画布坐标:', scaledX, scaledY, 'DPR:', dpr);
    
    return { x: scaledX, y: scaledY };
}

// 获取触摸位置
function getTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    // 基础实现：直接计算触摸在画布上的坐标
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    
    // 考虑设备像素比，确保正确的绘制坐标
    const dpr = window.devicePixelRatio || 1;
    const scaledX = x / dpr;
    const scaledY = y / dpr;
    
    console.log('触摸事件坐标:', e.touches[0].clientX, e.touches[0].clientY, '转换后画布坐标:', scaledX, scaledY, 'DPR:', dpr);
    
    return { x: scaledX, y: scaledY };
}

// 鼠标按下事件
function startDrawing(e) {
    console.log('==== 开始绘制事件触发 ====');
    console.log('当前工具:', appState.currentTool);
    
    if (appState.currentTool !== 'brush' && appState.currentTool !== 'eraser') {
        console.log('不是画笔或橡皮擦工具，忽略事件');
        return;
    }
    
    appState.isDrawing = true;
    appState.isMouseInsideCanvas = true;
    appState.isUserIntendingToDraw = true;
    const pos = e.type.includes('touch') ? getTouchPos(e) : getMousePos(e);
    console.log('鼠标位置:', pos);
    
    // 清空重做栈
    appState.redoStack = [];
    
    // 设置工具和上下文
    if (appState.currentTool === 'eraser') {
        // 对于橡皮擦，使用白色覆盖
        brush.setColor('#ffffff');
        brush.setFlow(100);
        console.log('设置为橡皮擦模式');
    } else if (appState.currentTool === 'brush') {
        // 设置画笔颜色
        brush.setColor(colorPicker.value);
        console.log('画笔颜色设置为:', colorPicker.value);
    }
    
    // 确保笔刷使用正确的上下文
    if (brush.ctx !== offscreenCtx) {
        console.log('重新设置笔刷上下文');
        brush.setContext(offscreenCtx);
    }
    
    // 手动设置上下文属性（调试用）
    offscreenCtx.strokeStyle = appState.currentTool === 'eraser' ? '#ffffff' : colorPicker.value;
    offscreenCtx.lineWidth = brush.size;
    offscreenCtx.globalAlpha = brush.flow / 100;
    offscreenCtx.globalCompositeOperation = 'source-over';
    offscreenCtx.lineCap = 'round';
    offscreenCtx.lineJoin = 'round';
    
    console.log('上下文属性设置完成，准备开始绘制');
    
    // 使用笔刷类开始绘制
    brush.startDrawing(pos.x, pos.y);
    
    // 立即渲染起始点
    drawToCanvas();
}

// 鼠标移动事件 - 优化版
let animationFrameId = null;
let lastDrawTime = 0;
const DRAW_THROTTLE_MS = 16; // 约60fps

function draw(e) {
    if (!appState.isDrawing || (appState.currentTool !== 'brush' && appState.currentTool !== 'eraser')) return;
    
    const currentTime = Date.now();
    
    // 绘制节流 - 限制绘制频率
    if (currentTime - lastDrawTime < DRAW_THROTTLE_MS) {
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(() => {
                performDraw(e);
            });
        }
        return;
    }
    
    performDraw(e);
}

function performDraw(e) {
    const pos = e.type.includes('touch') ? getTouchPos(e) : getMousePos(e);
    console.log('绘制事件触发，位置:', pos);
    
    // 使用笔刷类进行绘制
    brush.draw(pos.x, pos.y);
    
    // 立即渲染，不使用requestAnimationFrame优化（调试用）
    drawToCanvas(); // 将离屏画布内容渲染到主画布
    
    // 更新时间戳
    lastDrawTime = Date.now();
}

// 鼠标释放事件 - 优化版
function stopDrawing() {
    console.log('==== 停止绘制事件触发 ====');
    
    if (!appState.isDrawing || (appState.currentTool !== 'brush' && appState.currentTool !== 'eraser')) {
        console.log('不在绘制状态或不是画笔/橡皮擦工具');
        return;
    }
    
    appState.isDrawing = false;
    
    // 取消任何待处理的动画帧请求，避免内存泄漏
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // 使用笔刷类结束绘制
    brush.endDrawing();
    
    // 确保离屏画布内容渲染到主画布 - 双缓冲最后一步
    drawToCanvas();
    console.log('绘制完成并渲染到主画布');
    
    // 保存当前画布状态到历史记录
    saveToHistory();
    
    // 保存应用状态到localStorage
    appState.saveToStorage();
}

// 保存当前画布状态到历史记录 - 优化版
function saveToHistory() {
    // 限制历史记录大小，优化内存使用
    const MAX_HISTORY_SIZE = 30; // 减少最大历史记录数量以节省内存
    if (appState.historyStack.length >= MAX_HISTORY_SIZE) {
        appState.historyStack.shift();
        appState.currentHistoryIndex--;
    }
    
    // 移除当前索引之后的历史记录
    if (appState.currentHistoryIndex < appState.historyStack.length - 1) {
        appState.historyStack = appState.historyStack.slice(0, appState.currentHistoryIndex + 1);
    }
    
    // 关键优化：从离屏画布获取图像数据，确保获取到完整的绘制内容
    const imageData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
    // 清空重做栈
    appState.redoStack = [];
    
    // 保存到历史栈
    appState.historyStack.push(imageData);
    appState.currentHistoryIndex = appState.historyStack.length - 1;
    
    // 更新按钮状态
    updateHistoryButtons();
}

// 撤销操作 - 使用双缓冲优化
function undo() {
    if (appState.currentHistoryIndex > 0) {
        appState.currentHistoryIndex--;
        const imageData = appState.historyStack[appState.currentHistoryIndex];
        
        // 在离屏画布上恢复状态
        offscreenCtx.putImageData(imageData, 0, 0);
        
        // 通过双缓冲技术更新主画布，减少闪烁
        drawToCanvas();
        
        updateHistoryButtons();
    }
}

// 重做操作 - 使用双缓冲优化
function redo() {
    if (appState.currentHistoryIndex < appState.historyStack.length - 1) {
        appState.currentHistoryIndex++;
        const imageData = appState.historyStack[appState.currentHistoryIndex];
        
        // 在离屏画布上恢复状态
        offscreenCtx.putImageData(imageData, 0, 0);
        
        // 通过双缓冲技术更新主画布，减少闪烁
        drawToCanvas();
        
        updateHistoryButtons();
    }
}

// 更新历史记录按钮状态
function updateHistoryButtons() {
    undoBtn.disabled = appState.currentHistoryIndex <= 0;
    redoBtn.disabled = appState.currentHistoryIndex >= appState.historyStack.length - 1;
}

// 调整画布大小 - 优化版本
function resizeCanvas() {
    console.log('==== 调整画布大小 ====');
    
    // 根据要求设置画布尺寸为：宽度100%，高度calc(100vh - 150px)
    // 计算实际像素值
    const width = window.innerWidth;
    const height = window.innerHeight - 150;
    
    console.log('计算的画布尺寸:', width, 'x', height);
    
    // 确保画布容器也有正确的尺寸限制
    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
        canvasContainer.style.width = '100%';
        canvasContainer.style.height = 'calc(100vh - 150px)';
    }
    
    // 考虑设备像素比以提高清晰度
    const dpr = window.devicePixelRatio || 1;
    const scaledWidth = Math.floor(width * dpr);
    const scaledHeight = Math.floor(height * dpr);
    
    console.log('DPR:', dpr, '缩放后尺寸:', scaledWidth, 'x', scaledHeight);
    
    // 设置画布尺寸
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    
    // 同时设置离屏画布尺寸，确保双缓冲一致性
    setOffscreenCanvasSize(scaledWidth, scaledHeight);
    
    // 重置上下文比例
    ctx.resetTransform();
    ctx.scale(dpr, dpr);
    
    // 重置离屏上下文比例
    offscreenCtx.resetTransform();
    offscreenCtx.scale(dpr, dpr);
    
    console.log('上下文缩放设置完成');
    
    // 填充白色背景
    offscreenCtx.fillStyle = '#ffffff';
    offscreenCtx.fillRect(0, 0, width, height);
    console.log('白色背景填充完成');
    
    // 更新画布显示
    updateCanvasSizeDisplay();
    
    console.log('画布大小调整完成');
    
    // 重绘画布内容
    redrawCanvas();
}

// 重绘画布内容 - 使用双缓冲技术
function redrawCanvas() {
    // 在离屏画布上绘制
    // 清空离屏画布
    offscreenCtx.fillStyle = '#ffffff';
    offscreenCtx.fillRect(0, 0, offscreenCanvas.width / (window.devicePixelRatio || 1), offscreenCanvas.height / (window.devicePixelRatio || 1));
    
    // 如果有历史记录，恢复最新状态到离屏画布
    if (appState.currentHistoryIndex >= 0 && appState.currentHistoryIndex < appState.historyStack.length) {
        offscreenCtx.putImageData(appState.historyStack[appState.currentHistoryIndex], 0, 0);
    }
    
    // 一次性将离屏画布内容绘制到主画布
    drawToCanvas();
}

// 保存画布为图片
function saveCanvasAsImage() {
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `sketch-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
}

// 缩放画布
function zoomIn() {
    if (appState.zoomFactor < 3.0) {
        appState.zoomFactor += 0.1;
        updateZoom();
    }
}

function zoomOut() {
    if (appState.zoomFactor > 0.1) {
        appState.zoomFactor -= 0.1;
        updateZoom();
    }
}

function updateZoom() {
    // 固定缩放为1，简化绘制计算
    canvas.style.transform = 'scale(1)';
    updateZoomDisplay();
}

function updateZoomDisplay() {
    zoomLevel.textContent = `${Math.round(appState.zoomFactor * 100)}%`;
}

function updateCanvasSizeDisplay() {
    canvasSize.textContent = `${canvas.width} × ${canvas.height}px`;
}

// 更新工具按钮状态
function updateToolButtons() {
    const tools = [brushTool, eraserTool, shapeTool, layerTool, aiTool];
    tools.forEach(tool => tool.classList.remove('active'));
    
    switch (appState.currentTool) {
        case 'brush':
            brushTool.classList.add('active');
            break;
        case 'eraser':
            eraserTool.classList.add('active');
            break;
        case 'shape':
            shapeTool.classList.add('active');
            break;
        case 'layer':
            layerTool.classList.add('active');
            break;
        case 'ai':
            aiTool.classList.add('active');
            break;
    }
}

// 显示工具提示
function showToolTip(message) {
    toolTip.textContent = message;
    toolTip.style.opacity = '1';
    
    // 3秒后自动隐藏
    setTimeout(() => {
        toolTip.style.opacity = '0';
    }, 3000);
}

function getDefaultToolTip() {
    switch (appState.currentTool) {
        case 'brush':
            return '使用画笔工具进行绘图';
        case 'eraser':
            return '使用橡皮擦工具擦除内容';
        case 'shape':
            return '使用形状工具添加图形';
        case 'layer':
            return '管理图层';
        case 'ai':
            return '使用AI功能增强您的草图';
        default:
            return '智能草图应用';
    }
}

function updateToolTip(message) {
    toolTip.textContent = message;
}

// 键盘事件处理
function handleKeydown(e) {
    // 防止在输入框中触发快捷键
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    // Ctrl+Z 撤销
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
    }
    // Ctrl+Y 重做
    else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
    }
    // Ctrl+S 保存
    else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveCanvasAsImage();
    }
    // 数字键1-5切换工具
    else if (e.key >= '1' && e.key <= '5') {
        const tools = ['brush', 'eraser', 'shape', 'layer', 'ai'];
        appState.currentTool = tools[e.key - 1];
        updateToolButtons();
        updateToolTip(getDefaultToolTip());
        
        // 保存状态到localStorage
        appState.saveToStorage();
    }
    // + 和 - 键缩放
    else if (e.key === '+') {
        zoomIn();
    }
    else if (e.key === '-') {
        zoomOut();
    }
}

// 初始化事件监听器
function initEventListeners() {
    // 鼠标事件
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', () => {
        appState.isMouseInsideCanvas = false;
        if (appState.isDrawing) {
            stopDrawing();
        }
    });
    
    // 触摸事件支持
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // 防止页面滚动
        startDrawing(e);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // 防止页面滚动
        draw(e);
    });
    
    canvas.addEventListener('touchend', stopDrawing);
    
    // 窗口调整事件 - 移除，使用带防抖的版本
    
    // 键盘事件
    document.addEventListener('keydown', handleKeydown);
    
    // 按钮事件
    clearCanvas.addEventListener('click', () => {
        if (confirm('确定要清空画布吗？')) {
            redrawCanvas();
            saveToHistory();
        }
    });
    
    saveImage.addEventListener('click', saveCanvasAsImage);
    undoBtn.addEventListener('click', undo);
    redoBtn.addEventListener('click', redo);
    
    // 工具按钮事件
    brushTool.addEventListener('click', () => {
        appState.currentTool = 'brush';
        updateToolButtons();
        updateToolTip(getDefaultToolTip());
        
        // 保存状态到localStorage
        appState.saveToStorage();
    });
    
    eraserTool.addEventListener('click', () => {
        appState.currentTool = 'eraser';
        updateToolButtons();
        updateToolTip(getDefaultToolTip());
        
        // 保存状态到localStorage
        appState.saveToStorage();
    });
    
    shapeTool.addEventListener('click', () => {
        appState.currentTool = 'shape';
        updateToolButtons();
        updateToolTip(getDefaultToolTip());
        
        // 保存状态到localStorage
        appState.saveToStorage();
    });
    
    layerTool.addEventListener('click', () => {
        appState.currentTool = 'layer';
        updateToolButtons();
        updateToolTip(getDefaultToolTip());
        
        // 保存状态到localStorage
        appState.saveToStorage();
    });
    
    aiTool.addEventListener('click', () => {
        appState.currentTool = 'ai';
        updateToolButtons();
        updateToolTip(getDefaultToolTip());
        
        // 保存状态到localStorage
        appState.saveToStorage();
    });
    
    // 缩放按钮事件
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    
    // AI参数事件
    if (aiPrecision) {
        aiPrecision.addEventListener('input', () => {
            aiPrecisionValue.textContent = aiPrecision.value;
        });
    }
}

// 初始化应用 - 优化版
function initApp() {
    console.log('==== 应用初始化开始 ====');
    
    // 先调整画布大小，这会同时设置离屏画布尺寸
    resizeCanvas();
    console.log('画布尺寸调整完成:', canvas.width, 'x', canvas.height);
    
    // 重置应用状态（调试用，避免localStorage中的错误状态）
    appState = {
        currentTool: 'brush',
        zoomFactor: 1,
        isDrawing: false,
        isMouseInsideCanvas: false,
        isUserIntendingToDraw: false,
        historyStack: [],
        currentHistoryIndex: -1,
        redoStack: [],
        loadFromStorage: function() {},
        saveToStorage: function() {}
    };
    
    // 确保缩放因子为1，简化绘制计算
    appState.zoomFactor = 1;
    
    // 更新UI以反映加载的状态
    updateZoom();
    updateToolButtons();
    
    // 初始化事件监听器
    initEventListeners();
    console.log('事件监听器初始化完成');
    
    updateCanvasSizeDisplay();
    updateToolTip(getDefaultToolTip());
    
    // 设置初始画布为白色（在离屏画布上）
    offscreenCtx.fillStyle = '#ffffff';
    offscreenCtx.fillRect(0, 0, offscreenCanvas.width / (window.devicePixelRatio || 1), offscreenCanvas.height / (window.devicePixelRatio || 1));
    console.log('初始画布背景设置完成');
    
    // 使用双缓冲技术更新主画布
    drawToCanvas();
    
    // 初始化笔刷系统，确保使用离屏画布上下文
    console.log('初始化笔刷系统...');
    // 重新创建Brush实例（调试用）
    brush = new Brush();
    brush.setContext(offscreenCtx);
    brush.setType('pencil');
    brush.setSize(3);
    brush.setColor('#000000');
    brush.setFlow(100);
    console.log('笔刷初始化完成，类型:', brush.type);
    
    initBrushControls();
    updateBrushUI();
    updateBrushPreview();
    updatePresetSlots(); // 更新预设槽位显示
    
    // 保存初始状态到历史记录
    saveToHistory();
    
    console.log('==== 应用初始化完成 ====');
}

// 当页面加载完成后初始化应用
window.addEventListener('load', initApp);

// 监听窗口大小变化，自动调整画布大小
window.addEventListener('resize', function() {
    // 使用防抖函数避免频繁调整，提高性能
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
});

// 用于防抖的定时器
let resizeTimeout = null;