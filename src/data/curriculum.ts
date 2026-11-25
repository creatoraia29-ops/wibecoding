import type { Locale } from "@/lib/i18n";

export type StageId = "beginner" | "advanced" | "expert";

export interface LocalizedText {
  ru: string;
  en: string;
}

export interface QuizQuestion {
  question: LocalizedText;
  options: { ru: string[]; en: string[] };
  correctIndex: number;
  explanation: LocalizedText;
}

export interface Lesson {
  id: string;
  order: number;
  stage: StageId;
  level: number;
  isFree: boolean;
  durationMin: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  theory: {
    heading: LocalizedText;
    body: LocalizedText;
    codeExample?: string;
  }[];
  promptTask: {
    goal: LocalizedText;
    requirements: { ru: string[]; en: string[] };
    starterPrompt: LocalizedText;
  };
  quiz: QuizQuestion[];
}

export const STAGES: {
  id: StageId;
  levels: number[];
  title: LocalizedText;
  badge: LocalizedText;
}[] = [
  {
    id: "beginner",
    levels: [1, 2],
    title: { ru: "Начальный", en: "Beginner" },
    badge: { ru: "Уровни 1–2 • Free", en: "Levels 1–2 • Free" },
  },
  {
    id: "advanced",
    levels: [3, 4],
    title: { ru: "Продвинутый", en: "Advanced" },
    badge: { ru: "Уровни 3–4 • PRO", en: "Levels 3–4 • PRO" },
  },
  {
    id: "expert",
    levels: [5, 6],
    title: { ru: "Эксперт", en: "Expert" },
    badge: { ru: "Уровни 5–6 • PRO", en: "Levels 5–6 • PRO" },
  },
];

export const LEVELS: Record<number, { title: LocalizedText; stage: StageId }> = {
  1: {
    stage: "beginner",
    title: {
      ru: "Уровень 1: Основы вайб-кодинга",
      en: "Level 1: Vibe Coding Fundamentals",
    },
  },
  2: {
    stage: "beginner",
    title: {
      ru: "Уровень 2: Итерации и базовый дебаг",
      en: "Level 2: Iteration & Basic Debugging",
    },
  },
  3: {
    stage: "advanced",
    title: {
      ru: "Уровень 3: ИИ-редакторы (Cursor, Claude Code, Replit)",
      en: "Level 3: AI Editors (Cursor, Claude Code, Replit)",
    },
  },
  4: {
    stage: "advanced",
    title: {
      ru: "Уровень 4: Контекст проекта и правила",
      en: "Level 4: Project Context & AI Rules",
    },
  },
  5: {
    stage: "expert",
    title: {
      ru: "Уровень 5: Тестирование и поиск ошибок",
      en: "Level 5: Testing & Root-Cause Bug Hunting",
    },
  },
  6: {
    stage: "expert",
    title: {
      ru: "Уровень 6: Публикация (Деплой) и продакшен",
      en: "Level 6: Deployment & Production",
    },
  },
};

