// TCI Brand Colors and Assets
// TODO: Replace placeholder values with actual hex values from TCI_BrandManualGuide.pdf

export const TCI = {
  green: "#7CC04B", // TODO: set from PDF
  dark: "#233238", // TODO: set from PDF  
  light: "#F4F7F6", // TODO: set from PDF
  white: "#FFFFFF",
  boardWood: "#8B4513", // dark wood board color
  boardWoodLight: "#A0522D", // lighter wood accent
  boardWoodDark: "#654321", // darker wood accent
} as const;

export const TCI_ASSETS = {
  logo: "/img/tci-logo.png",
  photo: "/img/tci-photo.jpg", // TODO: Add the "other TCI Photo"
} as const;

export type TCIColor = keyof typeof TCI;





