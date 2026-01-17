import { BaseState } from "./BaseState.ts";
import type { AgentState } from "./AgentState.ts";
import { RingingState } from "./RingingState.ts";
import { UnavailableState } from "./UnavailableState.ts";
import { InvalidState } from "./InvalidState.ts";

export class AvailableState extends BaseState {
  name = "AVAILABLE";
  color = "#2f6304";

  private availableStartTime: Date = new Date();

  enter() {

    console.log("Entering AVAILABLE state");

    chrome.runtime.sendMessage({
      type: "SET_BADGE",
      color: this.color,
      text: "A",
    });

    this.manager.startTimer();
  }

  exit() {
    this.manager.stopTimer();
  }

  onDOMUpdate(text: string) {
    var nextState: AgentState | undefined;

    if (this.manager.config.keywords.ringing.some((k: string) => text === k.toLocaleLowerCase())) {
      nextState = new RingingState(this.manager, this.availableStartTime);
    }
    else if (this.manager.config.keywords.unavailable.some((k: string) => text === k.toLocaleLowerCase())) {
      nextState = new UnavailableState(this.manager);
    }
    else if (this.manager.config.keywords.available.some((k: string) => text === k.toLocaleLowerCase())) {
      return;
    }
    else {
      const nextState = new InvalidState(this.manager, this, text);
      this.manager.setState(nextState);
    }

    nextState && this.manager.setState(nextState);
  }
}
