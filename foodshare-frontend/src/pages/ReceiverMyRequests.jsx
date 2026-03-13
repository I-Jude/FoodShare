import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import requestService from '../services/requestService';

const COLORS = {
  textPrimary: 'var(--fs-text-1)',
  textSecondary: 'var(--fs-text-2)',
  border: 'var(--fs-border)',
};

const ReceiverMyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await requestService.getMyRequests();
      setRequests(data);
    } catch (err) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await requestService.cancelRequest(requestId);
      setRequests(requests.filter(r => r.id !== requestId));
      window.alert('Request cancelled!');
    } catch (err) {
      setError('Failed to cancel request');
    }
  };

  const handleMarkComplete = async (requestId) => {
    try {
      await requestService.markAsCompleted(requestId);
      setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'COMPLETED' } : r));
      window.alert('Request marked as completed!');
    } catch (err) {
      setError('Failed to mark as completed');
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

  return (
    <Container className="py-5">
      <h1 className="mb-4" style={{ color: COLORS.textPrimary }}>📦 My Requests</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {requests.length === 0 ? (
        <Alert variant="info">No requests yet. <Link to="/receiver/browse">Browse available food</Link> to make a request.</Alert>
      ) : (
        <Row>
          {requests.map((request) => (
            <Col md={6} lg={4} className="mb-4" key={request.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{request.donation.eventName}</Card.Title>
                  <Card.Text className="small" style={{ color: COLORS.textSecondary }}>
                    <div><strong>🍲 Food Items:</strong> {request.donation.foodItems}</div>
                    <div><strong>📦 Qty Requested:</strong> {request.quantityRequested}</div>
                    <div><strong>📍 Location:</strong> {request.donation.pickupLocation}</div>
                    <div><strong>Status:</strong> <Badge bg={
                      request.status === 'PENDING' ? 'warning' :
                      request.status === 'APPROVED' ? 'success' :
                      request.status === 'COMPLETED' ? 'info' : 'danger'
                    }>{request.status}</Badge></div>
                  </Card.Text>
                </Card.Body>
                <Card.Footer style={{ borderColor: COLORS.border }}>
                  {request.status === 'PENDING' && (
                    <Button variant="outline-danger" size="sm" className="w-100" onClick={() => handleCancel(request.id)}>
                      Cancel Request
                    </Button>
                  )}
                  {request.status === 'APPROVED' && (
                    <Button variant="success" size="sm" className="w-100" onClick={() => handleMarkComplete(request.id)}>
                      Mark as Completed
                    </Button>
                  )}
                  {request.status === 'COMPLETED' && (
                    <span className="text-success" style={{ color: 'var(--fs-success)' }}>✓ Completed</span>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ReceiverMyRequests;
