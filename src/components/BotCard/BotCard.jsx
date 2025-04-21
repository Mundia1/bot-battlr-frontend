import React from "react";
import styles from "./BotCard.module.css";

const BotCard = ({ bot, handleClick, handleDischarge }) => {
  const { id, name, health, damage, armor, bot_class, catchphrase, avatar_url } = bot;

  const getBotClassIcon = (botClass) => {
    switch (botClass) {
      case "Support":
        return "🔧";
      case "Medic":
        return "💉";
      case "Assault":
        return "🔫";
      case "Defender":
        return "🛡️";
      case "Captain":
        return "👨‍✈️";
      case "Witch":
        return "🧙‍♀️";
      default:
        return "🤖";
    }
  };

  return (
    <div className={styles.botCard} onClick={() => handleClick(bot)}>
      <div className={styles.botHeader}>
        <h3>{name}</h3>
        {handleDischarge && (
          <button 
            className={styles.dischargeBtn} 
            onClick={(e) => {
              e.stopPropagation();
              handleDischarge(id);
            }}
          >
            x
          </button>
        )}
      </div>
      <div className={styles.botAvatar}>
        <img src={avatar_url} alt={name} />
        <span className={styles.botClass}>
          {getBotClassIcon(bot_class)} {bot_class}
        </span>
      </div>
      <div className={styles.botStats}>
        <div>❤️ {health}</div>
        <div>⚔️ {damage}</div>
        <div>🛡️ {armor}</div>
      </div>
      <div className={styles.botCatchphrase}>
        <p>"{catchphrase}"</p>
      </div>
    </div>
  );
};

export default BotCard;