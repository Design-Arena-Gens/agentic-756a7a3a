"use client";
import { useEffect, useState } from 'react';

type Booking = {
  id: string;
  name: string;
  partySize: number;
  isoDateTime: string;
  phone: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((data) => setBookings(data.bookings ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <h2>Bookings (ephemeral demo storage)</h2>
      {loading ? (
        <p>Loading?</p>
      ) : bookings.length === 0 ? (
        <p>No bookings captured yet.</p>
      ) : (
        <ul>
          {bookings.map((b) => (
            <li key={b.id}>
              <strong>{b.name}</strong> ? party {b.partySize} ? {new Date(b.isoDateTime).toLocaleString()} ? {b.phone}
            </li>
          ))}
        </ul>
      )}
      <p style={{ marginTop: 16 }}>
        Note: this demo stores data in-memory. Use a real DB for production.
      </p>
    </div>
  );
}
