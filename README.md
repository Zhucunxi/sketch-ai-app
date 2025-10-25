# Sketch AI App

一个基于Web的智能草图应用，提供流畅的画布绘画体验。

## 功能特性

- 实时画布绘画
- 线条平滑功能（可调节强度）
- 颜色选择（黑白灰等）
- 线条粗细调节
- 清空画布功能
- 撤销上一步操作
- 保存图片功能
- 鼠标移出画布后暂停绘画，回到画布后继续绘画（用户按住鼠标时）

## 项目结构

```
├── index.html  # 主页面
├── script.js   # JavaScript逻辑
├── style.css   # 样式表
├── package.json  # 项目配置和依赖
└── vercel.json   # Vercel部署配置
```

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

然后在浏览器中访问 `http://localhost:8080`

## 部署到Vercel

### 方法1：使用Vercel CLI

1. 安装Vercel CLI

```bash
npm i -g vercel
```

2. 登录Vercel

```bash
vercel login
```

3. 部署项目

```bash
vercel --prod
```

### 方法2：使用GitHub + Vercel

1. 将项目推送到GitHub仓库
2. 在 [Vercel官网](https://vercel.com) 创建账户
3. 导入你的GitHub仓库
4. 配置部署设置（项目已包含必要的配置文件）
5. 点击部署

## 技术栈

- HTML5 Canvas
- JavaScript
- CSS3
- Vercel（部署）

## 许可证

MIT