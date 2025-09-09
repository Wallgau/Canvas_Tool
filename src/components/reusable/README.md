# Reusable Components

This folder contains generic, reusable UI components that can be used throughout the application.

## Components

### Button

- **Purpose**: Generic button component with multiple variants
- **Variants**: primary, secondary, destructive, outline, ghost, link
- **Usage**: `<Button description="Click me" variant="primary" onClick={handleClick} />`

### Input

- **Purpose**: Generic input field component
- **Features**: Type support, placeholder, validation states
- **Usage**: `<Input placeholder="Enter text..." value={value} onChange={handleChange} />`

### Card

- **Purpose**: Generic container component for content
- **Features**: Title, description, content, actions, delete functionality
- **Usage**: `<Card title="Title" description="Description" content={<Content />} />`

### SideMenu

- **Purpose**: Generic side menu/drawer component
- **Features**: Left/right positioning, options list, keyboard navigation
- **Usage**: `<SideMenu options={options} isVisible={isVisible} onSelect={handleSelect} />`

### ConfirmationModal

- **Purpose**: Generic confirmation dialog
- **Features**: Customizable message, confirm/cancel actions
- **Usage**: `<ConfirmationModal isVisible={isVisible} description="Are you sure?" onConfirm={handleConfirm} />`

## Design Principles

- **Generic**: Components should be reusable across different contexts
- **Composable**: Components can be combined to create complex UIs
- **Accessible**: All components follow accessibility best practices
- **Consistent**: Unified styling and behavior patterns
- **Type-safe**: Full TypeScript support with proper interfaces

## Usage

```typescript
import { Button, Input, Card, SideMenu, ConfirmationModal } from '../reusable';
```

## File Structure

```
reusable/
├── Button/
│   ├── Button.tsx
│   ├── Button.types.ts
│   └── Button.stories.tsx
├── Input/
│   ├── Input.tsx
│   ├── Input.types.ts
│   └── Input.stories.tsx
├── Card/
│   ├── Card.tsx
│   ├── Card.types.ts
│   └── Card.stories.tsx
├── SideMenu/
│   ├── SideMenu.tsx
│   ├── SideMenu.types.ts
│   └── SideMenu.stories.tsx
├── ConfirmationModal/
│   ├── ConfirmationModal.tsx
│   └── ConfirmationModal.stories.tsx
├── index.ts
└── README.md
```
