import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hairAnswersSchema } from "@/lib/validations/analysis";
import { runAnalysis, AnalysisGenerationError } from "@/lib/analysis-service";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ message: "Please sign in to run an analysis." }, { status: 401 });
  }

  const attempt = rateLimit(`analysis:${session.user.id}`, 15, 60 * 60 * 1000);
  if (!attempt.allowed) {
    return NextResponse.json(
      { message: "You've reached the analysis limit for now. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = hairAnswersSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Invalid quiz answers." }, { status: 400 });
  }

  try {
    const result = await runAnalysis({
      kind: "hair",
      answers: parsed.data,
      userId: session.user.id,
      tier: session.user.subscriptionTier,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AnalysisGenerationError) {
      return NextResponse.json({ message: error.message }, { status: 502 });
    }
    return NextResponse.json(
      { message: "Something went wrong generating your analysis." },
      { status: 500 }
    );
  }
}
