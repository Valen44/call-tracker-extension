
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
    let {period, startDateStr, endDateStr} = filter;
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

export default {
    getAllCalls,
    calculateStats,
    saveCall,
    getCall,
    filterCalls,
    calculateDayEarnings,
    deleteCall
}