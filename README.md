# Bridge Game API

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Running the Application](#running-the-application)
   - [API Documentation](#api-documentation)
5. [Testing](#testing)
   - [Running Tests](#running-tests)
   - [Testing CI/CD Pipeline](#testing-ci-cd-pipeline)
6. [Using the API in a Custom Front-End](#using-the-api-in-a-custom-front-end)
   - [Available Endpoints](#available-endpoints)
   - [Socket.io Integration](#socketio-integration)
   - [Example: Integrating with React](#example-integrating-with-react)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Best Practices](#best-practices)
9. [Contributing](#contributing)
10. [License](#license)

---

## Introduction

The **Bridge Game API** is a robust and scalable backend service designed to manage Bridge game sessions. It provides RESTful endpoints for game management and leverages Socket.io for real-time communication between players.

## Features

- **Create and Join Game Sessions:** Supports creating new games and joining existing ones with 4 or 8 players.
- **Real-Time Updates:** Players receive instant updates on game state changes and player actions.
- **Game State Management:** Track and update game states as players make moves.
- **Delete Games:** Remove completed games to conserve storage.
- **Comprehensive API Documentation:** Easily understand and interact with the API using Swagger.
- **Robust Testing:** Ensure reliability with unit and integration tests.
- **CI/CD Integration:** Automated build, test, and deployment pipeline to Azure.

## Project Structure

```
bridgeapi/
├── src/
│   ├── config/
│   │   └── index.js
│   ├── controllers/
│   │   └── gameController.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   ├── validation.js
│   │   └── security.js
│   ├── models/
│   │   └── Game.js
│   ├── routes/
│   │   └── gameRoutes.js
│   ├── services/
│   │   └── gameService.js
│   ├── sockets/
│   │   ├── index.js
│   │   └── socketEvents.js
│   ├── utils/
│   │   └── logger.js
│   ├── validations/
│   │   └── gameValidation.js
│   └── app.js
├── tests/
│   ├── unit/
│   │   └── gameService.test.js
│   └── integration/
│       └── gameRoutes.test.js
├── .env
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── swagger/
│   └── swagger.json
├── package.json
├── jest.config.js
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js**: v20.x
- **MongoDB**: Running instance (local or cloud)
- **Azure Account**: For deployment
- **GitHub Account**: For CI/CD integration

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/bridgeapi.git
   cd bridgeapi
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**

   Create a `.env` file in the root directory with the following content:

   ```bash
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/bridgeapi
   CORS_ORIGIN=http://localhost:3000
   LOG_LEVEL=info
   ```

### Running the Application

1. **Start the Server:**

   ```bash
   npm run dev
   ```

   The server will start on [http://localhost:3001](http://localhost:3001).

   **Production Mode:**

   ```bash
   npm start
   ```

### API Documentation

Access the Swagger UI for API documentation:

[http://localhost:3001/api-docs](http://localhost:3001/api-docs)

## Testing

### Running Tests

The project includes both unit and integration tests using Jest and Supertest.

```bash
npm run test
```

### Testing CI/CD Pipeline

The project is integrated with GitHub Actions for CI/CD. The pipeline performs the following steps:

#### Locally Trigger GitHub Actions:

Use the Act tool to run GitHub Actions locally.

1. **Install Act:**

   ```bash
   brew install act
   ```

   (For other platforms, refer to Act's installation guide)

2. **Run the Workflow:**

   ```bash
   act -j build-and-test
   act -j deploy
   ```

   Note: Ensure you have Docker installed, as Act uses Docker to run workflows.

#### Azure Testing:

Alternatively, you can create a separate branch and push changes to trigger the pipeline without affecting the main branch. Use Azure's staging slots to test deployments before swapping to production.

## Using the API in a Custom Front-End

If you intend to build a custom front-end for the Bridge game, this section will guide you on utilizing the API's endpoints and real-time features.

### Available Endpoints

- **Create Game**

  - **URL:** `POST /api/game/create`
  - **Body:**

    ```json
    {
      "gameId": "unique-game-id",
      "playerId": "player1",
      "maxPlayers": 4
    }
    ```

  - **Description:** Creates a new game session.

- **Join Game**

  - **URL:** `POST /api/game/join`
  - **Body:**

    ```json
    {
      "gameId": "unique-game-id",
      "playerId": "player2"
    }
    ```

  - **Description:** Allows a player to join an existing game.

- **Update Game**

  - **URL:** `POST /api/game/update`
  - **Body:**

    ```json
    {
      "gameId": "unique-game-id",
      "playerId": "player1",
      "cardPlayed": {
        "suit": "hearts",
        "value": "A"
      }
    }
    ```

  - **Description:** Updates the game state when a player plays a card.

- **Delete Game**

  - **URL:** `DELETE /api/game/{gameId}`
  - **Description:** Deletes a completed game session.

### Socket.io Integration

Available Socket Events:

- **Connect:** Triggered when a client connects.
- **Disconnect:** Triggered when a client disconnects.
- **playerJoined:** Notifies when a new player joins the game.
- **gameStateUpdated:** Notifies all players about game state changes.
- **gameDeleted:** Notifies all players that the game has been deleted.
- **playerMove:** Custom event for player moves.
- **chatMessage:** Handles in-game chat messages.
- **gameStarted:** Notifies when the game starts.
- **gameEnded:** Notifies when the game ends.
- **error:** Handles error events.

### Example: Integrating with React

Here's a basic example of how to integrate the API with a React front-end using Socket.io.

1. **Install Dependencies**

   ```bash
   npm install socket.io-client axios
   ```

2. **Initialize Socket.io Client**

   ```javascript
   // src/socket.js
   import { io } from 'socket.io-client';

   const socket = io('http://localhost:3001');

   export default socket;
   ```

3. **Connecting to a Game Room**

   ```javascript
   // src/App.js
   import React, { useEffect } from 'react';
   import socket from './socket';

   function App() {
     useEffect(() => {
       const gameId = 'unique-game-id'; // Replace with your game ID
       socket.emit('joinGame', gameId);

       socket.on('playerJoined', (data) => {
         console.log('Player Joined:', data);
       });

       socket.on('gameStateUpdated', (data) => {
         console.log('Game State Updated:', data);
         // Update your state accordingly
       });

       socket.on('gameDeleted', (data) => {
         console.log('Game Deleted:', data);
         // Handle game deletion (e.g., redirect to home)
       });

       return () => {
         socket.disconnect();
       };
     }, []);

     return (
       <div className="App">
         <h1>Bridge Game</h1>
         {/* Your game UI goes here */}
       </div>
     );
   }

   export default App;
   ```

4. **Making API Calls**

   Use axios to interact with the API endpoints.

   ```javascript
   // src/api.js
   import axios from 'axios';

   const API_BASE_URL = 'http://localhost:3001/api/game';

   // Create Game
   export const createGame = (gameId, playerId, maxPlayers) => {
     return axios.post(`${API_BASE_URL}/create`, { gameId, playerId, maxPlayers });
   };

   // Join Game
   export const joinGame = (gameId, playerId) => {
     return axios.post(`${API_BASE_URL}/join`, { gameId, playerId });
   };

   // Update Game
   export const updateGame = (gameId, playerId, cardPlayed) => {
     return axios.post(`${API_BASE_URL}/update`, { gameId, playerId, cardPlayed });
   };

   // Delete Game
   export const deleteGame = (gameId) => {
     return axios.delete(`${API_BASE_URL}/${gameId}`);
   };
   ```

5. **Playing a Card**

   ```javascript
   // Example function to play a card
   const playCard = async () => {
     const gameId = 'unique-game-id';
     const playerId = 'player1';
     const cardPlayed = { suit: 'hearts', value: 'A' };

     try {
       const response = await updateGame(gameId, playerId, cardPlayed);
       console.log(response.data);
     } catch (error) {
       console.error(error.response.data);
     }
   };
   ```

6. **Listening to Real-Time Updates**

   The Socket.io client in `App.js` already listens to `playerJoined`, `gameStateUpdated`, and `gameDeleted` events. You can expand these listeners to update your UI accordingly.

## CI/CD Pipeline

The project utilizes GitHub Actions for continuous integration and deployment to Azure.

### Workflow Configuration

**File:** `.github/workflows/ci-cd.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20.x'

      - name: Install dependencies
        run: npm install

      - name: Run lint
        run: npm run lint

      - name: Run tests
        run: npm run test

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/

  deploy:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    environment:
      name: 'production'
      url: ${{ steps.deploy.outputs.webapp-url }}

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20.x'

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build --if-present

      - name: 'Deploy to Azure Web App'
        id: deploy-to-webapp
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'bridge-api' # Replace with your Azure Web App name
          slot-name: 'production'
          publish-profile: ${{ secrets.AZUREAPPSERVICE_PUBLISHPROFILE }}
          package: .
```

### Setting Up Secrets

Ensure you have added the `AZUREAPPSERVICE_PUBLISHPROFILE` secret in your GitHub repository settings. This should contain the publish profile XML from your Azure Web App.

### Triggering the Pipeline

- **On Push:** The pipeline runs on every push to the main branch.
- **On Pull Request:** The pipeline runs on pull requests targeting the main branch.
- **Manual Trigger:** Use the "Run workflow" button in the GitHub Actions tab.

## Best Practices

- **Environment Variables:** Centralize configuration using environment variables to avoid hardcoding sensitive information.
- **Input Validation & Sanitization:** Use `express-validator` to validate and sanitize incoming requests, preventing malicious data.
- **Security:** Implement security best practices using `helmet` for setting HTTP headers and `cors` for handling Cross-Origin Resource Sharing.
- **Logging:** Utilize `winston` for robust logging, aiding in debugging and monitoring.
- **Error Handling:** Centralize error handling to maintain consistency and provide meaningful error messages.
- **Testing:** Maintain high test coverage with unit and integration tests to ensure code reliability.
- **Documentation:** Keep API documentation up-to-date with Swagger, making it easier for developers to understand and interact with the API.
- **Scalability:** Organize code into modular directories, facilitating scalability and maintainability.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
