import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "./DeleteDialog";
import { MoreHorizontal } from "lucide-react";
import { CallDialog } from '@/dashboard/components/CallForm/CallDialog';
import type { Call } from '@/types/Call';





export const ActionsDropDown = ({call} : {call : Call}) => {

    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
    

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

        <DeleteDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog} callID={call.id} />
        <CallDialog open={openEditDialog} onOpenChange={setOpenEditDialog} call={call} type="edit" />
    </div>
  )
}
