import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";

const usersCollection = collection(db, "users");

export const signUp = async (userData: any) => {
  try {
    // 1. Hash password sebelum simpen (Manual Security)
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(userData.password, salt);

    // 2. Simpan ke Firestore collection 'users'
    const docRef = await addDoc(usersCollection, {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: "operator",
      createdAt: new Date().toISOString()
    });
    
    return { status: true, id: docRef.id };
  } catch (error) {
    return { status: false, message: error };
  }
};

export const signIn = async (email: string, pass: string) => {
  try {
    // 1. Cari user berdasarkan email
    const q = query(usersCollection, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return { status: false, message: "User kaga ada!" };

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // 2. Cek Password (Bandingin teks biasa sama yang di-hash)
    const isMatch = bcrypt.compareSync(pass, userData.password);

    if (isMatch) {
      return { 
        status: true, 
        data: { id: userDoc.id, name: userData.name, email: userData.email } 
      };
    } else {
      return { status: false, message: "Password salah!" };
    }
  } catch (error) {
    return { status: false, message: error };
  }
};