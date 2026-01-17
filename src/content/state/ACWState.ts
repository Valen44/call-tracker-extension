import type { AgentState } from "./AgentState.ts";
import { AvailableState } from "./AvailableState.ts";
import { BaseState } from "./BaseState.ts";
import { InvalidState } from "./InvalidState.ts";
import { UnavailableState } from "./UnavailableState.ts";

export class ACWState extends BaseState {
  name = "ACW";
  color = "#633a04";

  enter() {
    console.log("Entering ACW State");
    chrome.runtime.sendMessage({
      type: "SET_BADGE",
      color: this.color,
      text: "W",
    });

    this.manager.startTimer();
  }

  exit() {
    this.manager.stopTimer();
  }

  onDOMUpdate(text: string) {
    var nextState: AgentState | undefined;

    if (this.manager.config.keywords.available.some((k: string) => text === k.toLocaleLowerCase())) {
      nextState = new AvailableState(this.manager);
    }
    else if (this.manager.config.keywords.unavailable.some((k: string) => text === k.toLocaleLowerCase())) {
      nextState = new UnavailableState(this.manager);
    }
    else if (this.manager.config.keywords.acw.some((k: string) => text === k.toLocaleLowerCase())) {
      return;
    }
    else {
      const nextState = new InvalidState(this.manager, this, text);
      this.manager.setState(nextState);
    }

    nextState && this.manager.setState(nextState);
  }


}
