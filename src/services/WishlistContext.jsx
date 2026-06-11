import { createContext, useContext, useEffect, useState } from "react";
import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  // const { user } = useAuth();
  const { user, loading } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // 🔄 realtime sync
  useEffect(() => {
    if (loading) return; // 🔥 IMPORTANT FIX
    if (!user) {
      setWishlist([]);
      return;
    }

    const ref = collection(db, "users", user.uid, "wishlist");

    const unsub = onSnapshot(
      ref,
      (snap) => {
        setWishlist(snap.docs.map((doc) => doc.data()));
      },
      (error) => {
        console.error("Wishlist snapshot error:", error);
      },
    );

    return () => unsub();
  }, [user, loading]);

  // ❤️ toggle wishlist
  async function toggleWishlist(product) {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "wishlist", product.id.toString());

    const exists = wishlist.find((i) => i.id === product.id);

    if (exists) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, product);
    }
  }

  function isWishlisted(id) {
    return wishlist.some((i) => i.id === id);
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
