# 🛠️ Tool Canvas V2

A modern, accessible visual workflow builder that allows you to create, organize, and manage tool workflows on a drag-and-drop canvas.

![Tool Canvas V2](https://img.shields.io/badge/version-2.0.0-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D22.12.0-green)
![React](https://img.shields.io/badge/react-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue)
![Vite](https://img.shields.io/badge/vite-7.1.5-purple)

## ✨ Features

- **🎨 Visual Workflow Builder** - Drag and drop tools to create workflows
- **🔧 5 Built-in Tools** - Weather, Wikipedia, Email, Calculator, Translator
- **📱 Responsive Design** - Works on desktop and mobile devices
- **♿ Accessibility** - WCAG 2.1 AA compliant with screen reader support
- **💾 Data Persistence** - Auto-saves to localStorage
- **📤 Export/Import** - Save and share configurations as JSON
- **🎯 TypeScript** - Full type safety and IntelliSense
- **⚡ Performance** - Optimized with lazy loading and code splitting

## 🚀 Quick Start

### Prerequisites

- **Node.js 22.12.0 or higher** (required for Vite 7.1.5)
- **npm 10.0.0 or higher**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Wallgau/Tool_Canvas.git
   cd Tool_Canvas
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📋 Available Scripts

| Command              | Description               |
| -------------------- | ------------------------- |
| `npm run dev`        | Start development server  |
| `npm run build`      | Build for production      |
| `npm run preview`    | Preview production build  |
| `npm run test`       | Run tests in watch mode   |
| `npm run test:run`   | Run tests once            |
| `npm run lint`       | Check code quality        |
| `npm run lint:fix`   | Fix linting issues        |
| `npm run format`     | Format code with Prettier |
| `npm run type-check` | Check TypeScript types    |

## 🏗️ Project Structure

```
src/
├── App/                    # Main app component
├── components/
│   ├── shared/            # Reusable components
│   │   ├── Button/        # Button component
│   │   ├── SideMenu/      # Side menu component
│   │   └── ConfirmationModal/
│   ├── ToolCanvasV2/      # Main canvas component
│   │   ├── components/    # Canvas sub-components
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Canvas utilities
│   └── ToolCard/          # Individual tool cards
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
└── test/                  # Test setup files
```

## 🎯 How to Use

### 1. Adding Tools

- Click the **"Add Tool"** button in the toolbar
- Select from 5 available tools:
  - 🌤️ **Weather Forecast** - Get weather information
  - 🔍 **Wikipedia Search** - Search Wikipedia articles
  - 📧 **Email Sender** - Compose and send emails
  - 🧮 **Calculator** - Perform calculations
  - 🌍 **Text Translator** - Translate text

### 2. Configuring Tools

- Click on any parameter to edit it
- Press **Enter** to save or **Escape** to cancel
- Parameters are validated based on input type

### 3. Organizing Workflow

- **Drag and drop** tools to rearrange them
- Tools automatically save their positions
- Visual feedback during dragging

### 4. Exporting Workflow

- Click **"Export"** to download configuration as JSON
- Share configurations with others
- Import by replacing localStorage data

### 5. Starting Over

- Click **"Clear"** to remove all tools
- Confirmation dialog prevents accidental clearing

## 🛠️ Development

### Node.js Version Requirements

This project requires **Node.js 22.12.0 or higher** due to Vite 7.1.5 compatibility requirements.

**Check your Node.js version:**

```bash
node --version
```

**If you need to upgrade Node.js:**

- **Using nvm (recommended):**
  ```bash
  nvm install 22
  nvm use 22
  ```
- **Direct download:** [nodejs.org](https://nodejs.org/)
- **Using Homebrew:**
  ```bash
  brew install node@22
  ```

### Local Development Setup

1. **Ensure Node.js 22+ is installed**
   ```bash
   node --version  # Should show v22.x.x or higher
   ```

````

2. **Install dependencies**
 ```bash
npm install
````

3. **Start development server**
   ```bash
   npm run dev
   ```

````

4. **Run tests**
 ```bash
npm run test:run
````

5. **Check code quality**
   ```bash
   npm run lint
   npm run type-check
   ```

````

### Building for Production

```bash
npm run build
npm run preview
````

## 🧪 Testing

The project uses **Vitest** for testing with comprehensive coverage:

- **Unit tests** - Individual component testing
- **Hook tests** - Custom hook testing
- **Utility tests** - Function testing
- **Integration tests** - Component interaction testing

**Run tests:**

```bash
npm run test        # Watch mode
npm run test:run    # Single run
```

## ♿ Accessibility

This project is built with accessibility in mind:

- **Screen reader support** - ARIA labels and live regions
- **Keyboard navigation** - Full keyboard accessibility
- **Focus management** - Proper focus handling
- **High contrast** - CSS supports high contrast mode
- **WCAG 2.1 AA compliant**

## 🚀 Deployment

### GitHub Pages (Automatic)

- Pushes to `main` branch automatically deploy
- Available at: `https://wallgau.github.io/Tool_Canvas/`

### Netlify

- Connect your GitHub repository
- Build command: `npm run build`
- Publish directory: `dist`
- Node.js version: `22`

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🔧 Configuration

### Environment Variables

No environment variables required for basic functionality.

### Customization

- **Add new tools** - Edit `src/types/global.ts`
- **Modify styling** - Update CSS modules in component folders
- **Change behavior** - Modify hooks in `src/components/ToolCanvasV2/hooks/`

## 📊 Performance

- **Lazy loading** - Components loaded on demand
- **Code splitting** - Reduced initial bundle size
- **CSS optimization** - Critical CSS inlined
- **React optimizations** - Memoization and efficient re-renders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Vitest** - Testing framework
- **Testing Library** - Component testing utilities

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Wallgau/Tool_Canvas/issues) page
2. Ensure you're using Node.js 22.12.0 or higher
3. Verify all dependencies are installed correctly
4. Create a new issue with detailed information

---

**Happy building! 🚀**
