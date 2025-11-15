/**
 * Storage abstraction layer
 * Uses filesystem for local development and Vercel KV for production
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  content?: string;
  markdownFile?: string;
}

// Check if we're in a Vercel environment
function isVercelEnv(): boolean {
  return process.env.VERCEL === "1" || !!process.env.KV_REST_API_URL;
}

// Storage keys
const LESSON_PREFIX = "lesson:";
const LESSON_CONTENT_PREFIX = "lesson:content:";
const LESSON_IDS_KEY = "lesson:ids";
const COMPLETED_LESSONS_KEY = "completed:lessons";

// Filesystem storage (for local development)
async function getLessonFromFS(lessonId: string): Promise<Lesson | null> {
  const fs = await import("fs");
  const path = await import("path");
  
  const lessonsDir = path.join(process.cwd(), "data", "lessons");
  const lessonJsonPath = path.join(lessonsDir, `${lessonId}.json`);
  
  if (!fs.existsSync(lessonJsonPath)) {
    return null;
  }
  
  const lessonData = JSON.parse(fs.readFileSync(lessonJsonPath, "utf-8")) as Lesson;
  const markdownPath = path.join(lessonsDir, lessonData.markdownFile || `${lessonId}.md`);
  
  if (fs.existsSync(markdownPath)) {
    lessonData.content = fs.readFileSync(markdownPath, "utf-8");
  }
  
  return lessonData;
}

async function getAllLessonsFromFS(): Promise<Lesson[]> {
  const fs = await import("fs");
  const path = await import("path");
  
  const lessonsDir = path.join(process.cwd(), "data", "lessons");
  
  if (!fs.existsSync(lessonsDir)) {
    return [];
  }
  
  const files = fs.readdirSync(lessonsDir);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  const lessons: Lesson[] = [];
  
  for (const file of jsonFiles) {
    const filePath = path.join(lessonsDir, file);
    const lessonData = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Lesson;
    lessons.push({
      id: lessonData.id,
      title: lessonData.title,
      description: lessonData.description,
      duration: lessonData.duration,
      difficulty: lessonData.difficulty,
    });
  }
  
  return lessons.sort((a, b) => a.id.localeCompare(b.id));
}

async function saveLessonToFS(lessonData: Lesson & { markdownContent: string }): Promise<void> {
  const fs = await import("fs");
  const path = await import("path");
  
  const lessonsDir = path.join(process.cwd(), "data", "lessons");
  if (!fs.existsSync(lessonsDir)) {
    fs.mkdirSync(lessonsDir, { recursive: true });
  }
  
  const jsonPath = path.join(lessonsDir, `${lessonData.id}.json`);
  const jsonData = {
    id: lessonData.id,
    title: lessonData.title,
    description: lessonData.description,
    duration: lessonData.duration,
    difficulty: lessonData.difficulty,
    markdownFile: `${lessonData.id}.md`,
  };
  
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), "utf-8");
  
  const markdownPath = path.join(lessonsDir, `${lessonData.id}.md`);
  fs.writeFileSync(markdownPath, lessonData.markdownContent, "utf-8");
}

async function getCompletedLessonsFromFS() {
  const fs = await import("fs");
  const path = await import("path");
  
  const dataDir = path.join(process.cwd(), "data");
  const completedLessonsPath = path.join(dataDir, "completed-lessons.json");
  
  if (!fs.existsSync(completedLessonsPath)) {
    return [];
  }
  
  return JSON.parse(fs.readFileSync(completedLessonsPath, "utf-8"));
}

async function saveCompletedLessonsToFS(completedLessons: string[]) {
  const fs = await import("fs");
  const path = await import("path");
  
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const completedLessonsPath = path.join(dataDir, "completed-lessons.json");
  fs.writeFileSync(completedLessonsPath, JSON.stringify(completedLessons, null, 2), "utf-8");
}

// KV storage (for Vercel production)
async function getKVClient() {
  if (!isVercel) {
    return null;
  }
  
  try {
    const { kv } = await import("@vercel/kv");
    return kv;
  } catch (error) {
    console.error("Failed to initialize KV:", error);
    return null;
  }
}

async function getLessonFromKV(lessonId: string): Promise<Lesson | null> {
  const kv = await getKVClient();
  if (!kv) return null;
  
  const lessonData = await kv.get<Lesson>(`${LESSON_PREFIX}${lessonId}`);
  const content = await kv.get<string>(`${LESSON_CONTENT_PREFIX}${lessonId}`);
  
  if (!lessonData) return null;
  
  return {
    ...lessonData,
    content: content || "",
  };
}

async function getAllLessonsFromKV(): Promise<Lesson[]> {
  const kv = await getKVClient();
  if (!kv) return [];
  
  const lessonIds = await kv.get<string[]>(LESSON_IDS_KEY) || [];
  const lessons: Lesson[] = [];

  for (const id of lessonIds) {
    const lesson = await kv.get<Lesson>(`${LESSON_PREFIX}${id}`);
    if (lesson) {
      lessons.push(lesson);
    }
  }
  
  return lessons.sort((a, b) => a.id.localeCompare(b.id));
}

async function saveLessonToKV(lessonData: Lesson & { markdownContent: string }): Promise<void> {
  const kv = await getKVClient();
  if (!kv) return;
  
  const lessonMetadata = {
    id: lessonData.id,
    title: lessonData.title,
    description: lessonData.description,
    duration: lessonData.duration,
    difficulty: lessonData.difficulty,
  };
  
  await kv.set(`${LESSON_PREFIX}${lessonData.id}`, lessonMetadata);
  await kv.set(`${LESSON_CONTENT_PREFIX}${lessonData.id}`, lessonData.markdownContent);
  
  // Update lesson IDs list
  const lessonIds = await kv.get<string[]>(LESSON_IDS_KEY) || [];
  if (!lessonIds.includes(lessonData.id)) {
    lessonIds.push(lessonData.id);
    await kv.set(LESSON_IDS_KEY, lessonIds);
  }
}

async function getCompletedLessonsFromKV() {
  const kv = await getKVClient();
  if (!kv) return [];
  
  return (await kv.get<string[]>(COMPLETED_LESSONS_KEY)) || [];
}

async function saveCompletedLessonsToKV(completedLessons: string[]) {
  const kv = await getKVClient();
  if (!kv) return;
  
  await kv.set(COMPLETED_LESSONS_KEY, completedLessons);
}

// Public API
export async function getLesson(lessonId: string): Promise<Lesson | null> {
  if (isVercelEnv()) {
    return await getLessonFromKV(lessonId);
  }
  return await getLessonFromFS(lessonId);
}

export async function getAllLessons(): Promise<Lesson[]> {
  if (isVercelEnv()) {
    return await getAllLessonsFromKV();
  }
  return await getAllLessonsFromFS();
}

export async function saveLesson(lessonData: Lesson & { markdownContent: string }): Promise<void> {
  if (isVercelEnv()) {
    return await saveLessonToKV(lessonData);
  }
  return await saveLessonToFS(lessonData);
}

export async function getCompletedLessons() {
  if (isVercelEnv()) {
    return await getCompletedLessonsFromKV();
  }
  return await getCompletedLessonsFromFS();
}

export async function saveCompletedLessons(completedLessons: string[]) {
  if (isVercelEnv()) {
    return await saveCompletedLessonsToKV(completedLessons);
  }
  return await saveCompletedLessonsToFS(completedLessons);
}

export async function resetLessons() {
  if (isVercelEnv()) {
    const kv = await getKVClient();
    if (!kv) return 0;
    
    const lessonIds = await kv.get<string[]>(LESSON_IDS_KEY) || [];
    let deletedCount = 0;
    
    for (const id of lessonIds) {
      await kv.del(`${LESSON_PREFIX}${id}`);
      await kv.del(`${LESSON_CONTENT_PREFIX}${id}`);
      deletedCount += 2;
    }
    
    await kv.del(LESSON_IDS_KEY);
    return deletedCount;
  } else {
    const fs = await import("fs");
    const path = await import("path");
    
    const lessonsDir = path.join(process.cwd(), "data", "lessons");
    if (!fs.existsSync(lessonsDir)) {
      return 0;
    }
    
    const files = fs.readdirSync(lessonsDir);
    let deletedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(lessonsDir, file);
      fs.unlinkSync(filePath);
      deletedCount++;
    }
    
    return deletedCount;
  }
}
