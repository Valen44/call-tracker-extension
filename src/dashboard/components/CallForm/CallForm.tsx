import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { type Call } from "@/types/Call";
import { DateTimePicker } from "../DateTimePicker";
import { useEffect, useState, useContext } from "react";
import dateService from "@/services/dateService";
import settingsService from "@/services/settingsService";
import callService from "@/services/callService";
import { NumberInput } from "@/components/ui/number-input";
import { toast } from "sonner";
import { CallContext } from "@/dashboard/context/CallContext";

const callSchema = z
  .object({
    startTime: z.date({ message: "You must choose a start time" }),
    endTime: z.date().optional(),
    duration: z.number().optional(),
    earnings: z.number().optional(),
    available: z.number().optional(),
    status: z.enum(["onGoing", "serviced", "notServiced"]),
  })
  .refine(
    (data) =>
      data.endTime !== undefined || data.status === "onGoing",
    {
      message: "End time is required if status is Serviced or Not Serviced",
      path: ["endTime"],
    }
  )
  .refine(
    (data) =>
      !data.endTime || data.endTime >= data.startTime,
    {
      message: "End time cannot be before start time",
      path: ["endTime"],
    }
  );

type CallFormValues = z.infer<typeof callSchema>;

interface CallFormProps {
  call?: Call;
  onClose: React.Dispatch<React.SetStateAction<boolean>>;
  type: "create" | "edit";
}

export const CallForm = ({ call, onClose, type }: CallFormProps) => {
  const { reloadTable } = useContext(CallContext);

  const defaultValues = call 
    ? {
        startTime: new Date(call.startTime),
        endTime: call.endTime ? new Date(call.endTime) : undefined,
        available: call.available ? call.available : undefined,
        status: call.status
      }
    : undefined;

  const form = useForm<CallFormValues>({
    resolver: zodResolver(callSchema),
    defaultValues: defaultValues
  });

  const onSubmit = async (values: CallFormValues) => {
    const callData: Call = {
      id: (type === "create" || !call) ? values.startTime.getTime().toString() : call.id,
      company: call ? call.company : "Undefined",
      startTime: values.startTime.toISOString(),
      endTime: values.endTime ? values.endTime.toISOString() : undefined,
      duration: durationInSeconds ?? undefined,
      earnings: values.status === "notServiced" ? 0 : earnings ?? undefined,
      available: values.available ?? undefined,
      status: values.status,
    }
    try {
      if (callData) callService.saveCall(callData).then(() => {
        console.table(callData)
        toast.success(`Call ${type === "create" ? "created" : "edited"} successfully!`)
        reloadTable();
      });
    } catch (error) {
      toast.error(`Error when ${type === "create" ? "creating" : "editting"} call`)
      console.error(`Error when ${type === "create" ? "creating" : "editing"} call:`, error)
    }
    onClose(false);
  };

  const [durationInSeconds, setDurationInSeconds] = useState<number | null>(null);
  const [earnings, setEarnings] = useState<number | null>(null);

  useEffect(() => {
    const start = form.watch("startTime");
    const end = form.watch("endTime");
    const status = form.watch("status");

    if (start && end) {
      const { seconds, minutes } = dateService.calculateDuration(new Date(start), new Date(end), true);

      setDurationInSeconds(seconds >= 0 ? seconds : null);
      if (status !== "notServiced") {
        settingsService.loadSettings().then((s) => {
          const earnings = minutes * s.rate;
          setEarnings(parseFloat(earnings.toFixed(2)));
        })
      } else setEarnings(0);
    } else {
      setDurationInSeconds(null);
      setEarnings(null);
    }

  }, [form.watch("startTime"), form.watch("endTime"), form.watch("status")]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex mb-5 justify-between items-center">
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <DateTimePicker
                  defaultValue={field.value ? field.value : undefined}
                  onSelection={(date) =>
                    field.onChange(date ?? undefined)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="flex mb-5 justify-between items-center">
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <DateTimePicker
                  defaultValue={field.value ? field.value : undefined}
                  onSelection={(date) =>
                    field.onChange(date ?? undefined)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-between mb-5">
          <FormItem>
            <FormLabel className="mb-2">Duration</FormLabel>
            <FormControl>
              <Input
                type="text"
                value={durationInSeconds ? dateService.formatDuration(durationInSeconds) : ""}
                disabled
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel className="mb-2">Earnings</FormLabel>
            <FormControl>
              <Input
                type="text"
                value={earnings ? `$${earnings} USD` : ""}
                disabled
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <div className="flex gap-2 justify-between mb-5">
          <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2">Available</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="w-[120px]">
                      <NumberInput
                        min={0}
                        stepper={1}
                        defaultValue={field.value}
                        onValueChange={(value) =>
                          field.onChange(value ?? undefined)}
                      />
                    </div>
                    <p className="text-sm">{dateService.formatDuration(field.value ?? 0)}</p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mb-2">Status</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={(value) => 
                      field.onChange(value ?? undefined)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="serviced">Serviced</SelectItem>
                      <SelectItem value="notServiced">Not Serviced</SelectItem>
                      <SelectItem value="onGoing">On-Going</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant={"secondary"} onClick={() => onClose(false)}>
            Close
          </Button>
          <Button type="submit">
            {type === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
