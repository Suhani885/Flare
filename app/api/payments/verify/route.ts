import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  purpose: z.enum(["product", "subscription"]),
  recordId: z.string(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Please sign in." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }
  const { purpose, recordId, razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    parsed.data;

  const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ message: "Payment verification failed." }, { status: 400 });
  }

  if (purpose === "subscription") {
    const subscription = await prisma.subscription.findUnique({ where: { id: recordId } });
    if (!subscription || subscription.userId !== session.user.id) {
      return NextResponse.json({ message: "Subscription not found." }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.subscription.update({
        where: { id: recordId },
        data: { status: "PAID", razorpayPaymentId: razorpay_payment_id },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: { subscriptionTier: "PREMIUM" },
      }),
    ]);

    return NextResponse.json({ ok: true });
  }

  const order = await prisma.order.findUnique({ where: { id: recordId }, include: { items: true } });
  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: recordId },
      data: { status: "PAID", razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature },
    }),
    ...order.items.map((item) =>
      prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    ),
  ]);

  return NextResponse.json({ ok: true });
}
