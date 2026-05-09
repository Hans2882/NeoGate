import { db } from "./firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { rtdb } from "./firebase";
import { ref, onValue, set, push, serverTimestamp } from "firebase/database";

const usersCollection = collection(db, "users");

export const signIn = async (email: string, pass: string) => {
  try {
    // 1. Cari user berdasarkan email
    const q = query(usersCollection, where("email", "==", email.trim().toLowerCase()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return { status: false, message: "User kaga ada!" };

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.isActive === false) {
      return { status: false, message: "Akun nonaktif. Hubungi superadmin."};
    }

    const role = userData.role || "operator";
    if (role !== "operator" && role !== "admin" && role !== "superadmin") {
      return { status: false, message: "Role akun tidak valid." };
    }

    // 2. Cek Password (Bandingin teks biasa sama yang di-hash)
    const isMatch = bcrypt.compareSync(pass, userData.password);

    if (isMatch) {
      const userName = userData.name || userData.fullname || userData.fullName || userData.displayName;

      return {
        status: true,
        data: { id: userDoc.id, name: userName, email: userData.email, role }
      };
    } else {
      return { status: false, message: "Password salah!" };
    }
  } catch (error) {
    return { status: false, message: error };
  }
};

export const createOperatorByAdmin = async (payload: { name: string; email: string; password: string; createdBy?: string }) => {
  try {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const q = query(usersCollection, where("email", "==", normalizedEmail));
    const existing = await getDocs(q);

    if (!existing.empty) {
      return { status: false, message: "Email sudah terdaftar." };
    }

    const hashedPassword = bcrypt.hashSync(payload.password, bcrypt.genSaltSync(10));
    const docRef = await addDoc(usersCollection, {
      name: payload.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "operator",
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: payload.createdBy || "admin"
    });

    return { status: true, id: docRef.id };
  } catch (error) {
    return { status: false, message: error };
  }
};

export const listenSystemStatus = (callback: (data: any) => void) => {
  const statusRef = ref(rtdb, 'system_monitor');
  return onValue(statusRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

export const listenActivities = (callback: (data: any[]) => void) => {
  const activityRef = ref(rtdb, 'activities');
  return onValue(activityRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Konversi objek JSON Firebase ke Array agar bisa di-map di table
      const formatted = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      })).reverse(); // Data terbaru di atas
      callback(formatted);
    } else {
      callback([]);
    }
  });
};

export const updateControlMode = async (mode: 'otomatis' | 'manual') => {
  try {
    await set(ref(rtdb, 'system_monitor/controlMode'), mode);
  } catch (error) {
    console.error("Gagal update mode:", error);
  }
};