export const LESSONS: Lesson[] = [
  {
    id: "vibe-intro",
    order: 1,
    stage: "beginner",
    level: 1,
    isFree: true,
    durationMin: 10,
    title: {
      ru: "1. Что такое Вайб-кодинг и AI-first мышление",
      en: "1. What is Vibe Coding & AI-First Thinking",
    },
    subtitle: {
      ru: "Как переключиться от ручного набора строк к управлению ИИ-агентом.",
      en: "Shift from typing every line manually to directing an AI coding agent.",
    },
    theory: [
      {
        heading: {
          ru: "Новая роль разработчика",
          en: "The New Role of the Builder",
        },
        body: {
          ru: "Вайб-кодинг — это подход, где вы формулируете намерение, архитектуру и ограничения на естественном языке, а ИИ берёт на себя реализацию. Ваша главная суперсила — ясность постановки задачи и быстрая проверка результата.",
          en: "Vibe coding is an approach where you specify intent, architecture, and constraints in natural language while AI writes the implementation. Your superpower is clarity of specification and fast verification.",
        },
      },
      {
        heading: {
          ru: "Формула: Контекст + Задача + Ограничения",
          en: "Formula: Context + Goal + Constraints",
        },
        body: {
          ru: "Вместо размытого «сделай сайт», задавайте стек, дизайн-токены и критерии готовности. Тогда модель с первого раза попадёт в цель.",
          en: "Instead of a vague 'make a website', specify the tech stack, design tokens, and acceptance criteria so the model nails it on the first pass.",
        },
        codeExample: `Role: Senior Next.js + Tailwind engineer.
Task: Build a responsive pricing card component (Free vs PRO).
Constraints: Use shadcn/ui Card, dark navy #031725 background, no external icon libs besides lucide-react.`,
      },
    ],
    promptTask: {
      goal: {
        ru: "Напиши стартовый промпт для создания трекера привычек на Next.js с указанием стека, UI и ограничений.",
        en: "Write a starter prompt to build a habit tracker in Next.js specifying stack, UI, and constraints.",
      },
      requirements: {
        ru: [
          "Указать фреймворк и библиотеку UI (например, Next.js + shadcn/ui)",
          "Описать ключевой функционал (добавление, отметка, стрик)",
          "Задать минимум 2 явных ограничения (без лишних библиотек / адаптивность)",
        ],
        en: [
          "Specify framework and UI library (e.g., Next.js + shadcn/ui)",
          "Describe core features (add habit, check-in, streak)",
          "Include at least 2 explicit constraints (responsive, minimal deps)",
        ],
      },
      starterPrompt: {
        ru: "Создай трекер привычек на Next.js...",
        en: "Build a habit tracker in Next.js...",
      },
    },
    quiz: [
      {
        question: {
          ru: "Что является главным навыком в вайб-кодинге?",
          en: "What is the core skill in vibe coding?",
        },
        options: {
          ru: [
            "Заучивание всех методов стандартной библиотеки наизусть",
            "Точная формулировка намерения, контекста и проверка результата",
            "Отключение всех проверок типов ради скорости",
          ],
          en: [
            "Memorizing every standard library method by heart",
            "Clear intent, structured context, and rapid verification",
            "Disabling all type checks for speed",
          ],
        },
        correctIndex: 1,
        explanation: {
          ru: "ИИ генерирует код быстро, но качество зависит от вашего контекста и критериев приёмки.",
          en: "AI writes code fast, but output quality depends on your context and acceptance criteria.",
        },
      },
      {
        question: {
          ru: "Какой элемент НЕ входит в базовую формулу сильного промпта?",
          en: "Which element is NOT part of the core prompt formula?",
        },
        options: {
          ru: ["Контекст проекта", "Ограничения и стек", "Случайный набор эмодзи"],
          en: ["Project context", "Constraints & tech stack", "Random emojis"],
        },
        correctIndex: 2,
        explanation: {
          ru: "Формула опирается на Контекст, Задачу и Ограничения.",
          en: "The formula relies on Context, Goal, and Constraints.",
        },
      },
    ],
  },
  {
    id: "prompt-anatomy",
    order: 2,
    stage: "beginner",
    level: 1,
    isFree: true,
    durationMin: 12,
    title: {
      ru: "2. Анатомия идеального промпта для кода",
      en: "2. Anatomy of a High-Precision Code Prompt",
    },
    subtitle: {
      ru: "Как структурировать запросы с помощью XML/Markdown блоков и примеров.",
      en: "Structure requests using clear sections, types, and few-shot examples.",
    },
    theory: [
      {
        heading: {
          ru: "Разделяй инструкции и данные",
          en: "Separate Instructions from Data",
        },
        body: {
          ru: "Модели намного точнее, когда вы используете чёткие заголовки или теги (<context>, <requirements>, <output_format>). Это снижает шанс, что ИИ забудет половину требований.",
          en: "Models perform significantly better when you use clear headings or tags (<context>, <requirements>, <output_format>), reducing missed requirements.",
        },
        codeExample: `<context>
App Router Next.js 16, TypeScript strict mode.
</context>
<task>
Create a rate-limit helper that resets daily at 12:00 PM local time.
</task>
<constraints>
- Pure TypeScript function, zero external dependencies
- Return { remainingSeconds, nextResetAt }
</constraints>`,
      },
    ],
    promptTask: {
      goal: {
        ru: "Перепиши размытый запрос «Сделай форму логина» в структурированный промпт с тегами или секциями.",
        en: "Rewrite the vague request 'Make a login form' into a structured prompt with clear sections.",
      },
      requirements: {
        ru: [
          "Использовать секции Context / Task / Constraints",
          "Указать валидацию полей (email + пароль)",
          "Указать обработку состояний загрузки и ошибки",
        ],
        en: [
          "Use Context / Task / Constraints sections",
          "Specify field validation (email + password)",
          "Include loading and error states",
        ],
      },
      starterPrompt: {
        ru: "<context>...</context>\n<task>...</task>",
        en: "<context>...</context>\n<task>...</task>",
      },
    },
    quiz: [
      {
        question: {
          ru: "Зачем использовать секции или XML-теги в промпте?",
          en: "Why use sections or XML-style tags in a prompt?",
        },
        options: {
          ru: [
            "Чтобы модель чётко отделяла контекст от требований и формата вывода",
            "Потому что иначе код не скомпилируется",
            "Чтобы увеличить стоимость запроса",
          ],
          en: [
            "So the model cleanly separates context, requirements, and output format",
            "Because otherwise TypeScript won't compile",
            "To increase token cost",
          ],
        },
        correctIndex: 0,
        explanation: {
          ru: "Структурирование помогает ИИ удерживать внимание на каждом ограничении.",
          en: "Structure helps the LLM track every constraint accurately.",
        },
      },
    ],
  },
  {
    id: "iterative-ui",
    order: 3,
    stage: "beginner",
    level: 2,
    isFree: true,
    durationMin: 12,
    title: {
      ru: "3. Итеративная генерация UI без хаоса",
      en: "3. Iterative UI Generation Without Chaos",
    },
    subtitle: {
      ru: "Как строить интерфейс маленькими шагами: скелет → логика → полировка.",
      en: "Build interfaces in small steps: layout skeleton → state logic → polish.",
    },
    theory: [
      {
        heading: {
          ru: "Правило одного шага за промпт",
          en: "One Step Per Prompt Rule",
        },
        body: {
          ru: "Не просите сгенерировать весь SaaS за один гигантский промпт. Сначала попросите макет (layout), затем подключите состояние, и только потом добавляйте анимации и адаптив.",
          en: "Never ask for an entire SaaS in one giant prompt. First build the layout skeleton, then wire state, and finally polish responsiveness and micro-interactions.",
        },
      },
    ],
    promptTask: {
      goal: {
        ru: "Составь серию из 2 последовательных промптов для создания дашборда аналитики.",
        en: "Write a 2-step prompt sequence to build an analytics dashboard.",
      },
      requirements: {
        ru: [
          "Шаг 1: только сетка и карточки метрик с мок-данными",
          "Шаг 2: интерактивный фильтр по датам и переключение графиков",
        ],
        en: [
          "Step 1: layout grid and KPI cards with mock data",
          "Step 2: interactive date filter and chart switching",
        ],
      },
      starterPrompt: {
        ru: "Шаг 1 (Скелет): ...\nШаг 2 (Интерактив): ...",
        en: "Step 1 (Skeleton): ...\nStep 2 (Interactivity): ...",
      },
    },
    quiz: [
      {
        question: {
          ru: "Почему итеративная генерация эффективнее одного огромного промпта?",
          en: "Why is iterative generation better than one giant prompt?",
        },
        options: {
          ru: [
            "Проще локализовать ошибки и контролировать архитектуру на каждом шаге",
            "ИИ не умеет писать больше 50 строк",
            "Это единственный способ использовать Tailwind",
          ],
          en: [
            "Easier to isolate bugs and steer architecture at each step",
            "AI cannot write more than 50 lines",
            "It is the only way to use Tailwind",
          ],
        },
        correctIndex: 0,
        explanation: {
          ru: "Малые итерации минимизируют каскадные ошибки.",
          en: "Small iterations minimize cascading bugs.",
        },
      },
    ],
  },
  {
    id: "basic-debug",
    order: 4,
    stage: "beginner",
    level: 2,
    isFree: true,
    durationMin: 15,
    title: {
      ru: "4. Передача контекста ошибки и первый дебаг",
      en: "4. Sharing Error Context & First Debugging",
    },
    subtitle: {
      ru: "Что копировать из консоли, чтобы ИИ починил баг за 1 ответ.",
      en: "What to copy from the terminal so AI fixes bugs in a single turn.",
    },
    theory: [
      {
        heading: {
          ru: "Триада дебага",
          en: "The Debugging Triad",
        },
        body: {
          ru: "Никогда не пишите просто «не работает». Приложите: 1) полный текст ошибки и stack trace, 2) фрагмент файла вокруг указанной строки, 3) что вы ожидали получить.",
          en: "Never just say 'it's broken'. Always include: 1) full error + stack trace, 2) the relevant code snippet, and 3) expected vs actual behavior.",
        },
        codeExample: `Error: TypeError: Cannot read properties of undefined (reading 'map')
File: src/components/LessonList.tsx:24
Expected: Render empty state when lessons array is loading.
Actual: Crashes on initial render.`,
      },
    ],
    promptTask: {
      goal: {
        ru: "Сформируй идеальный debug-промпт для ошибки гидратации (Hydration Mismatch) в Next.js.",
        en: "Write a clean debug prompt for a Next.js Hydration Mismatch error.",
      },
      requirements: {
        ru: [
          "Описать симптом и текст ошибки",
          "Указать компонент (например, переключатель темы)",
          "Попросить объяснить причину перед фиксом",
        ],
        en: [
          "Include the symptom and error message",
          "Mention the component (e.g., theme toggle)",
          "Ask AI to explain the root cause before patching",
        ],
      },
      starterPrompt: {
        ru: "У меня ошибка Hydration failed...",
        en: "I'm getting a Hydration failed error...",
      },
    },
    quiz: [
      {
        question: {
          ru: "Что нужно приложить к запросу на исправление бага?",
          en: "What should you always include in a bug-fix prompt?",
        },
        options: {
          ru: [
            "Скриншот рабочего стола",
            "Stack trace, релевантный код и ожидаемое поведение",
            "Весь node_modules",
          ],
          en: [
            "A desktop screenshot",
            "Stack trace, relevant code, and expected behavior",
            "All of node_modules",
          ],
        },
        correctIndex: 1,
        explanation: {
          ru: "Точный stack trace и ожидание позволяют модели сразу найти корневую причину.",
          en: "Stack trace + expected behavior lets the model pinpoint the root cause.",
        },
      },
    ],
  },
  {
    id: "mini-project-free",
    order: 5,
    stage: "beginner",
    level: 2,
    isFree: true,
    durationMin: 15,
    title: {
      ru: "5. Практикум: Мини-лендинг за 10 минут",
      en: "5. Capstone: Build a Mini Landing Page in 10 Min",
    },
    subtitle: {
      ru: "Финальный бесплатный урок: собираем полный промпт-бриф для реального проекта.",
      en: "Final free lesson: assemble a complete prompt brief for a real landing page.",
    },
    theory: [
      {
        heading: {
          ru: "Сборка мастер-брифа",
          en: "Assembling a Master Brief",
        },
        body: {
          ru: "Вы уже знаете структуру промпта, итерации и дебаг. Объедините всё это в один чёткий технический бриф: аудитория, палитра, типографика, секции и адаптивность.",
          en: "Combine prompt structure, iteration, and constraints into a single crisp technical brief: audience, palette, typography, sections, and responsiveness.",
        },
      },
    ],
    promptTask: {
      goal: {
        ru: "Напиши мастер-промпт для лендинга микро-SaaS продукта (например, AI-генератора резюме).",
        en: "Write a master prompt for a micro-SaaS landing page (e.g., an AI Resume Builder).",
      },
      requirements: {
        ru: [
          "Задать брендовые цвета и шрифтовую пару",
          "Перечислить 3–4 секции (Hero, Features, Pricing, FAQ)",
          "Указать требование к доступности и мобильной версии",
        ],
        en: [
          "Define brand colors and font pairing",
          "List 3–4 sections (Hero, Features, Pricing, FAQ)",
          "Include accessibility and mobile responsiveness constraints",
        ],
      },
      starterPrompt: {
        ru: "Создай лендинг для микро-SaaS...",
        en: "Create a landing page for a micro-SaaS...",
      },
    },
    quiz: [
      {
        question: {
          ru: "С чего лучше начинать создание нового проекта с ИИ?",
          en: "What is the best way to start a new project with AI?",
        },
        options: {
          ru: [
            "С короткого технического брифа (стек, дизайн-система, структура)",
            "С покупки домена до написания кода",
            "С копирования случайного кода без описания",
          ],
          en: [
            "With a concise technical brief (stack, design system, structure)",
            "Buying a domain before writing any spec",
            "Pasting random code with no description",
          ],
        },
        correctIndex: 0,
        explanation: {
          ru: "Чёткий бриф задаёт правильный фундамент всему проекту.",
          en: "A clear brief sets a solid foundation for the entire project.",
        },
      },
    ],
  },
  {
    id: "cursor-composer",
    order: 6,
    stage: "advanced",
    level: 3,
    isFree: false,
    durationMin: 20,
    title: {
      ru: "6. Cursor: Composer, Agent Mode и мультифайловые правки",
      en: "6. Cursor: Composer, Agent Mode & Multi-File Edits",
    },
    subtitle: {
      ru: "PRO: как управлять агентом Cursor для одновременного изменения API, типов и UI.",
      en: "PRO: direct Cursor Agent to update APIs, types, and UI in one coordinated pass.",
    },
    theory: [
      {
        heading: {
          ru: "Chat vs Composer / Agent",
          en: "Chat vs Composer / Agent",
        },
        body: {
          ru: "Обычный Chat хорош для вопросов. Agent Mode в Cursor умеет сам искать файлы, править сразу несколько модулей, запускать терминал и проверять сборку. Главное — давать ему чёткий scope файлов.",
          en: "Chat is great for Q&A. Cursor Agent Mode searches files, edits multiple modules simultaneously, runs terminal commands, and verifies builds. Always give it a clear file scope.",
        },
        codeExample: `Task: Add Stripe Checkout endpoint + Upgrade button.
Scope:
- Create src/app/api/stripe/checkout/route.ts
- Update src/components/PricingCard.tsx
Verify: Run \`npm run build\` and fix any TS errors.`,
      },
    ],
    promptTask: {
      goal: {
        ru: "Напиши промпт для Cursor Agent Mode, чтобы добавить тёмную тему и переключатель языка в существующий проект.",
        en: "Write a Cursor Agent Mode prompt to add dark mode and a language switcher to an existing app.",
      },
      requirements: {
        ru: [
          "Указать точные файлы для создания/изменения (Scope)",
          "Указать команду верификации (например, npm run build)",
          "Запретить трогать несвязанные модули",
        ],
        en: [
          "Specify exact files to create/modify (Scope)",
          "Include a verification command (e.g., npm run build)",
          "Forbid touching unrelated modules",
        ],
      },
      starterPrompt: {
        ru: "В Cursor Agent Mode выполни...",
        en: "In Cursor Agent Mode, implement...",
      },
    },
    quiz: [
      {
        question: {
          ru: "Зачем в промпте для ИИ-редактора указывать команду верификации (например, npm run build)?",
          en: "Why include a verification command (like npm run build) in an AI editor prompt?",
        },
        options: {
          ru: [
            "Чтобы агент сам проверил типы/сборку и исправил ошибки до завершения",
            "Чтобы ускорить интернет",
            "Это обязательный синтаксис JavaScript",
          ],
          en: [
            "So the agent verifies types/build and self-corrects errors before finishing",
            "To speed up Wi-Fi",
            "It is required JavaScript syntax",
          ],
        },
        correctIndex: 0,
        explanation: {
          ru: "Автоматическая самопроверка агентом экономит массу времени.",
          en: "Self-verification by the agent catches issues immediately.",
        },
      },
    ],
  },
  {
    id: "claude-code-replit",
    order: 7,
    stage: "advanced",
    level: 3,
    isFree: false,
    durationMin: 20,
    title: {
      ru: "7. Claude Code в терминале и Replit Agent",
      en: "7. Claude Code CLI & Replit Agent Workflows",
    },
    subtitle: {
      ru: "PRO: автономные CLI-агенты, работа с git diff и облачный прототипинг в Replit.",
      en: "PRO: autonomous CLI agents, git diff workflows, and rapid cloud builds in Replit.",
    },
    theory: [
      {
        heading: {
          ru: "CLI-агент против облачной IDE",
          en: "CLI Agent vs Cloud IDE",
        },
        body: {
          ru: "Claude Code работает прямо в вашем терминале: читает весь репозиторий, запускает тесты и делает коммиты. Replit Agent идеален для мгновенного старта в облаке с готовой БД и хостингом.",
          en: "Claude Code operates directly in your terminal: reading the repo, running tests, and managing git. Replit Agent excels at zero-setup cloud prototypes with built-in DB and hosting.",
        },
      },
    ],
    promptTask: {
      goal: {
        ru: "Сформулируй задачу для Claude Code по рефакторингу API-роутов с проверкой через git diff и тесты.",
        en: "Write a Claude Code task to refactor API routes with git diff review and test verification.",
      },
      requirements: {
        ru: [
          "Попросить сначала составить план без правки файлов",
          "Указать запуск тестов после изменений",
          "Попросить краткий summary изменённых файлов",
        ],
        en: [
          "Ask for a plan before editing files",
          "Require running tests after edits",
          "Request a concise summary of changed files",
        ],
      },
      starterPrompt: {
        ru: "Проанализируй src/app/api...",
        en: "Analyze src/app/api...",
      },
    },
    quiz: [
      {
        question: {
          ru: "Какая практика безопасности важна при работе с CLI-агентом?",
          en: "Which safety practice is essential when using a CLI coding agent?",
        },
        options: {
          ru: [
            "Проверять план и git diff перед коммитом",
            "Удалить .gitignore",
            "Запускать всё под root без резервных копий",
          ],
          en: [
            "Reviewing the plan and git diff before committing",
            "Deleting .gitignore",
            "Running everything as root with no backups",
          ],
        },
        correctIndex: 0,
        explanation: {
          ru: "Git diff и предварительный план дают полный контроль над изменениями.",
          en: "Reviewing plans and git diffs keeps you in full control.",
        },
      },
    ],
  },
  {
    id: "rules-files",
    order: 8,
    stage: "advanced",
    level: 4,
    isFree: false,
    durationMin: 20,
    title: {
      ru: "8. Правила для нейросетей: .cursorrules и CLAUDE.md",
      en: "8. AI Rules Engineering: .cursorrules & CLAUDE.md",
    },
    subtitle: {
      ru: "PRO: как задать постоянные стандарты кода, чтобы ИИ не повторял ошибки.",
      en: "PRO: encode persistent project standards so AI never repeats the same mistakes.",
    },
    theory: [
      {
        heading: {
          ru: "Системная память проекта",
          en: "Persistent Project Memory",
        },
        body: {
          ru: "Файлы .cursorrules, CLAUDE.md или AGENTS.md автоматически подгружаются в каждый запрос. Запишите туда стек, правила именования, запрет на дублирование логики и команды тестирования.",
          en: "Files like .cursorrules, CLAUDE.md, or AGENTS.md are loaded into every prompt automatically. Document your stack, naming conventions, DRY rules, and test commands there.",
        },
        codeExample: `# CLAUDE.md
- Framework: Next.js 16 App Router (Server Components by default)
- UI: shadcn/ui + Tailwind v4, brand colors #031725 / #499BED
- Never hardcode secrets; always read process.env
- Run \`npm run lint && npm run build\` after edits`,
      },
    ],
    promptTask: {
      goal: {
        ru: "Создай шаблон файла CLAUDE.md / .cursorrules для собственного SaaS-проекта.",
        en: "Draft a CLAUDE.md / .cursorrules file for your own SaaS project.",
      },
      requirements: {
        ru: [
          "Описать стек технологий",
          "Добавить 3 строгих правила качества кода",
          "Указать команды проверки (lint/test/build)",
        ],
        en: [
          "Define the tech stack",
          "Add 3 strict code quality rules",
          "Specify verification commands (lint/test/build)",
        ],
      },
      starterPrompt: {
        ru: "# Project AI Rules\n## Stack\n...",
        en: "# Project AI Rules\n## Stack\n...",
      },
    },
    quiz: [
      {
        question: {
          ru: "Для чего нужен файл CLAUDE.md или .cursorrules?",
          en: "What is the purpose of CLAUDE.md or .cursorrules?",
        },
        options: {
          ru: [
            "Передавать ИИ постоянные правила проекта автоматически в каждой сессии",
            "Хранить пароли пользователей в открытом виде",
            "Заменять package.json",
          ],
          en: [
            "Automatically give AI persistent project rules in every session",
            "Store user passwords in plain text",
            "Replace package.json",
          ],
        },
        correctIndex: 0,
        explanation: {
          ru: "Это единый источник правды о стандартах вашего репозитория для ИИ.",
          en: "It serves as the single source of truth for AI coding standards.",
        },
      },
    ],
  },
  {
    id: "context-management",
    order: 9,
    stage: "advanced",
    level: 4,
    isFree: false,
    durationMin: 20,
    title: {
      ru: "9. Управление контекстом проекта и @-ссылки",
      en: "9. Context Window Management & @-Mentions",
    },
    subtitle: {
      ru: "PRO: почему длинный чат «тупеет» и как держать контекст чистым.",
      en: "PRO: why long chats degrade and how to keep your context window sharp.",
    },
    theory: [
      {
        heading: {
          ru: "Гигиена контекстного окна",
          en: "Context Window Hygiene",
        },
        body: {
          ru: "Когда чат перегружен старыми ошибками, модель начинает путаться. Начинайте новую сессию под каждую фичу, используйте точечные @-ссылки на нужные файлы и фиксируйте итоги в ARCHITECTURE.md.",
          en: "When a chat fills up with stale errors, model quality drops. Start a fresh thread per feature, use targeted @-file references, and summarize decisions in ARCHITECTURE.md.",
        },
      },
    ],
    promptTask: {
      goal: {
        ru: "Напиши промпт-резюме (handoff) для переноса контекста из старого чата в новую сессию.",
        en: "Write a handoff summary prompt to transfer context cleanly into a fresh chat session.",
      },
      requirements: {
        ru: [
          "Указать, что уже сделано",
          "Перечислить ключевые файлы через @",
          "Сформулировать следующую конкретную задачу",
        ],
        en: [
          "Summarize what is already implemented",
          "Reference key files with @",
          "State the exact next task",
        ],
      },
      starterPrompt: {
        ru: "Контекст проекта: ...",
        en: "Project handoff context: ...",
      },
    },
    quiz: [
      {
        question: {
          ru: "Что делать, если ИИ начал путаться после 30 сообщений в одном чате?",
          en: "What should you do if AI starts getting confused after 30 messages in one chat?",
        },
        options: {
          ru: [
            "Открыть новый чат с кратким резюме и точными @-ссылками на файлы",
            "Повторять один и тот же запрос капсом",
            "Удалить проект",
          ],
          en: [
            "Start a fresh chat with a concise summary and exact @-file references",
            "Repeat the same prompt in ALL CAPS",
            "Delete the project",
          ],
        },
        correctIndex: 0,
        explanation: {
          ru: "Свежий контекст мгновенно возвращает точность модели.",
          en: "A fresh context window immediately restores model accuracy.",
        },
      },
    ],
  },
  {
    id: "ai-testing",
    order: 10,
    stage: "expert",
    level: 5,
    isFree: false,
    durationMin: 25,
    title: {
      ru: "10. Автоматизированное тестирование с ИИ",
      en: "10. Automated Testing & Edge-Case Discovery with AI",
    },
    subtitle: {
      ru: "PRO: как заставить ИИ находить граничные случаи и писать надёжные тесты.",
      en: "PRO: make AI uncover edge cases and write reliable unit & integration tests.",
    },
    theory: [
      {
        heading: {
          ru: "Тесты как страховка вайб-кодинга",
          en: "Tests as Vibe Coding Guardrails",
        },
        body: {
          ru: "Вайб-кодинг без тестов опасен регрессиями. Просите модель сначала перечислить edge cases (граничные случаи, например сброс квоты ровно в 12:00:00 или 11:59:59), а затем написать unit-тесты.",
          en: "Vibe coding without tests risks regressions. Ask the model to list edge cases first (e.g., quota reset at 12:00:00 vs 11:59:59) and then generate unit tests.",
        },
      },
    ],
    promptTask: {
      goal: {
        ru: "Напиши промпт для генерации unit-тестов функции сброса бесплатного тарифа в 12:00 полдень.",
        en: "Write a prompt to generate unit tests for the 12:00 PM noon Free-tier reset function.",
      },
      requirements: {
        ru: [
          "Попросить проверить время до 12:00, ровно в 12:00 и после 12:00",
          "Проверить переход через полночь",
          "Указать формат (Vitest или node:test)",
        ],
        en: [
          "Test before 12:00, exactly at 12:00, and after 12:00",
          "Test midnight rollover behavior",
          "Specify test runner (Vitest or node:test)",
        ],
      },
      starterPrompt: {
        ru: "Напиши unit-тесты на node:test для функции...",
        en: "Write unit tests using node:test for...",
      },
    },
    quiz: [
      {
        question: {
          ru: "Почему полезно просить ИИ сначала перечислить граничные случаи?",
          en: "Why ask AI to list edge cases before writing tests?",
        },
        options: {
          ru: [
            "Модель не пропустит скрытые баги вроде нулей, таймзон и пустых массивов",
            "Это отключает необходимость запускать тесты",
            "Тесты становятся длиннее без пользы",
          ],
          en: [
            "The model catches hidden bugs like timezones, boundaries, and empty states",
            "It removes the need to run tests",
            "It just makes files longer",
          ],
        },
        correctIndex: 0,
        explanation: {
          ru: "Явный список edge cases даёт намного более полное покрытие.",
          en: "Explicit edge-case listing leads to far better test coverage.",
        },
      },
    ],
  },
  {
    id: "deep-debug",
    order: 11,
    stage: "expert",
    level: 5,
    isFree: false,
    durationMin: 25,
    title: {
      ru: "11. Глубокий дебаг и борьба с галлюцинациями ИИ",
      en: "11. Deep Debugging & Eliminating AI Hallucinations",
    },
    subtitle: {
      ru: "PRO: что делать, когда ИИ ходит по кругу или выдумывает несуществующие API.",
      en: "PRO: break debugging loops and stop AI from inventing nonexistent APIs.",
    },
    theory: [
      {
        heading: {
          ru: "Выход из петли дебага",
          en: "Breaking the Debug Loop",
        },
        body: {
          ru: "Если ИИ дважды предложил фикс, который не сработал — остановитесь. Заставьте его сформулировать 3 альтернативные гипотезы, добавить диагностические логи и проверить реальные версии пакетов в package.json.",
          en: "If AI fails twice on the same bug, stop patching blindly. Force it to propose 3 root-cause hypotheses, add targeted logs, and verify actual package versions in package.json.",
        },
      },
    ],
    promptTask: {
      goal: {
        ru: "Напиши промпт для выхода из бесконечного цикла ошибок при интеграции Stripe Webhook.",
        en: "Write a prompt to break out of a debugging loop during Stripe Webhook integration.",
      },
      requirements: {
        ru: [
          "Запретить угадывать фикс вслепую",
          "Попросить 3 гипотезы причины (например, raw body vs parsed JSON)",
          "Потребовать проверку подписи webhook",
        ],
        en: [
          "Forbid blind guessing",
          "Request 3 root-cause hypotheses (e.g., raw body vs parsed JSON)",
          "Require webhook signature verification check",
        ],
      },
      starterPrompt: {
        ru: "Остановись и не пиши код сразу. Проанализируй...",
        en: "Stop and don't patch yet. Analyze...",
      },
    },
    quiz: [
      {
        question: {
          ru: "Что делать, если ИИ выдумал несуществующий метод библиотеки?",
          en: "What should you do when AI hallucinates a nonexistent library method?",
        },
        options: {
          ru: [
            "Указать точную версию пакета и приложить реальный фрагмент документации/типов",
            "Переименовать библиотеку",
            "Игнорировать ошибку компиляции",
          ],
          en: [
            "Provide the exact package version and real docs/type definitions",
            "Rename the library",
            "Ignore the compiler error",
          ],
        },
        correctIndex: 0,
        explanation: {
          ru: "Опора на реальные типы и документацию мгновенно устраняет галлюцинации.",
          en: "Grounding AI in actual types and docs eliminates hallucinations.",
        },
      },
    ],
  },
  {
    id: "deploy-prod",
    order: 12,
    stage: "expert",
    level: 6,
    isFree: false,
    durationMin: 25,
    title: {
      ru: "12. Публикация (Деплой): Vercel, Env и Stripe в продакшене",
      en: "12. Production Deployment: Vercel, Env Vars & Stripe Live",
    },
    subtitle: {
      ru: "PRO: чеклист перед релизом, секреты, вебхуки и мониторинг живого SaaS.",
      en: "PRO: pre-launch checklist, secrets management, webhooks, and live SaaS monitoring.",
    },
    theory: [
      {
        heading: {
          ru: "Продакшен-чеклист",
          en: "Production Launch Checklist",
        },
        body: {
          ru: "Перед деплоем проверьте: 1) .env.local не попал в git, 2) все ключи добавлены в панель хостинга (Vercel/Cloudflare), 3) Stripe Webhook настроен на продакшен-URL, 4) `npm run build` проходит без ошибок.",
          en: "Before deploying: 1) ensure .env.local is gitignored, 2) add all env vars in your host dashboard, 3) point Stripe Webhooks to your live URL, 4) verify `npm run build` passes cleanly.",
        },
      },
    ],
    promptTask: {
      goal: {
        ru: "Составь финальный промпт для аудита безопасности и готовности SaaS-проекта к деплою.",
        en: "Write a final pre-deployment security and production-readiness audit prompt for your SaaS.",
      },
      requirements: {
        ru: [
          "Проверить утечку секретов и клиентских ключей",
          "Проверить обработку ошибок API и Stripe Webhook",
          "Проверить SEO-метаданные и переменные окружения",
        ],
        en: [
          "Audit for leaked secrets or server keys in client code",
          "Verify API error handling and Stripe Webhook security",
          "Check SEO metadata and environment variable validation",
        ],
      },
      starterPrompt: {
        ru: "Проведи продакшен-аудит этого репозитория...",
        en: "Run a production readiness audit on this repository...",
      },
    },
    quiz: [
      {
        question: {
          ru: "Где должны храниться секретные ключи вроде STRIPE_SECRET_KEY и GEMINI_API_KEY?",
          en: "Where must secret keys like STRIPE_SECRET_KEY and GEMINI_API_KEY live?",
        },
        options: {
          ru: [
            "Только в переменных окружения сервера (.env.local / хостинг), без префикса NEXT_PUBLIC_",
            "В клиентском компоненте React",
            "В README.md",
          ],
          en: [
            "Only in server environment variables (.env.local / host), never prefixed with NEXT_PUBLIC_",
            "Inside a React client component",
            "In README.md",
          ],
        },
        correctIndex: 0,
        explanation: {
          ru: "Всё с префиксом NEXT_PUBLIC_ попадает в браузер пользователя, поэтому секреты хранятся только на сервере.",
          en: "Anything prefixed with NEXT_PUBLIC_ is exposed to the browser; secrets must stay server-side.",
        },
      },
    ],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getLocalized(text: LocalizedText, locale: Locale): string {
  return text[locale];
}
