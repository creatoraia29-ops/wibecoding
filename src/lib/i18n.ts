export type Locale = "ru" | "en";

export const dictionary = {
  ru: {
    brand: "VibeCode AI",
    nav: {
      home: "Главная",
      dashboard: "Кабинет",
      curriculum: "Программа",
      pricing: "Тарифы",
      startLearning: "Начать учиться",
    },
    hero: {
      badge: "Персональный ИИ-репетитор • Gemini 3.5 Flash-Lite",
      title: "Освой Вайб-кодинг с личным ИИ-наставником",
      subtitle:
        "Научись создавать реальные проекты с помощью промптов, Cursor, Claude Code и Replit. Практика, квизы, разбор ошибок и деплой — от нуля до продакшена.",
      ctaPrimary: "Начать бесплатно (5 уроков)",
      ctaSecondary: "Смотреть тариф PRO",
      stats: {
        stages: "3 этапа обучения",
        levels: "6 уровней сложности",
        reset: "Сброс Free в 12:00",
      },
    },
    stages: {
      title: "Путь обучения: 3 этапа и 6 уровней",
      subtitle:
        "Структурированная программа, которая превращает новичка в уверенного AI-инженера.",
      beginner: {
        name: "Начальный",
        tag: "Уровни 1–2 • Free",
        desc: "Основы вайб-кодинга, структура сильного промпта, итерации и первый дебаг.",
      },
      advanced: {
        name: "Продвинутый",
        tag: "Уровни 3–4 • PRO",
        desc: "Работа в Cursor, Claude Code и Replit, управление контекстом, .cursorrules и CLAUDE.md.",
      },
      expert: {
        name: "Эксперт",
        tag: "Уровни 5–6 • PRO",
        desc: "Автотесты, поиск багов, устранение галлюцинаций ИИ и публикация готовых проектов.",
      },
    },
    pricing: {
      title: "Простые и честные тарифы",
      subtitle:
        "Начни с 15 минут бесплатной практики каждый день или открой безграничный PRO через Stripe.",
      free: {
        name: "Free",
        price: "$0",
        period: "/ навсегда",
        desc: "Идеально для знакомства с вайб-кодингом.",
        features: [
          "15 минут практики в день (сброс ровно в 12:00)",
          "5 бесплатных уроков (Начальный этап)",
          "Базовые темы и квизы по практике",
          "Задачи по написанию промптов с ИИ-проверкой",
        ],
        cta: "Начать бесплатно",
      },
      pro: {
        name: "PRO",
        price: "$19",
        period: "/ месяц",
        badge: "Популярный",
        desc: "Интенсивная практика от 1–2 часов в день и все инструменты.",
        features: [
          "Практика от 1–2 часов в день (до 2+ часов без блокировок)",
          "Промпт-инжиниринг для написания чистого кода",
          "Работа в ИИ-редакторах: Cursor, Claude Code, Replit",
          "Управление контекстом проекта и правилами для нейросетей",
          "Тестирование, поиск ошибок и публикация (деплой) проектов",
          "Все 3 этапа, 6 уровней, квизы и задачи без ограничений",
        ],
        cta: "Перейти на PRO (Stripe)",
        activeCta: "Тариф PRO активен",
      },
    },
    dashboard: {
      title: "Кабинет обучения",
      subtitle: "Отслеживай дневную практику, уровни и прогресс по вайб-кодингу.",
      planLabel: "Текущий тариф",
      practiceToday: "Практика сегодня",
      remaining: "Осталось сегодня",
      nextReset: "Сброс в 12:00 (полдень) через",
      lessonsCompleted: "Пройдено уроков",
      tasksSolved: "Решено задач",
      upgradeBannerTitle: "Открой PRO-этапы и 2+ часа практики в день",
      upgradeBannerDesc:
        "Получи доступ к Cursor, Claude Code, Replit, управлению контекстом и деплою через Stripe.",
      upgradeBtn: "Активировать PRO",
      demoToggle: "Демо: переключить Free / PRO",
      openLesson: "Открыть урок",
      lockedPro: "Только PRO",
      completed: "Пройдено",
      freeBadge: "Free",
      proBadge: "PRO",
      levelLabel: "Уровень",
      minutesShort: "мин",
    },
    lesson: {
      backToDashboard: "← В кабинет",
      tabs: {
        theory: "Теория",
        quiz: "Квиз",
        task: "Задача по промпту",
      },
      markComplete: "Завершить урок",
      completedLabel: "Урок пройден",
      quizSubmit: "Проверить ответы",
      quizScore: "Результат квиза",
      taskLabel: "Практическая задача",
      taskPlaceholder: "Напиши свой промпт для решения задачи здесь...",
      taskSubmit: "Проверить промпт с ИИ",
      tutorTitle: "Персональный ИИ-репетитор",
      tutorModel: "gemini-3.5-flash-lite",
      tutorPlaceholder: "Спроси репетитора о теме урока, промпте или ошибке...",
      tutorSend: "Отправить",
      tutorWelcome:
        "Привет! Я твой персональный ИИ-репетитор по вайб-кодингу (на базе gemini-3.5-flash-lite). Изучи теорию слева, задавай любые вопросы или отправь свой промпт на разбор!",
      paywall: {
        limitTitle: "Дневной лимит Free (15 мин) исчерпан",
        limitDesc:
          "Твоя бесплатная квота автоматически обновится в 12:00 (полдень). Хочешь заниматься от 1–2 часов в день прямо сейчас?",
        lessonTitle: "Этот урок доступен на тарифе PRO",
        lessonDesc:
          "На бесплатном тарифе открыты первые 5 базовых уроков. Перейди на PRO, чтобы изучить ИИ-редакторы, правила контекста, тестирование и деплой.",
        upgradeCta: "Оформить PRO через Stripe",
        backCta: "Вернуться в кабинет",
      },
    },
    billing: {
      successTitle: "Добро пожаловать в PRO!",
      successDesc:
        "Твоя подписка активирована. Теперь тебе доступны 2+ часа практики в день, все этапы (Начальный, Продвинутый, Эксперт) и полный разбор промптов.",
      demoNote:
        "Примечание: Stripe сработал в локальном Demo-режиме (так как ключи Stripe не заданы в .env.local).",
      goDashboard: "Перейти к обучению",
      cancelTitle: "Оплата отменена",
      cancelDesc:
        "Ничего страшного — ты можешь продолжить на бесплатном тарифе (15 мин в день, сброс в 12:00) или вернуться к оформлению PRO позже.",
    },
  },
  en: {
    brand: "VibeCode AI",
    nav: {
      home: "Home",
      dashboard: "Dashboard",
      curriculum: "Curriculum",
      pricing: "Pricing",
      startLearning: "Start Learning",
    },
    hero: {
      badge: "Personal AI Tutor • Gemini 3.5 Flash-Lite",
      title: "Master Vibe Coding with Your Personal AI Tutor",
      subtitle:
        "Learn to build real software with prompts, Cursor, Claude Code, and Replit. Guided practice, quizzes, debugging, and production deployment.",
      ctaPrimary: "Start Free (5 Lessons)",
      ctaSecondary: "Explore PRO Plan",
      stats: {
        stages: "3 Learning Stages",
        levels: "6 Skill Levels",
        reset: "Free resets at 12:00 PM",
      },
    },
    stages: {
      title: "Learning Roadmap: 3 Stages & 6 Levels",
      subtitle:
        "A structured path that turns beginners into confident AI-first builders.",
      beginner: {
        name: "Beginner",
        tag: "Levels 1–2 • Free",
        desc: "Vibe coding fundamentals, prompt anatomy, iterative UI building, and basic debugging.",
      },
      advanced: {
        name: "Advanced",
        tag: "Levels 3–4 • PRO",
        desc: "Cursor, Claude Code & Replit workflows, context engineering, .cursorrules & CLAUDE.md.",
      },
      expert: {
        name: "Expert",
        tag: "Levels 5–6 • PRO",
        desc: "Automated testing, root-cause bug hunting, preventing hallucinations, and deployment.",
      },
    },
    pricing: {
      title: "Simple, Transparent Pricing",
      subtitle:
        "Start with 15 minutes of free daily practice or unlock full 1–2+ hour daily sessions with Stripe.",
      free: {
        name: "Free",
        price: "$0",
        period: "/ forever",
        desc: "Perfect for getting started with vibe coding.",
        features: [
          "15 min practice per day (resets daily at 12:00 PM noon)",
          "5 free lessons (Beginner stage)",
          "Core topics and practice quizzes",
          "Prompt-writing challenges with AI feedback",
        ],
        cta: "Start for Free",
      },
      pro: {
        name: "PRO",
        price: "$19",
        period: "/ month",
        badge: "Most Popular",
        desc: "Deep daily practice (1–2+ hours/day) and full-stack AI workflows.",
        features: [
          "1–2+ hours of daily practice (extended 120+ min quota)",
          "Prompt engineering for production-grade code",
          "AI Editors mastery: Cursor, Claude Code, Replit",
          "Project context management & AI rules (.cursorrules, CLAUDE.md)",
          "Testing, bug hunting & production deployment",
          "Unlimited access to all 3 stages, 6 levels, quizzes & tasks",
        ],
        cta: "Upgrade to PRO (Stripe)",
        activeCta: "PRO Plan Active",
      },
    },
    dashboard: {
      title: "Learning Dashboard",
      subtitle: "Track your daily practice quota, skill levels, and progress.",
      planLabel: "Current Plan",
      practiceToday: "Practice Today",
      remaining: "Remaining Today",
      nextReset: "Resets at 12:00 PM noon in",
      lessonsCompleted: "Lessons Completed",
      tasksSolved: "Tasks Solved",
      upgradeBannerTitle: "Unlock PRO Stages & 2+ Hours of Daily Practice",
      upgradeBannerDesc:
        "Master Cursor, Claude Code, Replit, context rules, testing, and deployment via Stripe.",
      upgradeBtn: "Upgrade to PRO",
      demoToggle: "Demo: Toggle Free / PRO",
      openLesson: "Open Lesson",
      lockedPro: "PRO Only",
      completed: "Completed",
      freeBadge: "Free",
      proBadge: "PRO",
      levelLabel: "Level",
      minutesShort: "min",
    },
    lesson: {
      backToDashboard: "← Dashboard",
      tabs: {
        theory: "Theory",
        quiz: "Quiz",
        task: "Prompt Task",
      },
      markComplete: "Complete Lesson",
      completedLabel: "Completed",
      quizSubmit: "Check Answers",
      quizScore: "Quiz Score",
      taskLabel: "Hands-on Prompt Challenge",
      taskPlaceholder: "Write your prompt for this task here...",
      taskSubmit: "Evaluate Prompt with AI",
      tutorTitle: "Personal AI Tutor",
      tutorModel: "gemini-3.5-flash-lite",
      tutorPlaceholder: "Ask your tutor about this lesson, prompt, or error...",
      tutorSend: "Send",
      tutorWelcome:
        "Hi! I'm your personal Vibe Coding AI Tutor (powered by gemini-3.5-flash-lite). Read the lesson on the left, ask me anything, or submit your prompt for live feedback!",
      paywall: {
        limitTitle: "Daily Free Limit (15 min) Reached",
        limitDesc:
          "Your free daily quota resets automatically at 12:00 PM noon. Ready for 1–2+ hours of daily practice right now?",
        lessonTitle: "This Lesson Requires PRO",
        lessonDesc:
          "The Free plan includes the first 5 foundational lessons. Upgrade to PRO to unlock AI editors, context rules, testing, and deployment.",
        upgradeCta: "Upgrade to PRO with Stripe",
        backCta: "Back to Dashboard",
      },
    },
    billing: {
      successTitle: "Welcome to PRO!",
      successDesc:
        "Your subscription is active. You now have 2+ hours of daily practice, all 3 stages (Beginner, Advanced, Expert), and unlimited AI prompt reviews.",
      demoNote:
        "Note: Stripe ran in local Demo mode because Stripe API keys are not configured in .env.local.",
      goDashboard: "Go to Dashboard",
      cancelTitle: "Checkout Canceled",
      cancelDesc:
        "No worries — you can continue on the Free plan (15 min/day, resets at 12:00 PM noon) or upgrade to PRO anytime.",
    },
  },
} as const;
