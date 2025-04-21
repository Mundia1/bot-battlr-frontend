// src/utils/api.js

const API_URL = process.env.NODE_ENV === 'production'
  ? process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "YOUR_PRODUCTION_API_URL"
  : "http://localhost:8001";

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

export const enlistBot = async (botId) => {
  // Assuming you have a way to identify the user on the frontend
  // For this example, we'll hardcode a userId, but in a real app,
  // you'd get this from authentication context or state.
  const userId = 'user123';
  try {
    const response = await fetch(`${API_URL}/armies/${botId}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to enlist bot: ${response.status} - ${errorData?.error || 'Unknown error'}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error enlisting bot:", error);
    throw error;
  }
};

export const releaseBot = async (botId) => {
  // Assuming you have a way to identify the user on the frontend
  const userId = 'user123'; // Replace with actual user ID
  try {
    const response = await fetch(`${API_URL}/armies/${botId}/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to release bot: ${response.status} - ${errorData?.error || 'Unknown error'}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error releasing bot:", error);
    throw error;
  }
};