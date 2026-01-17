import type { Call } from "@/types/Call.tsx";
import { ACWState } from "./ACWState.ts";
import type { AgentState } from "./AgentState.ts";
import { BaseState } from "./BaseState.ts";
import type { StateManager } from "./StateManager.ts";
import { UnavailableState } from "./UnavailableState.ts";
import callService from "@/services/callService";
import dateUtils from "@/services/dateService";
import { InvalidState } from "./InvalidState.ts";
import statsDisplay from "../statsDisplay.ts";

export class OnCallState extends BaseState {
  name = "ON_CALL";
  color = "rgb(55, 9, 98)";
  private availableStartTime: Date;
  public currentCall: Call | undefined;

  private callSavingIntervalID?: number;

  constructor(manager: StateManager, availableStartTime: Date) {
    super(manager);
    this.availableStartTime = availableStartTime;
  }

  enter() {
    console.log("Entering On-Call State");
    chrome.runtime.sendMessage({
      type: "SET_BADGE",
      color: this.color,
      text: "C",
    });

    this.manager.startTimer();

    this.startCall();

    this.callSavingIntervalID = window.setInterval(() => {
      this.saveCallProgress(false);
      console.log("Call progress saved");
      statsDisplay.updateStats();
    }, 60000);

  }

  exit() {
    this.endCall();
    this.callSavingIntervalID && clearInterval(this.callSavingIntervalID);
    this.callSavingIntervalID = undefined;
    this.manager.stopTimer();
  }

  onDOMUpdate(text: string) {
    var nextState: AgentState | undefined;

    if (this.manager.config.keywords.acw.some((k: string) => text === k.toLocaleLowerCase())) {
      nextState = new ACWState(this.manager);
    }
    else if (this.manager.config.keywords.unavailable.some((k: string) => text === k.toLocaleLowerCase())) {
      nextState = new UnavailableState(this.manager);
    }
    else if (this.manager.config.keywords.onCall.some((k: string) => text === k.toLocaleLowerCase())) {
      return;
    }
    else {
      const nextState = new InvalidState(this.manager, this, text);
      this.manager.setState(nextState);
    }

    nextState && this.manager.setState(nextState);
  }


  private async startCall() {
    const callId = Date.now().toString();

    const startTime = new Date();

    const { seconds: available, minutes: _ } = dateUtils.calculateDuration(this.availableStartTime, startTime, false)

    const callData: Call = {
      id: callId,
      company: this.manager.config.companyName,
      startTime: startTime.toISOString(),
      endTime: undefined,
      duration: 0,
      earnings: undefined,
      status: "onGoing",
      available: available,
    };

    await callService.saveCall(callData);
    this.currentCall = callData;

    console.info("Call started:");
    console.table(callData);

  }

  private async endCall() {
    if (!this.currentCall) return;

    await this.saveCallProgress(true);

    console.info("Call ended:");
    console.table(this.currentCall);

    this.currentCall = undefined;
  }

  private async saveCallProgress(callFinished: boolean) {
    if (!this.currentCall) return;

    const VALID_DURATION = this.manager.config.validCallDuration + 3;

    const startTime = new Date(this.currentCall.startTime);
    const endTime = new Date();

    const { seconds, minutes } = dateUtils.calculateDuration(startTime, endTime, this.manager.config.rounding);

    const isCallValid = (callFinished && seconds <= VALID_DURATION && !confirm("Was the call serviced/valid?")) ? false : true;

    const earnings = this.calculateEarnings(minutes, isCallValid);

    this.currentCall.endTime = endTime.toISOString();
    this.currentCall.duration = seconds;
    this.currentCall.earnings = earnings;

    if (callFinished) {
      this.currentCall.status = (isCallValid) ? "serviced" : "notServiced";
    }

    await callService.saveCall(this.currentCall);
  }

  private calculateEarnings(minutes: number, isCallValid: boolean): number {
    const RATE = this.manager.config.payRate;

    if (isCallValid) {
      return parseFloat((minutes * RATE).toFixed(2));
    }
    else return 0;
  }
}
