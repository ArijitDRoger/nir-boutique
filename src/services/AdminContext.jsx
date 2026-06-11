import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Check admin session on refresh
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        setAdmin({
          uid: user.uid,
          email: user.email,
          ...adminSnap.data(),
        });
      } else {
        setAdmin(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 🔐 ADMIN LOGIN FUNCTION (THIS WAS MISSING)
  async function adminLogin(email, password) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);

      const user = cred.user;

      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        await signOut(auth);
        return false;
      }

      setAdmin({
        uid: user.uid,
        email: user.email,
        ...adminSnap.data(),
      });

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  // 🚪 LOGOUT
  async function adminLogout() {
    await signOut(auth);
    setAdmin(null);
  }

  return (
    <AdminContext.Provider
      value={{
        admin,
        loading,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
