import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import deliveryService from '../services/deliveryService';
import { getImageUrl } from '../utils/imageUtils';

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await deliveryService.getDeliveryOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load delivery orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>🚚 Delivery Partner Dashboard</h1>
        <Badge bg="success" className="p-2">Role: {user.role}</Badge>
      </div>

      <p className="text-muted mb-4">View and manage orders assigned for delivery.</p>

      {error && <Alert variant="danger">{error}</Alert>}

      {orders.length === 0 ? (
        <Alert variant="info">
          No delivery orders available at the moment.
        </Alert>
      ) : (
        <Row>
          {orders.map((order) => (
            <Col md={12} className="mb-4" key={order.id}>
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between">
                  <span>Order ID: #{order.id}</span>
                  <Badge bg="light" text="dark">{order.status}</Badge>
                </Card.Header>
                {order.imagePath && (
                  <Card.Img
                    variant="top"
                    src={getImageUrl(order.imagePath)}
                    alt="Food"
                    style={{ height: '180px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h5 className="text-primary border-bottom pb-2">📍 Pickup Information</h5>
                      <div className="mb-2"><strong>Event:</strong> {order.eventName}</div>
                      <div className="mb-2"><strong>Items:</strong> {order.foodItems} ({order.quantity} units)</div>
                      <div className="mb-2"><strong>Pickup Address:</strong></div>
                      <Card className="bg-light p-3 border-start border-primary border-4">
                        {order.pickupLocation}
                      </Card>
                      <div className="mt-2"><strong>Donor:</strong> {order.donorName} ({order.donorPhone})</div>
                    </Col>
                    <Col md={6}>
                      <h5 className="text-success border-bottom pb-2">🏠 Delivery Information</h5>
                      <div className="mb-2"><strong>Receiver:</strong> {order.receiverName}</div>
                      <div className="mb-2"><strong>Contact:</strong> {order.receiverPhone}</div>
                      <div className="mb-2"><strong>Delivery Address:</strong></div>
                      <Card className="bg-light p-3 border-start border-success border-4">
                        {order.deliveryAddress}
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <div className="small text-muted text-end">
                    Last updated: {new Date().toLocaleDateString()}
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

export default DeliveryDashboard;
