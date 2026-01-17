import { z } from "zod";

export const CallSchema = z.object({
  id: z.string(),
  company: z.string(),
  startTime: z.string(),
  endTime: z.string().optional(),
  duration: z.number().optional(),
  earnings: z.number().optional(),
  available: z.number().optional(),
  status: z.enum(["onGoing", "serviced", "notServiced"]),
  // add other fields your Call has
});


export const CallArraySchema = z.array(CallSchema);

export type Call = z.infer<typeof CallSchema>;

// export type Call = {
//     id: string,
//     company: string,
//     startTime: string,
//     endTime?: string,
//     duration?: number,
//     earnings?: number,
//     available?: number,
//     status: "onGoing" | "serviced" | "notServiced"
// }

export type CallStats = {
    totalCalls: number,
    totalEarnings: number,
    totalTime: number,
    avgHourlyRate: number,
    avgCallTime: number,
    avgAvailableTime: number
}

export type DayEarnings = {
    [date: string]: number;
};
