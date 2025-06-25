<div style="font-family: Arial, sans-serif;">

<table align="center">
  <tr>
    <td><img src="https://raw.githubusercontent.com/shivdutt-B/heimdall/refs/heads/main/readme.assets/heimdall-logo-transparent.png" alt="Heimdall Logo" height="80"/></td>
    <td><h1 style="margin: 0; padding-left: 10px;">Heimdall</h1></td>
  </tr>
</table>
<!-- #<br> -->
<div align="center"><h2><code>Server Uptime & Cold Start Monitoring Platform</code></h2></div>
<br>

<div align="center">

[![Node.js](https://img.shields.io/badge/Built%20With-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Framework-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Containerized-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![AWS EC2](https://img.shields.io/badge/Server%20Instances-AWS%20EC2-FF9900?style=for-the-badge&logo=amazon-ec2&logoColor=white)](https://aws.amazon.com/ec2/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Recoil](https://img.shields.io/badge/State%20Management-Recoil-3578E5?style=for-the-badge&logo=recoil&logoColor=white)](https://recoiljs.org/)
[![BullMQ](https://img.shields.io/badge/Queue-BullMQ-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://docs.bullmq.io/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Nodemailer](https://img.shields.io/badge/Email-Nodemailer-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](https://nodemailer.com/)
[![PM2](https://img.shields.io/badge/Process%20Manager-PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white)](https://pm2.keymetrics.io/)
[![GitHub](https://img.shields.io/badge/Code%20Hosted%20On-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/)
[![Frontend Hosted on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Backend Hosted on Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)



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
<img src="./readme.assets/architecture.jpg" alt="Heimdall Architecture" width="1100px" height="800px" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
</div>

### 🧱 Microservices Breakdown

| 🎯 Service | 📝 Description | 🔧 Technology |
|------------|-----------------|---------------|
| **🌐 API Service** | User management, authentication, server CRUD operations | Express.js, Prisma |
| **⚡ Queue Service** | Job scheduling and Redis queue management | BullMQ, Redis |
| **🔍 Ping Worker** | Server pinging, performance metrics collection | Node.js, Docker |
| **📧 Alert Service** | Email notifications and alert management | Nodemailer, SMTP |
| **⚖️ Load Balancer** | Worker distribution and scaling | Node.js, Docker |
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
| **Render** | ![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white) | Hosting Main Server, Dispatch Service |
| **AWS EC2** | ![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=flat-square&logo=amazon-aws&logoColor=white) | Hosting Alert Service, Worker and Scale Worker Service |
| **Vercel** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) | Hosting Frontend |


---

## 🚀 Quick Start Guide

### 📋 Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **pnpm/npm** (Package manager)
- **Docker** (For Redis & PostgreSQL)
- **Git**

### ⚡ Installation Steps

```bash
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/heimdall.git
cd heimdall

# 2️⃣ Install dependencies for each microservice
cd service && npm install && cd ../
cd alert-service && npm install && cd ../
cd dispatch-service && npm install && cd ../
cd client && npm install && cd ../
cd scale-worker-service && npm install && cd ../

# 3️⃣ Configure environment variables for each service
cp service/.env.example service/.env
cp alert-service/.env.example alert-service/.env
cp dispatch-service/.env.example dispatch-service/.env
cp client/.env.example client/.env
cp scale-worker-service/.env.example scale-worker-service/.env
# Edit each .env file with your own configuration

# 4️⃣ Build and dockerize worker-service (used by scale-worker-service)
cd worker-service
cp .env.example .env
docker build -t heimdall-worker .
cd ../

# 5️⃣ Initialize the PostgreSQL database (only from the API service)
cd service
npx prisma migrate dev
npx prisma generate
cd ../

# 6️⃣ Start each service individually (see below)

```

```bash
# 🌐 Start the API Service (REST API & Auth)
cd service
npm run dev

# 📧 Start the Alert Service (email notifications)
cd alert-service
npm run dev

# ⚡ Start the Dispatch Service (job queue logic)
cd dispatch-service
npm run dev

# 💻 Start the Frontend Client (React dashboard)
cd client
npm run dev

# ⚖️ Start the Scale Worker Service (manages auto-scaling of dockerized workers)
cd scale-worker-service
npm run dev

# 🔍 Worker Service (Ping engine)
# ✅ Dockerized, DO NOT start manually
# ✅ Built in Step 4 as `heimdall-worker` image

```

---

## 📁 Project Structure

```
heimdall/
├── 🌐 service/                             # REST API & Authentication
│   ├── src/
│   │   ├── controllers/                    # Route handlers
│   │   ├── middleware/                     # Auth & validation
│   │   └── routes/                         # API endpoints
│   │   └── index.js                        # Entry Point
│   └── package.json
│
├── 🔍 worker-service/                      # Ping Processing Engine
│   ├── src/
│   │   └── index.ts                        # Entry Point
│   └── package.json
│
├── 📧 alert-service/                       # Notification System
│   ├── src/
│   │   ├── utils/                          # Helpers and Templates
│   │   │   └── mailer.ts                   # SMTP configuration & Template
│   │   └── index.ts                        # Entry Point
│   └── package.json
│
├── ⚡ dispatch-service/                    # Job Queue Management
│   ├── src/
│   │   └── index.ts                        # Entry Point
│   └── package.json
│
├── 💻 client/                              # React Dashboard
│   ├── src/
│   │   ├── assets/                         # Static Assets
│   │   ├── components/                     # UI components
│   │   ├── hooks/                          # Hooks for data fetching and other operation
│   │   ├── layouts/                        # Gather components
│   │   ├── pages/                          # Gather components and layouts
│   │   ├── skeleton/                       # Loading Screens
│   │   ├── stores/                         # Store Recoil Atoms
│   │   ├── styles/                         # Setting up tailwind css
│   │   │   └── globals.css                 # 
│   │   ├── utils/                          # Helper functions
│   │   │   └── cn.ts                       # Used for third part component libraries(like shadcn, magicUI) to run properly
│   │   └── App.tsx                         # Entry Point 
│   └── package.json
│
└── ⚖️ scale-worker-service/                # Worker Scaling
    └── src/
    │   └── index.ts                        # Entry Point
    └── package.json

```

## 🤝 Contributing
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

<h2>📄 License</h2>

<p>
  This project is licensed under the <a href="./LICENCE"><strong>MIT License</strong></a>.
</p>

---

<div align="center">
<code> Made this BITCH with ❤️ </code>
</div>