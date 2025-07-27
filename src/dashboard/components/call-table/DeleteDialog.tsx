import React from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import callService from "@/services/callService";

import { useContext } from "react";
import { CallContext } from "@/dashboard/context/CallContext";
import { toast } from "sonner";


export const DeleteDialog = ({
  open,
  onOpenChange,
  callID
}: {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  callID: string;
}) => {

  const { reloadTable } = useContext(CallContext);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => onOpenChange(!open)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Call</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this call? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant={"secondary"}>
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" variant="destructive" onClick={() => {
                try {
                  callService.deleteCall(callID).then(() => reloadTable())
                  toast.success("Call deleted successfully!")
                } catch (error) {
                  toast.error("Error while saving settings")
                  console.error("Error while deleting call", error)
                }
              }}
              >
                Delete
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
