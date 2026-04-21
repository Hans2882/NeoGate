import { db } from "@/utils/db/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const q = query(
      collection(db, "Train_activity"),
      orderBy("timestamp", "desc"),
      limit(5)
    );

    const querySnapshot = await getDocs(q);

    const activities = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      let formattedTime = "00:00";
      if (data.timestamp && data.timestamp.toDate) {
        const date = data.timestamp.toDate();
        formattedTime = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      } else if (data.timestamp?.seconds) {
        const date = new Date(data.timestamp.seconds * 1000);
        formattedTime = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      }

      return {
        id: doc.id,
        time: formattedTime,
        name: data['train_name'] || "Tanpa Nama",
        status: data['status '] || "UNKNOWN",
        direction: data['direction'] || "Unknown",
      };
    });

    res.status(200).json({ status: true, data: activities });
  } catch (error) {
    console.error("Firestore Error:", error);
    res.status(500).json({ status: false, data: [] });
  }
}