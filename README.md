<div align="center">

# SmartWind

### Full-Stack E-Commerce Web Application

<p>
  A modern and scalable e-commerce platform built with the <strong>PERN stack</strong>, designed to deliver a fast, secure, and seamless shopping experience.
</p>

<p>
  <img src="https://img.shields.io/badge/React-19-0ea5e9?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-2563eb?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Backend-166534?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-API-111827?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-1d4ed8?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-ORM-c084fc?style=for-the-badge" />
</p>

<p>
  <img src="https://img.shields.io/badge/Clerk-Authentication-6d28d9?style=flat-square" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-Styling-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/DaisyUI-Components-f59e0b?style=flat-square" />
  <img src="https://img.shields.io/badge/React_Query-Data_Fetching-ef4444?style=flat-square" />
  <img src="https://img.shields.io/badge/Zustand-State_Management-0f172a?style=flat-square" />
  <img src="https://img.shields.io/badge/Sentry-Monitoring-7c3aed?style=flat-square" />
</p>

</div>

---

## Overview

**SmartWind** is a full-stack e-commerce application built to showcase modern web development with a strong focus on performance, scalability, and user experience. It combines a responsive React frontend with a robust Express and PostgreSQL backend to create a complete production-style shopping platform.

## Features

- Secure user authentication with Clerk
- Full-stack architecture with separate frontend and backend
- Fast and responsive user interface
- PostgreSQL database integration with Drizzle ORM
- Efficient server state handling with React Query
- Lightweight global state management with Zustand
- Modern UI built with Tailwind CSS and DaisyUI
- Media handling with ImageKit
- Error tracking and monitoring with Sentry
- Type-safe development with TypeScript across the stack

## Tech Stack

| Layer | Technologies |
|------|--------------|
| Frontend | React, TypeScript, Vite, React Router, Tailwind CSS, DaisyUI, React Query, Zustand |
| Backend | Node.js, Express.js, TypeScript, Zod |
| Database | PostgreSQL, Drizzle ORM |
| Auth | Clerk |
| Monitoring | Sentry |
| Media | ImageKit |

## Project Structure

```bash
smartwind/
├── backend/
└── frontend/
```

## Installation

### Clone the repository

```bash
git clone https://github.com/marwancodes/smartwind.git
cd smartwind
```

### Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file in both the `backend` and `frontend` folders and add the required environment variables for:

- PostgreSQL database connection
- Clerk authentication keys
- ImageKit configuration
- Sentry credentials
- Frontend API configuration

## Run Locally

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend

```bash
cd frontend
npm run dev
```

## Scripts

### Backend

```bash
npm run dev
npm run build
npm start
npm run db:push
npm run db:seed
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Purpose

This project was built as a **full-stack e-commerce portfolio project** to demonstrate practical skills in frontend development, backend architecture, authentication, database management, and modern UI design.

## Author

**Marwan Warradi**  
UK-Based Full-Stack Developer

<p align="left">
  <a href="https://smartwind.onrender.com/">View Live App</a>
</p>
