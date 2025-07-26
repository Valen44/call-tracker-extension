import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import {
  Sheet,
  SheetClose,
  SheetDescription,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Settings } from "lucide-react";

import { ThemeSelectorButton } from "./ThemeSelectorButton";

import settingsService, {
  type Appearence,
  type ExtensionSettings,
  defaultSettings,
} from "@/services/settingsService";
import setThemeFromSettings from "@/services/themeService";
import { SortingSelectorButton } from "./SortingSelectorButton";

export const SettingsMenu = () => {
  const [dashboardTheme, setDashboardTheme] = useState<Appearence>(
    defaultSettings.appearence.dashboard
  );
  const [popupTheme, setPopupTheme] = useState<Appearence>(
    defaultSettings.appearence.popup
  );
  const [rate, setRate] = useState<number>(defaultSettings.rate);
  const [callSorting, setCallSorting] = useState<"asc" | "desc">(
    defaultSettings.callSorting
  );


  useEffect(() => {
    settingsService.loadSettings().then((settings) => {
      setDashboardTheme(settings.appearence.dashboard);
      setPopupTheme(settings.appearence.popup);
      setRate(settings.rate);
      setCallSorting(settings.callSorting);
    });
  }, []);

  const handleSubmit = async () => {
  const settings: ExtensionSettings = {
    rate: rate,
    appearence: {
      dashboard: dashboardTheme,
      popup: popupTheme
    },
    callSorting: callSorting
  };

  await settingsService.saveSettings(settings);
  await setThemeFromSettings("dashboard");
  window.dispatchEvent(new CustomEvent("settingsUpdated"));
};

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"outline"}>
          <Settings />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-3">
        <SheetHeader>
          <div className="flex items-center gap-2 justify-start">
            <Settings />
            <SheetTitle className="text-2xl font-bold">Settings</SheetTitle>
          </div>
        </SheetHeader>
        <SheetDescription></SheetDescription>

        <div className="px-4 flex justify-between gap-6 mb-2">
          <Label className="text-nowrap">Rate per minute</Label>
          <div className="w-[45%]">
            <NumberInput
              suffix=" USD"
              prefix="$"
              min={0.01}
              max={1}
              stepper={0.01}
              decimalScale={2}
              defaultValue={rate}
              onValueChange={(e) => e && setRate(e)}
            ></NumberInput>
          </div>
        </div>

        <div className="px-4 flex justify-between gap-6 mb-2">
          <Label className="text-nowrap">Dashboard theme</Label>
          <ThemeSelectorButton valueState={[dashboardTheme, setDashboardTheme]}/>
        </div>

        <div className="px-4 flex justify-between gap-6 mb-2">
          <Label className="text-nowrap">Popup theme</Label>
          <ThemeSelectorButton valueState={[popupTheme, setPopupTheme]}/>
        </div>

        <div className="px-4 flex justify-between gap-6 mb-2">
          <Label className="text-nowrap">Call Sorting by Start Time</Label>
          <SortingSelectorButton valueState={[callSorting, setCallSorting]}/>
        </div>

        <SheetFooter>
          <p className="text-sm text-muted-foreground">Changing the rate will only take effect on future calls after reloading the agent portal</p>

          <SheetClose asChild>
            <Button type="submit" onClick={() => handleSubmit()}>Save changes</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
