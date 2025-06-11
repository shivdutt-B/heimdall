<div style="font-family: Arial, sans-serif;">

# 🛡️ Heimdall
### Server Uptime & Cold Start Monitoring Platform

<div align="center">

[![Node.js](https://img.shields.io/badge/Built%20With-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![BullMQ](https://img.shields.io/badge/Queue-BullMQ-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://docs.bullmq.io/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](https://nodemailer.com/)
[![License](https://img.shields.io/github/license/yourusername/heimdall?style=for-the-badge)](LICENSE)

</div>

---

## 🌟 Overview

**Heimdall** is a comprehensive ping and uptime monitoring platform designed to eliminate cold starts on free hosting platforms like **Render**, **Railway**, and **Fly.io**. By intelligently pinging your backend servers at customizable intervals, Heimdall ensures optimal performance while providing detailed analytics and instant alerts.

> **🎯 Mission**: Keep your servers warm, your users happy, and your deployments reliable.

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🚀 **Performance Optimization**
- **Cold Start Prevention** — Reduce delays by 30-50 seconds
- **Intelligent Pinging** — Customizable intervals per server
- **Smart Resource Management** — Heap & RSS memory tracking

</td>
<td width="50%">

### 📊 **Advanced Monitoring**
- **Real-time Metrics** — Response time, uptime %, status codes
- **Interactive Dashboard** — Visual latency trends and history
- **Performance Analytics** — Comprehensive server health insights

</td>
</tr>
<tr>
<td width="50%">

### 🔔 **Intelligent Alerting**
- **Email Notifications** — Instant failure alerts
- **Smart Spam Prevention** — Configurable thresholds
- **24/7 Monitoring** — Continuous health checks

</td>
<td width="50%">

### 🏗️ **Scalable Architecture**
- **6-Microservice Design** — Clean separation of concerns
- **Queue-Based Processing** — BullMQ + Redis integration
- **Horizontal Scaling** — Load balancer ready

</td>
</tr>
</table>

---

## 🏛️ Architecture Overview

<div align="center">
<img src="./readme.assets/architecture.jpg" alt="Heimdall Architecture" width="400px" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</div>

### 🧱 Microservices Breakdown

| 🎯 Service | 📝 Description | 🔧 Technology |
|------------|-----------------|---------------|
| **🌐 API Service** | User management, authentication, server CRUD operations | Express.js, Prisma |
| **⚡ Queue Service** | Job scheduling and Redis queue management | BullMQ, Redis |
| **🔍 Ping Worker** | Server pinging, performance metrics collection | Node.js, HTTP clients |
| **📧 Alert Service** | Email notifications and alert management | Nodemailer, SMTP |
| **⚖️ Load Balancer** | Worker distribution and scaling (Optional) | Custom Node.js |
| **💻 Client Dashboard** | Interactive monitoring interface | React, TailwindCSS |

---

## 🛠️ Technology Stack

### 🖥️ **Backend Infrastructure**
| Technology | Badge | Purpose |
|------------|-------|---------|
| **Node.js** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) | Runtime Environment |
| **Express.js** | ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white) | Web Framework |
| **Prisma** | ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) | ORM & Database Client |

### 🗄️ **Database & Storage**
| Technology | Badge | Purpose |
|------------|-------|---------|
| **PostgreSQL** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white) | Primary Database |
| **Redis** | ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) | Caching & Queue Storage |

### 📬 **Queue System**
| Technology | Badge | Purpose |
|------------|-------|---------|
| **BullMQ** | ![BullMQ](https://img.shields.io/badge/BullMQ-FF6B6B?style=flat-square&logo=redis&logoColor=white) | Job Queue Management |
| **Redis Queue** | ![Redis](https://img.shields.io/badge/Redis_Queue-DC382D?style=flat-square&logo=redis&logoColor=white) | Queue Backend |

### 🎨 **Frontend**
| Technology | Badge | Purpose |
|------------|-------|---------|
| **React** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black) | UI Library |
| **TailwindCSS** | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white) | Styling Framework |

