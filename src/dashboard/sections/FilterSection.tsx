import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DateRangePicker from "../components/DateRangePicker.tsx" ;
import type { DateRangeRef } from "../components/DateRangePicker.tsx";
import { useContext, useRef, useState } from "react";
import { type Period } from "@/services/callService";
import { CallContext } from "../context/CallContext.tsx";


export const FilterSection = () => {
  const {sendFilter} = useContext(CallContext)

  const [clearSignal, setClearSignal] = useState<number>(0);


  const quickFilter = (period: Period) => {
    const quickFilter = { period };
    sendFilter(quickFilter);
    resetFilter();
  };

  const resetFilter = () => {
    setClearSignal(prev => prev + 1);
  };


  return (
    <section className="mb-6">
      <Card> <CardContent>
        <div className="grid sm:grid-cols-2 items-center gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-base">Filter by date range:</p>
            <DateRangePicker clearSignal={clearSignal}/>
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
