import { useState } from 'react';
import { formatLKR } from '../../utils/currency';
import { Button, Badge, Skeleton } from '../base';
import suiteStandard from '../../assets/img/suite_standard.svg';
import suiteLuxury from '../../assets/img/suite_luxury.svg';

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
      <article className="rounded-[2rem] border border-cashmere-700 bg-cashmere-900 overflow-hidden">
        <Skeleton className="h-56 w-full" />
        <div className="p-6 space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-full" count={2} />
          <Skeleton className="h-10 w-full" />
        </div>
      </article>
    );
  }

  if (!room) return null;

  const roomType = (room?.roomType || room?.type || 'Room').toString();
  const roomNumber = room?.roomNumber || room?.number || room?.roomNo || room?.id || '—';
  const imageUrl = room?.imageUrl || room?.image || '';
  const pricePerNight = Number(room?.pricePerNight || room?.price || 0) || 0;
  
  const status = room?.status || (
    room?.available === true ? 'Available'
      : room?.available === false ? 'Occupied'
      : 'Occupied'
  );

  const typeLower = roomType.toLowerCase();
  const isSuite = typeLower.includes('suite') || typeLower.includes('villa');
  const isSingle = typeLower.includes('single');
  const capacity = isSuite ? '4 Guests' : isSingle ? '1 Guest' : '2 Guests';
  const bedType = isSuite ? 'King Bed' : isSingle ? 'Single Bed' : 'Queen Bed';
  const amenities = [bedType, 'Air Conditioning', 'Free WiFi'];
  if (isSuite) amenities.push('Mini-bar');

  let nights = 0;
  if (checkInDate && checkOutDate && checkOutDate > checkInDate) {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    nights = Math.round((end - start) / (1000 * 60 * 60 * 24));
  }

  const stayTotal = nights > 0 ? pricePerNight * nights : 0;
  const isAvailable = status === 'Available';

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

  return (
    <article
      className="overflow-hidden rounded-xl border border-cashmere-700 bg-cashmere-900 flex flex-col h-full"
      role="region"
      aria-label={`${roomType} Room ${roomNumber}`}
    >
      <div className="relative h-52 overflow-hidden bg-heritage-900">
        <img
          src={
            !imageError && imageUrl
              ? imageUrl
              : (isSuite ? suiteLuxury : suiteStandard)
          }
          alt={`${roomType} room with ${capacity}`}
          onError={() => setImageError(true)}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute left-3 top-3">
          <Badge
            variant={isAvailable ? 'success' : 'warning'}
            size="sm"
          >
            {status}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5 flex-grow">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
            Room {roomNumber}
          </p>
          <h3 className="text-xl font-serif text-white font-semibold">{roomType}</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
              Capacity
            </p>
            <p className="text-sm text-white">{capacity}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
              Amenities
            </p>
            <p className="text-sm text-slate-300">{amenities.join(' • ')}</p>
          </div>
        </div>

        {nights > 0 ? (
          <div className="rounded-3xl bg-heritage-900 px-4 py-3 text-sm text-slate-300">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
              Estimated stay
            </p>
            <p className="mt-2 font-semibold text-white">
              {nights} night{nights !== 1 ? 's' : ''} — {formatLKR(stayTotal)}
            </p>
          </div>
        ) : null}

        <div className="mt-auto pt-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-400">
              Rate
            </p>
            <p className="font-serif text-3xl text-white">
              {formatLKR(pricePerNight)}
            </p>
            <span className="text-[11px] uppercase tracking-[0.35em] text-slate-500">
              / night
            </span>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto">
            <Button
              onClick={handleBookClick}
              disabled={!isAvailable || isBooking}
              loading={isBooking}
              fullWidth={false}
              variant={isAvailable ? 'primary' : 'secondary'}
              aria-label={`Book ${roomType} room ${roomNumber}`}
            >
              {isAvailable ? 'Reserve' : 'Unavailable'}
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
