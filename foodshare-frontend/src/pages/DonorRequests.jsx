import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import requestService from '../services/requestService';

const DonorRequests = () => {
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
      const data = await requestService.getIncomingRequests();
      setRequests(data);
    } catch (err) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await requestService.approveRequest(requestId);
      setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'APPROVED' } : r));
        window.alert('Request approved!');
    } catch (err) {
      setError('Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await requestService.rejectRequest(requestId);
      setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'REJECTED' } : r));
        window.alert('Request rejected!');
    } catch (err) {
      setError('Failed to reject request');
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

  return (
    <Container className="py-5">
      <h1 className="mb-4">📬 Incoming Requests</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {requests.length === 0 ? (
        <Alert variant="info">No requests yet. When receivers request your food, they will appear here.</Alert>
      ) : (
        <div>
          {requests.map((request) => (
            <Card className="mb-3 shadow-sm" key={request.id}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <h5>{request.donation.eventName}</h5>
                    <p className="mb-2"><strong>Receiver:</strong> {request.receiverName} ({request.receiverPhone})</p>
                    <p className="mb-2"><strong>Quantity Requested:</strong> {request.quantityRequested}</p>
                    <p className="mb-2"><strong>Message:</strong> {request.message}</p>
                    <p className="mb-0"><strong>Status:</strong> <Badge bg={request.status === 'PENDING' ? 'warning' : request.status === 'APPROVED' ? 'success' : 'danger'}>{request.status}</Badge></p>
                  </div>
                  {request.status === 'PENDING' && (
                    <div className="ms-3">
                      <Button variant="success" size="sm" className="mb-2 d-block" onClick={() => handleApprove(request.id)}>
                        Approve
                      </Button>
                      <Button variant="danger" size="sm" className="d-block" onClick={() => handleReject(request.id)}>
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
};

export default DonorRequests;
