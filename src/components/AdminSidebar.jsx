import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import {
//   collection,
//   addDoc,
//   deleteDoc,
//   updateDoc,
//   doc,
//   onSnapshot,
// } from "firebase/firestore";
// import { db } from "../firebase";

export default function AdminSidebar({
  tab,
  setTab,
  adminLogout,
  setEditId,
  setForm,
  setPreviewImages,
  emptyForm,
}) {
  const navigate = useNavigate();

  const sidebarItems = [
    { key: "products", label: "All Products", icon: "👗" },
    { key: "add", label: "Add Product", icon: "➕" },
    { key: "orders", label: "Orders", icon: "📦" },
    {
      key: "changePassword",
      label: "Change Password",
      icon: "🔒",
    },
  ];

  // const [heroSlides, setHeroSlides] = useState([]);

  // const [heroForm, setHeroForm] = useState({
  //   imageUrl: "",
  //   title: "",
  //   subtitle: "",
  //   order: 1,
  //   active: true,
  // });

  // useEffect(() => {
  //   const unsub = onSnapshot(collection(db, "heroSlides"), (snap) => {
  //     setHeroSlides(
  //       snap.docs.map((d) => ({
  //         id: d.id,
  //         ...d.data(),
  //       })),
  //     );
  //   });

  //   return () => unsub();
  // }, []);

  // const addHeroSlide = async () => {
  //   await addDoc(collection(db, "heroSlides"), heroForm);

  //   setHeroForm({
  //     imageUrl: "",
  //     title: "",
  //     subtitle: "",
  //     order: 1,
  //     active: true,
  //   });
  // };

  return (
    <aside className="w-60 bg-purple-900 text-white fixed left-0 top-0 h-screen flex flex-col">
      <div className="p-6 border-b border-purple-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400">
            <img
              src="/nir_logo.jpg"
              alt="logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <p className="font-bold text-sm">Nir Boutique</p>
            <p className="text-purple-300 text-xs">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setTab(item.key);
              setEditId(null);
              setForm(emptyForm);
              setPreviewImages([]);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
              ${
                tab === item.key
                  ? "bg-purple-600 text-white"
                  : "text-purple-200 hover:bg-purple-800"
              }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-purple-700 space-y-2">
        {/* <button
          onClick={() => navigate("/")}
          className="w-full px-4 py-2 rounded-xl hover:bg-purple-800"
        >
          🏠 View Store
        </button> */}

        <button
          onClick={() => {
            adminLogout();
            navigate("/admin/login");
          }}
          className="w-full px-4 py-2 rounded-xl text-red-300 hover:bg-red-900/30"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
