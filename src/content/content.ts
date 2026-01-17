import { StateManager } from "./state/StateManager";
import settingsService from "@/services/settingsService";
import { StatsDisplay } from "./statsDisplay";

async function init(): Promise<void> {
  const link = window.location.href;
  const config = await settingsService.getPortalConfig(link);

  if (config) {
    const portalConfig = config.portalConfig;

    const widget = new StatsDisplay(config.companyName);

    const manager = new StateManager({
      selector: portalConfig.selector,
      portalLink: portalConfig.portalLink,
      companyName: config.companyName,
      payRate: config.payRate,
      rounding: portalConfig.rounding,
      validCallDuration: portalConfig.validCallDuration,
      websiteTitleTimer: portalConfig.websiteTitleTimer,
      keywords: portalConfig.keywords
    }, widget);

    manager.start();

    setTimeout(() => {
      widget.create();
    }, 2000);
  }
}


init();

