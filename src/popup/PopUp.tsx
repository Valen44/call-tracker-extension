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
import settingsService from "@/services/settingsService";
import { ProgressCard } from "./sections/ProgressCard";

export const PopUp = () => {

  const [portalStats, setPortalStats] = useState<CallStats>({
    totalCalls: 0,
    totalEarnings: 0.0,
    totalTime: 0,
    avgHourlyRate: 0.0,
    avgCallTime: 0.0,
    avgAvailableTime: 0.0,
  })

  const [companyName, setCompanyName] = useState<string | undefined>(undefined);

  const [todayTotalEarnings, setTodayTotalEarnings] = useState<number>(0.0);

  const [calls, setCalls] = useState<Call[]>([])


  useEffect(() => {

    function getActiveTabUrl(): Promise<string | undefined> {
      return new Promise(resolve => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          resolve(tabs[0]?.url);
        });
      });
    }

    async function loadData() {
      console.log("Fetching calls...");

      // Getting config
      const link = await getActiveTabUrl();
      const config = await settingsService.getPortalConfig(link || "");
      const companyName = config?.companyName;
      setCompanyName(companyName);


      // Today calls
      const todayCalls = await callService.filterCalls({
        period: "today",
        companyName,
      });

      todayCalls.reverse();
      setCalls(todayCalls);
      setPortalStats(callService.calculateStats(todayCalls));

      // Today calls w/o company filter
      const todayCallsNoCompany = await callService.filterCalls({
        period: "today"
      });
      setTodayTotalEarnings(callService.calculateStats(todayCallsNoCompany).totalEarnings)

      setThemeFromSettings("popup");
    }

    loadData().catch(console.error);
  }, []);


  const openDashboard = () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('src/dashboard/dashboard.html') });
  }

  return (
    <div className="w-[350px] px-4 pt-4 pb-2 transition-colors duration-200 ease-in-out">
      <header className="flex gap-2 items-center justify-center mb-3">
        <div className="bg-accent-foreground rounded-lg p-2 flex justify-center items-center">
          <Phone className="stroke-background w-4 h-4" />
        </div>
        <h1 className="text-2xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">
          {companyName ? `Call Tracker - ${companyName}` : "Call Tracker"}
        </h1>
      </header>

      <Separator className="mb-3" />

      <StatsCard stats={portalStats} todayTotalEarnings={todayTotalEarnings} />

      <CallsCard calls={calls} companyName={companyName} />

      <ProgressCard todayTotalEarnings={todayTotalEarnings}></ProgressCard>

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
