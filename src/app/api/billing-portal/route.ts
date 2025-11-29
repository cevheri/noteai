
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Autumn as autumn } from "autumn-js";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {}

  const { returnUrl } = body as { returnUrl?: string };

  try {
    const res = await autumn.customers.billingPortal(session.user.id, {
      return_url: returnUrl || undefined,
    } as any);

    const url = res?.data?.url || res?.url;

    if (!url) {
      return NextResponse.json(
        { error: "Failed to generate billing portal URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to generate billing portal URL", message: err.message },
      { status: 500 }
    );
  }
}
