/* eslint-disable no-undef */
import utils from "./utilsService";

const saveCall = async (callData) => {
    try {
        const result = await chrome.storage.local.get(['calls']);
        const calls = result.calls || {};
        calls[callData.id] = callData;
        await chrome.storage.local.set({ calls });
    } catch (error) {
        console.error('Error saving call:', error);
    }
}

const getCall = async (callID) => {
    try {
        const result = await chrome.storage.local.get(['calls']);
        const calls = result.calls || {};
        return calls[callID];
    } catch (error) {
        console.error('Error getting call:', error);
        return null;
    }
}

const getAllCalls = async () => {
    try {
        const result = await chrome.storage.local.get(['calls']);
        const allCalls = result.calls || {};
        return Object.values(allCalls)

    } catch (error) {
        console.error('Error loading calls:', error);
    }
}


const filterCalls = async (filter={period: null, startDate: null, endDate: null}) => {
    const allCalls = await getAllCalls();
    let {period, startDate, endDate} = filter;

    if (period === "today") {
        ({ startDate, endDate } = utils.getTodayBoundaries());
    } else if (period === "month") {
        ({ startDate, endDate } = utils.getMonthBoundaries());
    } else if (period === "year") {
        ({ startDate, endDate } = utils.getYearBoundaries());
    } else if (period === "allTime") {
        return allCalls
    } else if (period === "custom") {
        ({ startDate, endDate } = utils.getDateBoundaries(startDate, endDate));
    }

    const filteredCalls = allCalls.filter((call) => {
        const callDate = new Date(call.startTime);
        return callDate >= startDate && callDate <= endDate;
    });

    return filteredCalls
}

const calculateStats = (calls) => {
    const totalCalls = calls.length;
    const totalEarnings = calls.reduce((sum, call) => sum + (call.earnings || 0), 0);
    const totalDuration = calls.reduce((sum, call) => sum + call.duration, 0);
    const totalAvail = calls.reduce((sum, call) => call.avail ? sum + call.avail : sum + 0, 0);
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

export default {
    getAllCalls,
    calculateStats,
    saveCall,
    getCall,
    filterCalls
}