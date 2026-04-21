import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, pilots, assessments, apiConfigs, InsertPilot, InsertAssessment, InsertApiConfig, pilotStoneResearch, researchFigures, researchStatistics, InsertPilotStoneResearch, InsertResearchFigure, InsertResearchStatistic } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== User Functions ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== Pilot Functions ====================

export async function createPilot(data: InsertPilot) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(pilots).values(data);
  return result[0].insertId;
}

export async function getPilotByPilotId(pilotId: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(pilots).where(eq(pilots.pilotId, pilotId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPilotsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(pilots).where(eq(pilots.userId, userId)).orderBy(desc(pilots.createdAt));
  return result;
}

export async function updatePilot(id: number, data: Partial<InsertPilot>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(pilots).set(data).where(eq(pilots.id, id));
}

export async function upsertPilot(data: InsertPilot) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getPilotByPilotId(data.pilotId);
  if (existing) {
    await updatePilot(existing.id, data);
    return existing.id;
  } else {
    return await createPilot(data);
  }
}

// ==================== Assessment Functions ====================

export async function createAssessment(data: InsertAssessment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(assessments).values(data);
  return result[0].insertId;
}

export async function getAssessmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(assessments).where(eq(assessments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAssessmentsByPilotId(pilotId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(assessments).where(eq(assessments.pilotId, pilotId)).orderBy(desc(assessments.createdAt));
  return result;
}

export async function getAssessmentsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(assessments).where(eq(assessments.userId, userId)).orderBy(desc(assessments.createdAt));
  return result;
}

export async function getAllAssessments() {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(assessments).orderBy(desc(assessments.createdAt));
  return result;
}

export async function updateAssessmentSyncStatus(id: number, syncedToRemote: boolean, remoteId?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(assessments).set({ 
    syncedToRemote, 
    remoteId: remoteId || null 
  }).where(eq(assessments.id, id));
}

export async function deleteAssessment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(assessments).where(eq(assessments.id, id));
}

// ==================== API Config Functions ====================

export async function createApiConfig(data: InsertApiConfig) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(apiConfigs).values(data);
  return result[0].insertId;
}

export async function getApiConfigsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(apiConfigs).where(eq(apiConfigs.userId, userId)).orderBy(desc(apiConfigs.createdAt));
  return result;
}

export async function getActiveApiConfig(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(apiConfigs)
    .where(and(eq(apiConfigs.userId, userId), eq(apiConfigs.isActive, true)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateApiConfig(id: number, data: Partial<InsertApiConfig>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(apiConfigs).set(data).where(eq(apiConfigs.id, id));
}

export async function deleteApiConfig(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(apiConfigs).where(eq(apiConfigs.id, id));
}

export async function updateApiConfigLastSync(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(apiConfigs).set({ lastSyncAt: new Date() }).where(eq(apiConfigs.id, id));
}


/**
 * 获取所有研究论文
 */
export async function getAllResearch() {
  const db = await getDb();
  if (!db) return [];
  const { desc } = await import('drizzle-orm');
  return await db
    .select()
    .from(pilotStoneResearch)
    .orderBy(desc(pilotStoneResearch.publicationYear));
}

/**
 * 获取特定研究的图表
 */
export async function getResearchFiguresByResearchId(researchId: number) {
  const db = await getDb();
  if (!db) return [];
  const { eq } = await import('drizzle-orm');
  return await db
    .select()
    .from(researchFigures)
    .where(eq(researchFigures.researchId, researchId));
}

/**
 * 获取研究统计数据
 */
export async function getResearchStatisticsByType(statisticType: string) {
  const db = await getDb();
  if (!db) return [];
  const { eq, asc } = await import('drizzle-orm');
  return await db
    .select()
    .from(researchStatistics)
    .where(eq(researchStatistics.statisticType, statisticType))
    .orderBy(asc(researchStatistics.label));
}

/**
 * 获取所有研究统计类型
 */
export async function getResearchStatisticTypes() {
  const db = await getDb();
  if (!db) return [];
  try {
    const results = await db
      .selectDistinct({
        statisticType: researchStatistics.statisticType,
      })
      .from(researchStatistics);
    return results.map(r => r.statisticType);
  } catch (error) {
    console.error("Error fetching research statistic types:", error);
    return [];
  }
}

/**
 * 创建研究论文
 */
export async function createResearch(data: InsertPilotStoneResearch) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pilotStoneResearch).values(data);
  return result;
}

/**
 * 创建研究图表
 */
export async function createResearchFigure(data: InsertResearchFigure) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(researchFigures).values(data);
  return result;
}

/**
 * 创建研究统计数据
 */
export async function createResearchStatistic(data: InsertResearchStatistic) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(researchStatistics).values(data);
  return result;
}
