import React from 'react'
import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type SortingSelectorButtonProps = {
  valueState: ["asc" | "desc", React.Dispatch<React.SetStateAction<"asc" | "desc">>];
}

export const SortingSelectorButton = ({ valueState }: SortingSelectorButtonProps) => {
  const [value, setValue] = valueState;

  return (
    <div className="flex items-stretch">
      <Tooltip>
        <TooltipTrigger>
          <Button
            onClick={() => setValue("asc")}
            variant={"outline"}
            className={cn(
              "rounded-r-none settings-btn",
              value === 'asc' && '!bg-accent-foreground !text-accent'
            )}
          >
            <ArrowUp />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Oldest calls first</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger>
          <Button
            onClick={() => setValue("desc")}
            variant={"outline"}
            className={cn(
              "rounded-l-none settings-btn",
              value === 'desc' && '!bg-accent-foreground !text-accent'
            )}
          >
            <ArrowDown />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Newest calls first</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
