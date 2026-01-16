export interface AgentState {
  name: string;

  enter(): void;
  exit(): void;

  onDOMUpdate(text: string): void;
}
