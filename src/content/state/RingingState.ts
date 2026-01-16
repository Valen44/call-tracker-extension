import type { AgentState } from "./AgentState.ts";
import { BaseState } from "./BaseState.ts";
import { InvalidState } from "./InvalidState.ts";
import { OnCallState } from "./OnCallState.ts";
import type { StateManager } from "./StateManager.ts";
import { UnavailableState } from "./UnavailableState.ts";

export class RingingState extends BaseState {
  name = "RINGING";
  private availableStartTime: Date;

  constructor(manager: StateManager, availableStartTime: Date) {
    super(manager);
    this.availableStartTime = availableStartTime;
  }

  enter() {

    console.log("Entering RINGING state");

    chrome.runtime.sendMessage({
      type: "SET_BADGE",
      color: "#0d00ffff",
      text: "R",
    });

    this.manager.startTimer();
  }

  exit() {
    this.manager.stopTimer();
  }

  onDOMUpdate(text: string) {
    var nextState: AgentState | undefined;

    if (this.manager.config.keywords.onCall.some((k: string) => text === k.toLocaleLowerCase())) {
      nextState = new OnCallState(this.manager, this.availableStartTime);
    }
    else if (this.manager.config.keywords.unavailable.some((k: string) => text === k.toLocaleLowerCase())) {
      nextState = new UnavailableState(this.manager);
    }
    else {
      const nextState = new InvalidState(this.manager, this, text);
      this.manager.setState(nextState);
    }

    nextState && this.manager.setState(nextState);
  }
}
