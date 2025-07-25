const formatDuration = (seconds: number, full = false) => {
    if (seconds === 0 || seconds === null) {
        return ``;
    } else if (seconds < 60) {
        return `${seconds}s`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return remainingSeconds > 0
            ? `${minutes}m ${remainingSeconds}s`
            : `${minutes}m`;
    } else {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        if (full) return `${hours}h ${minutes}m ${remainingSeconds}s`;
        return `${hours}h ${minutes}m`;
    }
};

const formatDate = (ISODate: string) => {
    const date = new Date(ISODate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatTime = (ISODate: string, incSeconds?:boolean) => {
    if (ISODate === null) return ""

    const date = new Date(ISODate);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    
    if (incSeconds) {
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`
    }

    return `${hours}:${minutes}`;
};

const getYearBoundaries = () => {
    const now = new Date();
    const year = now.getFullYear();
    const startDate = new Date(year, 0, 1); // January 1st
    const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st

    return {
        startDate,
        endDate,
    };
};

const getMonthBoundaries = () => {
    // month is 0-indexed: January = 0, December = 11
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59); // Day 0 of next month = last day of current month

    return {
        startDate,
        endDate,
    };
};

const getWeekBoundaries = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)

  // Calculate Sunday (start of week)
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - dayOfWeek,
    0, 0, 0
  );

  // Calculate Saturday (end of week)
  const endDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + (6 - dayOfWeek),
    23, 59, 59
  );

  return {
    startDate,
    endDate,
  };
};

const getTodayBoundaries = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();

    const startDate = new Date(year, month, day, 0, 0, 0);
    const endDate = new Date(year, month, day, 23, 59, 59);

    return {
        startDate,
        endDate,
    };
};

const getDateBoundaries = (startDateStr: string, endDateStr: string) => {

    const start = startDateStr.split("-")
    const end = endDateStr.split("-")

    const startDate = new Date(Number(start[0]), Number(start[1]) - 1, Number(start[2]), 0, 0, 0);
    const endDate = new Date(Number(end[0]), Number(end[1]) - 1, Number(end[2]), 23, 59, 59);


    return {
        startDate,
        endDate,
    };
};


export default {
    formatDuration,
    formatDate,
    formatTime,
    getDateBoundaries,
    getMonthBoundaries,
    getYearBoundaries,
    getTodayBoundaries,
    getWeekBoundaries
};
