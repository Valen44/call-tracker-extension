import { type Company } from "@/types/Company";

export type Appearence = "dark" | "light" | "device";

export type ExtensionSettings = {
  rate: number;
  appearence: {
    dashboard: Appearence;
    popup: Appearence;
  };
  callSorting: "asc" | "desc";
};

export 
const defaultSettings: ExtensionSettings = {
  rate: 0.15,
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


async function getPortalData(): Promise<Company[]> {

  const portalResponse = await fetch(chrome.runtime.getURL("config/portals.json"));
  const portalData: Company[] = await portalResponse.json();

  return portalData;
}

async function getPortalConfig(link: string): Promise<Company | undefined> {

  const portalData = await getPortalData();

  return portalData.find((company: Company) =>
    link.startsWith(company.portalConfig.portalLink)
  );
}

async function getCompanyColorMap(): Promise<Record<string, string>> {

  const portalData = await getPortalData();

  return portalData.reduce((acc, company) => {
    acc[company.companyName] = company.color;
    return acc;
  }, {} as Record<string, string>);
}

async function getCompanyNameList(): Promise<string[]> {

  const portalData = await getPortalData();

  return portalData.map((company) => company.companyName);
}

export default { saveSettings, getSettings, loadSettings, getPortalConfig, getCompanyColorMap, getCompanyNameList}