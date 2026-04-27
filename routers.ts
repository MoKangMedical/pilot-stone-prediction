import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import axios from "axios";

// 代谢指标数据验证schema
const metabolicDataSchema = z.object({
  serumOxalate: z.number().nullable(),
  serumOxalateUndone: z.boolean(),
  crp: z.number().nullable(),
  crpUndone: z.boolean(),
  lipoprotein: z.number().nullable(),
  lipoproteinUndone: z.boolean(),
  calcium: z.number().nullable(),
  calciumUndone: z.boolean(),
  phosphorus: z.number().nullable(),
  phosphorusUndone: z.boolean(),
  urineGravity: z.number().nullable(),
  urineGravityUndone: z.boolean(),
  urinePH: z.number().nullable(),
  urinePHUndone: z.boolean(),
  creatinine: z.number().nullable(),
  creatinineUndone: z.boolean(),
  urea: z.number().nullable(),
  ureaUndone: z.boolean(),
  uricAcid: z.number().nullable(),
  uricAcidUndone: z.boolean(),
  alt: z.number().nullable(),
  altUndone: z.boolean(),
  fastingGlucose: z.number().nullable(),
  fastingGlucoseUndone: z.boolean(),
  hba1c: z.number().nullable(),
  hba1cUndone: z.boolean(),
  pth: z.number().nullable(),
  pthUndone: z.boolean(),
  calcitonin: z.number().nullable(),
  calcitoninUndone: z.boolean(),
  totalCholesterol: z.number().nullable(),
  totalCholesterolUndone: z.boolean(),
  hdl: z.number().nullable(),
  hdlUndone: z.boolean(),
  ldl: z.number().nullable(),
  ldlUndone: z.boolean(),
  triglycerides: z.number().nullable(),
  triglyceridesUndone: z.boolean(),
});

// 健康指标数据验证schema
const healthDataSchema = z.object({
  bodyFat: z.number().nullable(),
  bodyFatUndone: z.boolean(),
  height: z.number().nullable(),
  weight: z.number().nullable(),
  waist: z.number().nullable(),
  hip: z.number().nullable(),
  systolic: z.number().nullable(),
  diastolic: z.number().nullable(),
  dvt: z.boolean(),
  hydrationFrequency: z.number(),
  radiationExposure: z.number(),
  waterIntake: z.number(),
  exerciseTime: z.number(),
  workStress: z.number(),
  sleepQuality: z.number(),
  mentalState: z.number(),
});

// 评估数据验证schema
const assessmentInputSchema = z.object({
  // 个人信息
  pilotName: z.string().min(1),
  pilotCode: z.string().min(1),
  gender: z.enum(["male", "female"]),
  age: z.number().min(18).max(70),
  
  // 职业特征
  flightDuration: z.number(),