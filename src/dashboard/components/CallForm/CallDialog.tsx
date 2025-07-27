import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CallForm } from "./CallForm";
import type { Call } from "@/types/Call";


export const CallDialog = ({
  open,
  onOpenChange,
  call,
  type,
}: {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  call?: Call;
  type: "create" | "edit";
}) => {

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => onOpenChange(!open)}
      >
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{type === "create" ? "New" : "Edit"} Call</DialogTitle>
          </DialogHeader>
          <DialogDescription>
          </DialogDescription>

          <CallForm call={call} onClose={onOpenChange} type={type}></CallForm>
        </DialogContent>
      </Dialog>
    </>
  );
};
