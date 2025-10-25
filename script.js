// 获取DOM元素
const canvas = document.getElementById('sketchCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const lineWidth = document.getElementById('lineWidth');
const lineWidthValue = document.getElementById('lineWidthValue');
const smoothToggle = document.getElementById('smoothToggle');
const smoothIntensity = document.getElementById('smoothIntensity');
const clearCanvas = document.getElementById('clearCanvas');
const saveImage = document.getElementById('saveImage');
const undoBtn = document.getElementById('undo');

// 初始化变量
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentX = 0;
let currentY = 0;
let points = []; // 存储绘制点
let animationFrameId = null;
let history = []; // 存储历史记录用于撤销功能
let maxHistory = 50; // 最大历史记录数量
let isMouseInsideCanvas = false; // 跟踪鼠标是否在画布内
let isUserIntendingToDraw = false; // 新变量：跟踪用户是否有意向绘画（按住鼠标按钮）

// 设置画布尺寸
function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // 设置canvas的实际尺寸
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    
    // 重新绘制内容（如果需要）
    redrawCanvas();
}

// 重新绘制画布内容
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 获取鼠标或触摸在画布上的坐标
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    // 检查是鼠标事件还是触摸事件
    const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

// 使用贝塞尔曲线平滑线条
function smoothCurve(points, tension = 0.5) {
    if (points.length < 3) return points;
    
    const result = [];
    
    // 添加第一个点
    result.push(points[0]);
    
    // 为中间的点计算平滑曲线
    for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        
        result.push(points[i]);
        result.push({x: xc, y: yc});
    }
    
    // 添加最后一个点
    result.push(points[points.length - 1]);
    
    return result;
}

// 绘制线条（简化版本，确保连续绘制）
function drawLine() {
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // 对于较少的点，直接连线
    if (points.length <= 3) {
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
    } else {
        // 对于较多的点，使用简单的平滑算法
        const tension = smoothing.value / 10;
        
        for (let i = 1; i < points.length - 1; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
        }
        // 连接到最后一个点
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
    }
    
    ctx.stroke();
    ctx.closePath();
}

// 鼠标按下事件
function startDrawing(e) {
    isDrawing = true;
    isMouseInsideCanvas = true;
    isUserIntendingToDraw = true; // 用户按下鼠标按钮，表示有意向绘画
    const pos = getMousePos(e);
    lastX = pos.x;
    lastY = pos.y;
    currentX = pos.x;
    currentY = pos.y;
    
    // 重置点数组并添加第一个点
    points = [{x: pos.x, y: pos.y}];
    
    // 设置绘图上下文
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = lineWidth.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';
}

// 设置绘图上下文属性
function setupDrawingContext() {
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = lineWidth.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';
}

// 基于贝塞尔曲线的线条平滑函数
function smoothPoints(points, intensity) {
    if (points.length < 2) return points;
    
    // 根据强度调整平滑系数
    let tension = 0.4;
    if (intensity === 'low') tension = 0.2;
    else if (intensity === 'high') tension = 0.6;
    
    const smoothed = [];
    
    // 对于简单的二次贝塞尔曲线，我们只需要原始点
    // 控制点将在绘制时计算
    return points;
}

