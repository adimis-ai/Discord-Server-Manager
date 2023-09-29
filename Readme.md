# Simplifidis

Simplifidis is a powerful and easy-to-use Electron application built with React, Redux, and TypeScript. It features a robust development environment with support for hot-reloading, linting, and testing.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Scripts](#scripts)
- [Building for Production](#building-for-production)
- [Testing](#testing)

## Features

- Built with Electron, React, Redux, and TypeScript
- Pre-configured with Webpack, Babel, and Jest
- Supports hot-reloading for development
- Linting with ESLint and Prettier
- Automated testing with Jest and Testing Library
- Cross-platform support for macOS, Windows, and Linux

## Requirements

- Node.js >=14.x
- npm >=7.x

## Installation

1. Clone the repository:



```
git clone https://github.com/adimis-ai/simplifids.git
```

2. Change into the directory:

```
cd simplifids
```

3. Install dependencies:

```
npm install
```

4. Start the development environment:

```
npm start
```

## Scripts

- `npm start` - Start the development environment
- `npm run build` - Build the application for production
- `npm run lint` - Lint the source code using ESLint
- `npm run package` - Package the application for distribution
- `npm run rebuild` - Rebuild native modules
- `npm run test` - Run tests using Jest

## Building for Production

To build the application for production, run:

```
npm run build
```

This will create a production build in the `dist` folder.

## Testing

To run tests, execute:

```
npm run test
```

This will run Jest with the configured test suite.