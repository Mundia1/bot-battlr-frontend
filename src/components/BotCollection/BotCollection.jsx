import React from "react";
import BotCard from "../BotCard/BotCard";
import styles from "./BotCollection.module.css";

const BotCollection = ({ 
  bots, 
  handleClick,
  sortBy,
  sortDirection,
  filterClasses,
}) => {
  if (!bots || bots.length === 0) {
    return <div className={styles.noBots}>No bots available</div>;
  }

  // Apply filtering
  let filteredBots = [...bots];
  if (filterClasses.length > 0) {
    filteredBots = filteredBots.filter(bot => filterClasses.includes(bot.bot_class));
  }

  // Apply sorting
  if (sortBy) {
    filteredBots.sort((a, b) => {
      if (sortDirection === "asc") {
        return a[sortBy] - b[sortBy];
      } else {
        return b[sortBy] - a[sortBy];
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
            handleClick={handleClick} 
          />
        ))}
      </div>
    </div>
  );
};

export default BotCollection;