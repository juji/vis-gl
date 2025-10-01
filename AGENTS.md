# GitHub Copilot Instructions

## File Naming Conventions

**ALWAYS use lowercase kebab-case for all filenames.**

### Examples:
- ✅ `user-profile.tsx`
- ✅ `api-handler.ts`
- ✅ `data-table.component.tsx`
- ✅ `auth-service.ts`
- ✅ `navigation-menu.tsx`

### Avoid:
- ❌ `UserProfile.tsx` (PascalCase)
- ❌ `apiHandler.ts` (camelCase)
- ❌ `data_table.tsx` (snake_case)
- ❌ `NAVIGATION.tsx` (UPPERCASE)

## Component Creation Standards

**ALWAYS organize components in their own directory with proper structure.**

### Directory Structure
Each component should have its own directory containing:
- `index.tsx` - Main component file
- `styles.module.css` - CSS module for component-specific styles
- Additional files as needed (tests, stories, etc.)

### Examples:
```
src/components/
├── sidebar/
│   ├── index.tsx
│   └── styles.module.css
├── navigation-menu/
│   ├── index.tsx
│   ├── styles.module.css
│   └── navigation-menu.test.tsx
└── user-profile/
    ├── index.tsx
    ├── styles.module.css
    └── user-profile.stories.tsx
```

### Component File Structure (`index.tsx`):
```tsx
'use client'; // Only if client-side features are needed

import styles from './styles.module.css';

interface ComponentNameProps {
  // Define props with TypeScript
  className?: string;
  children?: React.ReactNode;
}

export default function ComponentName({ 
  className = '',
  children 
}: ComponentNameProps) {
  return (
    <div className={`${styles.componentName} ${className}`}>
      {children}
    </div>
  );
}
```

### CSS Module Structure (`styles.module.css`):
```css
/* Component-specific styles */
.componentName {
  /* Base component styles */
}

.componentElement {
  /* Child element styles */
}

/* Use camelCase for class names to match TypeScript imports */
.primaryButton {
  /* Button variant styles */
}

/* Responsive design */
@media (max-width: 768px) {
  .componentName {
    /* Mobile styles */
  }
}
```

## Rules Summary

1. **File Naming**: All filenames use lowercase kebab-case with hyphens (-) to separate words
2. **Directory Names**: Use kebab-case for all directories (e.g., `user-profile/`, `navigation-menu/`)
3. **Component Files**: Always name the main file `index.tsx` for clean imports
4. **CSS Modules**: Always name CSS files `styles.module.css`
5. **CSS Classes**: Use camelCase for class names (matches TypeScript import style)
6. **Component Names**: Export PascalCase component names from files
7. **Props Interface**: Always define TypeScript interfaces for props
8. **Client Components**: Only use `'use client'` when necessary (hooks, events, etc.)
9. **CSS Imports**: Import CSS as `import styles from './styles.module.css'`
10. **File Types**: Apply kebab-case to all file types: `.tsx`, `.ts`, `.js`, `.jsx`, `.css`, `.md`, etc.

## Benefits:
- **Scoped Styling**: CSS modules prevent style conflicts
- **Co-location**: Related files are grouped together
- **Clean Imports**: Import as `../components/sidebar` (resolves to index.tsx)
- **Scalability**: Easy to add tests, stories, and other related files
- **Type Safety**: CSS modules provide IntelliSense and compile-time checking