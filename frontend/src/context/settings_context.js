import axios from 'axios';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { settings_url } from '../utils/constants';
import { DEFAULT_PRICING } from '../utils/pricing';

// Store-wide configuration (shipping, GST, add-ons, announcement). Loaded once
// for the whole app; the storefront reads it for pricing, the admin Store
// Settings page edits it. Falls back to sensible defaults until loaded.
const defaultSettings = {
  ...DEFAULT_PRICING,
  hemmingPrice: 800,
  giftBoxPrice: 400,
  petticoatPrice: 600,
  announcementText: '',
};

const SettingsContext = React.createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await axios.get(settings_url);
      if (data?.data) setSettings((s) => ({ ...s, ...data.data }));
    } catch (e) {
      // keep defaults — storefront still works without the settings doc
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (payload) => {
    try {
      const { data } = await axios.put(settings_url, payload, { withCredentials: true });
      if (data?.data) setSettings((s) => ({ ...s, ...data.data }));
      return { success: true };
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Failed to save settings' };
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, fetchSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);
