# Energy Monitor Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)

---

## Table of Contents

1. [Project Description](#project-description)
2. [Requirements](#requirements)
3. [Installation and Setup](#installation-and-setup)
4. [Project Structure](#project-structure)
5. [Routing](#routing)
6. [Styling](#styling)
7. [Testing](#testing)
8. [Authors](#authors)
9. [ShadCN Components](#shadcn-components)

---

## Project Description

The frontend of the Energy Monitor App is built using React, TypeScript, and Vite. It provides a modern and responsive user interface for monitoring energy usage, managing devices, and viewing analytics. Tailwind CSS is used for styling, ensuring a clean and consistent design.

---

## Requirements

- Node.js 18 or higher
- npm 9 or higher

---

## Installation and Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/lukaszaw/energy-monitor-app.git
   ```

2. Navigate to the frontend directory:
   ```bash
   cd energy-monitor-app/frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the application in your browser:
   ```
   http://localhost:5173
   ```

---

## Project Structure

```
frontend/
├── app/
│   ├── auth/          # Authentication context and utilities
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and libraries
│   ├── routes/        # Route components for different pages
│   ├── app.css        # Global styles
│   └── root.tsx       # Root component and layout
├── public/            # Static assets like images and icons
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
└── package.json       # Project metadata and dependencies
```

### Authentication
The `auth` folder contains the authentication context (`AuthContext.tsx`) and utility functions for managing user authentication and tokens.

### Components
The `components` folder includes reusable UI components such as charts, tables, forms, and navigation elements. These components are designed to be modular and customizable.

### Routes
The `routes` folder contains the main pages of the application, such as:
- `login.tsx` - Login page
- `register.tsx` - Registration page
- `dashboard.tsx` - User dashboard
- `devices.tsx` - Device management page
- `analytics.tsx` - Analytics and reports

---

## Routing

The application uses React Router for client-side routing. The routes are defined in `routes.ts` and dynamically loaded for better performance.

Example route configuration:
```typescript
import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/dashboard", "routes/dashboard.tsx"),
  route("/devices", "routes/devices.tsx"),
  route("/analytics", "routes/analytics.tsx"),
];
```

---

## Styling

The application uses Tailwind CSS for styling. Custom themes and variants are defined in `app.css` to ensure a consistent look and feel across the application.

Example theme configuration:
```css
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.147 0.004 49.25);
}

.dark {
  --background: oklch(0.147 0.004 49.25);
  --foreground: oklch(0.985 0.001 106.423);
}
```

---

## ShadCN Components

The application leverages ShadCN components to provide a set of accessible, customizable, and reusable UI elements. These components are built on top of Tailwind CSS, ensuring seamless integration with the existing styling framework.

### Key Features
- **Accessibility**: All components are designed with accessibility in mind, adhering to ARIA standards.
- **Customizability**: Easily extend or modify components to match the application's design system.
- **Consistency**: Ensures a unified look and feel across the application.

### Integration
The ShadCN components are located in the `components/ui/` directory. Each component is modular and can be imported individually as needed.

Example usage of a Button component:
```tsx
import { Button } from "./components/ui/button";

export function Example() {
  return <Button variant="primary">Click Me</Button>;
}
```

---

## Authors

- **Lukas** - [GitHub Profile](https://github.com/LukasZaw)

---

Feel free to contribute to this project by submitting issues or pull requests!
