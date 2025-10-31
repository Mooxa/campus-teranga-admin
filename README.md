# Campus Téranga Admin Dashboard

A modern Next.js web application for managing the Campus Téranga platform.

## Features

- **Dashboard**: Overview of platform statistics and recent activity
- **User Management**: Create, read, update, and delete user accounts
- **Event Management**: Manage events and activities
- **Formation Management**: Handle educational formations and courses
- **Service Management**: Manage platform services
- **Authentication**: Secure admin login with role-based access
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **HTTP Client**: Axios
- **Authentication**: JWT tokens

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Campus Téranga Backend running on port 3000

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Update `.env.local` with your API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Usage

### Login

Use the admin credentials to access the dashboard:

- **Phone**: +221771234568
- **Password**: admin123

### Features

#### Dashboard

- View platform statistics
- Monitor recent user activity
- Quick access to management sections

#### User Management

- View all registered users
- Toggle user active/inactive status
- Edit user information
- Delete user accounts

#### Event Management

- Create and manage events
- Set event details (title, description, date, location)
- Manage event organizers
- Toggle event visibility

#### Formation Management

- Create educational formations
- Set formation details (title, description, duration, level)
- Manage formation availability

#### Service Management

- Create platform services
- Categorize services
- Manage service availability

## API Integration

The admin dashboard integrates with the Campus Téranga backend API:

- **Authentication**: `/api/auth/login`, `/api/auth/me`
- **Admin Stats**: `/api/admin/stats`
- **Users**: `/api/admin/users`
- **Events**: `/api/admin/events`
- **Formations**: `/api/admin/formations`
- **Services**: `/api/admin/services`

## Color Scheme

The application uses the Campus Téranga brand colors:

- **Primary Orange**: #E1701A
- **Dark Blue**: #0C1C2C
- **White**: #FFFFFF
- **Grey**: Various shades for UI elements

## Development

### Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/             # Reusable UI components
│   └── Layout/            # Layout components
├── contexts/              # React contexts
├── lib/                   # Utility functions and API
└── styles/                # Styling and colors
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

The application can be deployed to any platform that supports Next.js:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker

## Security

- JWT token authentication
- Role-based access control (admin/super_admin)
- Protected routes
- Secure API communication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Campus Téranga platform.
