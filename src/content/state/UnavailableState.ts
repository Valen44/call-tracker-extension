import { AvailableState } from "./AvailableState.ts";
import { BaseState } from "./BaseState.ts";
import { InvalidState } from "./InvalidState.ts";

export class UnavailableState extends BaseState {
  name = "UNAVAILABLE";
  color = "#630404";

  enter() {

    console.log("Entering UNAVAILABLE state");

    chrome.runtime.sendMessage({
      type: "SET_BADGE",
      color: this.color,
      text: "U",
    });

    this.manager.startTimer();
  }

  exit(): void {
    this.manager.stopTimer();
  }

  onDOMUpdate(text: string) {
    if (this.manager.config.keywords.available.some((k: string) => text === k.toLocaleLowerCase())) {
      const nextState = new AvailableState(this.manager);
      this.manager.setState(nextState);
    }
    if (this.manager.config.keywords.unavailable.some((k: string) => text === k.toLocaleLowerCase())) {
      return;
    }
    else {
      const nextState = new InvalidState(this.manager, this, text);
      this.manager.setState(nextState);
    }
  }
}
