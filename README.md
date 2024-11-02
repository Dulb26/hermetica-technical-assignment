# Blockchain Connection and Transfer App

A responsive web application built with React, TypeScript, and Tailwind CSS that enables users to connect to multiple blockchains (Bitcoin, Stacks, and Solana) simultaneously and perform Bitcoin transfers using connected wallet.

## Core Features

- 🔗 Simultaneous Multi-Chain Connections
  - Connect to Bitcoin, Stacks, and Solana independently
  - Maintain multiple active blockchain sessions
  - Support for different wallet accounts per blockchain
- 💸 Bitcoin Transfer System

  - Real-time amount validation
  - Bitcoin address format verification
  - Comprehensive error handling

- 🎨 Responsive Design
  - Mobile-first approach with Tailwind CSS
  - Clean, intuitive user interface
  - Smooth transitions and hover effects
  - Accessible UI components

## Technical Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Vitest (Unit Testing)
- Zustand (State Management)

## Prerequisites

- Node.js (v18+)
- npm or yarn
- Supported Wallet Extensions:
  - Bitcoin: Xverse, Hiro
  - Stacks: Hiro Wallet
  - Solana: Solflare

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/Dulb26/hermetica-technical-assignment.git
cd hermetica-technical-assignment
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start development server:

```bash
npm run start
# or
yarn start
```

4. Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
/app
├── /components         # Reusable UI components
├── /icons              # Custom icon components
├── /public             # Static assets
└── /routes             # Application pages
└── /services           # Blockchain services
├── /store              # Zustand store
└── /types              # TypeScript types
```

## Testing Coverage

The application includes comprehensive unit tests for:

- Wallet Connection Features

  - Individual blockchain connections
  - Multi-chain connection states
  - Wallet disconnection handling

- Transfer Component
  - Amount validation
  - Bitcoin address validation
  - Error scenarios

Run tests:

```bash
npm run test
# or
yarn test
```

View coverage:

```bash
npm run test:coverage
# or
yarn test:coverage
```

## State Management

Using Zustand for managing:

- Active blockchain connections
- Wallet states per blockchain
- Transfer component state
- Error messages and notifications

## Error Handling

- Network connectivity issues
- Wallet connection failures
- Invalid transfer inputs
- Transaction failures
- Clear user feedback messages

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE)

## Acknowledgments

- [Sats-Connect](https://github.com/secretkeylabs/sats-connect)
- [Solana Web3.js](https://github.com/solana-labs/solana-web3.js)
- [Stacks.js](https://github.com/hirosystems/stacks.js)

## Contact

Your Name - [@dulb26](https://twitter.com/dulb26)
Project Link: [https://github.com/Dulb26/hermetica-technical-assignment]
