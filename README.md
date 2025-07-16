# 📸 InstaByu - Instagram Clone

Aplikasi sosial media modern yang terinspirasi dari Instagram, dibangun dengan **Next.js 15** dan **React 19**. InstaByu menyediakan pengalaman berbagi foto dan interaksi sosial yang mirip dengan Instagram.

## ✨ Fitur Utama

### 🔐 **Autentikasi**

- Register & Login user dengan validasi lengkap
- Autentikasi menggunakan Laravel Sanctum
- Protected routes untuk user yang sudah login
- Persistent login state dengan localStorage

### 📱 **Posting & Feed**

- Upload foto dengan drag & drop interface
- Caption dengan counter karakter (max 2,200)
- Real-time feed update tanpa refresh
- Infinite scroll untuk performa optimal
- Error handling untuk gambar yang gagal dimuat

### 💬 **Interaksi Sosial**

- Like & unlike posts dengan animasi smooth
- Sistem komentar real-time
- View comments dalam modal yang responsive
- Counter likes dan comments yang akurat

### 🎨 **UI/UX Modern**

- Design responsive untuk desktop & mobile
- Animasi smooth dengan Framer Motion
- Instagram-like interface yang familiar
- Dark mode ready (struktur sudah siap)

## 🛠 Tech Stack

### **Frontend**

- **Next.js 15** - React framework dengan App Router
- **React 19** - Library UI terbaru
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Animasi dan transisi
- **Radix UI** - Komponen UI primitives
- **React Hot Toast** - Notifikasi yang elegant

### **Backend Integration**

- **Laravel REST API** - Backend service
- **Laravel Sanctum** - API authentication
- **MySQL** - Database (via Laragon)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm atau yarn
- Laragon (untuk backend Laravel)

### Installation

1. **Clone repository**

```bash
git clone <repository-url>
cd instabyu
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment**

```bash
cp .env.example .env.local
```

4. **Jalankan development server**

```bash
npm run dev
```

5. **Buka aplikasi**

```
http://localhost:3000
```

## 📝 Available Scripts

```bash
# Development
npm run dev          # Jalankan dev server dengan Turbopack
npm run build        # Build untuk production
npm run start        # Jalankan production server

# Code Quality
npm run lint         # Jalankan ESLint
npm run lint:fix     # Fix ESLint errors otomatis
npm run format       # Format semua file dengan Prettier
npm run format:check # Check formatting tanpa mengubah file
npm run format:js    # Format file JavaScript/JSX
npm run format:css   # Format file CSS
npm run format:json  # Format file JSON
```

## 📁 Struktur Proyek

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth group routes
│   │   ├── login/         # Halaman login
│   │   └── register/      # Halaman register
│   ├── layout.js          # Root layout
│   └── page.js            # Homepage
├── components/
│   ├── common/            # Komponen reusable
│   │   ├── CommentsModal.jsx
│   │   ├── CreatePostModal.jsx
│   │   ├── ErrorBoundary.js
│   │   └── PostCard.jsx
│   ├── layout/            # Layout components
│   │   ├── ConditionalLayout.js
│   │   ├── MainFeed.jsx
│   │   ├── PopularPosts.jsx
│   │   ├── Sidebar.jsx
│   │   └── TopHeader.jsx
│   └── ui/                # UI primitives
│       ├── avatar.jsx
│       ├── button.jsx
│       ├── card.jsx
│       └── input.js
├── contexts/
│   └── AuthContext.js     # Global auth state
├── hooks/
│   ├── useApi.js          # API calls hook
│   └── useForm.js         # Form handling hook
└── lib/
    ├── api.js             # API endpoints
    ├── formUtils.js       # Form utilities
    ├── toast.js           # Toast notifications
    ├── userUtils.js       # User utilities
    ├── utils.js           # General utilities
    └── validation.js      # Form validation
```

## 🔧 Konfigurasi

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend Requirements

Aplikasi ini membutuhkan Laravel backend dengan endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/posts` - Get posts with pagination
- `POST /api/posts` - Create new post
- `POST /api/posts/{id}/like` - Like/unlike post
- `GET /api/posts/{id}/comments` - Get comments
- `POST /api/posts/{id}/comments` - Add comment

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
