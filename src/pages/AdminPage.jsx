import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../services/AdminContext";
import { useProducts } from "../services/ProductContext";
import ChangePassword from "./ChangePassword";
import AdminSidebar from "../components/AdminSidebar";
// import { api } from "../services/api";
// import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  where,
  addDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { useAuth } from "../services/AuthContext";

export const api = {
  async getOrders() {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  },
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const CATEGORIES = [
  "Western Dress",
  "Gown",
  "Kurti",
  "Lehenga",
  "Salwar",
  "Saree",
  "Botua",
  "Other",
];
const TAGS = [
  "Bestseller",
  "Trending",
  "New Arrival",
  "Popular",
  "Budget Pick",
  "Party Special",
];

const emptyForm = {
  name: "",
  price: "",
  originalPrice: "",
  category: "",
  tag: "",
  description: "",
  delivery: "Free delivery in 2-3 days",
  sizes: [],
  colors: "",
  highlights: "",
  images: "",
};

export default function AdminPage() {
  const { admin, adminLogout } = useAdmin();
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();
  const navigate = useNavigate();

  const [tab, setTab] = useState("products");
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedOrder, setSelectedOrder] = useState(null);

  // const today = new Date().toISOString().split("T")[0];
  // const { user, loading } = useAuth();

  useEffect(() => {
    if (!admin) return;

    setOrdersLoading(true);

    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        setOrders(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })),
        );

        setOrdersLoading(false);
      },
      (err) => {
        console.error("Orders listener error:", err);
        setOrdersLoading(false);
      },
    );

    return () => unsub();
  }, [admin]);

  useEffect(() => {
    if (admin === false) {
      navigate("/admin/login");
    }
  }, [admin, navigate]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.price || isNaN(form.price)) e.price = "Valid price required";
    if (!form.originalPrice || isNaN(form.originalPrice))
      e.originalPrice = "Valid price required";
    if (!form.category) e.category = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (form.sizes.length === 0) e.sizes = "Select at least one size";
    if (!form.images.trim()) e.images = "At least one image URL required";
    return e;
  }

  function handleImageInput(val) {
    setForm({ ...form, images: val });
    const urls = val
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    setPreviewImages(urls);
  }

  function toggleSize(s) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(s)
        ? prev.sizes.filter((x) => x !== s)
        : [...prev.sizes, s],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setErrors({});

    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      colors: form.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      highlights: form.highlights
        .split("\n")
        .map((h) => h.trim())
        .filter(Boolean),
      images: form.images
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean),
    };

    if (editId) {
      updateProduct(editId, payload);
      setSuccess("Product updated successfully!");
    } else {
      addProduct(payload);
      setSuccess("Product added successfully!");
    }

    setForm(emptyForm);
    setPreviewImages([]);
    setEditId(null);
    setTab("products");
    setTimeout(() => setSuccess(""), 3000);
  }

  function handleEdit(product) {
    setForm({
      name: product.name,
      price: String(product.price),
      originalPrice: String(product.originalPrice),
      category: product.category,
      tag: product.tag || "",
      description: product.description,
      delivery: product.delivery,
      sizes: product.sizes,
      colors: product.colors.join(", "),
      highlights: product.highlights.join("\n"),
      images: product.images.join("\n"),
    });
    setPreviewImages(product.images);
    setEditId(product.id);
    setTab("add");
  }

  // const sidebarItems = [
  //   { key: "products", label: "All Products", icon: "👗" },
  //   { key: "add", label: "Add Product", icon: "➕" },
  //   { key: "orders", label: "Orders", icon: "📦" },
  //   { key: "hero", label: "Hero Section", icon: "🖼️" },
  // ];

  function exportOrdersCSV(orders, filter = "ALL", fileName = null) {
    if (!orders || orders.length === 0) {
      alert("No orders to export");
      return;
    }

    let filtered = orders;

    if (filter !== "ALL") {
      filtered = orders.filter((o) => o.status === filter);
    }

    const headers = [
      "Order ID",
      "Order Number",
      "Customer Name",
      "Email",
      "Status",
      "Total Amount",
      "Date",
      "Items",
    ];

    const rows = filtered.map((order) => {
      const items = Array.isArray(order.items)
        ? order.items
        : JSON.parse(order.items || "[]");

      const itemText = items.map((i) => `${i.name} (x${i.qty})`).join(" | ");

      const date = order.createdAt?.toDate
        ? order.createdAt.toDate().toLocaleString("en-IN")
        : "";

      return [
        order.id,
        order.orderNumber || "",
        order.customerName || "",
        order.customerEmail || "",
        order.status || "",
        order.totalAmount || 0,
        date,
        itemText,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;

    link.download = fileName || `orders_${filter}_${Date.now()}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const filteredOrders = orders.filter((order) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      order.customerName?.toLowerCase().includes(search) ||
      order.customerEmail?.toLowerCase().includes(search) ||
      order.orderNumber?.toLowerCase().includes(search);

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Order Statustics Card

  const totalOrders = orders.length;

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  const confirmedCount = orders.filter((o) => o.status === "CONFIRMED").length;

  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  const cancelledCount = orders.filter((o) => o.status === "CANCELLED").length;

  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="min-w-screen h-screen flex-shrink-0 bg-gray-100">
        <AdminSidebar
          tab={tab}
          setTab={setTab}
          adminLogout={adminLogout}
          setEditId={setEditId}
          setForm={setForm}
          setPreviewImages={setPreviewImages}
          emptyForm={emptyForm}
        />

        {/* Main Content */}
        <main className="ml-60 h-screen w-70% overflow-y-auto p-8">
          {success && (
            <div className="mb-4 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
              ✅ {success}
            </div>
          )}

          {/* ── All Products Tab ── */}
          {tab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  All Products{" "}
                  <span className="text-purple-600">({products.length})</span>
                </h1>
                <button
                  onClick={() => setTab("add")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  + Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-44 object-cover"
                      />
                      {p.tag && (
                        <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {p.tag}
                        </span>
                      )}
                      <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                        {p.images.length} imgs
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="font-semibold text-gray-800 truncate">
                        {p.name}
                      </p>
                      <p className="text-xs text-purple-500 mt-0.5">
                        {p.category}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-gray-900">
                          ₹{p.price.toLocaleString()}
                        </span>
                        <span className="text-gray-400 line-through text-xs">
                          ₹{p.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(p)}
                          className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Add / Edit Product Tab ── */}
          {tab === "add" && (
            <div className="w-full">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">
                {editId ? "Edit Product" : "Add New Product"}
              </h1>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
                    Basic Information
                  </h2>

                  <Field label="Product Name" error={errors.name}>
                    <input
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="e.g. Floral Anarkali Suit"
                      className={input(errors.name)}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Selling Price (₹)" error={errors.price}>
                      <input
                        type="number"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: e.target.value })
                        }
                        placeholder="1299"
                        className={input(errors.price)}
                      />
                    </Field>
                    <Field
                      label="Original Price (₹)"
                      error={errors.originalPrice}
                    >
                      <input
                        type="number"
                        value={form.originalPrice}
                        onChange={(e) =>
                          setForm({ ...form, originalPrice: e.target.value })
                        }
                        placeholder="2499"
                        className={input(errors.originalPrice)}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Category" error={errors.category}>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                        className={input(errors.category)}
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Tag (optional)">
                      <select
                        value={form.tag}
                        onChange={(e) =>
                          setForm({ ...form, tag: e.target.value })
                        }
                        className={input()}
                      >
                        <option value="">No tag</option>
                        {TAGS.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>

                {/* Description & Highlights */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
                    Description & Highlights
                  </h2>

                  <Field label="Product Description" error={errors.description}>
                    <textarea
                      rows={4}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Describe the product in detail..."
                      className={input(errors.description)}
                    />
                  </Field>

                  <Field label="Highlights (one per line)">
                    <textarea
                      rows={4}
                      value={form.highlights}
                      onChange={(e) =>
                        setForm({ ...form, highlights: e.target.value })
                      }
                      placeholder={
                        "Premium georgette fabric\nFlared silhouette\nMachine washable"
                      }
                      className={input()}
                    />
                  </Field>
                </div>

                {/* Variants */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
                    Variants
                  </h2>

                  <Field label="Available Sizes" error={errors.sizes}>
                    <div className="flex gap-2 flex-wrap mt-1">
                      {SIZES.map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => toggleSize(s)}
                          className={`w-12 h-10 rounded-lg border-2 text-sm font-semibold transition-all
                          ${form.sizes.includes(s) ? "border-purple-600 bg-purple-600 text-white" : "border-gray-200 text-gray-600 hover:border-purple-400"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    {errors.sizes && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.sizes}
                      </p>
                    )}
                  </Field>

                  <Field label="Colors (comma separated)">
                    <input
                      value={form.colors}
                      onChange={(e) =>
                        setForm({ ...form, colors: e.target.value })
                      }
                      placeholder="Red, Blue, Green"
                      className={input()}
                    />
                  </Field>
                </div>

                {/* Images */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
                  <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
                    Product Images
                  </h2>

                  <Field
                    label="Image URLs (one per line)"
                    error={errors.images}
                  >
                    <textarea
                      rows={5}
                      value={form.images}
                      onChange={(e) => handleImageInput(e.target.value)}
                      placeholder={
                        "https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
                      }
                      className={input(errors.images)}
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Paste one image URL per line. First image will be the main
                      display image.
                    </p>
                  </Field>

                  {/* Image Previews */}
                  {previewImages.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Preview ({previewImages.length} images)
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        {previewImages.map((url, i) => (
                          <div key={i} className="relative">
                            <img
                              src={url}
                              alt={`preview-${i}`}
                              className="w-20 h-20 object-cover rounded-xl border border-purple-100"
                              onError={(e) => {
                                e.target.src = "";
                                e.target.className =
                                  "w-20 h-20 rounded-xl border border-red-200 bg-red-50";
                              }}
                            />
                            {i === 0 && (
                              <span className="absolute -top-1 -left-1 bg-purple-600 text-white text-xs px-1 rounded">
                                Main
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-xl font-bold transition-colors"
                  >
                    {editId ? "Update Product" : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(emptyForm);
                      setPreviewImages([]);
                      setEditId(null);
                      setErrors({});
                      setTab("products");
                    }}
                    className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-600 py-3.5 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Orders Tab ── */}
          {tab === "orders" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Orders{" "}
                  <span className="text-purple-600">
                    ({filteredOrders.length}/{orders.length})
                  </span>
                </h1>
                <button
                  onClick={async () => {
                    try {
                      setOrdersLoading(true);

                      const data = await api.getOrders();

                      // console.log("Orders refreshed:", data);

                      setOrders(data || []);
                    } catch (err) {
                      console.error("Failed to refresh orders:", err);
                    } finally {
                      setOrdersLoading(false);
                    }
                  }}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  🔄 Refresh
                </button>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      const today = new Date()
                        .toLocaleDateString("en-IN")
                        .replaceAll("/", "-");

                      exportOrdersCSV(
                        filteredOrders,
                        "ALL",
                        `${statusFilter || "all"}_orders_${today}.csv`,
                      );
                    }}
                    className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-xl text-sm"
                  >
                    ⬇️ Download Orders Data
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search by customer name, email or order number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-96 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-4 py-2 rounded-xl ${
                    statusFilter === "ALL"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  📦 All
                </button>

                <button
                  onClick={() => setStatusFilter("PENDING")}
                  className={`px-4 py-2 rounded-xl ${
                    statusFilter === "PENDING"
                      ? "bg-yellow-500 text-white"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  ⏳ Pending
                </button>

                <button
                  onClick={() => setStatusFilter("CONFIRMED")}
                  className={`px-4 py-2 rounded-xl ${
                    statusFilter === "CONFIRMED"
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  ✅ Confirmed
                </button>

                <button
                  onClick={() => setStatusFilter("DELIVERED")}
                  className={`px-4 py-2 rounded-xl ${
                    statusFilter === "DELIVERED"
                      ? "bg-green-500 text-white"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  🚚 Delivered
                </button>

                <button
                  onClick={() => setStatusFilter("CANCELLED")}
                  className={`px-4 py-2 rounded-xl ${
                    statusFilter === "CANCELLED"
                      ? "bg-red-500 text-white"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  ❌ Cancelled
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow border">
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <h2 className="text-2xl font-bold">{totalOrders}</h2>
                </div>

                <div className="bg-yellow-50 p-4 rounded-xl shadow border">
                  <p className="text-yellow-600 text-sm">Pending</p>
                  <h2 className="text-2xl font-bold">{pendingCount}</h2>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl shadow border">
                  <p className="text-blue-600 text-sm">Confirmed</p>
                  <h2 className="text-2xl font-bold">{confirmedCount}</h2>
                </div>

                <div className="bg-green-50 p-4 rounded-xl shadow border">
                  <p className="text-green-600 text-sm">Delivered</p>
                  <h2 className="text-2xl font-bold">{deliveredCount}</h2>
                </div>

                <div className="bg-red-50 p-4 rounded-xl shadow border">
                  <p className="text-red-600 text-sm">Cancelled</p>
                  <h2 className="text-2xl font-bold">{cancelledCount}</h2>
                </div>

                <div className="bg-purple-50 p-4 rounded-xl shadow border">
                  <p className="text-purple-600 text-sm">Revenue</p>
                  <h2 className="text-2xl font-bold">
                    ₹{totalRevenue.toLocaleString()}
                  </h2>
                </div>
              </div>

              {ordersLoading ? (
                <div className="text-center py-20 text-gray-400">
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm text-gray-400">
                  <p className="text-4xl mb-3">📦</p>
                  <p>No orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const items = order.items || [];
                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-bold text-gray-800">
                              Order #{order.orderNumber || order.id}
                            </p>
                            <p className="text-sm text-gray-500">
                              <strong>Customer: </strong>
                              {order.customerName}
                            </p>

                            <p className="text-xs text-gray-500">
                              <strong>Email: </strong>
                              {order.customerEmail}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              <strong>Date: </strong>
                              {order.createdAt?.toDate
                                ? order.createdAt
                                    .toDate()
                                    .toLocaleString("en-IN")
                                : "Date unavailable"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                order.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : order.status === "CONFIRMED"
                                    ? "bg-blue-100 text-blue-700"
                                    : order.status === "DELIVERED"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-600"
                              }`}
                            >
                              {order.status}
                            </span>
                            <span className="font-bold text-purple-700">
                              ₹{order.totalAmount}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1 mb-4">
                          {items.map((item, i) => (
                            <div
                              key={i}
                              className="flex justify-between text-sm text-gray-600"
                            >
                              <span>
                                {item.name} {item.size && `(${item.size})`} ×{" "}
                                {item.qty}
                              </span>
                              <span>₹{item.price * item.qty}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-lg text-sm"
                        >
                          👁 View Details
                        </button>
                        <div className="flex gap-2 flex-wrap">
                          {(() => {
                            const allowed = {
                              PENDING: ["CONFIRMED", "CANCELLED"],
                              CONFIRMED: ["DELIVERED", "CANCELLED"],
                              DELIVERED: [],
                              CANCELLED: [],
                            };
                            return (allowed[order.status] || []).map((s) => (
                              <button
                                key={s}
                                onClick={async () => {
                                  try {
                                    await updateDoc(
                                      doc(db, "orders", order.id),
                                      {
                                        status: s,
                                      },
                                    );

                                    setOrders((prev) =>
                                      prev.map((o) =>
                                        o.id === order.id
                                          ? { ...o, status: s }
                                          : o,
                                      ),
                                    );
                                  } catch (err) {
                                    console.error("Status update failed:", err);
                                  }
                                }}
                              >
                                {s === "CONFIRMED"
                                  ? "✅ Confirm"
                                  : s === "DELIVERED"
                                    ? "🚚 Mark Delivered"
                                    : "❌ Cancel"}
                              </button>
                            ));
                          })()}
                        </div>
                      </div>
                    );
                  })}
                  {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-bold">Order Details</h2>

                          <button
                            onClick={() => setSelectedOrder(null)}
                            className="text-red-500 font-bold"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-2 mb-6">
                          <p>
                            <strong>Order Number:</strong>{" "}
                            {selectedOrder.orderNumber}
                          </p>

                          <p>
                            <strong>Customer:</strong>{" "}
                            {selectedOrder.customerName}
                          </p>

                          <p>
                            <strong>Email:</strong>{" "}
                            {selectedOrder.customerEmail}
                          </p>

                          <p>
                            <strong>Status:</strong> {selectedOrder.status}
                          </p>

                          <p>
                            <strong>Total:</strong> ₹{selectedOrder.totalAmount}
                          </p>
                        </div>

                        <h3 className="font-bold text-lg mb-3">Products</h3>

                        <div className="space-y-4">
                          {selectedOrder.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex gap-4 border rounded-xl p-3"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />

                              <div>
                                <h4 className="font-semibold">{item.name}</h4>

                                <p>Size: {item.size || "-"}</p>

                                <p>Qty: {item.qty}</p>

                                <p>Price: ₹{item.price}</p>

                                <p className="font-bold">
                                  Total: ₹{item.price * item.qty}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {tab === "changePassword" && <ChangePassword />}
        </main>

        {/* Delete Confirm Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-6 w-80 shadow-xl text-center">
              <p className="text-4xl mb-3">🗑</p>
              <h3 className="font-bold text-gray-800 mb-2">Delete Product?</h3>
              <p className="text-gray-500 text-sm mb-5">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteProduct(deleteConfirm);
                    setDeleteConfirm(null);
                    setSuccess("Product deleted.");
                    setTimeout(() => setSuccess(""), 3000);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-semibold text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper components
function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600 block mb-1">
        {label}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function input(error) {
  return `w-full border ${error ? "border-red-400" : "border-gray-200"} rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50`;
}
