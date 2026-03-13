import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import donationService from '../services/donationService';
import requestService from '../services/requestService';

const COLORS = {
  primary: 'var(--fs-primary)',
  textPrimary: 'var(--fs-text-1)',
};

const RequestFood = () => {
  const { donationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [donation, setDonation] = useState(null);
  const [formData, setFormData] = useState({
    quantityRequested: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDonation();
  }, []);

  const fetchDonation = async () => {
    try {
      const data = await donationService.getDonationById(donationId);
      setDonation(data);
    } catch (err) {
      setError('Failed to load donation details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await requestService.createRequest({
        donationId: parseInt(donationId),
        quantityRequested: parseFloat(formData.quantityRequested),
        message: formData.message,
      });
      navigate('/receiver/requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

  return (
    <Container className="py-5">
      <Card style={{ maxWidth: '600px', margin: '0 auto', borderTop: `4px solid ${COLORS.primary}` }}>
        <Card.Body>
          <h2 className="mb-4" style={{ color: COLORS.textPrimary }}>📝 Request Food</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {donation && (
            <>
              <Alert variant="info">
                <h5>{donation.eventName}</h5>
                <p className="mb-2"><strong>Food Items:</strong> {donation.foodItems}</p>
                <p className="mb-2"><strong>Available Qty:</strong> {donation.quantity} {donation.unit}</p>
                <p className="mb-0"><strong>Location:</strong> {donation.pickupLocation}</p>
              </Alert>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Quantity Requested</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    name="quantityRequested"
                    placeholder={`Max ${donation.quantity}`}
                    value={formData.quantityRequested}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message to Donor (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    rows={3}
                    placeholder="Tell the donor about your organization or why you need this food"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Button variant="success" type="submit" className="w-100" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RequestFood;
