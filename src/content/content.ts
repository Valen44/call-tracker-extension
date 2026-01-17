import { StateManager } from "./state/StateManager";
import settingsService from "@/services/settingsService";
import statsDisplay from "./statsDisplay";

async function init(): Promise<void> {
  const link = window.location.href;
  const config = await settingsService.getPortalConfig(link);

  if (config) {
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

    setTimeout(() => {
      statsDisplay.createStatsDisplay();
    }, 2000);
  }
}


init();

