import React, { useEffect, useState } from "react";
import { Phone, MoonStar, Sun } from "lucide-react";
import {
  type EarningsCardProps,
  EarningsCard,
} from "./sections/EarningsCard.tsx";
import { FilterSection } from "./sections/FilterSection.tsx";
import { CallsSection } from "./sections/CallsSection.tsx";
import { type Call, callsMock } from "@/types/Call.tsx";
import { CalendarSection } from "./sections/CalendarSection.tsx";
import {
  toggleMode,
  setModeFromBrowserPreference,
} from "@/services/browserTheme";

import callService from "@/services/callService.tsx";

import { type filterCallsProps } from "@/services/callService.tsx";
import { type DayEarnings } from "@/types/Call.tsx";

import { CallContext } from "./context/CallContext.tsx";

const statsBlank = {
  totalCalls: 0,
  totalEarnings: 0.0,
  totalTime: 0,
  avgHourlyRate: 0.0,
  avgCallTime: 0.0,
  avgAvailableTime: 0.0,
};

export const Dashboard: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );

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

  const filterCalls = () => {
    callService.filterCalls(filter).then((calls) => {
      setFilteredCalls(calls);
    });
  };

  const reloadTable = () => {
    filterCalls();
  }

  const sendFilter = (filter: filterCallsProps) => {
    setFilter(filter)
  } 

  useEffect(() => {
    setModeFromBrowserPreference();
    getCalls();
  }, []);

  useEffect(() => {
    filterCalls();
  }, [filter]);

  return (
    <div className="transition-colors duration-200 ease-in-out p-10">
      <header className="flex gap-2 items-center mb-6 justify-between">
        <div className="flex gap-2 items-center">
          <div className="bg-accent-foreground rounded-2xl p-3 flex justify-center items-center">
            <Phone className="stroke-background" />
          </div>
          <h1 className="text-4xl font-bold">Call Dashboard</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            toggleMode(mode, setMode);
          }}
          className="rounded-lg px-1.5 py-1.5 shadow-md ring-1 ring-neutral-900/5 hover:bg-accent border-accent-foreground dark:ring-neutral-100/5 dark:shadow-white/10"
        >
          {mode === "light" ? <MoonStar></MoonStar> : <Sun />}
        </button>
      </header>

      <EarningsCard earnings={statsHeader} />

      <CallContext.Provider value={{reloadTable, sendFilter}}>
        <FilterSection/>
      </CallContext.Provider>

      <section className="flex gap-6 flex-wrap min-[1150px]:flex-nowrap justify-center min-[1150px]:justify-between">
        <div className="w-full">
          <CallContext.Provider value={{reloadTable, sendFilter}}>
            <CallsSection calls={filteredCalls} />
          </CallContext.Provider>
        </div>

        <div className="w-full min-[1150px]:w-min flex justify-center">
          <div className="w-full">
            <CalendarSection dayEarnings={dayEarnings} />
          </div>
        </div>
      </section>

    </div>
  );
};
