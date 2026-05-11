import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import donationService from '../services/donationService';
import { getImageUrl } from '../utils/imageUtils';

// Professional Color Palette
const COLORS = {
  primary: 'var(--fs-primary)',
  success: 'var(--fs-success)',
  warning: 'var(--fs-warning)',
  danger: 'var(--fs-danger)',
  info: 'var(--fs-accent)',
  textPrimary: 'var(--fs-text-1)',
  textSecondary: 'var(--fs-text-2)',
  border: 'var(--fs-border)',
};

const Home = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({ location: '', foodType: '', availableFrom: '' });
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await donationService.getAllDonations();
      setDonations(data);
      setFilteredDonations(data);
    } catch (err) {
      setError('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await donationService.searchDonations(
        searchParams.location,
        searchParams.foodType,
        searchParams.availableFrom
      );
      setFilteredDonations(data);
    } catch (err) {
      setError('Search failed');
    }
  };

  const handleViewDonation = (donationId) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role === 'RECEIVER') {
      navigate(`/receiver/request/${donationId}`);
    } else if (user?.role === 'DONOR') {
      // Donors can't request, but can view details
      window.alert('Donors cannot request food. You can only post food.');
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

  return (
    <Container fluid className="py-5 surface-container" style={{ minHeight: '100vh' }}>
      {/* Welcome Section */}
      {!isAuthenticated && (
        <div
          className="mb-5 p-5 text-center"
          style={{
            backgroundImage: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.info} 100%)`,
            color: 'var(--fs-text-1)',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(15, 22, 36, 0.45)',
          }}
        >
          <h1 className="mb-3 display-4" style={{ fontWeight: '700' }}>
            🍲 Welcome to FoodShare
          </h1>
          <p className="lead mb-4" style={{ fontSize: '18px' }}>
            Reduce food wastage by connecting food donors with those in need
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/login">
              <Button
                size="lg"
                className="fw-bold"
                style={{ backgroundColor: 'var(--fs-surface-1)', color: 'var(--fs-text-1)', border: '1px solid var(--fs-border)' }}
              >
                Login to Get Started
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="lg"
                className="fw-bold"
                style={{ backgroundColor: 'transparent', color: 'var(--fs-text-1)', border: '2px solid var(--fs-text-1)' }}
              >
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Welcome Message for Authenticated Users */}
      {isAuthenticated && (
        <Alert variant="success" className="mb-4 text-center">
          <h5>Welcome back, <strong>{user?.fullName}</strong>! 👋</h5>
          <p>
            {user?.role === 'DONOR' && '📋 You are a Food Donor. Go to "Posts" to manage your listings.'}
            {user?.role === 'RECEIVER' && '🔍 You are a Receiver. Browse available food below and request items you need.'}
            {user?.role === 'ADMIN' && '⚙️ You are an Admin. Go to Dashboard to manage the platform.'}
          </p>
        </Alert>
      )}

      <Container className="py-5">
        <h1 className="mb-4" style={{ color: COLORS.textPrimary, fontWeight: '700' }}>
          🍽️ Available Food Listings
        </h1>

        {/* Search Form */}
        <Card className="mb-4 shadow-sm" style={{ borderTop: `4px solid ${COLORS.primary}` }}>
          <Card.Body>
            <h5 className="mb-3" style={{ color: COLORS.primary, fontWeight: '600' }}>
              🔍 Search & Filter Food
            </h5>
            <Form onSubmit={handleSearch}>
              <Row>
                <Col md={3} className="mb-3">
                  <Form.Control
                    placeholder="Location"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                    style={{ borderColor: COLORS.border }}
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Control
                    placeholder="Food Type"
                    value={searchParams.foodType}
                    onChange={(e) => setSearchParams({ ...searchParams, foodType: e.target.value })}
                    style={{ borderColor: COLORS.border }}
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <Form.Control
                    type="datetime-local"
                    value={searchParams.availableFrom}
                    onChange={(e) => setSearchParams({ ...searchParams, availableFrom: e.target.value })}
                    style={{ borderColor: COLORS.border }}
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <Button
                    type="submit"
                    className="w-100 fw-bold"
                    style={{ backgroundColor: COLORS.primary, border: 'none' }}
                  >
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Donations Grid */}
        <Row>
          {filteredDonations.length === 0 ? (
            <Col className="text-center py-5">
              <h4 style={{ color: COLORS.textSecondary }}>No donations available</h4>
              <p style={{ color: COLORS.textSecondary }}>Check back soon or adjust your search filters</p>
            </Col>
          ) : (
            filteredDonations.map((donation) => (
              <Col md={4} className="mb-4" key={donation.id}>
                <Card
                  className="h-100 shadow-sm"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    borderRadius: '12px',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = `0 12px 24px rgba(37, 99, 235, 0.15)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  }}
                >
                  {donation.imagePath && (
                    <Card.Img
                      variant="top"
                      src={getImageUrl(donation.imagePath)}
                      alt="Food"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  {!donation.imagePath && (
                    <div
                      style={{
                        height: '200px',
                        backgroundColor: 'rgba(144, 160, 187, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: COLORS.textSecondary,
                      }}
                    >
                      No Image
                    </div>
                  )}
                  <Card.Body>
                    <Card.Title style={{ color: COLORS.primary, fontWeight: '600', marginBottom: '12px' }}>
                      {donation.eventName}
                    </Card.Title>
                    <Card.Text className="small" style={{ color: COLORS.textSecondary }}>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>🍲 Items:</strong> {donation.foodItems}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>📦 Qty:</strong> {donation.quantity} {donation.unit}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>📍 Location:</strong> {donation.pickupLocation}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>⏰ Until:</strong> {new Date(donation.availableUntil).toLocaleString()}
                      </div>
                      {donation.price > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                          <strong>💰 Price:</strong> ₹{donation.price} ({donation.paymentType})
                        </div>
                      )}
                      {donation.price === 0 && (
                        <div style={{ marginBottom: '8px', color: COLORS.success, fontWeight: '600' }}>
                          ✅ FREE
                        </div>
                      )}
                      <div style={{ marginTop: '10px' }}>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(donation.pickupLocation)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-info w-100"
                          style={{ fontSize: '12px' }}
                        >
                          🗺️ View on External Map
                        </a>
                      </div>
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer style={{ borderColor: COLORS.border }}>
                    {isAuthenticated && user?.role === 'RECEIVER' ? (
                      <Button
                        className="w-100 fw-bold"
                        onClick={() => handleViewDonation(donation.id)}
                        style={{ backgroundColor: COLORS.success, border: 'none' }}
                      >
                        Request Food
                      </Button>
                    ) : isAuthenticated && user?.role === 'DONOR' ? (
                      <Button
                        variant="secondary"
                        className="w-100"
                        disabled
                        style={{ backgroundColor: 'var(--fs-surface-3)', border: 'none', color: COLORS.textSecondary }}
                      >
                        You are a Donor
                      </Button>
                    ) : (
                      <Link to="/login" className="w-100" style={{ textDecoration: 'none' }}>
                        <Button
                          className="w-100 fw-bold"
                          style={{ backgroundColor: COLORS.primary, border: 'none' }}
                        >
                          Login to Request
                        </Button>
                      </Link>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </Container>
  );
};

export default Home;
