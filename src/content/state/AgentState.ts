export interface AgentState {
  name: string;
  color: string;

  enter(): void;
  exit(): void;

  onDOMUpdate(text: string): void;
}
