import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import donationService from '../services/donationService';
import { getImageUrl } from '../utils/imageUtils';

const COLORS = {
  textPrimary: 'var(--fs-text-1)',
  textSecondary: 'var(--fs-text-2)',
  border: 'var(--fs-border)',
};

const ReceiverBrowse = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({ location: '', foodType: '', availableFrom: '' });
  const navigate = useNavigate();

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

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

  return (
    <Container className="py-5">
      <h1 className="mb-4" style={{ color: COLORS.textPrimary }}>🔍 Browse Available Food</h1>

      {/* Search Form */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Search & Filter</h5>
          <Form onSubmit={handleSearch}>
            <Row>
              <Col md={3} className="mb-3">
                <Form.Control
                  placeholder="Location"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Control
                  placeholder="Food Type"
                  value={searchParams.foodType}
                  onChange={(e) => setSearchParams({ ...searchParams, foodType: e.target.value })}
                />
              </Col>
              <Col md={3} className="mb-3">
                <Form.Control
                  type="datetime-local"
                  value={searchParams.availableFrom}
                  onChange={(e) => setSearchParams({ ...searchParams, availableFrom: e.target.value })}
                />
              </Col>
              <Col md={3} className="mb-3">
                <Button variant="primary" type="submit" className="w-100">
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {filteredDonations.length === 0 ? (
        <Alert variant="info">No donations available matching your criteria.</Alert>
      ) : (
        <Row>
          {filteredDonations.map((donation) => (
            <Col md={4} className="mb-4" key={donation.id}>
              <Card className="h-100 shadow-sm">
                {donation.imagePath && (
                  <Card.Img
                    variant="top"
                    src={getImageUrl(donation.imagePath)}
                    alt="Food"
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{donation.eventName}</Card.Title>
                  <Card.Text className="small" style={{ color: COLORS.textSecondary }}>
                    <div><strong>🍲 Items:</strong> {donation.foodItems}</div>
                    <div><strong>📦 Qty:</strong> {donation.quantity} {donation.unit}</div>
                    <div><strong>📍 Location:</strong> {donation.pickupLocation}</div>
                    <div><strong>⏰ Until:</strong> {new Date(donation.availableUntil).toLocaleString()}</div>
                    {donation.price > 0 && <div><strong>💰 Price:</strong> ₹{donation.price}</div>}
                    {donation.price === 0 && <div className="text-success"><strong>✅ FREE</strong></div>}
                  </Card.Text>
                </Card.Body>
                <Card.Footer style={{ borderColor: COLORS.border }}>
                  <Button
                    variant="success"
                    className="w-100"
                    onClick={() => navigate(`/receiver/request/${donation.id}`)}
                  >
                    Request Food
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ReceiverBrowse;
