import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import dateUtils from "../../services/dateService";
import { type DayEarnings } from "@/types/Call";
export const CalendarSection = ({
  dayEarnings,
}: {
  dayEarnings: DayEarnings;
}) => {
  return (
    <div className="w-full min-[1150px]:w-min flex justify-center">
      <div className="w-full">
        <Card><CardContent>
          <div className="flex justify-center">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              showOutsideDays={true}
              fixedWeeks
              className=" rounded-lg bg-card [--cell-size:--spacing(11)] md:[--cell-size:--spacing(13)]"
              formatters={{
                formatMonthDropdown: (date) => {
                  return date.toLocaleString("default", { month: "long" });
                },
              }}
              components={{
                DayButton: ({ children, modifiers, day, ...props }) => {
                  const key = dateUtils.formatDate(day.date.toISOString());
                  const isOutside = modifiers.outside;

                  return (
                    <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                      <span className={!isOutside ? "font-bold" : "font-light"}>
                        {children}
                      </span>
                      {
                        <span
                          className={
                            !isOutside ? "font-medium text-green-700" : "font-light"
                          }
                        >
                          {dayEarnings[key] ? `$${dayEarnings[key].toFixed(2)}` : ""}
                        </span>
                      }
                    </CalendarDayButton>
                  );
                },
              }}
              onSelect={() => null}
              onDayFocus={() => null}
            />
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
};
