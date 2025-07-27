import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CallEditForm } from "./CallEditForm";
import type { Call } from "@/types/Call";


export const EditDialog = ({
  open,
  onOpenChange,
  call
}: {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  call: Call;
}) => {

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => onOpenChange(!open)}
      >
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Call</DialogTitle>
          </DialogHeader>
          <DialogDescription>
          </DialogDescription>

          <CallEditForm call={call} onClose={onOpenChange}></CallEditForm>
        </DialogContent>
      </Dialog>
    </>
  );
};
