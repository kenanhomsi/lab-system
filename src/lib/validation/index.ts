import { z, type ZodType } from "zod";

const MSG_REQUIRED = "هذا الحقل مطلوب";
const MSG_EMAIL = "البريد الإلكتروني غير صالح";

const mobileSchema = z
  .string({ error: () => MSG_REQUIRED })
  .min(8, "رقم الجوال قصير جداً")
  .max(20, "رقم الجوال طويل جداً")
  .regex(/^[\d+\s()\-]+$/, "صيغة رقم الجوال غير صالحة");

export const loginSchema = z.object({
  identifier: z
    .string({ error: () => MSG_REQUIRED })
    .min(3, "أدخل البريد أو الجوال (3 أحرف على الأقل)")
    .max(120, "القيمة طويلة جداً"),
  password: z
    .string({ error: () => MSG_REQUIRED })
    .min(1, "كلمة المرور مطلوبة")
    .max(128, "كلمة المرور طويلة جداً"),
  role: z.enum(["patient", "doctor", "lab", "special"], {
    error: () => "نوع الحساب غير صالح",
  }),
});

export const registerSchema = z
  .object({
    role: z.enum(["patient", "doctor", "lab"], {
      error: () => "نوع الحساب غير صالح",
    }),
    email: z.email(MSG_EMAIL),
    mobile: mobileSchema,
    fullName: z
      .string({ error: () => MSG_REQUIRED })
      .min(2, "الاسم يجب أن يكون حرفين على الأقل")
      .max(120, "الاسم طويل جداً"),
    city: z
      .string({ error: () => MSG_REQUIRED })
      .min(2, "اسم المدينة مطلوب")
      .max(80, "اسم المدينة طويل جداً"),
    password: z
      .string({ error: () => MSG_REQUIRED })
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .max(128, "كلمة المرور طويلة جداً"),
    age: z.coerce.number().optional(),
    gender: z.enum(["male", "female"]).optional(),
    specialty: z.string().max(120).optional(),
    labName: z.string().max(120).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "patient") {
      if (data.age === undefined || Number.isNaN(data.age)) {
        ctx.addIssue({
          code: "custom",
          message: "العمر مطلوب للمريض",
          path: ["age"],
        });
      } else if (data.age < 0 || data.age > 130) {
        ctx.addIssue({
          code: "custom",
          message: "العمر غير معقول",
          path: ["age"],
        });
      }
      if (!data.gender) {
        ctx.addIssue({
          code: "custom",
          message: "الجنس مطلوب للمريض",
          path: ["gender"],
        });
      }
    }
    if (data.role === "doctor" && !data.specialty?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "التخصص مطلوب للطبيب",
        path: ["specialty"],
      });
    }
    if (data.role === "lab" && !data.labName?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "اسم المخبر مطلوب",
        path: ["labName"],
      });
    }
  });

export const appointmentSchema = z.object({
  patientName: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "اسم المريض مطلوب")
    .max(120, "الاسم طويل جداً"),
  age: z.coerce
    .number({ error: () => "العمر مطلوب" })
    .int("العمر يجب أن يكون رقماً صحيحاً")
    .min(0, "العمر غير صالح")
    .max(130, "العمر غير معقول"),
  gender: z.enum(["male", "female"], { error: () => "اختر الجنس" }),
  mobile: mobileSchema,
  drawLocation: z.enum(["lab", "home", "work"], {
    error: () => "موقع السحب غير صالح",
  }),
  dateTime: z.iso.datetime({ error: () => "التاريخ والوقت غير صالحين" }),
  requiredTests: z
    .string({ error: () => MSG_REQUIRED })
    .min(3, "صف التحاليل المطلوبة")
    .max(2000, "النص طويل جداً"),
  prescriptionImage: z.string().max(500).optional(),
  medicalCondition: z.string().max(1000).optional(),
  address: z
    .string({ error: () => MSG_REQUIRED })
    .min(5, "العنوان مطلوب")
    .max(500, "العنوان طويل جداً"),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  savedAddressId: z.string().max(80).optional(),
  referredByDoctorId: z.string().max(80).optional(),
});

const optionalUrl = z
  .string()
  .max(2000)
  .optional()
  .refine((v) => v === undefined || v === "" || /^https?:\/\/.+/i.test(v), {
    message: "رابط الملف غير صالح",
  });

export const insuranceRequestSchema = z.object({
  insuredName: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "اسم المؤمن مطلوب")
    .max(120, "الاسم طويل جداً"),
  insuranceNumber: z
    .string({ error: () => MSG_REQUIRED })
    .min(3, "رقم التأمين مطلوب")
    .max(50, "رقم التأمين طويل جداً"),
  mobile: mobileSchema,
  cardImageUrl: optionalUrl,
  prescriptionImageUrl: optionalUrl,
});

export const complaintSchema = z.object({
  name: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "الاسم مطلوب")
    .max(120, "الاسم طويل جداً"),
  title: z
    .string({ error: () => MSG_REQUIRED })
    .min(3, "عنوان الشكوى مطلوب")
    .max(200, "العنوان طويل جداً"),
  text: z
    .string({ error: () => MSG_REQUIRED })
    .min(10, "نص الشكوى قصير جداً")
    .max(5000, "نص الشكوى طويل جداً"),
  attachmentUrl: optionalUrl,
});

