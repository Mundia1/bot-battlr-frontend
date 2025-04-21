import { useState, useEffect, useCallback } from "react";
import BotCollection from "./components/BotCollection/BotCollection";
import YourBotArmy from "./components/YourBotArmy/YourBotArmy";
import BotSpecs from "./components/BotSpecs/BotSpecs";
import SortBar from "./components/SortBar/SortBar";
import { fetchBots, dischargeBot } from "./utils/api";
import "./App.css";

function App() {
  const [bots, setBots] = useState([]);
  const [displayedBots, setDisplayedBots] = useState([]);
  const [army, setArmy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("collection");
  const [selectedBot, setSelectedBot] = useState(null);

  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterClasses, setFilterClasses] = useState([]);

  const loadBots = useCallback(async () => {
    try {
      setLoading(true);
      const botsData = await fetchBots();
      console.log('Fetched bots:', botsData);
      setBots(botsData);
      setDisplayedBots(botsData);
    } catch (err) {
      setError("Failed to load bots. Please try again later.");
      console.error('Load bots error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBots();
  }, [loadBots]);

  const viewBotSpecs = (bot) => {
    setSelectedBot(bot);
    setViewMode("specs");
  };

  const backToCollection = () => {
    setViewMode("collection");
    setSelectedBot(null);
  };

  const enlistBot = (bot) => {
    const botClassExists = army.some(b => b.bot_class === bot.bot_class);

    if (!botClassExists) {
      setArmy([...army, bot]);
      setDisplayedBots(displayedBots.filter(b => b.id !== bot.id));
      if (viewMode === "specs") {
        backToCollection();
      }
    } else {
      alert(`You can only enlist one bot of class: ${bot.bot_class}`);
    }
  };

  const releaseBot = (bot) => {
    setArmy(army.filter(b => b.id !== bot.id));
    setDisplayedBots([...displayedBots, bot]);
  };

  const handleDischargeBot = useCallback(async (botId) => {
    try {
      console.log('Attempting to discharge bot:', botId);
      console.log('Current army:', army);
      console.log('Current bots:', bots);
      console.log('Current displayedBots:', displayedBots);
      await dischargeBot(botId);
      setArmy(prevArmy => prevArmy.filter(b => b.id !== botId));
      setBots(prevBots => prevBots.filter(b => b.id !== botId));
      setDisplayedBots(prevDisplayedBots => prevDisplayedBots.filter(b => b.id !== botId));
      console.log('Discharge successful for bot:', botId);
    } catch (err) {
      console.error('Discharge error:', err.message);
      setError("Failed to discharge bot. Please try again.");
    }
  }, [dischargeBot]);

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
        dischargeBot={handleDischargeBot}
      />

      {viewMode === "collection" && (
        <>
          <SortBar
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            filterClasses={filterClasses}
            setFilterClasses={setFilterClasses}
          />
          <BotCollection
            bots={displayedBots}
            handleClick={viewBotSpecs}
            sortBy={sortBy}
            sortDirection={sortDirection}
            filterClasses={filterClasses}
          />
        </>
      )}

      {viewMode === "specs" && selectedBot && (
        <BotSpecs
          bot={selectedBot}
          enlistBot={enlistBot}
          backToCollection={backToCollection}
        />
      )}
    </div>
  );
}

export default App;