// 鼠标移动事件
function draw(e) {
    if (!isDrawing) return;
    
    const pos = getMousePos(e);
    currentX = pos.x;
    currentY = pos.y;
    
    // 添加新点到数组
    points.push({x: pos.x, y: pos.y});
    
    // 设置绘制属性（确保每次绘制都使用正确的样式）
    setupDrawingContext();
    
    // 检查是否启用平滑
    if (smoothToggle.checked && points.length >= 2) {
        // 清空整个画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 如果历史记录不为空，先恢复到上一个状态
        if (history.length > 0) {
            ctx.putImageData(history[history.length - 1], 0, 0);
        } else {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // 重新设置绘制属性
        setupDrawingContext();
        
        // 获取平滑强度
        const intensity = smoothIntensity.value;
        let tension = 0.4;
        if (intensity === 'low') tension = 0.2;
        else if (intensity === 'high') tension = 0.6;
        
        // 直接使用原始点，在绘制时计算控制点
        if (points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            
            // 使用更简单可靠的二次贝塞尔曲线算法
            for (let i = 1; i < points.length - 1; i++) {
                // 计算控制点 (中点)
                const cpX = points[i].x + tension * (points[i+1].x - points[i-1].x) / 2;
                const cpY = points[i].y + tension * (points[i+1].y - points[i-1].y) / 2;
                
                // 使用二次贝塞尔曲线连接到下一个点
                ctx.quadraticCurveTo(cpX, cpY, points[i+1].x, points[i+1].y);
            }
            
            ctx.stroke();
        }
    } else {
        // 不使用平滑时的直接绘制，确保实时反馈
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();
        ctx.closePath();
    }
    
    lastX = pos.x;
    lastY = pos.y;
}

// 鼠标释放事件
function stopDrawing() {
    if (!isDrawing) return;
    
    isDrawing = false;
    
    // 保存当前画布状态到历史记录
    saveToHistory();
    
    // 清除收集的点，为下一次绘制做准备
    points = [];
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    // 注意：我们不再重置isUserIntendingToDraw，而是在mouseup事件中处理
}

// 保存当前画布状态到历史记录
function saveToHistory() {
    // 获取当前画布内容
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // 添加到历史记录
    history.push(imageData);
    
    // 如果历史记录超过最大数量，删除最早的记录
    if (history.length > maxHistory) {
        history.shift();
    }
}

// 更新线条粗细显示
function updateLineWidth() {
    lineWidthValue.textContent = `${lineWidth.value}px`;
}

// 清空画布
function clearCanvasAction() {
    // 先清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    points = [];
    
    // 然后保存清空后的状态到历史记录
    saveToHistory();
}

// 撤销上一步
function undoAction() {
    if (history.length === 0) return;
    
    // 移除最后一次操作
    history.pop();
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 如果还有历史记录，恢复上一个状态
    if (history.length > 0) {
        ctx.putImageData(history[history.length - 1], 0, 0);
    }
}

// 快速颜色选择
function setupQuickColors() {
    const colorBtns = document.querySelectorAll('.color-btn');
    
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            colorPicker.value = color;
            
            // 更新活动状态
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // 设置默认活动颜色
    const defaultColorBtn = document.querySelector('.color-btn[data-color="#000000"]');
    if (defaultColorBtn) {
        defaultColorBtn.classList.add('active');
    }
    
    // 监听颜色选择器变化
    colorPicker.addEventListener('input', () => {
        // 移除所有活动状态
        colorBtns.forEach(b => b.classList.remove('active'));
        
        // 检查是否与快速颜色匹配
        const currentColor = colorPicker.value;
        const matchingBtn = document.querySelector(`.color-btn[data-color="${currentColor}"]`);
        if (matchingBtn) {
            matchingBtn.classList.add('active');
        }
    });
}

// 保存图片
function saveImageAction() {
    const link = document.createElement('a');
    link.download = `sketch_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// 绑定事件监听
function initEventListeners() {
    // 鼠标事件
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    
    // 修改mouseup事件，重置用户绘画意图
    canvas.addEventListener('mouseup', () => {
        isUserIntendingToDraw = false; // 松开鼠标按钮，表示结束绘画意图
        stopDrawing();
    });
    
    // 修改mouseout事件，只暂停绘画但保持用户意图
    canvas.addEventListener('mouseout', () => {
        isMouseInsideCanvas = false;
        stopDrawing(); // 暂停绘画但不重置isUserIntendingToDraw
    });
    
    // 当鼠标回到画布且用户仍按住鼠标时，恢复绘画
    canvas.addEventListener('mouseenter', (e) => {
        isMouseInsideCanvas = true;
        // 如果用户仍在按住鼠标按钮（有绘画意图），重新开始绘画
        if (isUserIntendingToDraw && !isDrawing) {
            // 我们不需要保存点数组，让它自然开始新的绘制
            const pos = getMousePos(e);
            lastX = pos.x;
            lastY = pos.y;
            currentX = pos.x;
            currentY = pos.y;
            
            points = [];
            points.push({x: pos.x, y: pos.y});
            
            isDrawing = true;
        }
    });
    
    // 触摸事件支持
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isUserIntendingToDraw = true; // 设置用户有意向绘画
        startDrawing(e);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        draw(e);
    });
    
    // 修改touchend事件，重置用户绘画意图
    canvas.addEventListener('touchend', () => {
        isUserIntendingToDraw = false;
        stopDrawing();
    });
    
    // 工具栏事件
    lineWidth.addEventListener('input', updateLineWidth);
    clearCanvas.addEventListener('click', clearCanvasAction);
    undoBtn.addEventListener('click', undoAction);
    saveImage.addEventListener('click', saveImageAction);
    
    // 设置快速颜色选择
    setupQuickColors();
    
    // 窗口调整事件
    window.addEventListener('resize', resizeCanvas);
}

// 初始化应用
function initApp() {
    resizeCanvas();
    initEventListeners();
    updateLineWidth();
    
    // 设置初始画布为白色
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 保存初始状态到历史记录
    saveToHistory();
}

// 当页面加载完成后初始化应用
window.addEventListener('load', initApp);