import { useState, useEffect } from "react";
import BotCollection from "./components/BotCollection/BotCollection";
import YourBotArmy from "./components/YourBotArmy/YourBotArmy";
import BotSpecs from "./components/BotSpecs/BotSpecs";
import SortBar from "./components/SortBar/SortBar";
import { fetchBots, dischargeBot } from "./utils/api"; // Changed deleteBot to dischargeBot
import "./App.css";

function App() {
  const [bots, setBots] = useState([]);
  const [displayedBots, setDisplayedBots] = useState([]);
  const [army, setArmy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("collection"); // collection, specs
  const [selectedBot, setSelectedBot] = useState(null);
  
  // Sorting and filtering states
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filterClasses, setFilterClasses] = useState([]);

  useEffect(() => {
    const loadBots = async () => {
      try {
        setLoading(true);
        const botsData = await fetchBots();
        console.log('Fetched bots:', botsData); // Debug log
        setBots(botsData);
        setDisplayedBots(botsData);
      } catch (err) {
        setError("Failed to load bots. Please try again later.");
        console.error('Load bots error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBots();
  }, []);

  const viewBotSpecs = (bot) => {
    setSelectedBot(bot);
    setViewMode("specs");
  };

  const backToCollection = () => {
    setViewMode("collection");
    setSelectedBot(null);
  };

  const enlistBot = (bot) => {
    // Check if bot class is already in army
    const botClassExists = army.some(b => b.bot_class === bot.bot_class);
    
    if (!botClassExists) {
      // Add to army
      setArmy([...army, bot]);
      
      // Remove from displayed collection
      setDisplayedBots(displayedBots.filter(b => b.id !== bot.id));
      
      // If in specs view, go back to collection
      if (viewMode === "specs") {
        backToCollection();
      }
    } else {
      alert(`You can only enlist one bot of class: ${bot.bot_class}`);
    }
  };

  const releaseBot = (bot) => {
    // Remove from army
    setArmy(army.filter(b => b.id !== bot.id));
    
    // Add back to collection
    setDisplayedBots([...displayedBots, bot]);
  };

  const dischargeBot = async (botId) => {
    try {
      await dischargeBot(botId); // Changed to dischargeBot
      // Remove from army
      setArmy(army.filter(b => b.id !== botId));
      // Also remove from original bots list
      setBots(bots.filter(b => b.id !== botId));
      setDisplayedBots(displayedBots.filter(b => b.id !== botId));
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