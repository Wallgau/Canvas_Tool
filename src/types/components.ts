/**
 * Component-specific types that are used across multiple components
 * These types are re-exported from individual component type files
 */

// Button component types
export type {
  ButtonVariant,
  ButtonSize,
  ButtonProps,
} from '../components/shared/Button/Button.types';

// SideMenu component types
export type {
  SideMenuOption,
  SideMenuProps,
  SideMenuPosition,
} from '../components/shared/SideMenu/SideMenu.types';

// ConfirmationModal component types
export type { ConfirmationModalProps } from '../components/shared/ConfirmationModal/ConfirmationModal';

// ToolCanvasV2 component types
export type { ToolCanvasV2Props } from '../components/ToolCanvasV2/ToolCanvasV2.types';
