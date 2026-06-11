import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

async function fetchOrdersByUid(uid) {
  const q = query(collection(db, "orders"), where("customerUid", "==", uid));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

const BASE = "http://localhost:8080/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

// console.log("getOrdersByUid =", getOrdersByUid);

export const api = {
  // Products
  getProducts: () => request("/products"),
  getProduct: (id) => request(`/products/${id}`),
  createProduct: (data) =>
    request("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id, data) =>
    request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: "DELETE" }),

  // Users
  signup: (name, mobile, password) =>
    request("/users/signup", {
      method: "POST",
      body: JSON.stringify({ name, mobile, password }),
    }),
  login: (mobile, password) =>
    request("/users/login", {
      method: "POST",
      body: JSON.stringify({ mobile, password }),
    }),

  // Admin
  adminLogin: (username, password) =>
    request("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  // Orders
  placeOrder: (data) =>
    request("/orders", { method: "POST", body: JSON.stringify(data) }),
  getOrders: () => request("/orders"),
  getOrdersByUid: fetchOrdersByUid,
  getOrdersByMobile: (mobile) => request(`/orders/mobile/${mobile}`),
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};
