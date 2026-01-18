import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DateRangePicker from "../components/DateRangePicker.tsx";
import { useContext, useEffect, useState } from "react";
import { type filterCallsProps, type Period } from "@/services/callService";
import { CallContext } from "../context/CallContext.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import settingsService from "@/services/settingsService.tsx";


export const FilterSection = () => {
  const { setFilter } = useContext(CallContext)

  const [clearSignal, setClearSignal] = useState<number>(0);

  const [companyNames, setCompanyNames] = useState<string[]>([]);

  useEffect(() => {
    settingsService.getCompanyNameList().then((names) => {
      setCompanyNames(names);
    });
  }, [])

  const setCompanyFilter = (companyName: string) => {
    setFilter(prev => ({
      ...prev,
      companyName: companyName === "all" ? undefined : companyName,
    }));
  }

  const quickFilter = (period: Period) => {;
    setFilter(prev => ({
      ...prev,
      period: period,
      startDateStr: undefined,
      endDateStr: undefined,
    }));
    resetFilter();
  };

  const resetFilter = () => {
    setClearSignal(prev => prev + 1);
  };


  return (
    <section className="mb-6">
      <Card> <CardContent>
        <div className="grid sm:grid-cols-2 items-center gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-base">Date range:</p>
              <DateRangePicker clearSignal={clearSignal} />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-base">Company:</p>
              <Select onValueChange={setCompanyFilter} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {companyNames.map((name) => (
                    <SelectItem key={name} value={name} >{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <Button variant="secondary" className="quick-filter-btn" onClick={() => quickFilter("today")}>Today</Button>
            <Button variant="secondary" className="quick-filter-btn" onClick={() => quickFilter("week")}>This Week</Button>
            <Button variant="secondary" className="quick-filter-btn" onClick={() => quickFilter("month")}>This Month</Button>
            <Button variant="secondary" className="quick-filter-btn" onClick={() => quickFilter("allTime")}>All Time</Button>
          </div>
        </div>
      </CardContent> </Card>
    </section>
  );
};
