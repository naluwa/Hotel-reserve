import { useState } from "react";
import { Button, Input, Select } from "../base";
import { ROOM_TYPES } from "../../config/roomTypes";
import heroImage from "../../assets/img/hero.jpg";

export default function HeroSection({
  filterCheckIn,
  filterCheckOut,
  roomTypeFilter,
  guestCount,
  onCheckInChange,
  onCheckOutChange,
  onRoomTypeChange,
  onGuestCountChange,
  onSearchAvailability,
  onStartBooking,
  onScrollToRooms,
  onClearFilters,
  hasFilters,
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-card">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Grand Reserve Colombo exterior"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1015]/90 via-[#11141c]/80 to-[#0b0d12]/70" />
      </div>

      {/* Decorative orbs */}
      <div className="hero-orb absolute -left-8 top-6 h-36 w-36 rounded-full bg-brass/20 blur-3xl" />
      <div className="hero-orb-delayed absolute bottom-3 right-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative p-8 sm:p-10 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          {/* Left headline */}
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brass/20 bg-brass/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-brass">
              <span className="h-2 w-2 rounded-full bg-brass" />
              Curated coastal luxury · Colombo 03
            </div>
            <h1 className="max-w-2xl text-balance font-serif text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
              Stay somewhere that feels unmistakably elevated.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-300">
              Discover refined suites on Galle Road, tailored service, and a
              calm retreat that makes every arrival feel effortless.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={onScrollToRooms}>
                Explore rooms
              </Button>
              <Button type="button" variant="outline" onClick={onStartBooking}>
                Start booking
              </Button>
            </div>
          </div>

          {/* Right booking widget */}
          <div className="rounded-[2rem] border border-white/10 bg-heritage-900/80 p-6 shadow-xl backdrop-blur sm:p-8">
            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brass">
                  Book your stay
                </p>
                <p className="mt-2 text-lg text-slate-300">
                  Check available rooms and secure the best rate for your dates.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Check-in"
                  type="date"
                  value={filterCheckIn}
                  onChange={onCheckInChange}
                  variant="filled"
                  className="bg-[#0b0d12]/80 text-white"
                />
                <Input
                  label="Check-out"
                  type="date"
                  value={filterCheckOut}
                  onChange={onCheckOutChange}
                  variant="filled"
                  className="bg-[#0b0d12]/80 text-white"
                />
                <Select
                  label="Room type"
                  value={roomTypeFilter}
                  onChange={onRoomTypeChange}
                  options={[
                    { value: "All", label: "All room types" },
                    ...ROOM_TYPES.map((type) => ({ value: type, label: type })),
                  ]}
                  className="bg-[#0b0d12]/80 text-white"
                />
                <Select
                  label="Guests"
                  value={guestCount}
                  onChange={onGuestCountChange}
                  placeholder="Select an option"
                  options={[
                    { value: "1", label: "1 guest" },
                    { value: "2", label: "2 guests" },
                    { value: "3", label: "3 guests" },
                    { value: "4", label: "4 guests" },
                  ]}
                  className="bg-[#0b0d12]/80 text-white"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={onSearchAvailability}
                >
                  Search availability
                </Button>
                <button
                  type="button"
                  className="text-sm text-slate-400 transition hover:text-white"
                  onClick={onClearFilters}
                >
                  {hasFilters ? "Clear search" : "Reset dates"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
