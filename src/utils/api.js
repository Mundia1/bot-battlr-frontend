const API_URL = "http://localhost:8001";

export const fetchBots = async () => {
  try {
    const response = await fetch(`${API_URL}/bots`);
    if (!response.ok) {
      throw new Error(`Failed to fetch bots. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching bots:", error);
    throw error;
  }
};

export const deleteBot = async (botId) => {
  try {
    const response = await fetch(`${API_URL}/bots/${botId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Failed to delete bot. Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting bot:", error);
    throw error;
  }
};