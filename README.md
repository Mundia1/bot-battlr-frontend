# Bot Battlr

Welcome to **Bot Battlr**, the one and only spot in the known universe where you can custom build your own Bot Army!

## Description

This React application allows users to:
- Browse through a list of robots
- View bot details
- Enlist bots into their army
- Release bots from their army
- Permanently discharge bots from service

## Features

### Core Features
- View profiles of all bots in the Bot Collection
- Add individual bots to your army by clicking on them
- Release bots from your army by clicking on them
- Discharge bots permanently with the "x" button

## Setup Instructions

### Prerequisites
- Node.js and npm installed

### Installation
1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the JSON server for the backend:
   ```
   json-server --watch db.json --port 8001
   ```
5. In a new terminal, start the development server:
   ```
   npm run dev
   ```
6. Open your browser and visit `http://localhost:3000`

## Technologies Used
- React
- Vite
- CSS Modules
- JSON Server (for the backend)

## Project Structure
```
src/
├── App.css
├── App.jsx            # Main application component
├── assets/            # Static assets
├── components/        # React components
│   ├── BotCard/       # Individual bot display
│   ├── BotCollection/ # Collection of all available bots
│   └── YourBotArmy/   # User's selected bots
├── hooks/             # Custom React hooks
├── index.css          # Global styles
├── main.jsx           # Application entry point
├── Routes.jsx         # Router configuration (for expansion)
└── utils/             # Utility functions
    └── api.js         # API communication
```

## API
The application communicates with a local JSON server with the following endpoints:

- `GET /bots` - Retrieve all bots
- `DELETE /bots/:id` - Remove a bot

## Future Enhancements
- Sorting bots by health, damage, or armor
- Filtering bots by class
- Detailed view for each bot
- Limit enlistment to one bot per class

## License
MIT