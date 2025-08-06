import { useState, useEffect } from "react";

import { Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { StatsCard } from "./sections/StatsCard";
import { CallsCard } from "./sections/CallsCard";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

import callService from "@/services/callService";
import { type CallStats, type Call } from "@/types/Call";
import setThemeFromSettings from "@/services/themeService";

export const PopUp = () => {

  const [stats, setStats] = useState<CallStats>({
    totalCalls: 0,
    totalEarnings: 0.0,
    totalTime: 0,
    avgHourlyRate: 0.0,
    avgCallTime: 0.0,
    avgAvailableTime: 0.0,
  })
  const [monthEarnings, setMonthEarnings] = useState<number>(0.0);


  useEffect(() => {
    console.log("Fetching calls...")
    callService.filterCalls({ period: "today" }).then((calls) => {
      calls.reverse();
      setCalls(calls);
      const stats = callService.calculateStats(calls);
      setStats(stats);
    });

    callService.filterCalls({ period: "month" }).then((calls) => {
      const monthEarnings = callService.calculateStats(calls).totalEarnings;
      setMonthEarnings(monthEarnings);
    })

    setThemeFromSettings("popup")
  }, []);

  const [calls, setCalls] = useState<Call[]>([])

  const openDashboard = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/dashboard/dashboard.html') });
  }

  return (
    <div className="w-[350px] px-4 pt-4 pb-2 transition-colors duration-200 ease-in-out">
      <header className="flex gap-2 items-center justify-center mb-3">
        <div className="bg-accent-foreground rounded-2xl p-3 flex justify-center items-center">
          <Phone className="stroke-background" />
        </div>
        <h1 className="text-4xl font-bold">Call Tracker</h1>
      </header>

      <Separator className="mb-3" />

      <StatsCard stats={stats} monthEarnings={monthEarnings} />

      <CallsCard calls={calls} />

      <div className="flex justify-center gap-2">
        <Button onClick={() => openDashboard()}><ExternalLink /> Dashboard</Button>
        <a href='https://ko-fi.com/S6S31J8RFT' target='_blank'>
          <Button>
            <img src="https://storage.ko-fi.com/cdn/brandasset/v2/kofi_symbol.png" width={20} height={20}></img>
            Donations
          </Button>
        </a>
      </div>

    </div>
  );
};
