import { createContext } from "react";
import { type filterCallsProps } from "@/services/callService";

export const CallContext = createContext({
  reloadTable: () => {},
  filterCalls: (filter: filterCallsProps) => {},
});