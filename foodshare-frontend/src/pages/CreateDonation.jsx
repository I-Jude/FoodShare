import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import donationService from '../services/donationService';
import { getImageUrl } from '../utils/imageUtils';

const COLORS = {
  primary: 'var(--fs-primary)',
  textPrimary: 'var(--fs-text-1)',
  textSecondary: 'var(--fs-text-2)',
  border: 'var(--fs-border)',
};

const emptyDonation = {
  eventName: '',
  description: '',
  foodItems: '',
  quantity: '',
  unit: 'kg',
  pickupLocation: '',
  availableFrom: '',
  availableUntil: '',
  price: 0,
  paymentType: 'CASH',
};

const toDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (num) => `${num}`.padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const CreateDonation = ({ isEdit = false }) => {
  const [formData, setFormData] = useState({
    ...emptyDonation,
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDonation, setLoadingDonation] = useState(isEdit);
  const navigate = useNavigate();
  const { donationId } = useParams();

  useEffect(() => {
    if (!isEdit || !donationId) {
      setLoadingDonation(false);
      return;
    }

    const fetchDonationForEdit = async () => {
      try {
        setLoadingDonation(true);
        const donation = await donationService.getDonationById(donationId);
        setFormData({
          eventName: donation.eventName || '',
          description: donation.description || '',
          foodItems: donation.foodItems || '',
          quantity: donation.quantity ?? '',
          unit: donation.unit || 'kg',
          pickupLocation: donation.pickupLocation || '',
          availableFrom: toDateTimeLocal(donation.availableFrom),
          availableUntil: toDateTimeLocal(donation.availableUntil),
          price: donation.price ?? 0,
          paymentType: donation.paymentType || 'CASH',
        });
        if (donation.imagePath) {
          setImagePreview(getImageUrl(donation.imagePath));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load donation for editing');
      } finally {
        setLoadingDonation(false);
      }
    };

    fetchDonationForEdit();
  }, [isEdit, donationId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Only JPG/PNG images allowed');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      setImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const donation = isEdit
        ? await donationService.updateDonation(donationId, formData)
        : await donationService.createDonation(formData);

      if (image) {
        const formDataWithImage = new FormData();
        formDataWithImage.append('file', image);
        await donationService.uploadImage(donation.id, formDataWithImage);
      }

      navigate('/donor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  if (loadingDonation) {
    return (
      <Container className="py-5">
        <Card className="shadow-sm" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <Card.Body>
            <p className="mb-0">Loading donation details...</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card
        className="shadow-sm"
        style={{ maxWidth: '700px', margin: '0 auto', borderTop: `4px solid ${COLORS.primary}` }}
      >
        <Card.Body>
          <h2 className="mb-4" style={{ color: COLORS.primary, fontWeight: '700' }}>
            {isEdit ? 'Edit Food Donation' : 'Post Food Donation'}
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600', color: COLORS.textPrimary }}>Event Name</Form.Label>
              <Form.Control
                type="text"
                name="eventName"
                placeholder="e.g., Wedding Reception"
                value={formData.eventName}
                onChange={handleChange}
                style={{ borderColor: COLORS.border }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600', color: COLORS.textPrimary }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                placeholder="Describe the food and condition"
                value={formData.description}
                onChange={handleChange}
                style={{ borderColor: COLORS.border }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600', color: COLORS.textPrimary }}>
                Food Items (comma-separated)
              </Form.Label>
              <Form.Control
                type="text"
                name="foodItems"
                placeholder="e.g., Biryani, Desserts, Juice"
                value={formData.foodItems}
                onChange={handleChange}
                style={{ borderColor: COLORS.border }}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: COLORS.textPrimary }}>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="quantity"
                  placeholder="10"
                  value={formData.quantity}
                  onChange={handleChange}
                  style={{ borderColor: COLORS.border }}
                  required
                />
              </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: COLORS.textPrimary }}>Unit</Form.Label>
                <Form.Select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  style={{ borderColor: COLORS.border }}
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="pieces">Pieces</option>
                  <option value="servings">Servings</option>
                  <option value="liters">Liters</option>
                </Form.Select>
              </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600', color: COLORS.textPrimary }}>Pickup Location</Form.Label>
              <Form.Control
                type="text"
                name="pickupLocation"
                placeholder="Hotel ABC, Downtown"
                value={formData.pickupLocation}
                onChange={handleChange}
                style={{ borderColor: COLORS.border }}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: COLORS.textPrimary }}>Available From</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  style={{ borderColor: COLORS.border }}
                  required
                />
              </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                <Form.Label style={{ fontWeight: '600', color: COLORS.textPrimary }}>Available Until</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="availableUntil"
                  value={formData.availableUntil}
                  onChange={handleChange}
                  style={{ borderColor: COLORS.border }}
                  required
                />
              </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600', color: COLORS.textPrimary }}>Price (₹) - Leave 0 for Free</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                name="price"
                placeholder="0"
                value={formData.price}
                onChange={handleChange}
                style={{ borderColor: COLORS.border }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: '600', color: COLORS.textPrimary }}>Payment Type</Form.Label>
              <Form.Select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                style={{ borderColor: COLORS.border }}
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI / Digital</option>
                <option value="CARD">Card</option>
                <option value="OTHER">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '600', color: COLORS.textPrimary }}>
                🖼️ Upload Food Image (Optional)
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                style={{ borderColor: COLORS.border }}
              />
              <small style={{ color: COLORS.textSecondary, marginTop: '8px', display: 'block' }}>
                ✓ Supported: JPG, PNG | Max size: 5MB
              </small>

              {imagePreview && (
                <div style={{ marginTop: '16px' }}>
                  <p style={{ fontWeight: '600', color: COLORS.textPrimary, marginBottom: '8px' }}>Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '250px',
                      borderRadius: '8px',
                      border: `2px solid ${COLORS.primary}`,
                    }}
                  />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    style={{ marginTop: '8px' }}
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </Form.Group>

            <Button
              type="submit"
              className="w-100 fw-bold"
              style={{
                backgroundColor: COLORS.primary,
                border: 'none',
                padding: '12px',
                fontSize: '16px',
              }}
              disabled={loading}
            >
              {loading
                ? (isEdit ? 'Saving changes...' : 'Posting...')
                : (isEdit ? 'Save Changes' : 'Post Donation')}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreateDonation;
