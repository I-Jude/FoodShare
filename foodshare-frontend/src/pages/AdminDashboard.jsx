import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Spinner } from 'react-bootstrap';
import api from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersData = await api.get('/admin/users');
      const statsData = await api.get('/admin/stats');
      setUsers(usersData.data);
      setStats(statsData.data);
    } catch (err) {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/activate`);
      fetchData();
      window.alert('User activated!');
    } catch (err) {
      setError('Failed to activate user');
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/deactivate`);
      fetchData();
      window.alert('User deactivated!');
    } catch (err) {
      setError('Failed to deactivate user');
    }
  };

  if (loading) return <div className="text-center p-5"><Spinner animation="border" /></div>;

  return (
    <Container fluid className="py-5">
      <h1 className="mb-4">⚙️ Admin Dashboard</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Statistics */}
      {stats && (
        <Row className="mb-4">
          <Col md={3} className="mb-3">
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h4 className="text-primary">{stats.totalUsers || 0}</h4>
                <p className="text-muted" style={{ color: 'var(--fs-text-2)' }}>Total Users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-3">
            <Card className="text-center shadow-sm">
              <Card.Body>
                <h4 className="text-success">{stats.totalDonations || 0}</h4>
                <p className="text-muted" style={{ color: 'var(--fs-text-2)' }}>Active Donations</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Users Management */}
      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-3">👥 User Management</h3>
          {users.length === 0 ? (
            <Alert variant="info">No users found.</Alert>
          ) : (
            <Table striped bordered hover responsive style={{ color: 'var(--fs-text-1)' }}>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Full Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.fullName}</td>
                    <td>
                      <span className="badge bg-info">{user.role}</span>
                    </td>
                    <td>
                      <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {user.isActive ? (
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleDeactivateUser(user.id)}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleActivateUser(user.id)}
                        >
                          Activate
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