### 📧 **Communication**
| Technology | Badge | Purpose |
|------------|-------|---------|
| **Nodemailer** | ![Nodemailer](https://img.shields.io/badge/Nodemailer-EA4335?style=flat-square&logo=gmail&logoColor=white) | Email Service |
| **SMTP** | ![SMTP](https://img.shields.io/badge/SMTP-FF6B35?style=flat-square&logo=mail.ru&logoColor=white) | Email Protocol |

### 🚀 **DevOps & Deployment**
| Technology | Badge | Purpose |
|------------|-------|---------|
| **Docker** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) | Containerization |
| **Render** | ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white) | Cloud Platform |
| **Railway** | ![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=flat-square&logo=railway&logoColor=white) | Hosting Platform |
| **AWS EC2** | ![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=flat-square&logo=amazon-aws&logoColor=white) | Cloud Compute |
| **AWS Services** | ![AWS](https://img.shields.io/badge/AWS-FF9900?style=flat-square&logo=amazon-aws&logoColor=white) | Cloud Infrastructure |

---

## 🚀 Quick Start Guide

### 📋 Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **pnpm** (Package manager)
- **Docker** (For Redis & PostgreSQL)
- **Git**

### ⚡ Installation Steps

```bash
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/heimdall.git
cd heimdall

# 2️⃣ Install dependencies across all services
pnpm install

# 3️⃣ Start infrastructure services
docker-compose up -d

# 4️⃣ Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# 5️⃣ Initialize database
pnpm prisma migrate dev
pnpm prisma generate

# 6️⃣ Start all services concurrently
pnpm dev
```

### 🔧 Individual Service Commands

```bash
# Start specific services
pnpm --filter api-service dev      # 🌐 API Server
pnpm --filter worker dev           # 🔍 Ping Worker
pnpm --filter alert-service dev    # 📧 Alert Service
pnpm --filter queue-service dev    # ⚡ Queue Service
pnpm --filter client dev           # 💻 Dashboard
```

---

## 📁 Project Structure

```
heimdall/
├── 🌐 api-service/           # REST API & Authentication
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth & validation
│   │   └── routes/          # API endpoints
│   └── package.json
│
├── 🔍 worker/               # Ping Processing Engine
│   ├── src/
│   │   ├── jobs/            # Job processors
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── 📧 alert-service/        # Notification System
│   ├── src/
│   │   ├── templates/       # Email templates
│   │   └── mailer/          # SMTP configuration
│   └── package.json
│
├── ⚡ queue-service/        # Job Queue Management
│   ├── src/
│   │   ├── queues/          # BullMQ setup
│   │   └── schedulers/      # Job scheduling
│   └── package.json
│
├── 💻 client/               # React Dashboard
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Route pages
│   │   └── hooks/           # Custom hooks
│   └── package.json
│
└── ⚖️ scale-worker-service/  # Load Balancer (Optional)
    └── src/
        └── balancer/        # Worker distribution
```

---

## 🎨 Dashboard Preview

### 📊 Real-time Monitoring Interface

*Coming Soon: Dashboard screenshots showcasing uptime metrics, response times, and alert configurations*

**Key Dashboard Features:**
- 📈 Interactive latency graphs
- 🟢 Real-time server status indicators
- ⚙️ Customizable ping intervals
- 📋 Historical performance data
- 🔔 Alert configuration panel

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/heimdall"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# Email Configuration (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Application Settings
NODE_ENV="development"
PORT=3000
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### 📝 Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support & Community

<div align="center">

**Need Help?** | **Stay Connected**
--- | ---
🐛 [Report Issues](https://github.com/yourusername/heimdall/issues) | 💬 [Discussions](https://github.com/yourusername/heimdall/discussions)
📧 [Email Support](mailto:support@heimdall.dev) | 🐦 [Twitter Updates](https://twitter.com/heimdall_dev)
📖 [Documentation](https://docs.heimdall.dev) | ⭐ [Star on GitHub](https://github.com/yourusername/heimdall)

</div>

---

<div align="center">

### 🌟 Show Your Support

If Heimdall helps keep your servers running smoothly, please consider giving it a ⭐!

**Made with ❤️ by the Heimdall Team**

*Keeping your servers awake so you can sleep peacefully* 😴

</div>