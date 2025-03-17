# Crypto Alerts

A real-time cryptocurrency monitoring application that tracks and alerts users about significant trading activities.

## Features

- Real-time monitoring of cryptocurrency trades
- Alert system for different types of trading activities
- Modern, responsive UI built with React and Tailwind CSS
- Type-safe development with TypeScript
- Client-side routing with React Router

## Tech Stack

- **Framework:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Build Tool:** Vite
- **UI Components:** Radix UI
- **Deployment:** GitHub Pages

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/artyomloyko/crypto-alerts.git
cd crypto-alerts
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run test` - Run tests
- `npm run deploy` - Deploy to GitHub Pages

### Project Structure

```
crypto-alerts/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── context/       # React context providers
│   ├── lib/           # Utility functions
│   └── router.tsx     # Router configuration
├── public/            # Static assets
└── index.html         # Entry HTML file
```

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the main branch.

To manually deploy:

```bash
npm run deploy
```

The deployed application is available at: [https://artyomloyko.github.io/crypto-alerts](https://artyomloyko.github.io/crypto-alerts)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
