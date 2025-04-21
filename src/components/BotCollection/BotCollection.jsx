import React, { useState, useEffect } from "react";
import BotCard from "../BotCard/BotCard";
import styles from "./BotCollection.module.css";
import { fetchBots } from "../../utils/api"; // Import fetchBots

const BotCollection = ({ onBotSelect, enlistedBots, onBotEnlist, sortBy, sortDirection, filterClasses }) => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchBots()
      .then((data) => {
        // Filter out already enlisted bots from the collection
        const availableBots = data.filter(
          (bot) => !enlistedBots.some((enlistedBot) => enlistedBot.id === bot.id)
        );
        setBots(availableBots);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
        console.error("Error fetching bots:", err);
      });
  }, [enlistedBots]); // Re-fetch when enlistedBots changes

  if (loading) {
    return <div className={styles.loading}>Loading bots...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error loading bots: {error.message}</div>;
  }

  if (!bots || bots.length === 0) {
    return <div className={styles.noBots}>No new bots available</div>;
  }

  // Apply filtering
  let filteredBots = [...bots];
  if (filterClasses.length > 0) {
    filteredBots = filteredBots.filter((bot) => filterClasses.includes(bot.bot_class));
  }

  // Apply sorting
  if (sortBy) {
    filteredBots.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      if (sortDirection === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  }

  return (
    <div className={styles.botCollectionContainer}>
      <h2>Bot Collection</h2>
      <div className={styles.botCollection}>
        {filteredBots.map((bot) => (
          <BotCard
            key={bot.id}
            bot={bot}
            handleClick={() => onBotSelect(bot)} // Use onBotSelect to show details
            onEnlist={onBotEnlist} // Pass down the enlist function
          />
        ))}
      </div>
    </div>
  );
};

export default BotCollection;