# FoodShare Frontend - React Application

This is the frontend application for the FoodShare platform, built with React 18 and Vite.

## Technology Stack

- **React**: 18.2.0 (UI Library)
- **React Router**: v6 (Routing)
- **Axios**: HTTP client
- **Bootstrap 5**: UI framework
- **React-Bootstrap**: Bootstrap components for React
- **Vite**: Build tool and dev server

## Project Structure

```
foodshare-frontend/
├── src/
│   ├── components/          # Reusable components
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ...
│   ├── services/            # API service layer
│   │   ├── api.js           # Axios instance
│   │   ├── authService.js
│   │   ├── donationService.js
│   │   └── requestService.js
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.js
│   ├── context/             # React Context
│   │   └── AuthContext.jsx
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # React entry point
│   └── App.css
├── public/
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── package.json
└── README.md               # This file
```

## Setup Instructions

### Prerequisites
- Node.js 16+ with npm

### Step 1: Navigate to Frontend Directory
```bash
cd foodshare-frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```

Application will start at: `http://localhost:3000`

### Step 4: Build for Production
```bash
npm run build
```

Production files will be in `dist/` directory.

## Available Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## Key Features

### Authentication
- User registration with role selection (DONOR/RECEIVER)
- JWT-based login
- Token storage in localStorage
- Protected routes requiring authentication

### Food Donation Browsing
- View all available food donations
- Search by location, food type, availability time
- Responsive donation card layout
- Click to request food

### Navigation
- Navbar with links based on user role
- Responsive mobile menu
- Logout functionality

## Component Architecture

### App Component (src/App.jsx)
- Main application wrapper
- Sets up routing with React Router
- Includes Navigation component

### Navigation Component
- Displays different menu based on authentication status
- Shows user name when logged in
- Logout button for authenticated users

### AuthContext (src/context/AuthContext.jsx)
- Global authentication state management
- Provides useAuth hook for accessing auth state
- Handles login/register/logout logic

### Pages
- **Login**: User login form
- **Register**: User registration with role selection
- **Home**: Browse and search available donations

### Services
- **authService**: Handle authentication API calls
- **api**: Axios instance with JWT interceptors
- **donationService**: Handle donation API calls
- **requestService**: Handle request API calls

## Authentication Flow

1. User registers with email, password, and role
2. Token is received and stored in localStorage
3. Axios interceptor automatically includes token in requests
4. If token expires (401 response), user is redirected to login
5. Token is cleared from localStorage on logout

## API Integration

All API calls are handled through service modules in `src/services/`:

```javascript
// Example: Get all donations
import donationService from '../services/donationService';

const donations = await donationService.getAllDonations();

// Example: Search donations
const results = await donationService.searchDonations(location, foodType, availableFrom);

// Example: Create request
import requestService from '../services/requestService';

const request = await requestService.createRequest({
  donationId: 1,
  quantityRequested: 5,
  message: "Need food for event"
});
```

## Styling

The application uses:
- **Bootstrap 5** for responsive layout and components
- **React-Bootstrap** for Bootstrap components as React components
- **Inline styles** for custom styling when needed
- **CSS Grid/Flexbox** for layout

## Environment Configuration

The backend API URL is currently configured in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

To change this for different environments:

```javascript
// For development
const API_BASE_URL = 'http://localhost:8080/api';

// For production
const API_BASE_URL = 'https://api.example.com/api';
```

## Page Routes

```
/ - Home (Browse donations)
/login - Login page
/register - Registration page
/my-donations - Donor's donations (protected, DONOR role)
/my-requests - Receiver's requests (protected, RECEIVER role)
/request/:donationId - Create food request (protected, RECEIVER role)
/admin/dashboard - Admin dashboard (protected, ADMIN role)
```

## Protected Routes

Routes that require authentication are wrapped with `<ProtectedRoute>`:

```javascript
<ProtectedRoute requiredRole="DONOR">
  <MyDonations />
</ProtectedRoute>
```

If user is not authenticated or doesn't have the required role, they are redirected to login.

## Common Development Tasks

### Add New Page
1. Create new file in `src/pages/`
2. Create component with form or content
3. Add route in `App.jsx`
4. If protected, wrap with `<ProtectedRoute>`

### Add New Service
1. Create new file in `src/services/`
2. Export functions that make API calls using `api` instance
3. Import and use in components

### Add New Context
1. Create new file in `src/context/`
2. Create context with React.createContext()
3. Create provider component
4. Create custom hook to use context
5. Wrap App with provider

## Troubleshooting

### Frontend can't connect to backend
- Verify backend is running on http://localhost:8080
- Check CORS configuration in backend SecurityConfig
- Look at browser console for network errors
- Check Network tab in DevTools

### Token issues
- Clear localStorage and log in again: `localStorage.clear()`
- Check token in DevTools: Storage → localStorage
- Verify Authorization header in Network tab

### Build errors
```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install
npm run build
```

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Performance Optimization

- Lazy load routes with React.lazy()
- Memoize expensive components with React.memo()
- Use useCallback for event handlers
- Implement list virtualization for large lists
- Optimize images with appropriate sizes

## Future Enhancements

- [ ] Add more pages (MyDonations, MyRequests, UserProfile, AdminDashboard)
- [ ] Image upload preview before submission
- [ ] Real-time notifications with WebSocket
- [ ] Map view for donations using Leaflet/Google Maps
- [ ] User ratings and reviews
- [ ] Advanced filtering and sorting
- [ ] Dark mode toggle
- [ ] Mobile-responsive improvements
- [ ] PWA capabilities
- [ ] Accessibility improvements

## Testing

Future testing setup with:
- Jest for unit tests
- React Testing Library for component tests
- E2E testing with Cypress/Playwright

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Open source for educational purposes.
