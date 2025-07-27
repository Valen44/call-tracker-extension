import type { ColumnDef } from "@tanstack/react-table";

import dateService from "@/services/dateService";

import { type Call } from "@/types/Call";

import { ActionsDropDown } from "./ActionsDropDown";

import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";


export const columns: ColumnDef<Call>[] = [
  {
    accessorKey: "date",
    header: ({column}) => ( <DataTableColumnHeader column={column} title="Date" className="pl-4"/> ),
    cell: ({ row }) => {
      const date = row.getValue("startTime") as string;
      const formatted = dateService.formatDate(date);
      return <div className="pl-4">{formatted}</div>;
    },
  },
  {
    accessorKey: "startTime",
    header: ({column}) => ( <DataTableColumnHeader column={column} title="Start Time" /> ),
    cell: ({ row }) => {
      const time = row.getValue("startTime") as string;
      const formatted = dateService.formatTime(time);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "endTime",
    header: ({column}) => ( <DataTableColumnHeader column={column} title="End Time"/> ),
    cell: ({ row }) => {
      const status = row.original.status;
      const time = row.getValue("endTime") as string | undefined;
      const formatted = time && status !== "onGoing" ? dateService.formatTime(time) : "";
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "duration",
    header: ({column}) => ( <DataTableColumnHeader column={column} title="Duration"/> ),
    cell: ({ row }) => {
      const status = row.original.status;
      const duration = row.getValue("duration") as number;
      const formatted = duration && status !== "onGoing" ? dateService.formatDuration(duration) : "";
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "available",
    header: ({column}) => ( <DataTableColumnHeader column={column} title="Available"/> ),
    cell: ({ row }) => {
      const available = row.getValue("available") as number;
      const formatted = available ? dateService.formatDuration(available) : "";
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "earnings",
    header: ({column}) => ( <DataTableColumnHeader column={column} title="Earnings"/> ),
    cell: ({ row }) => {
      const status = row.original.status;
      const earnings = parseFloat(row.getValue("earnings"));
      const formatted = !Number.isNaN(earnings) && status !== "onGoing"
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(earnings)
        : "";
      
      if (status === "notServiced")
        return <div className="text-destructive font-medium">N-S</div>;
      else return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: () => { return <div className=""></div>},
    cell: ({ row }) => {
      const call = row.original;

      return (
        <ActionsDropDown call={call}/>
      );
    },
  },
];
