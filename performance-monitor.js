/**
 * 性能监控模块 - 监控绘画应用的关键性能指标
 */
class PerformanceMonitor {
    constructor() {
        // DOM元素引用
        this.performancePanel = document.getElementById('performancePanel');
        this.toggleButton = document.getElementById('togglePerformancePanel');
        this.performanceSummary = document.getElementById('performanceSummary');
        this.fpsCounter = document.getElementById('fpsCounter');
        this.latencyCounter = document.getElementById('latencyCounter');
        this.memoryCounter = document.getElementById('memoryCounter');
        this.activeBrush = document.getElementById('activeBrush');
        
        // 图表引用
        this.fpsChart = document.getElementById('fpsChart');
        this.latencyChart = document.getElementById('latencyChart');
        this.fpsCtx = this.fpsChart.getContext('2d');
        this.latencyCtx = this.latencyChart.getContext('2d');
        
        // 性能数据缓存
        this.fpsHistory = [];
        this.latencyHistory = [];
        this.maxHistoryLength = 50; // 图表显示的最大数据点
        
        // 性能监控变量
        this.lastFrameTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdateTime = 0;
        
        // 延迟测量变量
        this.startDrawTime = 0;
        this.drawLatency = 0;
        
        // 内存使用变量
        this.lastMemoryUsage = 0;
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化性能监控面板
     */
    init() {
        // 设置折叠/展开功能
        this.toggleButton.addEventListener('click', () => {
            this.togglePanel();
        });
        
        // 初始化图表
        this.initCharts();
        
        // 启动性能监控
        this.startMonitoring();
        
        // 立即更新一次内存使用情况
        this.updateMemoryUsage();
    }
    
    /**
     * 初始化图表
     */
    initCharts() {
        // 清空图表
        this.fpsCtx.clearRect(0, 0, this.fpsChart.width, this.fpsChart.height);
        this.latencyCtx.clearRect(0, 0, this.latencyChart.width, this.latencyChart.height);
        
        // 设置背景色
        this.fpsCtx.fillStyle = 'rgba(15, 15, 35, 0.2)';
        this.latencyCtx.fillStyle = 'rgba(15, 15, 35, 0.2)';
        this.fpsCtx.fillRect(0, 0, this.fpsChart.width, this.fpsChart.height);
        this.latencyCtx.fillRect(0, 0, this.latencyChart.width, this.latencyChart.height);
    }
    
    /**
     * 切换性能面板的显示/隐藏
     */
    togglePanel() {
        const isVisible = this.performancePanel.style.display === 'flex';
        this.performancePanel.style.display = isVisible ? 'none' : 'flex';
        this.toggleButton.classList.toggle('active', !isVisible);
    }
    
    /**
     * 启动性能监控
     */
    startMonitoring() {
        // 使用requestAnimationFrame监控FPS
        const monitorFrameRate = (timestamp) => {
            // 计算FPS
            if (this.lastFrameTime) {
                const deltaTime = timestamp - this.lastFrameTime;
                this.frameCount++;
                
                // 每1000ms更新一次FPS显示
                if (timestamp - this.lastFpsUpdateTime >= 1000) {
                    this.fps = Math.round((this.frameCount * 1000) / (timestamp - this.lastFpsUpdateTime));
                    this.updateFPSCounter(this.fps);
                    this.updateFPSChart(this.fps);
                    
                    // 重置计数器
                    this.frameCount = 0;
                    this.lastFpsUpdateTime = timestamp;
                }
            } else {
                this.lastFpsUpdateTime = timestamp;
            }
            
            this.lastFrameTime = timestamp;
            
            // 继续监控
            requestAnimationFrame(monitorFrameRate);
        };
        
        // 启动FPS监控
        requestAnimationFrame(monitorFrameRate);
        
        // 定期更新内存使用情况（每5秒）
        setInterval(() => {
            this.updateMemoryUsage();
        }, 5000);
    }
    
    /**
     * 更新FPS计数器显示
     */
    updateFPSCounter(fps) {
        this.fpsCounter.textContent = fps;
        
        // 根据FPS范围设置颜色编码
        this.updateStatusColor(this.fpsCounter, {
            good: fps >= 50,
            warning: fps >= 30 && fps < 50,
            critical: fps < 30
        });
        
        // 更新摘要文本
        this.updatePerformanceSummary();
    }
    
    /**
     * 更新FPS图表
     */
    updateFPSChart(fps) {
        // 添加新数据点
        this.fpsHistory.push(fps);
        
        // 保持历史记录在最大长度内
        if (this.fpsHistory.length > this.maxHistoryLength) {
            this.fpsHistory.shift();
        }
        
        // 绘制图表
        this.drawChart(this.fpsCtx, this.fpsHistory, 0, 60);
    }
    
    /**
     * 更新延迟计数器显示
     */
    updateLatencyCounter(latency) {
        this.latencyCounter.textContent = `${latency}ms`;
        
        // 根据延迟范围设置颜色编码
        this.updateStatusColor(this.latencyCounter, {
            good: latency < 10,
            warning: latency >= 10 && latency < 30,
            critical: latency >= 30
        });
        
        // 更新摘要文本
        this.updatePerformanceSummary();
    }
    
    /**
     * 更新延迟图表
     */
    updateLatencyChart(latency) {
        // 添加新数据点
        this.latencyHistory.push(latency);
        
        // 保持历史记录在最大长度内
        if (this.latencyHistory.length > this.maxHistoryLength) {
            this.latencyHistory.shift();
        }
        
        // 绘制图表
        this.drawChart(this.latencyCtx, this.latencyHistory, 0, 100);
    }
    
    /**
     * 更新内存使用情况
     */
    updateMemoryUsage() {
        // 尝试使用Performance API获取内存信息
        if (performance && performance.memory) {
            const memoryMB = Math.round(performance.memory.usedJSHeapSize / (1024 * 1024));
            this.memoryCounter.textContent = `${memoryMB}MB`;
            
            // 计算内存使用变化
            const memoryChange = memoryMB - this.lastMemoryUsage;
            this.lastMemoryUsage = memoryMB;
            
            // 根据内存使用情况设置颜色编码
            this.updateStatusColor(this.memoryCounter, {
                good: memoryMB < 500,
                warning: memoryMB >= 500 && memoryMB < 1000,
                critical: memoryMB >= 1000
            });
        } else {
            // 不支持时显示N/A
            this.memoryCounter.textContent = 'N/A';
        }
    }
    
    /**
     * 更新当前活跃笔刷
     */
    updateActiveBrush(brushType) {
        this.activeBrush.textContent = brushType;
    }
    
    /**
     * 开始测量绘制延迟
     */
    startDrawLatencyMeasurement() {
        this.startDrawTime = performance.now();
    }
    
    /**
     * 结束测量绘制延迟
     */
    endDrawLatencyMeasurement() {
        if (this.startDrawTime > 0) {
            const endTime = performance.now();
            this.drawLatency = Math.round(endTime - this.startDrawTime);
            
            // 更新延迟显示
            this.updateLatencyCounter(this.drawLatency);
            this.updateLatencyChart(this.drawLatency);
            
            // 重置开始时间
            this.startDrawTime = 0;
        }
    }
    
    /**
     * 更新性能摘要
     */
    updatePerformanceSummary() {
        // 根据FPS判断整体性能状态
        let summary = '性能';
        
        if (this.fps >= 50) {
            summary = '性能良好';
        } else if (this.fps >= 30) {
            summary = '性能一般';
        } else {
            summary = '性能较差';
        }
        
        this.performanceSummary.textContent = summary;
    }
    
    /**
     * 根据状态更新元素颜色类
     */
    updateStatusColor(element, status) {
        // 移除所有状态类
        element.classList.remove('good', 'warning', 'critical');
        
        // 添加对应的状态类
        if (status.good) {
            element.classList.add('good');
        } else if (status.warning) {
            element.classList.add('warning');
        } else if (status.critical) {
            element.classList.add('critical');
        }
    }
    
    /**
     * 绘制简单的线图
     */
    drawChart(ctx, data, minValue, maxValue) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const padding = 2;
        const availableWidth = width - (padding * 2);
        const availableHeight = height - (padding * 2);
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 设置背景
        ctx.fillStyle = 'rgba(15, 15, 35, 0.2)';
        ctx.fillRect(0, 0, width, height);
        
        if (data.length < 2) return;
        
        // 绘制数据线
        ctx.beginPath();
        ctx.strokeStyle = '#8b5cf6'; // 使用强调色
        ctx.lineWidth = 1.5;
        
        for (let i = 0; i < data.length; i++) {
            // 归一化数据值到图表高度
            const value = Math.max(minValue, Math.min(maxValue, data[i]));
            const normalizedValue = 1 - (value - minValue) / (maxValue - minValue);
            const x = padding + (i / (data.length - 1)) * availableWidth;
            const y = padding + normalizedValue * availableHeight;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // 绘制参考线
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)';
        ctx.lineWidth = 0.5;
        
        // 中间参考线
        const midY = padding + availableHeight / 2;
        ctx.moveTo(padding, midY);
        ctx.lineTo(width - padding, midY);
        
        ctx.stroke();
    }
}

// 导出模块
export default PerformanceMonitor;