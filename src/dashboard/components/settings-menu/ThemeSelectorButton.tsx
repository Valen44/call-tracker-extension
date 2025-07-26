import React from 'react'
import { MoonStar, Sun } from "lucide-react"
import { type Appearence } from '@/services/settingsService'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ThemeSelectorButtonProps = {
  valueState: [Appearence, React.Dispatch<React.SetStateAction<Appearence>>];
}

export const ThemeSelectorButton = ({ valueState }: ThemeSelectorButtonProps) => {
  const [value, setValue] = valueState;
  
  return (
    <div className="flex items-stretch">
      <Button
        onClick={() => setValue("device")}
        variant={"outline"}
        className={cn(
          "rounded-r-none settings-btn",
          value === 'device' && '!bg-accent-foreground !text-accent'
        )}
      >
        Device
      </Button>
      <Button
        onClick={() => setValue("light")}
        variant={"outline"}
        className={cn(
          "rounded-none settings-btn",
          value === 'light' && '!bg-accent-foreground !text-accent'
        )}
      >
        <Sun />
      </Button>
      <Button
        onClick={() => setValue("dark")}
        variant={"outline"}
        className={cn(
          "rounded-l-none settings-btn ",
          value === 'dark' && '!bg-accent-foreground !text-accent'
        )}
      >
        <MoonStar />
      </Button>
    </div>
  )
}
