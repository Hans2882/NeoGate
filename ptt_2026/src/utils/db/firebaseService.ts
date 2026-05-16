import { db } from "./firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { rtdb } from "./firebase";
import { ref, onValue, set, push, serverTimestamp } from "firebase/database";

const usersCollection = collection(db, "users");

const getGateFromRole = (role?: string | null) => {
  if (role === "operator1") return "gate1";
  if (role === "operator2") return "gate2";
  return null;
};

const getRoleFromGate = (gate?: string | null) => {
  if (gate === "gate1") return "operator1";
  if (gate === "gate2") return "operator2";
  return "operator";
};

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
    if (role !== "operator" && role !== "operator1" && role !== "operator2" && role !== "admin" && role !== "superadmin") {
      return { status: false, message: "Role akun tidak valid." };
    }

    // 2. Cek Password (Bandingin teks biasa sama yang di-hash)
    const isMatch = bcrypt.compareSync(pass, userData.password);

    if (isMatch) {
      const userName = userData.name || userData.fullname || userData.fullName || userData.displayName;
      const gate = userData.gate || getGateFromRole(role);

      return {
        status: true,
        data: { id: userDoc.id, name: userName, email: userData.email, role, gate }
      };
    } else {
      return { status: false, message: "Password salah!" };
    }
  } catch (error) {
    return { status: false, message: error };
  }
};

export const createOperatorByAdmin = async (payload: {
  name: string;
  email: string;
  password: string;
  gate: 'gate1' | 'gate2';
  role?: 'operator1' | 'operator2' | 'operator';
  createdBy?: string;
}) => {
  try {
    const normalizedEmail = payload.email.trim().toLowerCase();
    const q = query(usersCollection, where("email", "==", normalizedEmail));
    const existing = await getDocs(q);

    if (!existing.empty) {
      return { status: false, message: "Email sudah terdaftar." };
    }

    const assignedGate = payload.gate;
    const assignedRole = payload.role || getRoleFromGate(assignedGate);

    const hashedPassword = bcrypt.hashSync(payload.password, bcrypt.genSaltSync(10));
    const docRef = await addDoc(usersCollection, {
      name: payload.name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: assignedRole,
      gate: assignedGate,
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

const formatSessionTime = (sessionId: string) => {
  const match = sessionId.match(/^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/);

  if (!match) {
    return sessionId;
  }

  const [, year, month, day, hour, minute, second] = match;
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );

  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
};

const formatBoolean = (value: unknown) => {
  if (value === true) return "true";
  if (value === false) return "false";
  if (value === null || value === undefined) return "-";
  return String(value);
};

const isSessionLike = (value: unknown) => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, any>;
  return (
    Object.prototype.hasOwnProperty.call(candidate, "control") ||
    Object.prototype.hasOwnProperty.call(candidate, "status") ||
    Object.prototype.hasOwnProperty.call(candidate, "limits") ||
    Object.prototype.hasOwnProperty.call(candidate, "system_monitor")
  );
};

const buildActivityRows = (gateName: string, gateData: Record<string, any> | null | undefined) => {
  if (!gateData) {
    return [];
  }

  const entries = isSessionLike(gateData)
    ? [["live", gateData] as [string, Record<string, any>]]
    : Object.entries(gateData).filter(([, sessionValue]) => isSessionLike(sessionValue)) as Array<
        [string, Record<string, any>]
      >;

  return entries
    .map(([sessionId, sessionValue]) => {
      const session = sessionValue as Record<string, any>;
      const control = (session.control || {}) as Record<string, any>;
      const status = (session.status || {}) as Record<string, any>;
      const systemMonitor = (session.system_monitor || {}) as Record<string, any>;
      const limits = (session.limits || {}) as Record<string, any>;

      return {
        id: `${gateName}-${sessionId}`,
        time: formatSessionTime(sessionId),
        gate: gateName.toUpperCase(),
        sessionId,
        gateState: status.gate_state || "UNKNOWN",
        keretaLewat: formatBoolean(status.kereta_lewat),
        bahaya: formatBoolean(systemMonitor.bahaya ?? session.bahaya),
        control: `servo_pos: ${control.servo_pos ?? "-"}, buzzer: ${formatBoolean(control.buzzer)}`,
        limits: `close1: ${formatBoolean(limits.close1)}, close2: ${formatBoolean(limits.close2)}, open1: ${formatBoolean(limits.open1)}, open2: ${formatBoolean(limits.open2)}`
      };
    })
    .sort((a, b) => b.sessionId.localeCompare(a.sessionId));
};

export const listenActivities = (
  callback: (data: any[]) => void,
  gateFilter?: 'gate1' | 'gate2' | null,
  onError?: (message: string) => void
) => {
  if (gateFilter === 'gate1' || gateFilter === 'gate2') {
    const gateRef = ref(rtdb, gateFilter);
    const unsubscribeGate = onValue(gateRef, (snapshot) => {
      const gateData = snapshot.val();
      callback(buildActivityRows(gateFilter, gateData));
    }, (error) => {
      onError?.(error.message || 'Gagal membaca data aktivitas dari Realtime Database.');
      callback([]);
    });

    return () => {
      unsubscribeGate();
    };
  }

  const gate1Ref = ref(rtdb, 'gate1');
  const gate2Ref = ref(rtdb, 'gate2');

  let gate1Data: Record<string, any> | null = null;
  let gate2Data: Record<string, any> | null = null;

  const emit = () => {
    const rows = [
      ...buildActivityRows('gate1', gate1Data),
      ...buildActivityRows('gate2', gate2Data)
    ];

    callback(rows);
  };

  const unsubscribeGate1 = onValue(gate1Ref, (snapshot) => {
    gate1Data = snapshot.val();
    emit();
  }, (error) => {
    onError?.(error.message || 'Gagal membaca data gate1 dari Realtime Database.');
  });

  const unsubscribeGate2 = onValue(gate2Ref, (snapshot) => {
    gate2Data = snapshot.val();
    emit();
  }, (error) => {
    onError?.(error.message || 'Gagal membaca data gate2 dari Realtime Database.');
  });

  return () => {
    unsubscribeGate1();
    unsubscribeGate2();
  };
};

export const updateControlMode = async (mode: 'otomatis' | 'manual') => {
  try {
    await set(ref(rtdb, 'system_monitor/controlMode'), mode);
  } catch (error) {
    console.error("Gagal update mode:", error);
  }
};
