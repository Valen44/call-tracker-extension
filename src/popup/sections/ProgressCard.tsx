import { Card } from "@/components/ui/card"
import settingsService, { type ExtensionSettings } from "@/services/settingsService"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"

export const ProgressCard = ({ todayTotalEarnings }: { todayTotalEarnings: number }) => {

  const [goal, setGoal] = useState<number | null>(null);

  const progressValue = goal ? Math.min((todayTotalEarnings / goal) * 100, 100) : 0;

  let progressColor;
  if (progressValue < 33) {
    progressColor = "bg-red-600";
  } else if (progressValue < 66) {
    progressColor = "bg-purple-600";
  } else if (progressValue < 100) {
    progressColor = "bg-blue-600";
  }
  else {
    progressColor = "bg-green-600";
  }

  useEffect(() => {
    async function fetchSettings() {
      const config: ExtensionSettings = await settingsService.loadSettings();
      setGoal(config?.goal || null);
    }

    fetchSettings();
  }, []);

  return (
    <Card className="py-2 px-4 gap-0 mb-3">
      {goal ?
        <div className="flex items-center w-full gap-3">
          <Progress
            value={progressValue}
            className="flex-1"
            color={progressColor}
          />
          <p className="text-base whitespace-nowrap">
            ${todayTotalEarnings} / ${goal} | {progressValue.toFixed(0)}%
          </p>
        </div>

        :
        <p className="text-muted-foreground text-xs leading-tight">Set a goal in dashboard to track your progress!</p>}
    </Card>
  )
}
