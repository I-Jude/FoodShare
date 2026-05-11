import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import DonorRequests from './pages/DonorRequests';
import ReceiverBrowse from './pages/ReceiverBrowse';
import ReceiverMyRequests from './pages/ReceiverMyRequests';
import AdminDashboard from './pages/AdminDashboard';
import CreateDonation from './pages/CreateDonation';
import RequestFood from './pages/RequestFood';
import DeliveryDashboard from './pages/DeliveryDashboard';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/theme.css';

const COLORS = {
  primary: '#23A7A0',
  textPrimary: '#E8EEF8',
  danger: '#F04343',
  accent: '#F97316',
};

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkStyle = {
    color: COLORS.textPrimary,
    fontWeight: '500',
    padding: '8px 12px',
    lineHeight: 1.2,
  };

  return (
    <Navbar
      className="navbar-darkglass"
      expand="lg"
      sticky="top"
      style={{ padding: '1rem 0' }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold" style={{ color: COLORS.primary, fontSize: '24px' }}>
          FoodShare
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ borderColor: COLORS.textPrimary }} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-1">
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login" style={navLinkStyle}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" style={navLinkStyle}>
                  Register
                </Nav.Link>
              </>
            ) : (
              <>
                <span style={{ color: COLORS.textPrimary, fontWeight: '600', padding: '8px 12px', marginRight: '6px' }}>
                  {user?.fullName}
                </span>

                {user?.role === 'DONOR' && (
                  <>
                    <Nav.Link as={Link} to="/donor/dashboard" style={navLinkStyle}>
                      Posts
                    </Nav.Link>
                    <Nav.Link as={Link} to="/donor/requests" style={navLinkStyle}>
                      Requests
                    </Nav.Link>
                    <Nav.Link as={Link} to="/donor/create" style={navLinkStyle}>
                      Create Post
                    </Nav.Link>
                  </>
                )}

                {user?.role === 'RECEIVER' && (
                  <>
                    <Nav.Link as={Link} to="/receiver/browse" style={navLinkStyle}>
                      Browse
                    </Nav.Link>
                    <Nav.Link as={Link} to="/receiver/requests" style={navLinkStyle}>
                      My Requests
                    </Nav.Link>
                  </>
                )}

                {user?.role === 'ADMIN' && (
                  <Nav.Link as={Link} to="/admin/dashboard" style={navLinkStyle}>
                    Admin
                  </Nav.Link>
                )}

                {user?.role === 'DELIVERY_PARTNER' && (
                  <Nav.Link as={Link} to="/delivery/dashboard" style={navLinkStyle}>
                    Deliveries
                  </Nav.Link>
                )}

                <Button
                  onClick={handleLogout}
                  size="sm"
                  style={{
                    backgroundColor: COLORS.danger,
                    border: 'none',
                    color: COLORS.textPrimary,
                    fontWeight: '500',
                    marginLeft: '8px',
                    padding: '8px 14px',
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const AppContent = () => {
  return (
    <div className="app-shell">
      <Navigation />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Donor Routes */}
        <Route
          path="/donor/dashboard"
          element={
            <ProtectedRoute requiredRole="DONOR">
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/requests"
          element={
            <ProtectedRoute requiredRole="DONOR">
              <DonorRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/create"
          element={
            <ProtectedRoute requiredRole="DONOR">
              <CreateDonation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/edit/:donationId"
          element={
            <ProtectedRoute requiredRole="DONOR">
              <CreateDonation isEdit={true} />
            </ProtectedRoute>
          }
        />

        {/* Receiver Routes */}
        <Route
          path="/receiver/browse"
          element={
            <ProtectedRoute requiredRole="RECEIVER">
              <ReceiverBrowse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receiver/requests"
          element={
            <ProtectedRoute requiredRole="RECEIVER">
              <ReceiverMyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receiver/request/:donationId"
          element={
            <ProtectedRoute requiredRole="RECEIVER">
              <RequestFood />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Delivery Partner Routes */}
        <Route
          path="/delivery/dashboard"
          element={
            <ProtectedRoute requiredRole="DELIVERY_PARTNER">
              <DeliveryDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
