# Grammar Check Application

## Getting Started

### Prerequisites
- Node.js installed
- npm package manager
- node version v20+

### Setup and Running
1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory with the following keys:
   - PORT
   - JWT_SECRET 
   - OPENAI_API_KEY
   - NODE_ENV

   Sample JWT_SECRET: `8f43a09c1b4e5d2f7a6b9c0e3d8f1a4b5c2e7d9`

4. Start the backend server: `npm run backend`
5. Start the frontend development server: `npm run dev`
   (Frontend proxies to backend port via Vite config)

## Features

### Frontend
- Built with React and Vite
- BEM methodology for structured and scalable CSS
- SCSS variables for consistent styling -  Though not been able to use everywhere in the esscence of time
- Debounced API requests for optimal performance
- Real-time error highlighting
- Authentication system (currently in-memory, can be connected to a database)
- Haven't used any third party UI libs to keep the app lightweight

### Backend
- A bare minimum Express.js server
- OpenAI GPT integration for grammar checking
- Returns word positions and errors for highlighting
- JWT-based authentication

## Technical Implementation

- Frontend sends debounced requests on text changes
- Error highlights are cleared during rechecking
- Backend processes text using GPT API and returns position-based error data
- Frontend renders highlighted errors in real-time

## Future Improvements

- TypeScript implementation (TSX)
- Enhanced architecture using NestJS
- Real-time updates using WebSocket/SSE
- Memoization for optimized rechecking
- Database integration for user management
- More comprehensive SCSS variable usage
- For Edge cases related to position - As using LLM is not the most reliable way to compare for errors 

Options:
1. To fine tune a Gpt for grammar checking - Medium effort, high - medium throughput
2. Use a simple redis based RAG for eample references to enhance prompt for edge cases.  - Low effort, low throughput

More advanced - High effort:
Graph Neural Networks - GNNs have been used in more advanced NLP tasks like text classification, relation extraction, and document classification.