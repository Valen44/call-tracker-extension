export type Call = {
    id: string,
    company: string,
    startTime: string,
    endTime?: string,
    duration?: number,
    earnings?: number,
    available?: number,
    status: "onGoing" | "serviced" | "notServiced"
}

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

// export const dayEarningsMock = {
//   "2025-07-20": 40,
//   "2025-07-21": 35.12,
//   "2025-07-22": 24.85,
//   "2025-07-23": 31.45,
//   "2025-06-30": 31.45,
// };

// export const callsMock: Call[] = [
//     {
//         id: "1231321",
//         startTime: new Date(2025, 6, 20, 13, 0, 0).toISOString(),
//         endTime: new Date(2025, 6, 20, 13, 4, 0).toISOString(),
//         duration: 4*60,
//         earnings: 4*0.15,
//         available: undefined,
//         status: "serviced"
//     },
//     {
//         id: "2234234",
//         startTime: new Date(2025, 6, 20, 13, 4, 30).toISOString(),
//         endTime: new Date(2025, 6, 20, 13, 6, 0).toISOString(),
//         duration: 1.5*60,
//         earnings: 0,
//         available: 30,
//         status: "notServiced"
//     },
//     {
//         id: "4234234",
//         startTime: new Date(2025, 6, 20, 13, 4, 30).toISOString(),
//         endTime: new Date(2025, 6, 20, 13, 6, 0).toISOString(),
//         duration: 1.5*60,
//         earnings: 0,
//         available: 30,
//         status: "notServiced"
//     },
//     {
//         id: "534534534",
//         startTime: new Date(2025, 6, 20, 13, 7, 0).toISOString(),
//         endTime: undefined,
//         duration: undefined,
//         earnings: undefined,
//         available: 60,
//         status: "onGoing"
//     }
// ]