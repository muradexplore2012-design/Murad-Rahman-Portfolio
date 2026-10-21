# Murad Rahman — Professional Portfolio Website & CMS

A high-performance, mobile-first, Firebase-powered personal portfolio website and full-featured Content Management System (CMS) built specifically for **Murad Rahman (Graphics Designer & Web Developer)**.

---

## 🌟 Features Overview

### 1. Public Portfolio
- **Personal Hero**: Professional introduction with Islamic greeting (*আসসালামুয়ালাইকুম, আপনাকে স্বাগতম*), bold headline, availability status badge, and quick contact buttons.
- **Murad Rahman Photo Integration**: Features Murad's official photo accompanied by Adobe Creative Suite glowing badges (**Ps**, **Ai**, **Pr**, **Ae**) and web development badges.
- **About Me Section**: Background story, creative philosophy, core specialties checklist, and direct CV download button.
- **Interactive Services Grid**: Service cards for Graphics Design, Custom Web Development, Blogger Website Setup, and UI/UX with smooth "Book Service" triggers.
- **Projects & Portfolio Grid**: Dynamic category filters (*All, Graphics Design, Web Development, Blogger Custom*), interactive project detail modal with high-res imagery, tool tags, live links, and repository buttons.
- **Software Skills & Tools**: Categorized skill tags (Adobe Creative Suite, Web Technologies, Platforms & Workflow) without fabricated percentage bars.
- **Customer Reviews**: Clean section that renders approved client testimonials or stays hidden if none exist (zero fake social proof).
- **Interactive Contact Form**: Direct message delivery to Firebase Firestore with anti-spam honeypot protection, field validation, and responsive alerts.
- **Professional Footer**: Branding, quick navigation, configured social links, copyright, and subtle link to Admin panel.

### 2. Admin Panel & CMS (`/admin`)
- **Protected Authentication**: Only the verified Admin Firebase Auth UID / Email can log in (`/admin/login`).
- **Dashboard**: Real-time Firebase counts for published projects, services, and incoming contact inquiries.
- **Profile & Identity Editor**: Edit name, title, greetings, headline, bio, location, public email, phone, availability toggle, and social profile links.
- **Projects Manager**: Create, edit, publish/unpublish, feature, categorize, set external links, upload cover images, and delete projects with confirmation.
- **Services Manager**: Manage services, descriptions, icon categories, features checklist, starting prices, and turnaround time.
- **Skills Manager**: Add/remove skill categories and manage individual tool badges and experience levels.
- **Testimonials Manager**: Approve, edit, or remove client testimonials.
- **Contact Inbox**: View incoming visitor messages, search/filter inquiries, mark read/unread, open detailed modal, and reply directly via email.
- **Site Settings & SEO**: Manage meta titles, descriptions, Open Graph preview image, footer text, and toggle section visibility on the homepage.
- **1-Click Database Seeder**: Initialize Firestore collections with Murad Rahman's starter content with a single button.

---

## 📂 Project Structure

```text
Murad Rahman Protfolio/
├── public/
│   ├── images/
│   │   └── murad-rahman.jpg       # Murad Rahman's official profile photograph
│   ├── favicon.svg                # Favicon
│   ├── robots.txt                 # Search engine crawler instructions
│   └── sitemap.xml                # XML Sitemap
├── src/
│   ├── components/                # Public website UI components
│   │   ├── Navbar.tsx             # Responsive sticky navbar & mobile drawer
│   │   ├── HeroSection.tsx        # Hero banner with Murad's photo & tool badges
│   │   ├── AboutSection.tsx       # Bio, quick facts & CV download
│   │   ├── ServicesSection.tsx    # Services grid & inquiry trigger
│   │   ├── ProjectsSection.tsx    # Filterable portfolio grid
│   │   ├── ProjectDetailModal.tsx # Project preview dialog
│   │   ├── SkillsSection.tsx      # Categorized software & tech skills
│   │   ├── TestimonialsSection.tsx# Genuine client reviews (hidden when empty)
│   │   ├── ContactSection.tsx     # Validated contact form & direct channels
│   │   ├── Footer.tsx             # Branding & footer navigation
│   │   └── Icons.tsx              # Custom SVG icons
│   ├── features/
│   │   └── admin/                 # Code-split Admin CMS
│   │       ├── AdminLayout.tsx    # Admin sidebar & mobile navigation
│   │       ├── AdminRouteGuard.tsx# Auth protection guard
│   │       ├── AdminLoginPage.tsx # Email/Password admin login
│   │       ├── AdminDashboard.tsx # Real-time statistics & 1-click seeder
│   │       ├── AdminProfile.tsx   # Identity & bio manager
│   │       ├── AdminProjects.tsx  # Projects CRUD & image upload
│   │       ├── AdminServices.tsx  # Services CRUD
│   │       ├── AdminSkills.tsx    # Skills & groups CRUD
│   │       ├── AdminTestimonials.tsx # Testimonials manager
│   │       ├── AdminInbox.tsx     # Visitor inquiries reader & search
│   │       └── AdminSettings.tsx  # SEO & section visibility toggles
│   ├── lib/
│   │   ├── firebase.ts            # Centralized Firebase Web SDK initialization
│   │   └── auth.ts                # Admin authorization helpers
│   ├── services/
│   │   ├── firestoreService.ts    # Firestore data access & offline fallback
│   │   ├── storageService.ts      # Firebase Storage upload utility
│   │   └── starterData.ts         # Murad Rahman's default verified starter data
│   ├── types/
│   │   └── index.ts               # TypeScript data models
│   ├── App.tsx                    # React Router configuration & code-splitting
│   ├── main.tsx                   # React 19 root mounting
│   └── index.css                  # Tailwind CSS v4 styling & design tokens
├── .env                           # Local environment config (kept out of git)
├── .env.example                   # Example environment template
├── firestore.rules                # Least-privilege Firestore security rules
├── storage.rules                  # Storage access control rules
├── firestore.indexes.json         # Firestore query index definitions
├── firebase.json                  # Firebase hosting & SPA rewrite settings
├── vite.config.ts                 # Vite + Tailwind CSS plugin config
└── tsconfig.json                  # TypeScript compiler settings
```

