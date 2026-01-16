import { StateManager } from "./state/StateManager";
import { type Company } from "@/types/Company";
import settingsService from "@/services/settingsService";

// ---- inject widget ----
const widget = document.createElement("div");
widget.id = "call-timer-widget";
widget.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #111;
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  font-family: monospace;
  z-index: 999999;
`;
widget.textContent = "WAITING";
document.body.appendChild(widget);

// ---- start state system ----
async function init(): Promise<void> {
  const link = window.location.href;
  const config = await settingsService.getPortalConfig(link);

  if (!config) {
    console.warn(`No configuration found for current website`);
    widget.textContent = "ERROR";
  }
  else {
    const portalConfig = config.portalConfig;

    const manager = new StateManager({
      selector: portalConfig.selector,
      portalLink: portalConfig.portalLink,
      companyName: config.companyName,
      payRate: config.payRate,
      rounding: portalConfig.rounding,
      validCallDuration: portalConfig.validCallDuration,
      websiteTitleTimer: portalConfig.websiteTitleTimer,
      keywords: portalConfig.keywords,
    });

    manager.start();
  }
}


init();

