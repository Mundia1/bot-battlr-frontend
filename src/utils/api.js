// Use environment variable for API URL with fallback to static db.json
const API_URL = import.meta.env.VITE_API_URL || '/db.json';

export const fetchBots = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch bots. Status: ${response.status}`);
    }
    const data = await response.json();
    // Handle db.json structure: return bots array if { bots: [...] }, else raw data
    return Array.isArray(data) ? data : data.bots || [];
  } catch (error) {
    console.error("Error fetching bots:", error);
    throw error;
  }
};

export const dischargeBot = async (botId) => {
  try {
    // Static db.json can't be modified; return success for frontend state update
    return { success: true, botId };
  } catch (error) {
    console.error("Error discharging bot:", error);
    throw error;
  }
};