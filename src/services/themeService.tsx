import settingsService from "./settingsService";

const setTheme = (theme: "dark" | "light") => {
  const root = document.documentElement;
  if (theme  === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

const setThemeFromSettings = async (page: "popup" | "dashboard") => {
  const settings = await settingsService.loadSettings();
  const devicePreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  let theme: "dark" | "light";

  if (page === "dashboard") {
    theme = (settings.appearence.dashboard === "device") ? devicePreference : settings.appearence.dashboard;
  } else {
    theme = (settings.appearence.popup === "device") ? devicePreference : settings.appearence.popup;
  }

  setTheme(theme);
}

export default setThemeFromSettings;


