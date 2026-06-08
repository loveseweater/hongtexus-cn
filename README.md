# Hongtexus — Premium Textile Solutions

Hongtexus 纺织品品牌官网，集品牌展示、产品目录、电商与博客于一体的多语言企业网站。

支持 5 种语言：英文 (EN)、中文 (ZH)、西班牙语 (ES)、法语 (FR)、德语 (DE)。

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 目录结构

```
hongtexus/
├── src/
│   ├── app/
│   │   ├── [locale]/           # 多语言路由
│   │   │   ├── page.tsx        # 首页
│   │   │   ├── products/       # 产品目录
│   │   │   ├── blog/           # 博客
│   │   │   ├── about/          # 关于我们
│   │   │   └── contact/        # 联系我们
│   │   └── api/                # API 路由
│   ├── components/
│   │   ├── layout/             # Header, Footer, LanguageSwitcher
│   │   └── ui/                 # 通用 UI 组件
│   ├── lib/
│   │   ├── data/               # 产品/博客数据
│   │   └── utils.ts
│   ├── messages/               # 5 种语言文案
│   ├── i18n.ts                 # 国际化配置
│   ├── routing.ts              # 路由配置
│   └── middleware.ts           # 语言中间件
├── public/
└── package.json
```

## 技术栈

- **框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **多语言**: next-intl
- **图标**: Lucide React
- **字体**: Playfair Display + Inter (Google Fonts)

## 部署

域名托管在 Cloudflare，可通过 Cloudflare Pages 部署。
