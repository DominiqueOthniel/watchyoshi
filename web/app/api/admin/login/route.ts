import { NextResponse } from "next/server";
import {
  adminCookie,
  createSessionToken,
  credentialsConfigured,
  credentialsMatch,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    if (!credentialsConfigured()) {
      return NextResponse.json(
        { error: "Admin credentials are not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const email = String(body.email || "");
    const password = String(body.password || "");

    if (!credentialsMatch(email, password)) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = await createSessionToken(email);
    const res = NextResponse.json({ ok: true });
    res.cookies.set(adminCookie.name, token, adminCookie.options);
    return res;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
