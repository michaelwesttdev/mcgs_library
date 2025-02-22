
# Electron-TS-Tailwind-Webpack-Template

A modern Electron template built with **TypeScript**, **Tailwind CSS**, and **Webpack**. This template is designed to kickstart your desktop application development with a streamlined and efficient setup.

---

## Features

- **Electron**: Cross-platform desktop application development.
- **TypeScript**: Strongly-typed language for scalable and maintainable code.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
- **Webpack**: Bundler for optimized and efficient builds.
- **Hot Reloading**: Seamless development experience with live reloading.

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (>= 18.x)
- **npm** (>= 9.x) or **yarn** (>= 1.x)

---

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/michaelwesttdev/electron-ts-tailwind-webpack-template.git
    cd electron-ts-tailwind-webpack-template
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```

---

### Development

Start the development server with hot reloading:
```bash
npm run dev
```
or
```bash
yarn dev
```

This will:
- Bundle the app with Webpack
- Launch Electron with live reloading

---

### Build

To create a production build, run:
```bash
npm run build
```
or
```bash
yarn build
```

This will:
- Bundle the source code
- Optimize assets
- Output the files in the `dist` directory

---

### Packaging

To package the application for distribution:
```bash
npm run package
```
or
```bash
yarn package
```

This will:
- Create platform-specific installers (e.g., `.exe` for Windows, `.dmg` for macOS).

---

## Project Structure

```plaintext
electron-ts-tailwind-webpack-template/
│
├── src/                     # Source files
│   ├── main/                # Main process (Electron)
│   │   └── main.ts          # Main Electron entry
│   └── renderer/            # Renderer process (Frontend)
│       └── index.tsx        # React/Tailwind entry
│
├── public/                  # Static assets
│   └── index.html
│
├── dist/                    # Bundled output (auto-generated)
│
├── webpack.config.js        # Webpack configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # NPM scripts and dependencies
```

---

## Configuration

### Tailwind CSS
Customize Tailwind in `tailwind.config.js`:
```js
module.exports = {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### Webpack
The configuration is found in `webpack.config.js`, set up for:
- TypeScript transpilation
- Tailwind CSS processing
- Hot reloading in development mode

---

## Scripts

- `dev`: Starts the development server with hot reloading
- `build`: Bundles the application for production
- `package`: Packages the application into a distributable format
- `lint`: Runs ESLint for static code analysis

---

## Dependencies

### Core
- **Electron**: Desktop application framework
- **Webpack**: Module bundler
- **TypeScript**: Typed JavaScript for maintainable code
- **Tailwind CSS**: Utility-first CSS framework

### DevDependencies
- **ts-loader**: TypeScript loader for Webpack
- **postcss** and **autoprefixer**: Required for Tailwind processing
- **eslint**: Linting and code quality checks

---

## Contributing

1. **Fork the repository**
2. **Create a feature branch**:
    ```bash
    git checkout -b feature/your-feature
    ```
3. **Commit your changes**:
    ```bash
    git commit -m "Add your feature"
    ```
4. **Push to the branch**:
    ```bash
    git push origin feature/your-feature
    ```
5. **Create a Pull Request**

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- [Electron](https://www.electronjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Webpack](https://webpack.js.org/)

---

## Support

For issues or feature requests, please open an issue on [GitHub](https://github.com/michaelwesttdev/electron-ts-tailwind-webpack-template/issues).

---

## Author

Developed by **Tawana Michael West (https://github.com/michaelwesttdev)**
