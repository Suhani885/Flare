import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { razorpay, PREMIUM_PRICE_PAISE } from "@/lib/razorpay";

const bodySchema = z.object({
  purpose: z.enum(["product", "subscription"]),
  productId: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Please sign in to buy." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }
  const { purpose, productId } = parsed.data;
  const userId = session.user.id;

  try {
    if (purpose === "subscription") {
      const razorpayOrder = await razorpay.orders.create({
        amount: PREMIUM_PRICE_PAISE,
        currency: "INR",
        receipt: `sub_${userId}_${Date.now()}`,
      });

      const subscription = await prisma.subscription.create({
        data: {
          userId,
          razorpayOrderId: razorpayOrder.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      return NextResponse.json({
        razorpayOrderId: razorpayOrder.id,
        amount: PREMIUM_PRICE_PAISE,
        recordId: subscription.id,
      });
    }

    const product = productId && (await prisma.product.findUnique({ where: { id: productId } }));
    if (!product || product.status !== "APPROVED" || product.isExternal || product.stock < 1) {
      return NextResponse.json({ message: "This product isn't available." }, { status: 400 });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: product.price,
      currency: "INR",
      receipt: `order_${userId}_${Date.now()}`,
    });

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: product.price,
        razorpayOrderId: razorpayOrder.id,
        items: { create: [{ productId: product.id, quantity: 1, price: product.price }] },
      },
    });

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: product.price,
      recordId: order.id,
    });
  } catch (error) {
    console.error("Razorpay create-order error:", error);
    return NextResponse.json(
      { message: "Could not start checkout. Please try again." },
      { status: 502 }
    );
  }
}
