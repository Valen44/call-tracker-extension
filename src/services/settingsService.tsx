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

export default { saveSettings, getSettings, loadSettings}