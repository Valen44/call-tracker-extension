
import dateUtils from "./dateService";
import { type Call, type CallStats, type DayEarnings } from "@/types/Call";

const saveCall = async (callData: Call) => {
    try {
        const result = await chrome.storage.local.get(['calls']);
        const calls = result.calls || {};
        calls[callData.id] = callData;
        await chrome.storage.local.set({ calls });
    } catch (error) {
        console.error('Error saving call:', error);
    }
}

const deleteCall = async (callID: string) => {
    try {
      const result = await chrome.storage.local.get(["calls"]);
      const calls = result.calls || {};
      delete calls[callID];
      await chrome.storage.local.set({ calls });
      
    } catch (error) {
      console.error("Error deleting call:", error);
    }
}

const getCall = async (callID: string): Promise<Call | null> => {
    try {
        const result = await chrome.storage.local.get(['calls']);
        const calls = result.calls || {};
        return calls[callID];
    } catch (error) {
        console.error('Error getting call:', error);
        return null;
    }
}

const getAllCalls = async (): Promise<Call[]> => {
    try {
        const result = await chrome.storage.local.get(['calls']);
        const allCalls = result.calls || {};
        return Object.values(allCalls)

    } catch (error) {
        console.error('Error loading calls:', error);
        return []
    }
}

export type Period = "today" | "week" | "month" | "year" | "allTime" | "custom"

export type filterCallsProps = {
    period: Period,
    startDateStr?: string,
    endDateStr?: string,
};

const filterCalls = async (filter : filterCallsProps): Promise<Call[]> => {
    const allCalls = await getAllCalls();
    const {period, startDateStr, endDateStr} = filter;
    let startDate: Date;
    let endDate: Date;

    if (period === "today") 
        ({ startDate, endDate } = dateUtils.getTodayBoundaries());
    else if (period === "week")
        ({ startDate, endDate } = dateUtils.getWeekBoundaries());
    else if (period === "month")
        ({ startDate, endDate } = dateUtils.getMonthBoundaries());
    else if (period === "year")
        ({ startDate, endDate } = dateUtils.getYearBoundaries());
    else if (period === "allTime")
        return allCalls
    else if (period === "custom" && startDateStr && endDateStr)
    ({ startDate, endDate } = dateUtils.getDateBoundaries(startDateStr, endDateStr));

    const filteredCalls = allCalls.filter((call) => {
        const callDate = new Date(call.startTime);
        return callDate >= startDate && callDate <= endDate;
    });

    return filteredCalls
}

const calculateStats = (calls: Call[]) : CallStats => {
    const totalCalls = calls.length;
    const totalEarnings = calls.reduce((sum, call) => sum + (call.earnings || 0), 0);
    const totalDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0);
    const totalAvail = calls.reduce((sum, call) => call.available ? sum + call.available : sum + 0, 0);
    const avgHourlyRate = totalDuration / (totalDuration + totalAvail) * 0.15 * 60 || 0.0;
    const avgCallTime = Math.round(totalDuration / totalCalls) || 0;
    const avgAvailableTime = Math.round(totalAvail / totalCalls) || 0;

    return {
        totalCalls: totalCalls,
        totalEarnings: totalEarnings,
        totalTime: totalDuration,
        avgHourlyRate: avgHourlyRate,
        avgCallTime: avgCallTime,
        avgAvailableTime: avgAvailableTime
    }
}

const calculateDayEarnings = (calls: Call[]) : DayEarnings   => {
    const dayEarnings : DayEarnings = {}

    calls.map((call) => {
        const date = dateUtils.formatDate(call.startTime);
        const earnings = call.earnings ?? 0
        dayEarnings[date] = (dayEarnings[date] || 0) + earnings
    });

    return dayEarnings
}

const resolveNotFinishedCalls = async () => {
    const calls = await getAllCalls();

    const filteredCalls = calls.filter((call) => call.status === "onGoing");

    filteredCalls.map((call) => {
       if (call.endTime === undefined) {
        call.endTime = call.startTime;
        call.duration = 0;
      }

      if (call.duration !== undefined && call.duration < 120) {
        call.earnings = 0;
        call.status = "notServiced";
      } else call.status = "serviced";

      saveCall(call);
    });
  }

const calculateDuration = (startTime: Date, endTime: Date) => {
    const duration = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000); 

    // Calculate minutes and round to 30s
    let minutes = Math.floor(duration / 60);
    if (duration % 60 >= 30) minutes += 1;

    return {duration, minutes}
}

const exportCalls = async (): Promise<Call[]> => {
  const allCalls = await getAllCalls();
  // Filter out ongoing calls before exporting
  return allCalls.filter(call => call.status !== "onGoing");
};

const importCalls = async (callsToImport: Call[]) => {
  const result = await chrome.storage.local.get(['calls']);
  const existingCalls = result.calls || {};
  const importedCalls: { [key: string]: Call } = {};
  let skippedCount = 0;
  const totalCallsToImport = callsToImport.length;

  for (const call of callsToImport) {
    // Check if call with the same ID already exists
    if (existingCalls[call.id]) {
      console.warn(`Skipping import of duplicate call ID: ${call.id}`);
      skippedCount++;
      continue;
    }
    // Validate calls before importing
    if (call.status === "onGoing") {
      console.warn(`Skipping import of ongoing call: ${call.id}`);
      skippedCount++;
      continue;
    }
    if (call.endTime === undefined || new Date(call.endTime) < new Date(call.startTime)) {
      console.warn(`Skipping import of invalid call (endTime before startTime or missing endTime): ${call.id}`);
      skippedCount++;
      continue;
    }
    importedCalls[call.id] = call;
  }

  const updatedCalls = { ...existingCalls, ...importedCalls };
  await chrome.storage.local.set({ calls: updatedCalls });

  return { skippedCount, totalCallsToImport };
};

const deleteAllCalls = async () => {
  try {
    await chrome.storage.local.remove('calls');
  } catch (error) {
    console.error('Error deleting all calls:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
};

export default {
    getAllCalls,
    calculateStats,
    saveCall,
    getCall,
    filterCalls,
    calculateDayEarnings,
    deleteCall,
    resolveNotFinishedCalls,
    calculateDuration,
    exportCalls,
    importCalls,
    deleteAllCalls,
}