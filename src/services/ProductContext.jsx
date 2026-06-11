import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const unsub = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setProducts(data);
        setProductsLoading(false);
      },
      (error) => {
        console.error("Snapshot error:", error);
        setProductsLoading(false);
      },
    );

    return () => unsub();
  }, [authLoading]);

  async function addProduct(product) {
    const docRef = await addDoc(collection(db, "products"), product);

    const newProduct = {
      id: docRef.id,
      ...product,
    };

    setProducts((prev) => [newProduct, ...prev]);

    return newProduct;
  }

  async function updateProduct(id, updated) {
    await updateDoc(doc(db, "products", id), updated);

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    );
  }

  async function deleteProduct(id) {
    await deleteDoc(doc(db, "products", id));

    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        loading: productsLoading,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
