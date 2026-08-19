const DEFAULT_SETTINGS = {
  expiryThreshold: 48,
  discountEnabled: true,
  transferEnabled: true,
  notificationsEnabled: true,
  discountThreshold: 10,
};

export const getSettings = () => {
  try {
    const savedSettings = localStorage.getItem(
      "inventorySettings"
    );

    if (!savedSettings) {
      return DEFAULT_SETTINGS;
    }

    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(savedSettings),
    };
  } catch (error) {
    console.error("Unable to load settings:", error);

    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings) => {
  const updatedSettings = {
    ...DEFAULT_SETTINGS,
    ...settings,
  };

  localStorage.setItem(
    "inventorySettings",
    JSON.stringify(updatedSettings)
  );

  return updatedSettings;
};

export const resetSettings = () => {
  localStorage.removeItem("inventorySettings");

  return DEFAULT_SETTINGS;
};

export const getDefaultSettings = () => {
  return DEFAULT_SETTINGS;
};