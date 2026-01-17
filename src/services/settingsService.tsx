import { type Company } from "@/types/Company";

export type Appearence = "dark" | "light" | "device";

export type ExtensionSettings = {
  appearence: {
    dashboard: Appearence;
    popup: Appearence;
  };
  callSorting: "asc" | "desc";
  goal?: number;
};

export
  const defaultSettings: ExtensionSettings = {
    appearence: {
      dashboard: "device",
      popup: "device",
    },
    callSorting: "desc",
  };

const saveSettings = async (settings: ExtensionSettings): Promise<void> => {
  await chrome.storage.local.set({ extensionSettings: settings });
};

const getSettings = async (): Promise<ExtensionSettings | null> => {
  const result = await chrome.storage.local.get("extensionSettings");
  return result.extensionSettings ?? null;
};

const loadSettings = async (): Promise<ExtensionSettings> => {
  return (await getSettings()) ?? defaultSettings;
};


async function loadPortalsConfig(): Promise<Company[]> {
  const stored = await chrome.storage.local.get("portalsConfig");
  if (stored.portalsConfig) return stored.portalsConfig;

  const res = await fetch(chrome.runtime.getURL("config/portals.json"));
  const json = await res.json();

  await chrome.storage.local.set({ portalsConfig: json });
  return json;
}

async function getPortalConfig(link: string): Promise<Company | undefined> {

  const portalData = await loadPortalsConfig();

  return portalData.find((company: Company) =>
    link.startsWith(company.portalConfig.portalLink)
  );
}

async function getPortalRate(name: string): Promise<{ rate: number , rounding: boolean }> {

  const portalData = await loadPortalsConfig();

  const rate = portalData.find((company: Company) => name === company.companyName)?.payRate ?? 0;

  const rounding = portalData.find((company: Company) => name === company.companyName)?.portalConfig.rounding ?? false;

  return { rate, rounding };
}

async function getCompanyColorMap(): Promise<Record<string, string>> {

  const portalData = await loadPortalsConfig();

  return portalData.reduce((acc, company) => {
    acc[company.companyName] = company.color;
    return acc;
  }, {} as Record<string, string>);
}

async function getCompanyNameList(): Promise<string[]> {

  const portalData = await loadPortalsConfig();

  return portalData.map((company) => company.companyName);
}

async function savePortalsConfig(portalConfig: Company[]): Promise<void> {
  await chrome.storage.local.set({ portalsConfig: portalConfig });
};

export default {
  saveSettings,
  getSettings,
  loadSettings,
  getPortalConfig,
  getCompanyColorMap,
  getCompanyNameList,
  loadPortalsConfig,
  savePortalsConfig,
  getPortalRate
}