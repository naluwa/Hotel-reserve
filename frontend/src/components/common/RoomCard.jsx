import { useState } from "react";
import { formatLKR } from "../../utils/currency";
import { Button, Skeleton } from "../base";
import suiteStandard from "../../assets/img/suite_standard.jpg";
import suiteLuxury from "../../assets/img/suite_luxury.jpg";
import roomPlaceholder from "../../assets/img/room_placeholder.jpg";

const ROOM_SIZES = {
  suite: "650 sq ft",
  deluxe: "520 sq ft",
  double: "360 sq ft",
  single: "260 sq ft",
};

export default function RoomCard({
  room,
  isAdmin = false,
  onBook,
  onEdit,
  checkInDate,
  checkOutDate,
  isLoading = false,
}) {
  const [imageError, setImageError] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  if (isLoading) {
    return (
      <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-cashmere-900/80">
        <Skeleton className="h-56 w-full" />
        <div className="space-y-4 p-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-full" count={2} />
          <Skeleton className="h-10 w-full" />
        </div>
      </article>
    );
  }

  if (!room) return null;

  const roomType = (room?.roomType || room?.type || "Room").toString();
  const roomNumber =
    room?.roomNumber || room?.number || room?.roomNo || room?.id || "-";
  const imageUrl = room?.imageUrl || room?.image || "";
  const pricePerNight = Number(room?.pricePerNight || room?.price || 0) || 0;

  const status =
    room?.status ||
    (room?.available === true
      ? "Available"
      : room?.available === false
        ? "Occupied"
        : "Occupied");

  const typeLower = roomType.toLowerCase();
  const isSuite = typeLower.includes("suite") || typeLower.includes("villa");
  const isSingle = typeLower.includes("single");

  const capacity =
    room?.capacity ||
    (isSuite ? "4 Guests" : isSingle ? "1 Guest" : "2 Guests");
  const bedType =
    room?.bedType ||
    (isSuite ? "King Bed" : isSingle ? "Single Bed" : "Queen Bed");
  const roomSize =
    room?.roomSize ||
    ROOM_SIZES[
      isSuite
        ? "suite"
        : typeLower.includes("deluxe")
          ? "deluxe"
          : typeLower.includes("double")
            ? "double"
            : isSingle
              ? "single"
              : "deluxe"
    ];

  const amenitiesRaw = room?.amenities;
  const amenities = Array.isArray(amenitiesRaw)
    ? amenitiesRaw
    : typeof amenitiesRaw === "string"
      ? amenitiesRaw
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const amenityTags =
    amenities.length > 0
      ? amenities
      : [
          bedType,
          isSuite ? "Ocean View" : "City View",
          isSuite ? "Private Pool" : "Free Wi-Fi",
        ];

  let nights = 0;
  if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
  }

  const stayTotal = nights > 0 ? pricePerNight * nights : 0;
  const isAvailable = status === "Available";

  const handleBookClick = async () => {
    setIsBooking(true);
    try {
      await onBook?.(room);
    } finally {
      setIsBooking(false);
    }
  };

  const handleEditClick = async () => {
    setIsBooking(true);
    try {
      await onEdit?.(room);
    } finally {
      setIsBooking(false);
    }
  };

  const fallbackImage = isSuite ? suiteLuxury : roomPlaceholder;
  const displayImage = !imageError && imageUrl ? imageUrl : fallbackImage;

  return (
    <article
      className="motion-card flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-cashmere-900/80"
      role="region"
      aria-label={`${roomType} Room ${roomNumber}`}
    >
      <div className="relative h-56 overflow-hidden bg-heritage-900">
        <img
          src={displayImage}
          alt={`${roomType} room with ${capacity}`}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover transition duration-500 ease-out hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-heritage-900/70 via-transparent to-transparent" />
        <div
          className={`absolute left-4 top-4 rounded-2xl border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
            isAvailable
              ? "border-emerald-400/70 bg-black text-green-500 shadow-[0_0_24px_rgba(112,211,158,0.18)]"
              : "border-white/10 bg-slate-950/80 text-slate-200"
          }`}
          style={
            isAvailable
              ? { transform: "translateY(-1px) scale(1.01)" }
              : undefined
          }
        >
          {status}
        </div>
      </div>

      <div className="flex flex-grow flex-col gap-5 p-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
            Room {roomNumber}
          </p>
          <h3 className="font-serif text-2xl font-semibold text-white">
            {roomType}
          </h3>
          <p className="text-sm leading-6 text-slate-300">
            {room?.description ||
              "Well-appointed rooms with attentive service and refined finishes."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Guests", value: capacity },
            { label: "Bed", value: bedType },
            { label: "Size", value: roomSize },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">
                {item.label}
              </p>
              <p className="text-sm text-white">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
          {amenityTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mt-1 font-serif text-3xl text-white">
              {formatLKR(pricePerNight)}
            </p>
            {nights > 0 ? (
              <span className="text-sm text-slate-500">
                {formatLKR(stayTotal)} total · {nights} night
                {nights !== 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-sm text-slate-500">/ night</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleBookClick}
              disabled={!isAvailable || isBooking}
              loading={isBooking}
              fullWidth={false}
              variant={isAvailable ? "primary" : "secondary"}
              aria-label={`Book ${roomType} room ${roomNumber}`}
            >
              {isAvailable ? "Book Now" : "Unavailable"}
            </Button>
            {isAdmin && (
              <Button
                onClick={handleEditClick}
                disabled={isBooking}
                variant="outline"
                size="md"
                aria-label={`Edit ${roomType} room ${roomNumber}`}
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
