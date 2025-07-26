import React, { useEffect, useState } from "react";
import { CallContext } from "./context/CallContext.tsx";

import { type Call } from "@/types/Call.tsx";
import { type filterCallsProps } from "@/services/callService.tsx";
import { type DayEarnings } from "@/types/Call.tsx";
import {
  type EarningsCardProps,
  EarningsCard,
} from "./sections/EarningsCard.tsx";
import { FilterSection } from "./sections/FilterSection.tsx";
import { CallsSection } from "./sections/CallsSection.tsx";
import { CalendarSection } from "./sections/CalendarSection.tsx";
import { HeaderSection } from "./sections/HeaderSection.tsx";

import callService from "@/services/callService.tsx";
import setThemeFromSettings from "@/services/themeService.tsx";

export const Dashboard: React.FC = () => {
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([]);
  const [filter, setFilter] = useState<filterCallsProps>({
    period: "today",
    startDateStr: "",
    endDateStr: "",
  });

  const [statsHeader, setStatsHeader] = useState<EarningsCardProps>({
    today: 0,
    month: 0,
    year: 0,
  });

  const [dayEarnings, setDayEarnings] = useState<DayEarnings>({});

  const getCalls = async () => {
    try {
      const [allTimeCalls, yearCalls, monthCalls, todayCalls] =
        await Promise.all([
          callService.filterCalls({ period: "allTime" }),
          callService.filterCalls({ period: "year" }),
          callService.filterCalls({ period: "month" }),
          callService.filterCalls({ period: "today" }),
        ]);

      setFilteredCalls(todayCalls);

      const updatedStats = {
        year: callService.calculateStats(yearCalls).totalEarnings,
        month: callService.calculateStats(monthCalls).totalEarnings,
        today: callService.calculateStats(todayCalls).totalEarnings,
      };

      setStatsHeader(updatedStats);

      const dayEarnings = callService.calculateDayEarnings(allTimeCalls);
      setDayEarnings(dayEarnings);
    } catch (error) {
      console.error("Error loading call data:", error);
    }
  };

  const filterCalls = (filter: filterCallsProps) => {
    setFilter(filter);
    callService.filterCalls(filter).then((calls) => { setFilteredCalls(calls); });
  };

  const reloadTable = () => {
    filterCalls(filter);
  }

  useEffect(() => {
    getCalls();
    setThemeFromSettings("dashboard");
  }, []);

  return (
    <div className="transition-colors duration-200 ease-in-out p-10">
      <CallContext.Provider value={{ reloadTable, filterCalls }}>

        <HeaderSection />

        <EarningsCard earnings={statsHeader} />

        <FilterSection />

        <section className="flex gap-6 flex-wrap min-[1150px]:flex-nowrap justify-center min-[1150px]:justify-between">
          <CallsSection calls={filteredCalls} />

          <CalendarSection dayEarnings={dayEarnings} />
        </section>

      </CallContext.Provider>
    </div>
  );
};
