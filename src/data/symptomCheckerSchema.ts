import { z } from "zod";

// Schema for additional user information
export const userInfoSchema = z.object({
  age: z.string().optional()
    .refine(val => !val || !isNaN(Number(val)), {
      message: "Age must be a number",
    })
    .refine(val => !val || (Number(val) >= 0 && Number(val) <= 120), {
      message: "Age must be between 0 and 120",
    }),
  gender: z.enum(["male", "female", "other", "not_specified"]).optional(),
  preExistingConditions: z.array(z.string()).default([]),
  symptomDuration: z.enum(["not_specified", "less_than_day", "1_3_days", "3_7_days", "1_2_weeks", "more_than_2_weeks"]).optional(),
  additionalInfo: z.string().max(500, "Additional information should be less than 500 characters").optional(),
});

export type UserInfoInputs = z.infer<typeof userInfoSchema>;

// Predefined pre-existing condition options
export const preExistingConditionOptions = [
  { value: "diabetes", label: "Diabetes" },
  { value: "hypertension", label: "Hypertension (High Blood Pressure)" },
  { value: "asthma", label: "Asthma" },
  { value: "heart_disease", label: "Heart Disease" },
  { value: "arthritis", label: "Arthritis" },
  { value: "thyroid_disorder", label: "Thyroid Disorder" },
  { value: "kidney_disease", label: "Kidney Disease" },
  { value: "liver_disease", label: "Liver Disease" },
  { value: "cancer", label: "Cancer" },
  { value: "depression", label: "Depression" },
  { value: "anxiety", label: "Anxiety Disorder" },
];

// Symptom duration options
export const symptomDurationOptions = [
  { value: "not_specified", label: "Select duration" },
  { value: "less_than_day", label: "Less than 1 day" },
  { value: "1_3_days", label: "1-3 days" },
  { value: "3_7_days", label: "3-7 days" },
  { value: "1_2_weeks", label: "1-2 weeks" },
  { value: "more_than_2_weeks", label: "More than 2 weeks" },
];

// Gender options
export const genderOptions = [
  { value: "not_specified", label: "Select gender (optional)" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];