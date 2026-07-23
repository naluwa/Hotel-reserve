import { useEffect, useState } from 'react';
import { formatLKR } from '../../utils/currency';
import {
  Modal,
  ModalContent,
  ModalFooter,
  Button,
  Card,
  CardHeader,
  CardContent,
  Input,
  Alert,
  Badge,
  Spinner,
} from '../base';

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function BookingModal({
  room,
  isCustomer,
  customerName,
  customerEmail,
  checkInDate,
  checkOutDate,
  onNameChange,
  onEmailChange,
  onSubmit,
  onClose,
  isLoading = false,
  error = null,
}) {
  const [draftCheckIn, setDraftCheckIn] = useState(checkInDate || '');
  const [draftCheckOut, setDraftCheckOut] = useState(checkOutDate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setDraftCheckIn(checkInDate || '');
    setDraftCheckOut(checkOutDate || '');
  }, [checkInDate, checkOutDate, room?.id]);

  if (!room) return null;

  const today = todayStr();
  const minCheckOut = draftCheckIn || today;

  let nights = 0;
  if (draftCheckIn && draftCheckOut && draftCheckOut > draftCheckIn) {
    const start = new Date(draftCheckIn);
    const end = new Date(draftCheckOut);
    nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
  }

  const total = room.pricePerNight * nights;
  const formattedStay = `${draftCheckIn || '—'} to ${draftCheckOut || '—'}`;

  const validateForm = () => {
    const errors = {};

    if (!draftCheckIn) {
      errors.checkIn = 'Arrival date is required';
    }
    if (!draftCheckOut) {
      errors.checkOut = 'Departure date is required';
    }
    if (draftCheckIn && draftCheckOut && draftCheckOut <= draftCheckIn) {
      errors.checkOut = 'Departure date must be after arrival date';
    }
    if (!customerName?.trim()) {
      errors.name = 'Full name is required';
    }
    if (!customerEmail?.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit?.(event, draftCheckIn, draftCheckOut);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Book Room ${room.roomNumber}`}
      description={`${room.roomType} - Complete your reservation`}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <ModalContent className="space-y-6">
          {error && (
            <Alert
              variant="error"
              title="Booking Error"
              message={error}
              onClose={() => {}}
            />
          )}

          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
            {/* Left Column: Summary & Cost */}
            <Card variant="elevated" className="flex flex-col justify-between p-6 space-y-6 bg-cashmere-900 border-cashmere-700">
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.35em] text-brass font-semibold">
                      Room {room.roomNumber}
                    </span>
                    <Badge variant="success" size="sm">
                      {room.status || "Available"}
                    </Badge>
                  </div>
                  <h3 className="mt-1 font-serif text-2xl text-white font-semibold">
                    {room.roomType}
                  </h3>
                </div>

                <div className="border-t border-cashmere-700 pt-4 space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                    Stay Summary
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    <div className="rounded-2xl border border-cashmere-700 bg-heritage-900 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">Arrival</p>
                      <p className="mt-1 font-semibold text-white">{draftCheckIn || 'Not selected'}</p>
                    </div>
                    <div className="rounded-2xl border border-cashmere-700 bg-heritage-900 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">Departure</p>
                      <p className="mt-1 font-semibold text-white">{draftCheckOut || 'Not selected'}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-cashmere-700 pt-4 space-y-3 text-sm">
                  <h4 className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                    Cost Breakdown
                  </h4>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Daily rate</span>
                    <span>{formatLKR(room.pricePerNight)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Stay length</span>
                    <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-brass-subtle bg-brass/10 p-4">
                <div className="flex items-center justify-between text-base font-semibold text-white">
                  <span>Total Cost</span>
                  <span className="text-brass text-lg font-bold">{formatLKR(total)}</span>
                </div>
              </div>
            </Card>

            {/* Right Column: Guest Form Inputs */}
            <Card variant="elevated" className="flex flex-col justify-between p-6 space-y-5 bg-cashmere-900 border-cashmere-700">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-white">Guest Details</p>
                  <p className="mt-1 text-xs text-slate-400">
                    Select your stay dates and confirm this room instantly.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Arrival Date"
                    type="date"
                    value={draftCheckIn}
                    min={today}
                    onChange={(e) => {
                      setDraftCheckIn(e.target.value);
                      if (formErrors.checkIn) setFormErrors({ ...formErrors, checkIn: '' });
                    }}
                    required
                    error={formErrors.checkIn}
                    aria-label="Select arrival date"
                  />

                  <Input
                    label="Departure Date"
                    type="date"
                    value={draftCheckOut}
                    min={minCheckOut}
                    onChange={(e) => {
                      setDraftCheckOut(e.target.value);
                      if (formErrors.checkOut) setFormErrors({ ...formErrors, checkOut: '' });
                    }}
                    required
                    error={formErrors.checkOut}
                    aria-label="Select departure date"
                  />
                </div>

                <Input
                  label="Full Name"
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    onNameChange(e.target.value);
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                  }}
                  placeholder="Enter your full name here"
                  required
                  error={formErrors.name}
                  aria-label="Enter your full name"
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => {
                    onEmailChange(e.target.value);
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  placeholder="Enter your email address here"
                  required
                  error={formErrors.email}
                  aria-label="Enter your email address"
                />
              </div>

              <Alert
                variant="info"
                title="Important"
                message="Review your stay details, then confirm to complete the booking instantly."
              />
            </Card>
          </div>

          <ModalFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-cashmere-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isLoading || !draftCheckIn || !draftCheckOut}
              loading={isSubmitting || isLoading}
              fullWidth
              aria-busy={isSubmitting || isLoading}
            >
              {isSubmitting || isLoading ? 'Confirming...' : 'Confirm Reservation'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
