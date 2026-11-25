import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getLessonById } from "@/data/curriculum";
import type { Locale } from "@/lib/i18n";
import { canAccessLesson, getQuotaStatus } from "@/lib/quota";
import { getSessionUserId } from "@/lib/session";
import { getOrCreateUser } from "@/lib/store";

const MODEL_NAME = "gemini-3.5-flash-lite";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildDemoReply(params: {
  locale: Locale;
  lessonTitle: string;
  userMessage: string;
  isPromptReview: boolean;
  requirements: string[];
}): string {
  const { locale, lessonTitle, userMessage, isPromptReview, requirements } =
    params;

  if (locale === "ru") {
    if (isPromptReview) {
      const lengthScore = Math.min(10, Math.max(5, Math.floor(userMessage.length / 25)));
      return [
        `### Разбор промпта (Demo • ${MODEL_NAME})`,
        `**Урок:** ${lessonTitle}`,
        `**Предварительная оценка:** ${lengthScore}/10`,
        "",
        "**Сильные стороны:**",
        "- Чётко обозначено намерение и направление задачи.",
        "",
        "**Что усилить по чеклисту урока:**",
        ...requirements.map((r) => `- Проверь, явно ли указано: *${r}*`),
        "",
        "**Совет репетитора:** Добавь секции `<context>`, `<constraints>` и точную команду проверки (например, `npm run build`), чтобы ИИ-редактор не делал лишних правок.",
      ].join("\n");
    }

    return [
      `Отличный вопрос по теме «${lessonTitle}»! *(Demo-режим без GEMINI_API_KEY • целевая модель: ${MODEL_NAME})*`,
      "",
      "В вайб-кодинге главное — давать ИИ конкретный контекст и ограничения:",
      "1. Укажи точные файлы и стек технологий.",
      "2. Разбей сложную фичу на 2–3 маленьких шага.",
      "3. Всегда прикладывай полный текст ошибки или ожидаемый результат.",
      "",
      "Попробуй сформулировать свой промпт во вкладке «Задача по промпту» и нажми «Проверить промпт с ИИ»!",
    ].join("\n");
  }

  if (isPromptReview) {
    const lengthScore = Math.min(10, Math.max(5, Math.floor(userMessage.length / 25)));
    return [
      `### Prompt Review (Demo • ${MODEL_NAME})`,
      `**Lesson:** ${lessonTitle}`,
      `**Estimated Score:** ${lengthScore}/10`,
      "",
      "**Strengths:**",
      "- Clear intent and direction for the coding agent.",
      "",
      "**Checklist Improvements:**",
      ...requirements.map((r) => `- Make sure you explicitly specify: *${r}*`),
      "",
      "**Tutor Tip:** Separate `<context>` and `<constraints>`, and include a verification command like `npm run build` so the AI self-checks its work.",
    ].join("\n");
  }

  return [
    `Great question about "${lessonTitle}"! *(Demo mode without GEMINI_API_KEY • target model: ${MODEL_NAME})*`,
    "",
    "In vibe coding, precision beats length:",
    "1. Specify your exact files and tech stack.",
    "2. Break large features into 2–3 small iterations.",
    "3. Always include expected vs actual behavior when debugging.",
    "",
    "Try drafting your prompt in the 'Prompt Task' tab and click 'Evaluate Prompt with AI'!",
  ].join("\n");
}

export async function POST(req: Request) {
  const { userId } = await getSessionUserId();
  const user = getOrCreateUser(userId);

  const body = (await req.json().catch(() => ({}))) as {
    lessonId?: string;
    locale?: Locale;
    messages?: ChatMessage[];
    isPromptReview?: boolean;
  };

  const locale: Locale = body.locale === "en" ? "en" : "ru";
  const lesson = body.lessonId ? getLessonById(body.lessonId) : undefined;

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  if (!canAccessLesson(user.plan, lesson.isFree)) {
    return NextResponse.json(
      { error: "PRO subscription required for this lesson" },
      { status: 403 }
    );
  }

  const quota = getQuotaStatus({
    plan: user.plan,
    usedSecondsToday: user.usedSecondsToday,
    lastResetAt: user.lastResetAt,
    tzOffsetMinutes: user.tzOffsetMinutes,
  });

  if (quota.limitReached) {
    return NextResponse.json(
      { error: "Daily practice limit reached" },
      { status: 403 }
    );
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  const latestUserMsg =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  if (!latestUserMsg.trim()) {
    return NextResponse.json({ error: "Empty message" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const reply = buildDemoReply({
      locale,
      lessonTitle: lesson.title[locale],
      userMessage: latestUserMsg,
      isPromptReview: Boolean(body.isPromptReview),
      requirements: lesson.promptTask.requirements[locale],
    });
    return NextResponse.json({ reply, model: MODEL_NAME, demo: true });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction =
      locale === "ru"
        ? `Ты — персональный ИИ-репетитор по вайб-кодингу (Vibe Coding).
Текущий урок: "${lesson.title.ru}" (${lesson.subtitle.ru}).
Практическая задача урока: "${lesson.promptTask.goal.ru}".
Требования к задаче: ${lesson.promptTask.requirements.ru.join("; ")}.
Отвечай кратко, дружелюбно, по делу и на русском языке. Если ученик прислал промпт на проверку, оцени его по 10-балльной шкале, отметь плюсы и предложи улучшенный вариант.`
        : `You are a personal Vibe Coding AI Tutor.
Current lesson: "${lesson.title.en}" (${lesson.subtitle.en}).
Hands-on task: "${lesson.promptTask.goal.en}".
Task requirements: ${lesson.promptTask.requirements.en.join("; ")}.
Respond concisely, clearly, and encouragingly in English. If the student submits a prompt for review, score it out of 10, highlight strengths, and provide an improved version.`;

    const conversationText = messages
      .slice(-8)
      .map((m) => `${m.role === "user" ? "Student" : "Tutor"}: ${m.content}`)
      .join("\n\n");

    const generateWithRetry = async () => {
      try {
        return await ai.models.generateContent({
          model: MODEL_NAME,
          contents: conversationText,
          config: {
            systemInstruction,
            temperature: 0.5,
            maxOutputTokens: 900,
          },
        });
      } catch (firstErr) {
        const status = (firstErr as { status?: number })?.status;
        if (status === 503 || status === 429) {
          await new Promise((r) => setTimeout(r, 700));
          return await ai.models.generateContent({
            model: MODEL_NAME,
            contents: conversationText,
            config: {
              systemInstruction,
              temperature: 0.5,
              maxOutputTokens: 900,
            },
          });
        }
        throw firstErr;
      }
    };

    const response = await generateWithRetry();

    const reply =
      response.text ??
      (locale === "ru"
        ? "Не удалось получить ответ от модели. Попробуй ещё раз."
        : "Could not get a response from the model. Please try again.");

    return NextResponse.json({ reply, model: MODEL_NAME, demo: false });
  } catch (err) {
    console.error("Gemini API error:", err);
    const fallback = buildDemoReply({
      locale,
      lessonTitle: lesson.title[locale],
      userMessage: latestUserMsg,
      isPromptReview: Boolean(body.isPromptReview),
      requirements: lesson.promptTask.requirements[locale],
    });
    return NextResponse.json({
      reply: fallback,
      model: MODEL_NAME,
      demo: true,
    });
  }
}
