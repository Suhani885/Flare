import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rate-limit";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ENTREPRENEUR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Not authorized to upload images." }, { status: 403 });
  }

  const attempt = rateLimit(`upload:${session.user.id}`, 30, 60 * 60 * 1000);
  if (!attempt.allowed) {
    return NextResponse.json(
      { message: "Too many uploads. Please try again later." },
      { status: 429 }
    );
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    return NextResponse.json(
      { message: "Image uploads aren't configured yet. Please try again later." },
      { status: 503 }
    );
  }

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { message: "Only JPEG, PNG, WebP, or AVIF images are allowed." },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ message: "Image must be under 5MB." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "flare/products",
      resource_type: "image",
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ message: "Image upload failed. Please try again." }, { status: 500 });
  }
}
