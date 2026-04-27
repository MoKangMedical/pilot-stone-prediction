import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock database functions
vi.mock("./db", () => ({
  getPilotByPilotId: vi.fn().mockResolvedValue(null),
  createPilot: vi.fn().mockResolvedValue(1),
  createAssessment: vi.fn().mockResolvedValue(1),
  getAssessmentById: vi.fn().mockResolvedValue({
    id: 1,
    pilotName: "测试飞行员",
    pilotCode: "P001",
    gender: "male",
    age: 35,
    flightRisk: "25.5",
    metabolicRisk: "30.2",
    healthRisk: "20.1",
    overallRisk: "25.3",
    riskLevel: "medium",
    createdAt: new Date(),
  }),
  getAssessmentsByUserId: vi.fn().mockResolvedValue([
    {
      id: 1,
      pilotName: "测试飞行员",
      pilotCode: "P001",
      gender: "male",
      age: 35,
      flightRisk: "25.5",
      metabolicRisk: "30.2",
      healthRisk: "20.1",
      overallRisk: "25.3",
      riskLevel: "medium",
      createdAt: new Date(),
    },
  ]),
  deleteAssessment: vi.fn().mockResolvedValue(undefined),
  getApiConfigsByUserId: vi.fn().mockResolvedValue([]),
  createApiConfig: vi.fn().mockResolvedValue(1),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "测试用户",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };

  return { ctx };
}

describe("assessment.create", () => {
  it("creates a new assessment successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const input = {
      pilotName: "测试飞行员",
      pilotCode: "P001",
      gender: "male" as const,
      age: 35,
      flightDuration: 3.5,
      annualFlightHours: 600,
      aircraftType: "波音737",
      altitudeRatio: 70,
      timezoneFlights: 5,
      cockpitTemp: 24,
      diversions: 1,
      saltIntake: "medium" as const,
      metabolicData: {
        serumOxalate: 45,
        crp: 1.5,
        crpUndone: false,
        lipoprotein: 25,
        lipoproteinUndone: false,
        calcium: 2.3,
        calciumUndone: false,
        phosphorus: 1.2,
        phosphorusUndone: false,
        urineGravity: 1.015,
        urineGravityUndone: false,
        urinePH: 6.5,
        urinePHUndone: false,
        creatinine: 80,
        creatinineUndone: false,
        urea: 5.5,
        ureaUndone: false,
        uricAcid: 350,
        uricAcidUndone: false,
        alt: 25,
        altUndone: false,
        fastingGlucose: 5.2,
        fastingGlucoseUndone: false,
        hba1c: 5.5,
        hba1cUndone: false,
        pth: 45,
        pthUndone: false,
        calcitonin: 5,
        calcitoninUndone: false,
        totalCholesterol: 4.5,
        totalCholesterolUndone: false,
        hdl: 1.3,
        hdlUndone: false,
        ldl: 2.5,
        ldlUndone: false,
        triglycerides: 1.2,
        triglyceridesUndone: false,
      },
      healthData: {
        bodyFat: 22,
        bodyFatUndone: false,
        height: 175,
        weight: 70,
        waist: 85,
        hip: 95,
        systolic: 120,
        diastolic: 80,
        dvt: false,
        hydrationFrequency: 4,
        radiationExposure: 30,
        waterIntake: 2500,
        exerciseTime: 60,
        workStress: 40,
        sleepQuality: 70,
        mentalState: 75,
      },
      flightRisk: 25.5,
      metabolicRisk: 30.2,
      healthRisk: 20.1,
      overallRisk: 25.3,
      riskLevel: "medium" as const,
      suggestions: [
        {
          title: "饮水建议",
          content: "建议每日饮水量保持在2500ml以上",
        },
      ],
    };

    const result = await caller.assessment.create(input);

    expect(result).toHaveProperty("id");
    expect(result.id).toBe(1);
  });
});

describe("assessment.list", () => {
  it("returns list of assessments for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.assessment.list();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("pilotName");
    expect(result[0]).toHaveProperty("riskLevel");
  });
});

describe("assessment.export", () => {
  it("exports assessments in CSV format", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.assessment.export({ format: "csv" });

    expect(result).toHaveProperty("format", "csv");
    expect(result).toHaveProperty("data");
    expect(typeof result.data).toBe("string");
  });

  it("exports assessments in JSON format", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.assessment.export({ format: "json" });

    expect(result).toHaveProperty("format", "json");
    expect(result).toHaveProperty("data");
    expect(Array.isArray(result.data)).toBe(true);
  });
});

describe("apiConfig.create", () => {
  it("creates a new API config successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.apiConfig.create({
      name: "测试API",
      endpoint: "https://api.example.com/sync",
      apiKey: "test-api-key",
    });

    expect(result).toHaveProperty("id");
    expect(result.id).toBe(1);
  });
});

describe("apiConfig.list", () => {
  it("returns list of API configs for authenticated user", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.apiConfig.list();

    expect(Array.isArray(result)).toBe(true);
  });
});
