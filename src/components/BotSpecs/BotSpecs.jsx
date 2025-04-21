import React from "react";
import styles from "./BotSpecs.module.css";

const BotSpecs = ({ bot, enlistBot, backToCollection }) => {
  if (!bot) return null;

  const { name, health, damage, armor, bot_class, catchphrase, avatar_url } = bot;

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
    <div className={styles.botSpecsContainer}>
      <h2>Bot Specifications</h2>
      <div className={styles.botSpecsCard}>
        <div className={styles.botHeader}>
          <h3>{name} {getBotClassIcon(bot_class)}</h3>
          <div className={styles.botClass}>{bot_class}</div>
        </div>
        <div className={styles.botImageContainer}>
          <img src={avatar_url} alt={name} className={styles.botImage} />
        </div>
        <div className={styles.botStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Health:</span>
            <div className={styles.statBar}>
              <div 
                className={styles.statFill} 
                style={{ width: `${health}%`, backgroundColor: '#4caf50' }}
              ></div>
              <span className={styles.statValue}>{health}</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Damage:</span>
            <div className={styles.statBar}>
              <div 
                className={styles.statFill} 
                style={{ width: `${damage}%`, backgroundColor: '#f44336' }}
              ></div>
              <span className={styles.statValue}>{damage}</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Armor:</span>
            <div className={styles.statBar}>
              <div 
                className={styles.statFill} 
                style={{ width: `${armor}%`, backgroundColor: '#2196f3' }}
              ></div>
              <span className={styles.statValue}>{armor}</span>
            </div>
          </div>
        </div>
        <div className={styles.botCatchphrase}>
          <p>"{catchphrase}"</p>
        </div>
        <div className={styles.botActions}>
          <button 
            className={`${styles.botButton} ${styles.backBtn}`} 
            onClick={backToCollection}
          >
            Back to Collection
          </button>
          <button 
            className={`${styles.botButton} ${styles.enlistBtn}`} 
            onClick={() => enlistBot(bot)}
          >
            Enlist Bot
          </button>
        </div>
      </div>
    </div>
  );
};

export default BotSpecs;