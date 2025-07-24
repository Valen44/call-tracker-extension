import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DeleteDialog } from "./DeleteDialog";
import { MoreHorizontal } from "lucide-react";





export const ActionsDropDown = ({callID} : {callID : string}) => {

    const [isDeleteDialog, setIsDeleteDialog] = useState<boolean>(false);
    

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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setIsDeleteDialog(!isDeleteDialog)}
            >
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

        <DeleteDialog isDeleteDialog={isDeleteDialog} setIsDeleteDialog={setIsDeleteDialog} callID={callID} />
    </div>
  )
}
