import React from "react";
import styles from "./SortBar.module.css";

const BOT_CLASSES = ["Support", "Medic", "Assault", "Defender", "Captain", "Witch"];

const SortBar = ({ 
  sortBy, 
  setSortBy, 
  sortDirection, 
  setSortDirection,
  filterClasses,
  setFilterClasses
}) => {
  const handleSortChange = (criteria) => {
    if (sortBy === criteria) {
      // Toggle direction if clicking the same criteria
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new criteria and default to ascending
      setSortBy(criteria);
      setSortDirection("asc");
    }
  };

  const toggleClassFilter = (botClass) => {
    setFilterClasses(prev => {
      if (prev.includes(botClass)) {
        return prev.filter(c => c !== botClass);
      } else {
        return [...prev, botClass];
      }
    });
  };

  const getSortIcon = (criteria) => {
    if (sortBy !== criteria) return null;
    return sortDirection === "asc" ? "↑" : "↓";
  };

  return (
    <div className={styles.sortBarContainer}>
      <div className={styles.sortOptions}>
        <h3>Sort by:</h3>
        <button 
          className={`${styles.sortButton} ${sortBy === "health" ? styles.active : ""}`}
          onClick={() => handleSortChange("health")}
        >
          Health {getSortIcon("health")}
        </button>
        <button 
          className={`${styles.sortButton} ${sortBy === "damage" ? styles.active : ""}`}
          onClick={() => handleSortChange("damage")}
        >
          Damage {getSortIcon("damage")}
        </button>
        <button 
          className={`${styles.sortButton} ${sortBy === "armor" ? styles.active : ""}`}
          onClick={() => handleSortChange("armor")}
        >
          Armor {getSortIcon("armor")}
        </button>
      </div>
      <div className={styles.filterOptions}>
        <h3>Filter by class:</h3>
        <div className={styles.filterButtons}>
          {BOT_CLASSES.map(botClass => (
            <button
              key={botClass}
              className={`${styles.filterButton} ${filterClasses.includes(botClass) ? styles.active : ""}`}
              onClick={() => toggleClassFilter(botClass)}
            >
              {botClass}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortBar;