import { type Call } from "@/types/Call";
import dateUtils from "@/services/dateService";

type CallItemProps = {
  call: Call;
  roundCorners: "top" | "bottom" | "all";
};

export const CallItem = ({ call, roundCorners }: CallItemProps) => {
  const roundCornersClass = () => {
    let classStr = "";

    if (roundCorners === "top") classStr = "rounded-t-lg";
    else if (roundCorners === "bottom") classStr = "rounded-b-lg";
    else if (roundCorners === "all") classStr = "";

    return classStr;
  };

  const earningsText = () => {
    let text = "";

    if (call.status === "notServiced") text = "N-S";
    else if (call.status === "onGoing") text = "ON GOING";
    else text = `$${call.earnings?.toFixed(2)}`;

    return text;
  };

  return (
    <>
      <div
        className={`bg-accent p-2.5 flex justify-between items-center ${roundCornersClass()} border-b`}
      >
        <div>
          <p className="text-base">
            {dateUtils.formatTime(call.startTime)} -{" "}
            {call.endTime && call.status !== "onGoing"
              ? dateUtils.formatTime(call.endTime)
              : ""}
          </p>
          {call.duration ? (
            <p className="text-muted-foreground text-sm">
              {call.status !== "onGoing"
                ? dateUtils.formatDuration(call.duration)
                : ""}
            </p>
          ) : null}
        </div>
        <p className="text-lg font-semibold">{`${earningsText()}`}</p>
      </div>

      {call.available ? (
        <div className="bg-accent-foreground/5 dark:bg-accent-foreground/5 p-1 text-center border-b ">
          <p className="text-muted-foreground text-xs">
            {dateUtils.formatDuration(call.available)}
          </p>
        </div>
      ) : null}
    </>
  );
};
