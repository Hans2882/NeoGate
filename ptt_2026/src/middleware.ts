import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import withAuth from "./middleware/withAuth";

export function mainMiddleware(req: NextRequest) {
  return NextResponse.next();
}

// Daftar rute yang harus login dulu (Dashboard & Admin)
export default withAuth(mainMiddleware, ["/dashboard", "/admin", "/profile"]);