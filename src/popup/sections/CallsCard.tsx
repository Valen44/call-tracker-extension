import { type Call } from "@/types/Call"
import { Card } from "@/components/ui/card"
import { CallItem } from "../CallItem";

export const CallsCard = ({calls, companyName} : {calls : Call[], companyName?: string}) => {
  return (
    <Card className="p-4 gap-0 mb-3">
        {/* <div className="mb-3">
          <h1 className="text-lg font-semibold"> {companyName ? `${companyName} | ` : ""} Today's Calls</h1>
        </div> */}

        <div className="max-h-[240px] overflow-auto rounded-lg">
          {calls.map((call, index) => {
            let roundCorners: "top" | "bottom" | "all";

            if(index === 0) roundCorners = "top";
            else if(index === calls.length - 1) roundCorners = "bottom";
            else roundCorners = "all";

            return (<CallItem call={call} roundCorners={roundCorners}/>)
          })}
        </div>
    </Card>
  )
}
