import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mapAnalysisResult } from "@/lib/analysis-mapper";
import { AnalysisDetailView } from "@/components/analysis/analysis-detail-view";

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) notFound();

  const analysis = await prisma.analysis.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!analysis) notFound();

  const result = mapAnalysisResult(
    analysis.resultJson as unknown as Parameters<typeof mapAnalysisResult>[0]
  );

  return (
    <AnalysisDetailView result={result} type={analysis.type === "SKIN" ? "skin" : "hair"} />
  );
}