---

## 🔶 Firebase Configuration Insertion Points

### 1. Environment Variables (`.env` and `.env.local`)
The application is pre-configured with the project settings provided:

```bash
# 🔶 PASTE FIREBASE CONFIG HERE
VITE_FIREBASE_API_KEY="AIzaSyDfl5pmu20OjAw9DJzFTxOFJmIzUDUhwuk"
VITE_FIREBASE_AUTH_DOMAIN="murad-rahman-994ed.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="murad-rahman-994ed"
VITE_FIREBASE_STORAGE_BUCKET="murad-rahman-994ed.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="791694775814"
VITE_FIREBASE_APP_ID="1:791694775814:web:da0531cb1a9f6866ae1587"

# 🔶 ADMIN IDENTITY CONFIGURATION
VITE_INITIAL_ADMIN_UID="VBYGRdOew4NAXcdKTmIgEXd79Sv2"
VITE_INITIAL_ADMIN_EMAIL="muradexplore2012@gmail.com"
```

### 2. File Insertion Locations
- **`src/lib/firebase.ts`**: Centralized Firebase Web App configuration initialization.
- **`src/lib/auth.ts`**: Admin UID and Admin Email check.
- **`firestore.rules`**: Admin UID matching rule for database read/write.
- **`storage.rules`**: Admin UID matching rule for file uploads.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher, v24 recommended)
- npm (v9 or higher)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Generates optimized static output inside the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🔒 Firebase Security & Admin Setup

### 1. Enable Email/Password Authentication
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project: **`murad-rahman-994ed`**.
3. In the left menu, click **Authentication** > **Sign-in method**.
4. Enable **Email/Password**.
5. Under the **Users** tab, click **Add User**:
   - Email: `muradexplore2012@gmail.com`
   - Set a secure password.
6. Note the **UID** generated for this user (`VBYGRdOew4NAXcdKTmIgEXd79Sv2`).

### 2. Deploy Firestore Rules
Run using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```
Or paste the contents of `firestore.rules` directly into the Firebase Console (**Firestore Database** > **Rules** tab).

### 3. Deploy Storage Rules
```bash
firebase deploy --only storage:rules
```
Or paste the contents of `storage.rules` into Firebase Console (**Storage** > **Rules** tab).

### 4. Initialize Database with Starter Data
1. Visit `/admin/login` on your portfolio site.
2. Sign in with `muradexplore2012@gmail.com` and your password.
3. On the **Admin Dashboard**, click **"ফায়ারবেস স্টার্টার ডেটা লোড করুন"**.
4. All initial verified starter content will automatically seed into your Cloud Firestore collections!

---

## 🌐 Deployment Options

### Option A: Firebase Hosting (Recommended)
```bash
# 1. Login to Firebase CLI
firebase login

# 2. Build production assets
npm run build

# 3. Deploy
firebase deploy
```

### Option B: Netlify or Vercel
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- Add all environment variables from `.env` into your hosting provider's Dashboard Settings.

---

## 📄 License & Credits
© Murad Rahman. Hand-crafted with React 19, TypeScript, Tailwind CSS v4, and Firebase.
