import React from "react";
import BotCard from "../BotCard/BotCard";
import styles from "./BotCollection.module.css";

const BotCollection = ({ bots, enlistBot }) => {
  if (!bots || bots.length === 0) {
    return <div className={styles.noBots}>No bots available</div>;
  }

  return (
    <div className={styles.botCollectionContainer}>
      <h2>Bot Collection</h2>
      <div className={styles.botCollection}>
        {bots.map((bot) => (
          <BotCard 
            key={bot.id} 
            bot={bot} 
            handleClick={enlistBot} 
          />
        ))}
      </div>
    </div>
  );
};

export default BotCollection;