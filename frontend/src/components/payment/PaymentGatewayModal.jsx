import { useState } from "react";
import { Modal, ModalContent, ModalFooter, Input, Button, Card } from "../base";
import { updateReservationPayment } from "../../services/api";
import { TOAST_TYPES } from "../../config/constants";
import { formatLKR } from "../../utils/currency";

export default function PaymentGatewayModal({
  booking,
  room,
  authToken,
  showToast,
  onSuccess,
  onClose,
}) {
  const [card, setCard] = useState({
    name: "",
    number: "",
    expiry: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!booking) return null;

  const handlePay = async (e) => {
    e.preventDefault();
    if (
      card.number.replace(/\s/g, "").length < 16 ||
      card.expiry.length < 5 ||
      card.cvv.length < 3
    ) {
      return showToast("Please check card details.", TOAST_TYPES.ERROR);
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await updateReservationPayment(booking.id, "PAID", authToken);
      setIsDone(true);
      showToast("Payment successful!", TOAST_TYPES.SUCCESS);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      showToast(err.message, TOAST_TYPES.ERROR);
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Confirm Your Payment"
      description="Secure Payment Gateway — Reservation Checkout"
      size="md"
    >
      <form onSubmit={handlePay}>
        <ModalContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
            {/* Left Column: Payment Input Form */}
            <Card
              variant="elevated"
              className="flex flex-col justify-between p-6 bg-cashmere-900 border-cashmere-700 space-y-5"
            >
              <div>
                <h3 className="font-semibold text-white text-base">
                  Cardholder Information
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  Enter your payment card details below to complete your booking.
                </p>

                {isDone ? (
                  <div className="mt-6 rounded border border-green-800/40 bg-green-950/30 p-5 text-center text-white">
                    <p className="text-base font-semibold text-green-400">
                      Payment Confirmed
                    </p>
                    <p className="mt-2 text-xs text-slate-300">
                      Your stay is reserved and your receipt has been generated.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    <Input
                      label="Cardholder Name"
                      required
                      placeholder="Alex Johnson"
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                    />

                    <Input
                      label="Card Number"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={card.number}
                      onChange={(e) =>
                        setCard({
                          ...card,
                          number: e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 16)
                            .replace(/(.{4})/g, "$1 ")
                            .trim(),
                        })
                      }
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input
                        label="Expiry Date"
                        required
                        placeholder="MM/YY"
                        value={card.expiry}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            expiry: e.target.value
                              .replace(/\D/g, "")
                              .slice(0, 4)
                              .replace(/(.{2})/, "$1/")
                              .replace(/\/$/, ""),
                          })
                        }
                      />
                      <Input
                        label="CVV"
                        required
                        type="password"
                        placeholder="123"
                        value={card.cvv}
                        onChange={(e) =>
                          setCard({
                            ...card,
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded border border-cashmere-700 bg-heritage-900 p-3 text-xs text-slate-400 flex items-center gap-2">
                <svg className="w-4 h-4 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>256-bit encrypted SSL secure payment gateway</span>
              </div>
            </Card>

            {/* Right Column: Payment Details Summary */}
            <Card
              variant="elevated"
              className="flex flex-col justify-between p-6 bg-cashmere-900 border-cashmere-700 space-y-6"
            >
              <div className="space-y-5">
                <h3 className="font-semibold text-white text-base">
                  Payment Details
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="rounded-2xl border border-cashmere-700 bg-heritage-900 p-4">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                      Room Selected
                    </p>
                    <p className="mt-1 font-semibold text-white text-base">
                      Room {room?.roomNumber || "301"} — {room?.roomType || "Standard Suite"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-cashmere-700 bg-heritage-900 p-4">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                      Reservation ID
                    </p>
                    <p className="mt-1 font-mono text-xs text-slate-300">
                      {booking.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-brass-subtle bg-brass/10 p-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
                    Total Amount Due
                  </p>
                  <p className="mt-1 text-2xl font-bold text-brass">
                    {formatLKR(booking.totalAmount)}
                  </p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  Your payment info is processed securely and is never stored locally.
                </p>
              </div>
            </Card>
          </div>

          <ModalFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-cashmere-700">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={onClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              fullWidth
              loading={isProcessing}
              disabled={isProcessing || isDone}
            >
              {isProcessing ? "Processing..." : `Pay ${formatLKR(booking.totalAmount)}`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
