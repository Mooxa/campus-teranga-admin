# Campus Teranga Admin Dashboard - Vercel Deployment Guide

This guide will help you deploy the Campus Teranga admin dashboard to Vercel with the production backend API.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your admin code should be in a Git repository
3. **Backend API**: Your backend should be deployed and running at `https://campus-teranga-backend.onrender.com`

## Deployment Steps

### 1. Prepare Your Repository

Ensure your admin dashboard code is pushed to GitHub with the following structure:
```
campus_teranga_admin/
├── src/
├── package.json
├── vercel.json
├── next.config.ts
└── tailwind.config.ts
```

### 2. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project
5. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `campus_teranga_admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Option B: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your admin directory
cd campus_teranga_admin
vercel

# Follow the prompts to configure your project
```

### 3. Environment Variables

Set these environment variables in Vercel dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://campus-teranga-backend.onrender.com/api` | Production API endpoint |
| `NEXT_PUBLIC_APP_NAME` | `Campus Teranga Admin` | Application name |
| `NEXT_PUBLIC_APP_VERSION` | `1.0.0` | Application version |
| `NEXT_PUBLIC_APP_ENVIRONMENT` | `production` | Environment mode |
| `NEXT_PUBLIC_ADMIN_DOMAIN` | `campus-teranga-admin.vercel.app` | Admin domain |
| `NEXT_PUBLIC_BACKEND_DOMAIN` | `campus-teranga-backend.onrender.com` | Backend domain |

### 4. Domain Configuration

Vercel will automatically provide:
- **Preview URL**: `https://campus-teranga-admin-git-main.vercel.app`
- **Production URL**: `https://campus-teranga-admin.vercel.app`

You can also add a custom domain if needed.

### 5. Backend CORS Configuration

The backend has been configured to allow requests from:
- `https://campus-teranga-admin.vercel.app`
- `https://campus-teranga-admin-git-main.vercel.app`
- `https://campus-teranga-admin-git-develop.vercel.app`

## Testing the Deployment

### 1. Health Check
Visit your deployed admin dashboard and check:
- ✅ Dashboard loads without errors
- ✅ Login page is accessible
- ✅ API calls are working

### 2. Admin Login
Use the seeded admin credentials:
- **Phone**: `+221771234568`
- **Password**: `admin123`

Or Super Admin:
- **Phone**: `+221771234569`
- **Password**: `superadmin123`

### 3. API Connectivity
Test the connection to your backend:
```bash
curl https://campus-teranga-admin.vercel.app/api/health
```

## Features Available

Once deployed, your admin dashboard will have:

### 📊 Dashboard
- User statistics and analytics
- Recent user registrations
- System overview

### 👥 User Management
- View all users
- Create new users
- Edit user profiles
- Deactivate/activate users

### 🎉 Event Management
- Create and manage events
- View event registrations
- Update event details

### 🏫 Formation Management
- Manage university formations
- Add new programs
- Update formation details

### 🚌 Service Management
- Manage services (transport, housing, etc.)
- Add new services
- Update service information

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS includes your Vercel domain
   - Check that `NEXT_PUBLIC_API_URL` is correctly set

2. **API Connection Issues**
   - Verify backend is running at `https://campus-teranga-backend.onrender.com`
   - Check network tab in browser dev tools

3. **Build Failures**
   - Ensure all dependencies are in `package.json`
   - Check for TypeScript errors
   - Verify Next.js configuration

4. **Authentication Issues**
   - Ensure admin users are seeded in the backend
   - Check JWT token handling

### Logs and Debugging

1. **Vercel Logs**
   - Go to your project dashboard
   - Click on "Functions" tab
   - View deployment logs

2. **Browser Console**
   - Open browser dev tools
   - Check console for errors
   - Monitor network requests

## Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to Git
   - Use Vercel's environment variable system

2. **API Security**
   - Backend uses JWT authentication
   - Admin routes are protected
   - CORS is properly configured

3. **HTTPS**
   - Vercel automatically provides HTTPS
   - All API calls use secure connections

## Support

For issues with this deployment:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review Next.js deployment guide: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
3. Check backend API status: [https://campus-teranga-backend.onrender.com/health](https://campus-teranga-backend.onrender.com/health)

## Next Steps

After successful deployment:
1. **Test all features** thoroughly
2. **Set up monitoring** and alerts
3. **Configure custom domain** if needed
4. **Set up CI/CD** for automatic deployments
5. **Train admin users** on the dashboard features

Your Campus Teranga admin dashboard is now ready for production use! 🚀
