import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { CallDialog } from '@/dashboard/components/CallForm/CallDialog';
import type { Call } from '@/types/Call';
import callService from '@/services/callService';
import { useContext } from 'react';
import { CallContext } from '@/dashboard/context/CallContext';
import { toast } from 'sonner';
import { DeleteDialog } from '../DeleteDialog';





export const ActionsDropDown = ({call} : {call : Call}) => {

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

    const { reloadTable } = useContext(CallContext);

    const handleDelete = async () => {
      try {
        await callService.deleteCall(call.id);
        reloadTable();
        toast.success("Call deleted successfully!");
      } catch (error) {
        toast.error("Error while deleting call");
        console.error("Error while deleting call", error);
      }
    };

  return (
    <div className="">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setOpenEditDialog(!openEditDialog)}
            >
              Edit
              </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setOpenDeleteDialog(!openDeleteDialog)}
            >
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

        <DeleteDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          title="Delete Call"
          description={`Are you sure you want to delete this call? This action cannot be undone.`}
          onConfirm={handleDelete}
        />
        <CallDialog open={openEditDialog} onOpenChange={setOpenEditDialog} call={call} type="edit" />
    </div>
  )
}
