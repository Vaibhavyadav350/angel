# Angel Fashion Studio - E-Commerce Platform

A complete e-commerce solution built with the MERN stack (MongoDB, Express.js, React, Node.js) for Angel Fashion Studio.

## 📁 Project Structure

This repository contains a monorepo structure with all components of the e-commerce platform:

```
angel/
├── frontend/          # React application (Customer + Admin integrated)
│   └── src/
│       ├── pages/     # Customer pages + admin/ folder
│       └── components/ # Customer components + admin/ folder
├── backend/           # Node.js/Express.js REST API server
├── docs/              # Project documentation
├── assets/            # Shared assets and images
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd angel
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```
   Note: The frontend includes both customer and admin interfaces. Admin panel is accessible at `/admin/*` routes.

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

### Environment Setup

Each application requires its own environment variables. See the respective README files in each directory for detailed setup instructions:

- [Frontend Setup](./frontend/README.md) (includes admin panel)
- [Backend Setup](./backend/README.md)

### Running the Applications

**Start Backend Server:**
```bash
cd backend
npm start
```

**Start Frontend (Customer + Admin):**
```bash
cd frontend
npm start
```
The application will run at `http://localhost:3000`
- Customer routes: `/`, `/products`, `/cart`, etc.
- Admin routes: `/admin/login`, `/admin`, `/admin/products`, etc.

## 📚 Documentation

Comprehensive documentation is available in the `docs/` directory:

- [Technical Architecture](./docs/TECHNICAL-ARCHITECTURE.md) - System architecture and design
- [Frontend Documentation](./docs/FRONTEND-DOCUMENTATION.md) - Frontend implementation details
- [Backend Documentation](./docs/BACKEND-DOCUMENTATION.md) - Backend API and database schema
- [Development Setup](./docs/DEVELOPMENT-SETUP.md) - Detailed setup guide
- [API Documentation](./docs/API-DOCUMENTATION.md) - Complete API reference
- [Project Proposal](./docs/Proposal.md) - Business requirements and project scope

## 🛠 Tech Stack

### Frontend (Customer)
- **React** 17.0.1
- **React Router** 5.2.0
- **Styled Components** 5.2.1
- **Firebase** 9.6.1 (Authentication)
- **Stripe** 8.130.0 (Payments)
- **React Image Magnify** 2.7.4
- **React Toastify** 8.1.0

### Admin Panel (Integrated in Frontend)
- **React** 17.0.1 (same as frontend)
- **Chakra UI** 1.8.9
- **React Router** 5.2.0 (admin routes at `/admin/*`)
- **Axios** 0.21.4

### Backend
- **Node.js**
- **Express.js** 4.17.2
- **MongoDB** with Mongoose 6.1.4
- **JWT** 8.5.1 (Authentication)
- **Stripe** 8.195.0 (Payment processing)
- **Cloudinary** 1.28.1 (Image upload)
- **Bcrypt.js** 2.4.3 (Password hashing)

## ✨ Features

### Customer Features
- User authentication (Email/Password, Google Sign-In)
- Product browsing with filters and sorting
- Shopping cart with persistence
- Secure checkout with Stripe
- Order history and tracking
- Product reviews and ratings
- User profile management
- Responsive design

### Admin Features
- Three-tier admin privilege system
- Product management (CRUD)
- Order management and status updates
- Admin user management
- Dashboard with analytics
- Image upload and management

## 📖 Development

For detailed development instructions, see:
- [Development Setup Guide](./docs/DEVELOPMENT-SETUP.md)
- [Frontend Documentation](./docs/FRONTEND-DOCUMENTATION.md)
- [Backend Documentation](./docs/BACKEND-DOCUMENTATION.md)

## 📝 License

See [LICENSE.md](./LICENSE.md) for details.

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## 📧 Contact

**Client:** Khushi  
**Company:** Angel Fashion Studio  
**Website:** http://angelfashionstudio.au/

---

Built with ❤️ for Angel Fashion Studio
