import { createContext } from "react";
import type { filterCallsProps } from "@/services/callService";
import type { Dispatch, SetStateAction } from "react";

type CallContextType = {
  reloadTable: () => void;
  filterCalls: (filter: filterCallsProps) => void;
  filter: filterCallsProps;
  setFilter: Dispatch<SetStateAction<filterCallsProps>>;
};

export const CallContext = createContext<CallContextType>({
  reloadTable: () => {},
  filterCalls: () => {},
  filter: { period: "today" },
  setFilter: () => {},
});
