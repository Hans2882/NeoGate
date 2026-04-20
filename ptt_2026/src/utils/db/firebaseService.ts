import { collection, getDocs, getFirestore, query, orderBy } from "firebase/firestore";
import app from "@/utils/db/firebase";

const db = getFirestore(app);

export async function retrieveData(collectionName: string) {
  const q = query(collection(db, collectionName), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return data;
}