# Kerala Public Grievance Portal

A comprehensive web application for citizens to submit public grievances and for administrators to manage them. Built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### For Citizens
- Submit complaints in Malayalam/English
- Select from 14 districts and multiple service categories
- Track complaint status
- User-friendly bilingual interface
- No login required for complaint submission

### For Administrators
- Secure admin dashboard
- Real-time complaint management
- Filter complaints by district, status, and category
- Update complaint status (Pending/In Progress/Resolved/Rejected)
- Role-based access control

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/           # React components
│   ├── AdminLogin.tsx   # Admin authentication
│   ├── AdminPanel.tsx   # Dashboard for complaint management
│   ├── AdminRoute.tsx   # Protected route component
│   ├── ComplaintForm.tsx# Main complaint submission form
│   └── Login.tsx        # User authentication
├── context/
│   └── AuthContext.tsx  # Authentication context provider
├── lib/
│   └── supabase.ts      # Supabase client configuration
├── App.tsx              # Main application component
└── main.tsx            # Application entry point
```

## Database Schema

### Tables

#### complaints
- `id`: UUID (Primary Key)
- `name`: Text (Required)
- `phone`: Text (Required)
- `address`: Text (Required)
- `district`: Text (Required)
- `service_category`: Text (Required)
- `status`: Text (Default: 'pending')
- `created_at`: Timestamp
- `user_id`: UUID (Foreign Key)
- `description`: Text

#### profiles
- `id`: UUID (Primary Key)
- `role`: Text (Default: 'user')
- `created_at`: Timestamp

## Security Features

- Row Level Security (RLS) enabled
- Role-based access control
- Secure authentication flow
- Protected admin routes
- Input validation

## Available Service Categories

1. Water Supply (Kerala Water Authority)
2. Electricity (KSEB)
3. Road Maintenance (PWD)
4. Waste Management
5. Public Transport (KSRTC)
6. Healthcare (Kerala Health Services)
7. Education
8. Agriculture
9. Social Welfare
10. Revenue Department
11. Civil Supplies
12. Police
13. Local Self Government

## Districts Covered

1. Thiruvananthapuram
2. Kollam
3. Pathanamthitta
4. Alappuzha
5. Kottayam
6. Idukki
7. Ernakulam
8. Thrissur
9. Palakkad
10. Malappuram
11. Kozhikode
12. Wayanad
13. Kannur
14. Kasaragod

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The application is deployed on Netlify and can be accessed at the provided deployment URL.

## Admin Access

Default admin credentials (for demo purposes only):
- Email: admin@admin.com
- Password: password

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License# compliantbox.github.io
