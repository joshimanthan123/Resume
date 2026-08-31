# Practical 7: Authentication and Middleware Pipeline

## Project Overview
This directory contains the complete full-stack Task Management System updated for **Practical 7: Authentication and Middleware Pipeline**. It extends Practical 6 by integrating secure **JWT (JSON Web Token)** authentication, **bcryptjs** password hashing, Express **validation middleware**, and **user task ownership isolation**.

## Folder Structure
```text
Practical-7/
├── frontend/    # React 19 + Vite + Tailwind CSS Auth UI Frontend
├── backend/     # Express.js + MongoDB + JWT + bcrypt Backend API
└── README.md
```

## Features
* User Authentication (`POST /register`, `POST /login`, `GET /me`)
* Password Hashing with `bcryptjs`
* Express Input Validation Middleware (`middleware/validation.js`)
* JWT Verification Auth Middleware (`middleware/auth.js`)
* Multi-User Task Ownership Isolation
* Automated Integration Tests (`test-auth-api.js`)

## How to Run

### 1. Backend Server
```bash
cd backend
npm install
node server.js
```
Backend runs on `http://localhost:5000`.

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## Automated Tests
```bash
cd backend
node test-auth-api.js
```
