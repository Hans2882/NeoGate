import { retrieveData } from "@/utils/db/firebaseService";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const data = await retrieveData("train_activities");
    res.status(200).json({ status: true, statusCode: 200, data });
  } else {
    res.status(405).json({ status: false, statusCode: 405, message: "Method Not Allowed" });
  }
}