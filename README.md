# WFH Attendance Monitoring System - Backend API

Backend REST API untuk aplikasi monitoring absensi Work From Home (WFH) karyawan.

## 🚀 Tech Stack

- **NestJS** 10.x - Framework HTTP
- **TypeScript** - Bahasa pemrograman
- **PostgreSQL** - Database
- **TypeORM** - ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload
- **class-validator** - DTO validation
- **class-transformer** - DTO transformation

## ✨ Fitur Utama

### Admin
- ✅ Login dengan email & password
- ✅ CRUD master employee (Create, Read, Update, Delete)
- ✅ Melihat semua data attendance
- ✅ Melihat detail attendance dengan foto bukti

### Employee
- ✅ Login dengan email & password
- ✅ Check-in WFH dengan upload foto bukti
- ✅ Sistem otomatis capture tanggal dan waktu check-in
- ✅ Melihat history attendance milik sendiri

## 📋 Setup & Installation

### 1. Prerequisites
- Node.js >= 16.x
- npm atau yarn
- PostgreSQL 12+

### 2. Setup Database
```bash
createdb wfh_attendance_db
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Environment Variables
```bash
cp .env.example .env
```

Edit `.env` sesuai konfigurasi lokal Anda.

### 5. Run Application
```bash
# Development mode (dengan hot reload)
npm run start:dev

# Production build
npm run build

# Production mode
npm run start:prod
```

Aplikasi akan berjalan di `http://localhost:3001`

## 🔗 API Endpoints

### Authentication
- `POST /auth/login` - Login dengan email & password

### Employees (ADMIN only)
- `POST /employees` - Create employee
- `GET /employees` - Get semua employees
- `GET /employees/:id` - Get employee by ID
- `PATCH /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

### Attendances
- `POST /attendances/check-in` - Check-in WFH (EMPLOYEE only)
- `GET /attendances/my` - Get my attendance history (EMPLOYEE only)
- `GET /attendances` - Get semua attendance (ADMIN only)
- `GET /attendances/:id` - Get attendance detail (ADMIN only)

## 📝 Default Admin Account

Email: `admin@mail.com`  
Password: `password`

> ⚠️ IMPORTANT: Ganti password ini setelah login pertama!

## 📁 Project Structure

```
src/
├── auth/              # Authentication module
├── users/             # Users management
├── employees/         # Employees management
├── attendances/       # Attendance management
├── common/            # Shared utilities & enums
├── app.module.ts
├── main.ts
└── ...
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 🔐 Security Features

✅ JWT Authentication  
✅ Role-based Access Control (ADMIN/EMPLOYEE)  
✅ Password hashing dengan bcrypt  
✅ Input validation (class-validator)  
✅ Error handling yang proper  

## 📤 File Upload

Foto di-upload ke `./uploads/attendances/` dan dapat diakses via:
```
http://localhost:3001/uploads/attendances/filename.jpg
```

Limit: 5MB, hanya image files.

## ⚙️ Database Schema

### Users Table
- id: UUID (PK)
- name: string
- email: string (unique)
- password: string (hashed)
- role: enum (ADMIN, EMPLOYEE)
- createdAt: timestamp
- updatedAt: timestamp

### Employees Table
- id: UUID (PK)
- user: FK to Users (OneToOne)
- employeeCode: string (unique)
- department: string
- position: string
- createdAt: timestamp
- updatedAt: timestamp

### Attendances Table
- id: UUID (PK)
- employee: FK to Employees (ManyToOne)
- attendanceDate: date
- checkInTime: timestamp
- photoPath: string
- note: string (nullable)
- createdAt: timestamp
- updatedAt: timestamp

## 📚 Full Documentation

Untuk dokumentasi lengkap endpoint dengan request/response examples, silakan refer ke file ini saat development atau lihat IntelliSense di IDE saat menggunakan API.

## 📝 License

UNLICENSED
