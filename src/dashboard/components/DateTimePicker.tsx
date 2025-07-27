import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dateService from "@/services/dateService";

type DateTimePickerProps = {
  defaultValue?: Date;
  onSelection?: (dateTime: Date | undefined) => void;
  incHeaders?: boolean
};

export const DateTimePicker = ({
  defaultValue,
  onSelection,
  incHeaders = false
}: DateTimePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);
  const [time, setTime] = React.useState<string | undefined>(
    defaultValue
      ? dateService.formatTime(defaultValue.toISOString(), true)
      : undefined
  );

  React.useEffect(() => {
    console.log(date);
    if (!onSelection) return;

    if (!date) {
      onSelection(date);
      return
    }

    if(!time) return;

    const [hours, minutes, seconds] = time.split(":").map((v) => Number(v));
    const valid = [hours, minutes, seconds].every((v) => typeof v === "number");

    if (!valid) return;

    const composed = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
      seconds
    );

    if (isNaN(composed.getTime())) return;

    onSelection(composed);
  }, [date, time]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        {incHeaders ?
          <Label htmlFor="date-picker" className="px-1">
            Date
          </Label>
          : null
        }
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setOpen(false);
              }}
              
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        {incHeaders ?
          <Label htmlFor="time-picker" className="px-1">
            Time
          </Label>
          : null
        }
        { date? 
          <Input
            type="time"
            id="time-picker"
            step="1"
            defaultValue={time}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            onChange={(e) => {
              if (e) {
                setTime(e.target.value);
              }
            }}
          />
          : null
        }
      </div>
    </div>
  );
};
