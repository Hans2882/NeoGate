import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/utils/db/firebase";

type CreateUserPayload = {
  name?: string;
  email?: string;
  password?: string;
  role?: "operator" | "admin" | "superadmin";
};

type ApiResponse =
  | { status: true; message: string; id: string }
  | { status: false; message: string };

const usersCollection = collection(db, "users");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: false, message: "Method not allowed" });
  }

  const adminKey = req.headers["x-superadmin-key"];
  if (!adminKey || adminKey !== process.env.SUPERADMIN_KEY) {
    return res.status(401).json({ status: false, message: "Unauthorized" });
  }

  const { name, email, password, role }: CreateUserPayload = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ status: false, message: "name, email, password wajib diisi" });
  }

  if (password.length < 6) {
    return res.status(400).json({ status: false, message: "Password minimal 6 karakter" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const q = query(usersCollection, where("email", "==", normalizedEmail));
  const existing = await getDocs(q);
  if (!existing.empty) {
    return res.status(409).json({ status: false, message: "Email sudah terdaftar" });
  }

  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

  const docRef = await addDoc(usersCollection, {
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: role || "operator",
    isActive: true,
    createdAt: new Date().toISOString(),
    createdBy: "superadmin"
  });

  return res.status(201).json({
    status: true,
    message: "User berhasil dibuat",
    id: docRef.id
  });
}
