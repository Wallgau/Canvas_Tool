# 🛠️ Tool Canvas V2

A modern, accessible visual workflow builder that allows you to create, organize, and manage tool workflows on a drag-and-drop canvas using ReactFlow.

![Tool Canvas V2](https://img.shields.io/badge/version-2.0.0-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D22.12.0-green)
![React](https://img.shields.io/badge/react-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.9.2-blue)
![Vite](https://img.shields.io/badge/vite-7.1.5-purple)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.4.0-blue)
![ReactFlow](https://img.shields.io/badge/reactflow-12.0.0-orange)

## ✨ Features

- **🎨 Visual Workflow Builder** - Drag and drop tools using ReactFlow
- **🔧 5 Built-in Tools** - Weather, Wikipedia, Email, Calculator, Translator
- **📱 Responsive Design** - Works on desktop and mobile devices
- **♿ Accessibility** - WCAG 2.1 AA compliant with screen reader support
- **💾 Data Persistence** - Auto-saves to localStorage
- **📤 Export/Import** - Save and share configurations as JSON
- **🎯 TypeScript** - Full type safety and IntelliSense
- **⚡ Performance** - Optimized with lazy loading and code splitting
- **🎨 Modern UI** - Built with Tailwind CSS and reusable components
- **📚 Component Library** - Documented with Ladle for easy development

## 🚀 Quick Start

### Prerequisites

- **Node.js 22.12.0 or higher** (required for Vite 7.1.5)
- **npm 10.0.0 or higher**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Wallgau/Canvas_Tool.git
   cd Canvas_Tool
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

| Command              | Description                     |
| -------------------- | ------------------------------- |
| `npm run dev`        | Start development server        |
| `npm run build`      | Build for production            |
| `npm run preview`    | Preview production build        |
| `npm run test`       | Run tests in watch mode         |
| `npm run test:run`   | Run tests once                  |
| `npm run lint`       | Check code quality              |
| `npm run lint:fix`   | Fix linting issues              |
| `npm run format`     | Format code with Prettier       |
| `npm run type-check` | Check TypeScript types          |
| `npm run ladle`      | Start component library         |
| `npm run ladle:build`| Build component library         |

## 🏗️ Project Architecture

### Tech Stack

- **Frontend**: React 19.1.1 with TypeScript 5.9.2
- **Build Tool**: Vite 7.1.5 with ESBuild
- **Styling**: Tailwind CSS 3.4.0
- **Canvas**: ReactFlow 12.0.0 for drag-and-drop functionality
- **Testing**: Vitest with React Testing Library
- **Component Library**: Ladle for component documentation
- **Code Quality**: ESLint + Prettier
- **Deployment**: GitHub Actions + GitHub Pages

### Project Structure

```
src/
├── App/                           # Main app component
├── components/
│   ├── reusable/                  # 🆕 Generic, reusable UI components
│   │   ├── Button/               # Button component with variants
│   │   ├── Input/                # Input component with validation
│   │   ├── Card/                 # Generic card container
│   │   ├── SideMenu/             # Side menu/drawer component
│   │   ├── ConfirmationModal/    # Confirmation dialog
│   │   ├── index.ts              # Clean exports
│   │   └── README.md             # Component documentation
│   ├── ToolCard/                 # Tool-specific card component
│   ├── Toolbar/                  # Main toolbar component
│   ├── ToolSelector/             # Tool selection component
│   └── ItemSelector/             # Generic item selector wrapper
├── pages/
│   └── ToolCanvasPage.tsx        # Main canvas page with ReactFlow
├── hooks/
│   ├── useToolManagement.ts      # Tool CRUD operations
│   └── useToolPersistence.ts     # LocalStorage persistence
├── types/                        # TypeScript type definitions
├── utils/                        # Utility functions
└── test/                         # Test setup files
```

### Component Architecture

#### Reusable Components (`src/components/reusable/`)
- **Generic & Composable**: Can be used across different contexts
- **Type-Safe**: Full TypeScript support with proper interfaces
- **Accessible**: WCAG 2.1 AA compliant
- **Documented**: Stories available in Ladle component library
- **Consistent**: Unified styling and behavior patterns

#### Tool-Specific Components
- **ToolCard**: Specialized card for tool workflows
- **Toolbar**: Main application toolbar
- **ToolSelector**: Tool selection interface
- **ItemSelector**: Generic wrapper for selection UIs

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

- Click on any parameter to edit it inline
- Press **Enter** to save or **Escape** to cancel
- Parameters are validated based on input type
- All fields are editable with real-time validation

### 3. Organizing Workflow

- **Drag and drop** tools using ReactFlow
- Tools automatically save their positions
- Visual feedback during dragging
- Zoom and pan support for large workflows

### 4. Exporting Workflow

- Click **"Export"** to download configuration as JSON
- Share configurations with others
- Import by replacing localStorage data

### 5. Starting Over

- Click **"Clear All"** to remove all tools
- Confirmation modal prevents accidental clearing

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

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Start component library**
   ```bash
   npm run ladle
   ```

5. **Run tests**
   ```bash
   npm run test:run
   ```

6. **Check code quality**
   ```bash
   npm run lint
   npm run type-check
   ```

### Building for Production

```bash
npm run build
npm run preview
```

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

## 📚 Component Library

The project includes a component library built with **Ladle**:

- **Interactive Stories** - See components in different states
- **Live Documentation** - Real-time component examples
- **Development Tool** - Test components in isolation

**Start the component library:**

```bash
npm run ladle
```

Visit `http://localhost:61000` to explore the component library.

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
- Available at: `https://wallgau.github.io/Canvas_Tool/`
- Includes `.nojekyll` file for proper static file serving

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
- **Modify styling** - Update Tailwind classes or create custom CSS
- **Change behavior** - Modify hooks in `src/hooks/`
- **Add components** - Create new components in `src/components/reusable/`

## 📊 Performance

- **Lazy loading** - Components loaded on demand
- **Code splitting** - Reduced initial bundle size
- **ReactFlow optimization** - Efficient canvas rendering
- **React optimizations** - Memoization and efficient re-renders
- **Tailwind CSS** - Optimized CSS with purging

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
- **ReactFlow** - Canvas functionality
- **Tailwind CSS** - Styling framework
- **Ladle** - Component library
- **Vitest** - Testing framework
- **Testing Library** - Component testing utilities

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Wallgau/Canvas_Tool/issues) page
2. Ensure you're using Node.js 22.12.0 or higher
3. Verify all dependencies are installed correctly
4. Create a new issue with detailed information

---

**Happy building! 🚀**