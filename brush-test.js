/**
 * 笔刷测试模块 - 用于验证和测试不同笔刷的效果
 */
class BrushTest {
    constructor() {
        // DOM元素引用
        this.runTestButton = document.getElementById('runBrushTest');
        this.clearResultsButton = document.getElementById('clearTestResults');
        this.testResultsContainer = document.getElementById('brushTestResults');
        this.testBrushSizeInput = document.getElementById('testBrushSize');
        this.testBrushFlowInput = document.getElementById('testBrushFlow');
        this.testBrushFlowValue = document.getElementById('testBrushFlowValue');
        
        // 笔刷类型定义
        this.brushTypes = ['pencil', 'pen', 'marker', 'watercolor', 'spray'];
        this.brushNames = {
            'pencil': '铅笔',
            'pen': '钢笔',
            'marker': '马克笔',
            'watercolor': '水彩',
            'spray': '喷枪'
        };
        
        // 测试结果存储
        this.testResults = [];
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化笔刷测试模块
     */
    init() {
        // 绑定事件监听器
        this.runTestButton.addEventListener('click', () => this.runAllBrushTests());
        this.clearResultsButton.addEventListener('click', () => this.clearTestResults());
        this.testBrushFlowInput.addEventListener('input', (e) => {
            this.testBrushFlowValue.textContent = `${e.target.value}%`;
        });
        
        // 初始化流量显示
        this.testBrushFlowValue.textContent = `${this.testBrushFlowInput.value}%`;
    }
    
    /**
     * 运行所有笔刷的测试
     */
    runAllBrushTests() {
        // 清空之前的测试结果
        this.clearTestResults();
        
        // 获取测试参数
        const testSize = parseInt(this.testBrushSizeInput.value) || 5;
        const testFlow = parseInt(this.testBrushFlowInput.value) || 100;
        
        // 显示加载状态
        this.testResultsContainer.innerHTML = '<p class="no-results">正在测试所有笔刷...</p>';
        
        // 使用setTimeout确保UI更新后再开始测试
        setTimeout(() => {
            // 清空测试结果容器
            this.testResultsContainer.innerHTML = '';
            this.testResults = [];
            
            // 为每种笔刷类型创建测试
            this.brushTypes.forEach((brushType, index) => {
                // 使用setTimeout为每个测试添加延迟，避免UI阻塞
                setTimeout(() => {
                    this.runSingleBrushTest(brushType, testSize, testFlow);
                }, index * 100); // 每个测试间隔100ms
            });
        }, 100);
    }
    
    /**
     * 运行单个笔刷的测试
     */
    runSingleBrushTest(brushType, size, flow) {
        // 创建测试画布
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 60;
        canvas.className = 'brush-test-canvas';
        
        // 获取画布上下文
        const ctx = canvas.getContext('2d');
        
        // 设置白色背景
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 保存当前笔刷状态
        const originalBrushType = window.brush.type;
        const originalBrushSize = window.brush.size;
        const originalBrushFlow = window.brush.flow;
        
        // 设置测试参数
        window.brush.setType(brushType);
        window.brush.setSize(size);
        window.brush.setFlow(flow);
        
        // 在测试画布上绘制测试图案
        this.drawTestPattern(ctx, canvas.width, canvas.height, brushType, size, flow);
        
        // 评估笔刷测试结果
        const testResult = this.evaluateBrushTest(brushType, canvas);
        
        // 记录测试结果
        const result = {
            type: brushType,
            name: this.brushNames[brushType] || brushType,
            size: size,
            flow: flow,
            status: testResult.status,
            details: testResult.details
        };
        
        this.testResults.push(result);
        
        // 显示测试结果
        this.displayTestResult(result, canvas);
        
        // 恢复原始笔刷状态
        window.brush.setType(originalBrushType);
        window.brush.setSize(originalBrushSize);
        window.brush.setFlow(originalBrushFlow);
    }
    
    /**
     * 在测试画布上绘制测试图案
     */
    drawTestPattern(ctx, width, height, brushType, size, flow) {
        // 设置画布上下文供笔刷使用
        const testBrush = new Brush();
        testBrush.setContext(ctx);
        testBrush.setType(brushType);
        testBrush.setSize(size);
        testBrush.setFlow(flow);
        testBrush.setColor('#333333');
        
        // 定义测试图案的绘制函数
        const drawLine = (x1, y1, x2, y2) => {
            testBrush.startDrawing(x1, y1);
            testBrush.draw(x2, y2);
            testBrush.endDrawing();
        };
        
        // 绘制水平测试线
        drawLine(width * 0.1, height * 0.3, width * 0.9, height * 0.3);
        
        // 绘制垂直测试线
        drawLine(width * 0.2, height * 0.2, width * 0.2, height * 0.8);
        
        // 绘制斜线
        drawLine(width * 0.1, height * 0.6, width * 0.5, height * 0.2);
        
        // 绘制曲线或波浪线
        const centerY = height * 0.7;
        const waveAmplitude = 8;
        const waveFrequency = 0.05;
        
        let startX = width * 0.1;
        let startY = centerY + Math.sin(startX * waveFrequency) * waveAmplitude;
        
        testBrush.startDrawing(startX, startY);
        
        for (let x = startX + 2; x < width * 0.9; x += 2) {
            const y = centerY + Math.sin(x * waveFrequency) * waveAmplitude;
            testBrush.draw(x, y);
        }
        
        testBrush.endDrawing();
    }
    
    /**
     * 评估笔刷测试结果
     */
    evaluateBrushTest(brushType, canvas) {
        // 获取画布数据进行分析
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        
        // 简单的评估逻辑：检查是否有绘制内容
        let pixelCount = 0;
        for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            
            // 如果像素不是白色，则计数
            if (r < 255 || g < 255 || b < 255) {
                pixelCount++;
            }
        }
        
        // 计算绘制的像素百分比
        const totalPixels = canvas.width * canvas.height;
        const drawnPixelPercentage = (pixelCount / totalPixels) * 100;
        
        // 根据绘制效果评估状态
        let status = 'good';
        let details = '';
        
        if (drawnPixelPercentage < 1) {
            status = 'error';
            details = '未检测到绘制内容';
        } else if (drawnPixelPercentage < 5) {
            status = 'warning';
            details = '绘制内容较少';
        } else {
            status = 'good';
            details = '绘制正常';
        }
        
        return { status, details };
    }
    
