import { type AgentState } from "./AgentState.ts";
import { StateManager } from "./StateManager.ts";

export abstract class BaseState implements AgentState {
  abstract name: string;
  protected manager: StateManager;

  constructor(manager: StateManager) {
    this.manager = manager;
  }

  enter(): void {}
  exit(): void {}

  onDOMUpdate(_text: string): void {}
}
