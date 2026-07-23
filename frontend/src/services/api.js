const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081";

const buildHeaders = (token) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const handleResponse = async (response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || response.statusText || "Request failed");
  }
  return data;
};

const buildUrl = (path, query = {}) => {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
};

const apiRequest = async (path, options = {}) => {
  try {
    const targetUrl = (typeof path === "string" && (path.startsWith("http://") || path.startsWith("https://")))
      ? path
      : `${BASE_URL}${path}`;
    const response = await fetch(targetUrl, options);
    return handleResponse(response);
  } catch {
    throw new Error(
      "Network error: could not reach the API. Ensure the backend is running and try again.",
    );
  }
};

export const loginUser = (username, password) =>
  apiRequest("/api/auth/login", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ username, password }),
  });

export const registerCustomer = (fullName, email, password, nicPassport, phone, address) =>
  apiRequest("/api/auth/register", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ fullName, email, password, nicPassport, phone, address }),
  });

export const fetchDashboard = (token) =>
  apiRequest("/api/dashboard/summary", {
    headers: buildHeaders(token),
  });

export const fetchRooms = (token) =>
  apiRequest("/api/rooms", {
    headers: buildHeaders(token),
  });

export const fetchAvailableRooms = (checkIn, checkOut) =>
  apiRequest(buildUrl("/api/rooms/available", { checkIn, checkOut }));

export const createRoom = (room, token) =>
  apiRequest("/api/rooms", {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(room),
  });

export const updateRoom = (id, room, token) =>
  apiRequest(`/api/rooms/${id}`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(room),
  });

export const deleteRoom = (id, token) =>
  apiRequest(`/api/rooms/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

export const fetchCustomers = (token) =>
  apiRequest("/api/customers", {
    headers: buildHeaders(token),
  });

export const createCustomer = (customer, token) =>
  apiRequest("/api/customers", {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(customer),
  });

export const updateCustomer = (id, customer, token) =>
  apiRequest(`/api/customers/${id}`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(customer),
  });

export const deleteCustomer = (id, token) =>
  apiRequest(`/api/customers/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

export const fetchReservations = (token) =>
  apiRequest("/api/reservations", {
    headers: buildHeaders(token),
  });

export const createReservation = (reservation, token) =>
  apiRequest("/api/reservations", {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(reservation),
  });

export const fetchMyReservations = (token) =>
  apiRequest("/api/reservations/my", {
    headers: buildHeaders(token),
  });

export const updateReservation = (id, reservation, token) =>
  apiRequest(`/api/reservations/${id}`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(reservation),
  });

export const updateReservationPayment = (id, status, token) =>
  apiRequest(`/api/reservations/${id}/payment?status=${status}`, {
    method: "PUT",
    headers: buildHeaders(token),
  });

export const cancelReservation = (id, token) =>
  apiRequest(`/api/reservations/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

export const checkInReservation = (id, token) =>
  apiRequest(`/api/reservations/${id}/check-in`, {
    method: "POST",
    headers: buildHeaders(token),
  });

export const checkOutReservation = (id, token) =>
  apiRequest(`/api/reservations/${id}/check-out`, {
    method: "POST",
    headers: buildHeaders(token),
  });

export const fetchPayments = (token) =>
  apiRequest("/api/payments", {
    headers: buildHeaders(token),
  });

export const createPayment = (payment, token) =>
  apiRequest("/api/payments", {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(payment),
  });

export const updatePayment = (id, payment, token) =>
  apiRequest(`/api/payments/${id}`, {
    method: "PUT",
    headers: buildHeaders(token),
    body: JSON.stringify(payment),
  });

export const fetchAdminUsers = (token) =>
  apiRequest("/api/admin/users", {
    headers: buildHeaders(token),
  });

export const createAdminUser = (data, token) =>
  apiRequest("/api/admin/users", {
    method: "POST",
    headers: buildHeaders(token),
    body: JSON.stringify(data),
  });

export const deleteAdminUser = (id, token) =>
  apiRequest(`/api/admin/users/${id}`, {
    method: "DELETE",
    headers: buildHeaders(token),
  });

export const setupAdminPassword = (email, password, fullName) =>
  apiRequest("/api/auth/setup-admin-password", {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ email, password, fullName }),
  });

