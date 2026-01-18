import { z } from "zod";

export const CompanySchema = z.object({
  companyName: z.string(),
  payRate: z.number(),
  color: z.string(),
  portalConfig: z.object({
    portalLink: z.string(),
    selector: z.string(),
    rounding: z.boolean(),
    validCallDuration: z.number(),
    websiteTitleTimer: z.boolean(),
    keywords: z.object({
      available: z.array(z.string()),
      onCall: z.array(z.string()),
      acw: z.array(z.string()),
      unavailable: z.array(z.string()),
      ringing: z.array(z.string()),
    }),
  }),
});

export const CompanyArraySchema = z.array(CompanySchema);

export type Company = z.infer<typeof CompanySchema>;

// export interface Company {
//   enabled: boolean
//   companyName: string;
//   payRate: number;
//   color: string;
//   portalConfig: {
//     portalLink: string;
//     selector: string;
//     rounding: boolean;
//     validCallDuration: number;
//     websiteTitleTimer: boolean;
//     keywords: {
//       available: string[];
//       onCall: string[];
//       acw: string[];
//       unavailable: string[];
//       ringing: string[];
//     };
//   };
// }