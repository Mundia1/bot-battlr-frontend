import { useState, useEffect } from "react";
import BotCollection from "./components/BotCollection/BotCollection";
import YourBotArmy from "./components/YourBotArmy/YourBotArmy";
import { fetchBots, deleteBot } from "./utils/api";
import "./App.css";

function App() {
  const [bots, setBots] = useState([]);
  const [army, setArmy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBots = async () => {
      try {
        setLoading(true);
        const botsData = await fetchBots();
        setBots(botsData);
      } catch (err) {
        setError("Failed to load bots. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBots();
  }, []);

  const enlistBot = (bot) => {
    // Check if bot is already in army
    if (!army.find(b => b.id === bot.id)) {
      setArmy([...army, bot]);
    }
  };

  const releaseBot = (bot) => {
    setArmy(army.filter(b => b.id !== bot.id));
  };

  const dischargeBot = async (botId) => {
    try {
      await deleteBot(botId);
      setArmy(army.filter(b => b.id !== botId));
      setBots(bots.filter(b => b.id !== botId));
    } catch (err) {
      setError("Failed to discharge bot. Please try again.");
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">Loading bots...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Bot Battlr</h1>
        <p>Build your bot army!</p>
      </header>

      <YourBotArmy 
        army={army} 
        releaseBot={releaseBot}
        dischargeBot={dischargeBot}
      />

      <BotCollection 
        bots={bots}
        enlistBot={enlistBot}
      />
    </div>
  );
}

export default App;