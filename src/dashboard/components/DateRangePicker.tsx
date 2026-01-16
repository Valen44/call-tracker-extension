import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { type filterCallsProps } from "@/services/callService"
import dateService from "@/services/dateService"

import { CallContext } from "../context/CallContext.tsx";

export type DateRangeRef = {
  clearPicker: () => void;
};

export default function DateRangePicker({ clearSignal }: { clearSignal: number }) {

  const { filterCalls, setFilter } = React.useContext(CallContext)

  const [range, setRange] = React.useState<DateRange | undefined>(undefined)

  const sendRange = (range: DateRange | undefined) => {
    setRange(range);

    if (!range?.from || !range?.to) return;

    const { from, to } = range;

    setFilter(prev => ({
      ...prev,
      period: "custom",
      startDateStr: dateService.formatDate(from.toISOString()),
      endDateStr: dateService.formatDate(to.toISOString()),
    }));
  };

  React.useEffect(() => {
    setRange(undefined);
  }, [clearSignal])

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="w-56 justify-between font-normal"
          >
            {range?.from && range?.to
              ? `${range.from.toISOString().split("T")[0]} - ${range.to.toISOString().split("T")[0]}`
              : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={range}
            captionLayout="dropdown"
            onSelect={(range) => {
              sendRange(range)

            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
