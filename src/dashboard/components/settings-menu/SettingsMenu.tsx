import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown, Settings } from "lucide-react";

import { ThemeSelectorButton } from "./ThemeSelectorButton";

import settingsService,
{
  type Appearence,
  type ExtensionSettings,
  defaultSettings,
} from "@/services/settingsService";
import setThemeFromSettings from "@/services/themeService";
import { SortingSelectorButton } from "./SortingSelectorButton";
import { toast } from "sonner";

import callService from "@/services/callService";
import { DeleteDialog } from "../DeleteDialog";
import { CallContext } from "@/dashboard/context/CallContext";


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
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const { reloadTable } = useContext(CallContext);

  useEffect(() => {
    settingsService.loadSettings().then((settings) => {
      setDashboardTheme(settings.appearence.dashboard);
      setPopupTheme(settings.appearence.popup);
      setRate(settings.rate);
      setCallSorting(settings.callSorting);
    });
  }, [openSettings]);

  const handleSubmit = async () => {
    const settings: ExtensionSettings = {
      rate: rate,
      appearence: {
        dashboard: dashboardTheme,
        popup: popupTheme,
      },
      callSorting: callSorting,
    };

    try {
      await settingsService.saveSettings(settings);
      toast.success("Settings saved!");
    } catch (error) {
      toast.error("Error while saving settings");
      console.error("Error while saving settings", error);
    }

    await settingsService.saveSettings(settings);
    await setThemeFromSettings("dashboard");
    window.dispatchEvent(new CustomEvent("settingsUpdated"));
  };

  const handleBackup = async () => {
    try {
      const callsToBackup = await callService.exportCalls();
      const blob = new Blob([JSON.stringify(callsToBackup)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'call_backup.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Calls backed up successfully!");
    } catch (error) {
      toast.error("Error while backing up calls");
      console.error("Error while backing up calls", error);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const callsToImport = JSON.parse(e.target?.result as string);
        const { skippedCount, totalCallsToImport } = await callService.importCalls(callsToImport);

        if (skippedCount === totalCallsToImport) {
          toast.warning("None of the calls were imported (check browser's console).");
        } else if (skippedCount > 0) {
          toast.warning(`Calls imported successfully but ${skippedCount} were skipped (check browser's console).`);
        } else {
          toast.success("Calls imported successfully!");
        }

        reloadTable();

      } catch (error) {
        toast.error("Error while restoring calls");
        console.error("Error while restoring calls", error);
      }
    };
    reader.readAsText(file);
  };

  const handleDeleteAllCalls = async () => {
    try {
      await callService.deleteAllCalls();
      toast.success("All calls deleted successfully!");
      reloadTable();
    } catch (error) {
      toast.error("Error while deleting calls");
      console.error("Error while deleting calls", error);
    }
  };


  return (
    <>
      <Button variant={"outline"} onClick={() => setOpenSettings(!openSettings)}>
        <Settings />
      </Button>

      <Sheet open={openSettings} onOpenChange={() => setOpenSettings(!openSettings)}>
        <SheetContent className="p-3">
          <SheetHeader>
            <div className="flex items-center gap-2 justify-start">
              <Settings />
              <SheetTitle className="text-2xl font-bold">Settings</SheetTitle>
            </div>
          </SheetHeader>
          <SheetDescription></SheetDescription>

          <div className="flex flex-col justify-between h-full">
            <section>
              <div className="px-4 flex justify-between gap-6 mb-3">
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
              <div className="px-4 flex justify-between gap-6 mb-3">
                <Label className="text-nowrap">Dashboard theme</Label>
                <ThemeSelectorButton valueState={[dashboardTheme, setDashboardTheme]} />
              </div>
              <div className="px-4 flex justify-between gap-6 mb-3">
                <Label className="text-nowrap">Popup theme</Label>
                <ThemeSelectorButton valueState={[popupTheme, setPopupTheme]} />
              </div>
              <div className="px-4 flex justify-between gap-6 mb-3">
                <Label className="text-nowrap">Call Sorting by Start Time</Label>
                <SortingSelectorButton valueState={[callSorting, setCallSorting]} />
              </div>
            </section>

            <Collapsible className="px-4">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg font-semibold">Backup and Restore</h1>
                <CollapsibleTrigger>
                  <Button variant="ghost" size="icon" className="size-8">
                    <ChevronsUpDown />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div className="px-4 flex justify-between gap-6 mb-2 mt-2 items-center">
                  <Label className="text-nowrap">Backup Calls</Label>
                  <Button variant="outline" onClick={handleBackup} >
                    Backup
                  </Button>
                </div>
                <div className="px-4 flex justify-between gap-6 mb-2 items-center">
                  <Label className="text-nowrap">Restore Calls</Label>
                  <input type="file" accept=".json" onChange={handleRestore} className="hidden" id="restore-button" />
                  <Label htmlFor="restore-button" className="cursor-pointer px-4 py-2 border border-input bg-background hover:bg-accent  dark:bg-input/30 dark:border-input dark:hover:bg-input/50 hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    Restore
                  </Label>
                </div>

                <div className="px-4 flex justify-between gap-6 mb-2">
                  <Label className="text-nowrap">Delete All Calls</Label>
                  <Button variant="destructive" onClick={() => setOpenDeleteDialog(true)}>Delete All</Button>
                </div>

              </CollapsibleContent>
            </Collapsible>

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

      <DeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        title="Delete All Calls"
        description="Are you sure you want to delete all calls? This action cannot be undone."
        onConfirm={handleDeleteAllCalls}
      />

    </>
  );
};