    /**
     * 显示测试结果
     */
    displayTestResult(result, canvas) {
        // 创建结果容器
        const resultItem = document.createElement('div');
        resultItem.className = `brush-test-item ${result.status}`;
        
        // 添加测试画布
        resultItem.appendChild(canvas);
        
        // 创建信息容器
        const infoContainer = document.createElement('div');
        infoContainer.className = 'brush-test-info';
        
        // 添加笔刷名称
        const nameElement = document.createElement('div');
        nameElement.className = 'brush-test-name';
        nameElement.textContent = result.name;
        infoContainer.appendChild(nameElement);
        
        // 添加测试参数
        const paramsElement = document.createElement('div');
        paramsElement.className = 'brush-test-params';
        paramsElement.innerHTML = `大小: ${result.size}px<br>流量: ${result.flow}%<br>${result.details}`;
        infoContainer.appendChild(paramsElement);
        
        // 添加状态标签
        const statusElement = document.createElement('div');
        statusElement.className = `brush-test-status ${result.status}`;
        
        // 设置状态文本
        let statusText = '';
        switch (result.status) {
            case 'good':
                statusText = '良好';
                break;
            case 'warning':
                statusText = '警告';
                break;
            case 'error':
                statusText = '错误';
                break;
        }
        
        statusElement.textContent = statusText;
        
        // 组装结果项
        resultItem.appendChild(infoContainer);
        resultItem.appendChild(statusElement);
        
        // 添加到结果容器
        this.testResultsContainer.appendChild(resultItem);
    }
    
    /**
     * 清除测试结果
     */
    clearTestResults() {
        this.testResults = [];
        this.testResultsContainer.innerHTML = '<p class="no-results">点击"运行笔刷测试"开始测试所有笔刷</p>';
    }
}

// 导出模块
export default BrushTest;