import type { StatsDisplay } from "../statsDisplay.ts";
import { type AgentState } from "./AgentState.ts";
import { UnavailableState } from "./UnavailableState.ts";

export interface Config {
  selector: string;
  portalLink: string;
  companyName: string;
  payRate: number;
  rounding: boolean;
  validCallDuration: number;
  websiteTitleTimer: boolean;
  keywords: {
    unavailable: string[];
    available: string[];
    ringing: string[];
    onCall: string[];
    acw: string[];
  };
}

export class StateManager {
  private currentState!: AgentState;

  private observer?: MutationObserver;
  private widget: StatsDisplay;

  private timer = 0;
  private interval?: number;

  public config: Config;



  constructor(config: Config, widget: StatsDisplay) {
    this.config = config;
    this.widget = widget;
  }

  start() {
    console.log("Starting State Manager");
    console.log(this.config);
    const unavailableState = new UnavailableState(this);
    this.setState(unavailableState);
    this.observeDOM();
  }

  setState(state: AgentState) {
    this.currentState?.exit();
    this.currentState = state;
    this.currentState.enter();
    this.updateWidget();
    this.widget.setStatus(this.currentState);
  }

  // ---------- DOM ----------
  private observeDOM() {
  const waitForElement = () => {
    const el = document.querySelector(this.config.selector);

    if (!el) {
      requestAnimationFrame(waitForElement);
      return;
    }

    this.observer = new MutationObserver(() => {
      const text = el.textContent?.trim().toLowerCase() || "";
      this.currentState.onDOMUpdate(text);
    });

    this.observer.observe(el, { childList: true, subtree: true, characterData: true});
  };

  waitForElement();
}

  // ---------- TIMER ----------
  startTimer() {
    this.timer = 0;
    this.interval && clearInterval(this.interval);

    this.interval = window.setInterval(() => {
      this.timer++;
      this.updateWidget();
    }, 1000);
  }

  stopTimer() {
    this.interval && clearInterval(this.interval);
    this.interval = undefined;
    this.timer = 0;
    this.updateWidget();
  }

  // ---------- WIDGET ----------

  updateWidget() {
    if (!this.widget.tracker) return;

    this.widget.updateTimer(this.timer);

    if (this.config.websiteTitleTimer) {
      const m = Math.floor(this.timer / 60).toString().padStart(2, "0");
      const s = (this.timer % 60).toString().padStart(2, "0");
      document.title = `(${m}:${s}) ${this.config.companyName}`;
    }
  }



  updateWidgetStats() {
    this.widget.updateStats()
  }
}
