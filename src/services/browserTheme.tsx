import React from "react";

export const setModeFromBrowserPreference = () => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const root = document.documentElement;
  if (prefersDark) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
};

export const toggleMode = (
  mode: "light" | "dark",
  setMode: React.Dispatch<React.SetStateAction<"light" | "dark">>
) => {
  const newMode = mode === "light" ? "dark" : "light";
  document.documentElement.classList.toggle("dark");
  setMode(newMode);
};
