import React from "react";
import BotCard from "../BotCard/BotCard";
import styles from "./YourBotArmy.module.css";

const YourBotArmy = ({ army, releaseBot, dischargeBot }) => {
  return (
    <div className={styles.armyContainer}>
      <h2>Your Bot Army</h2>
      <div className={styles.armyDescription}>
        {army.length === 0 ? (
          <p>You don't have any bots in your army yet. Click on bots to view details and enlist them!</p>
        ) : (
          <p>Click on a bot to release it from your army. Click the X to discharge permanently.</p>
        )}
      </div>
      <div className={styles.botArmy}>
        {army.map((bot) => (
          <BotCard 
            key={bot.id} 
            bot={bot} 
            handleClick={releaseBot}
            handleDischarge={dischargeBot}
          />
        ))}
      </div>
    </div>
  );
};

export default YourBotArmy;