export const careerApplicationSchema = z.object({
  fullName: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "الاسم الكامل مطلوب")
    .max(120, "الاسم طويل جداً"),
  city: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "المدينة مطلوبة")
    .max(80, "اسم المدينة طويل جداً"),
  mobile: mobileSchema,
  email: z.email(MSG_EMAIL),
  degree: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "المؤهل مطلوب")
    .max(120, "القيمة طويلة جداً"),
  previousExperience: z
    .string({ error: () => MSG_REQUIRED })
    .min(5, "اذكر الخبرة السابقة")
    .max(4000, "النص طويل جداً"),
  yearsOfExperience: z.coerce
    .number({ error: () => "سنوات الخبرة مطلوبة" })
    .min(0, "سنوات الخبرة غير صالحة")
    .max(60, "سنوات الخبرة غير معقولة"),
  skills: z
    .string({ error: () => MSG_REQUIRED })
    .min(3, "اذكر المهارات")
    .max(2000, "النص طويل جداً"),
  additionalCertifications: z.string().max(2000).optional(),
  vacancyId: z.string({ error: () => MSG_REQUIRED }).min(1, "الوظيفة مطلوبة"),
  cvUrl: z
    .string({ error: () => MSG_REQUIRED })
    .min(1, "ملف السيرة الذاتية مطلوب")
    .refine((v) => /^https?:\/\/.+/i.test(v), "رابط السيرة غير صالح"),
});

export const clientApplicationSchema = z.object({
  managerName: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "اسم المسؤول مطلوب")
    .max(120, "الاسم طويل جداً"),
  labName: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "اسم المخبر مطلوب")
    .max(120, "الاسم طويل جداً"),
  mobile: mobileSchema,
  email: z.email(MSG_EMAIL),
  address: z
    .string({ error: () => MSG_REQUIRED })
    .min(5, "العنوان مطلوب")
    .max(500, "العنوان طويل جداً"),
  additionalInfo: z.string().max(2000).optional(),
});

export const contactSchema = z.object({
  name: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "الاسم مطلوب")
    .max(120, "الاسم طويل جداً"),
  message: z
    .string({ error: () => MSG_REQUIRED })
    .min(10, "الرسالة قصيرة جداً")
    .max(4000, "الرسالة طويلة جداً"),
});

const labOrderTestSchema = z.object({
  testId: z.string({ error: () => MSG_REQUIRED }).min(1, "معرف التحليل مطلوب"),
  testName: z
    .string({ error: () => MSG_REQUIRED })
    .min(1, "اسم التحليل مطلوب")
    .max(200, "الاسم طويل جداً"),
  requiredSample: z
    .string({ error: () => MSG_REQUIRED })
    .min(1, "نوع العينة مطلوب")
    .max(120, "القيمة طويلة جداً"),
  price: z.coerce
    .number({ error: () => "السعر مطلوب" })
    .min(0, "السعر لا يمكن أن يكون سالباً")
    .max(1e7, "السعر كبير جداً"),
});

const labOrderPatientSchema = z.object({
  name: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "اسم المريض مطلوب")
    .max(120, "الاسم طويل جداً"),
  age: z.coerce
    .number({ error: () => "العمر مطلوب" })
    .int("العمر يجب أن يكون رقماً صحيحاً")
    .min(0, "العمر غير صالح")
    .max(130, "العمر غير معقول"),
  gender: z.enum(["male", "female"], { error: () => "اختر الجنس" }),
  tests: z.array(labOrderTestSchema).min(1, "أضف تحليلاً واحداً على الأقل"),
});

export const labOrderSchema = z.object({
  date: z.iso.date({ error: () => "تاريخ الطلب غير صالح" }),
  patients: z
    .array(labOrderPatientSchema)
    .min(1, "أضف مريضاً واحداً على الأقل"),
});

export const paymentSchema = z.object({
  date: z.iso.date({ error: () => "التاريخ غير صالح" }),
  amount: z.coerce
    .number({ error: () => "المبلغ مطلوب" })
    .positive("المبلغ يجب أن يكون أكبر من صفر")
    .max(1e12, "المبلغ كبير جداً"),
  description: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "الوصف مطلوب")
    .max(500, "الوصف طويل جداً"),
  note: z.string().max(500).optional(),
});

export const expenseSchema = z.object({
  date: z.iso.date({ error: () => "التاريخ غير صالح" }),
  amount: z.coerce
    .number({ error: () => "المبلغ مطلوب" })
    .positive("المبلغ يجب أن يكون أكبر من صفر")
    .max(1e12, "المبلغ كبير جداً"),
  expenseType: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "نوع المصروف مطلوب")
    .max(120, "القيمة طويلة جداً"),
  note: z.string().max(500).optional(),
});

export const taskSchema = z.object({
  title: z
    .string({ error: () => MSG_REQUIRED })
    .min(2, "عنوان المهمة مطلوب")
    .max(200, "العنوان طويل جداً"),
  description: z.string().max(2000).optional(),
  dueDate: z.iso.date({ error: () => "تاريخ الاستحقاق غير صالح" }),
  dueTime: z
    .string()
    .optional()
    .refine(
      (v) => v === undefined || v === "" || /^([01]?\d|2[0-3]):[0-5]\d$/.test(v),
      { message: "صيغة الوقت غير صالحة (HH:MM)" },
    ),
  reminderEnabled: z.coerce.boolean(),
});

export function getValidationErrors(
  schema: ZodType,
  data: unknown,
): Record<string, string> {
  const result = schema.safeParse(data);
  if (result.success) {
    return {};
  }
  const flat = result.error.flatten();
  const out: Record<string, string> = {};
  const fieldErrors = flat.fieldErrors as Record<string, string[] | undefined>;
  for (const [key, messages] of Object.entries(fieldErrors)) {
    const first = messages?.[0];
    if (first) {
      out[key] = first;
    }
  }
  return out;
}
