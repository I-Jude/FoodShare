import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import donationService from '../services/donationService';
import { getImageUrl } from '../utils/imageUtils';

const DonorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await donationService.getDonorDonations(user.id);
      setDonations(data);
    } catch (err) {
      setError('Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

  return (
    <Container className="py-5">
      <h1 className="mb-4">📋 My Food Donations</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {donations.length === 0 ? (
        <Alert variant="info">
          No donations yet. <Link to="/donor/create">Click here to post your first donation</Link>
        </Alert>
      ) : (
        <Row>
          {donations.map((donation) => (
            <Col md={6} lg={4} className="mb-4" key={donation.id}>
              <Card className="h-100 shadow-sm">
                {donation.imagePath && (
                  <Card.Img
                    variant="top"
                    src={getImageUrl(donation.imagePath)}
                    alt="Food"
                    style={{ height: '160px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{donation.eventName}</Card.Title>
                  <Card.Text>
                    <div><strong>Items:</strong> {donation.foodItems}</div>
                    <div><strong>Quantity:</strong> {donation.quantity} {donation.unit}</div>
                    <div><strong>Location:</strong> {donation.pickupLocation}</div>
                    <div><strong>Status:</strong> <Badge bg="info">{donation.status}</Badge></div>
                    <div><strong>Available Until:</strong> {new Date(donation.availableUntil).toLocaleString()}</div>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="flex-grow-1"
                      onClick={() => navigate(`/donor/edit/${donation.id}`)}
                    >
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" className="flex-grow-1">Delete</Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default DonorDashboard;
