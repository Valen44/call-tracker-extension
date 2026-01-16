import { AvailableState } from "./AvailableState.ts";
import { BaseState } from "./BaseState.ts";
import type { StateManager } from "./StateManager.ts";
import { UnavailableState } from "./UnavailableState.ts";

export class InvalidState extends BaseState {
  name = "INVALID";
  private prevState: BaseState;
  private nextStateText: string;

  constructor(manager: StateManager, prevState: BaseState, nextStateText: string) {
      super(manager);
      this.prevState = prevState;
      this.nextStateText = nextStateText;
    }

  enter() {

    console.log("Entering INVALID state");
    console.warn("Agent went trough an invalid state transition from ", this.prevState.name, " to ", this.nextStateText, ". Please go to available or unavailable state manually.");

    chrome.runtime.sendMessage({
      type: "SET_BADGE",
      color: "#6f0b0b",
      text: "E",
    });

  }

  onDOMUpdate(text: string) {
    if (this.manager.config.keywords.unavailable.some((k: string) => text === k.toLocaleLowerCase())) {
      const nextState = new UnavailableState(this.manager);
      this.manager.setState(nextState);
    }

    else if (this.manager.config.keywords.available.some((k: string) => text === k.toLocaleLowerCase())) {
      const nextState = new AvailableState(this.manager);
      this.manager.setState(nextState);
    }
  }
}
