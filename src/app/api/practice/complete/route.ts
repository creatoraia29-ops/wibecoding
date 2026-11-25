import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/session";
import { updateUser } from "@/lib/store";

export async function POST(req: Request) {
  const { userId } = await getSessionUserId();
  const body = (await req.json().catch(() => ({}))) as {
    lessonId?: string;
    type?: "lesson" | "task" | "quiz";
    score?: number;
  };

  if (!body.lessonId || !body.type) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const lessonId = body.lessonId;

  const user = updateUser(userId, (u) => {
    const completedLessons = new Set(u.completedLessons);
    const solvedTasks = new Set(u.solvedTasks);
    const quizScores = { ...u.quizScores };

    if (body.type === "lesson") {
      completedLessons.add(lessonId);
    } else if (body.type === "task") {
      solvedTasks.add(lessonId);
    } else if (body.type === "quiz" && typeof body.score === "number") {
      quizScores[lessonId] = Math.max(quizScores[lessonId] ?? 0, body.score);
    }

    return {
      ...u,
      completedLessons: Array.from(completedLessons),
      solvedTasks: Array.from(solvedTasks),
      quizScores,
    };
  });

  return NextResponse.json({
    completedLessons: user.completedLessons,
    solvedTasks: user.solvedTasks,
    quizScores: user.quizScores,
  });
}
