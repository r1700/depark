# 🚀 Smart Parking Management System

A comprehensive system to manage automated multi-level parking facilities, from employee registration through parking operations and real-time retrieval coordination.

## 🚀 Quick Start

**Required tools:**
- Node.js 18+ 
- npm
- Git
- Supabase CLI

```bash
# Clone the repository
git clone https://github.com/diversi-tech/depark
cd depark

# Install all dependencies
npm run install:all

# Set up environment files
copy packages\backend\.env.example packages\backend\.env
copy packages\frontend\.env.example packages\frontend\.env
copy packages\opc\.env.example packages\opc\.env

# Set up database
npx supabase start

# Start all services (in separate terminals):

# OPC Bridge Service
npm run dev:opc

# Backend API
npm run dev:backend  

# Frontend Applications
npm run dev:frontend
```

**That's it!** 🎉
- Frontend Applications: http://localhost:3000
- Backend API: http://localhost:3001/api
- OPC Bridge Service: http://localhost:3002 (Not built yet)

## 📋 Table of Contents

- [🏗️ Project Overview](#️-project-overview)
- [🔧 Key Components](#-key-components)
- [👥 Team Structure](#-team-structure)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📅 Project Timeline](#-project-timeline)

---

## 🏗️ Project Overview

This project provides a digital platform for managing smart parking facilities with automated underground storage. The system handles the complete parking lifecycle from employee onboarding, vehicle registration, automated parking coordination, to real-time car retrieval operations and comprehensive analytics.

### Architecture Overview

```
┌─────────────────┐      ┌─────────────────┐       ┌─────────────────┐
│   Frontend      │      │   Backend       │       │   OPC Bridge    │
│ (Cloudflare)    │ ──── │   (Render)      │ ───── │   (Local)       │
│ React + TS      │      │   Express + TS  │       │   Node.js + OPC │
└─────────────────┘      └─────────────────┘       └─────────────────┘
                                 │                         │
                         ┌─────────────────┐       ┌─────────────────┐
                         │   Database      │       │  Parking        │
                         │   (Supabase)    │       │  Hardware       │
                         │   PostgreSQL    │       │  (OPC-UA)       │
                         └─────────────────┘       └─────────────────┘
```

**Live URLs after deployment:**
- Frontend: `https://depark.pages.dev`
- Backend API: `https://your-backend.onrender.com/api`

---

## 🔧 Key Components

- **🔗 OPC Bridge Service:** Node.js service interfacing with parking hardware via OPC-UA
- **⚡ Core API:** Node.js TypeScript service with comprehensive parking management
- **👩‍💼 HR Dashboard:** React TypeScript application for employee and vehicle management  
- **🎛️ Admin Dashboard:** React TypeScript application for system administration and analytics
- **📱 Mobile Web App:** Progressive Web App for employee self-service
- **📲 Tablet Interface:** Touch-optimized interface for on-site parking operations
- **🗄️ Database:** Supabase PostgreSQL with real-time capabilities
- **🔐 Integrations:** Google O, Government vehicle database, WebSocket real-time updates

## 👥 Team Structure

The project is divided into four specialized teams working collaboratively on a unified system:

### Team 1: OPC Bridge & Integration (4 developers)
- **🔗 OPC Bridge Service:** Hardware communication and parking coordination
- **🏛️ Government API Integration:** Vehicle dimension database management

### Team 2: Core Infrastructure & HR Management (7 developers)  
- **⚡ Backend API:** Core system architecture and business logic
- **👩‍💼 HR Dashboard:** Employee and vehicle management interface

### Team 3: Admin & Analytics (7 developers)
- **🎛️ Admin Dashboard:** System administration and user approval workflows
- **📊 Analytics System:** Usage statistics and operational insights

### Team 4: User Interfaces (6 developers)
- **📱 Mobile Web App:** Employee self-service application
- **📲 Tablet Interface:** On-site parking operations terminal
- **🔄 Real-time Systems:** WebSocket implementation for live updates

All teams collaborate on the same unified codebase with clear feature ownership and integration responsibilities.

## 📚 Documentation

### Project Documentation

- [🏗️ High-Level Design (HLD)](https://docs.google.com/document/d/1TN53ZEET-_nMGjN8cYzhFKV8EWKr5UFW0XiB8LVfWRI/edit) - Contains user roles, system components, project timeline, and wireframes
- [📊 Entity Types](./types/entity-types.md) - Complete database schema and type definitions
- [🔌 API Types](./types/api-types.md) - Request/response interfaces and endpoint specifications

### Team-Specific PRDs

- [🔗 Team 1 PRD](https://docs.google.com/document/d/1i64PwVd-M03rVHbtkVBGQgZEuV9J07mv3DklHtC__zU/edit) - OPC Bridge and integration requirements
- [⚡ Team 2 PRD](https://docs.google.com/document/d/1Em4ErZ-WpclLEBpgva6bUa4Z1gQr0D9lnkIo0IEBGSI/edit) - Core infrastructure and HR management requirements  
- [🎛️ Team 3 PRD](https://docs.google.com/document/d/1j-MOtZTTt52idzp-CDR0L7mVTUegztEpTEYsVz_ENZ4/edit) - Admin dashboard and analytics requirements
- [📱 Team 4 PRD](https://docs.google.com/document/d/1CckqDQVlluoK3NsQVn_RrYf-ct5SZKA01jO6QemQyUg/edit) - User interface and real-time system requirements

### Project Structure
```
├── migrations/           # Database migration scripts
├── packages/
│   ├── opc/              # OPC Bridge Service (Team 1)
│   ├── backend/          # Core API Server (Teams 1, 2, 3)
│   ├── frontend/         # Web Applications (Teams 2, 3, 4)
├── types/                # Shared TypeScript definitions
└── README.md
```

---

## 🤝 Contributing

### Development Guidelines

1. **📋 Code Standards**
   - Use TypeScript for all code
   - Follow ESLint configuration  
   - Maintain 80%+ test coverage
   - Use conventional commit messages

2. **🌿 Branch Strategy**
   - `main`: Development and integration branch
   - `prod`: Production deployment branch
   - `feature/*`: Feature development
   - `hotfix/*`: Critical fixes

3. **🔄 Pull Request Process**
   - Create feature branch from `main`
   - Implement feature with tests
   - Submit PR with clear description
   - Ensure CI/CD passes
   - Request team lead review

4. **🗄️ Database Changes**
   - Create migrations in `/migrations/` folder
   - Include rollback scripts
   - Test migrations on sample data
   - Document breaking changes

### Feature Development

Each developer owns a specific feature with clear boundaries:
- **Primary Owner:** Full responsibility for feature implementation
- **Secondary Contributors:** Support for cross-cutting concerns
- **Feature Documentation:** Individual README files for complex features

## 📅 Project Timeline

- **Week 1:** 🏗️ Foundation setup (database, routing, WebSocket, OPC bridge)
- **Weeks 2-3:** ⚡ Core functionality implementation (entry flow, basic interfaces)  
- **Weeks 4-5:** 🚀 Advanced features (mobile app, queue management, analytics)
- **Week 6:** 🔧 Cross-team integration and comprehensive testing
- **Week 7:** ✅ User acceptance testing and performance optimization
- **Week 8:** 🚀 Production deployment and documentation finalization

---

*Happy parking! 🅿️🚗*

## 📄 License

This project is private and proprietary. Unorized copying, distribution, or use is strictly prohibited.