# React 19 + Vite + JSX + Tailwind CSS Setup Guide (বাংলা)

> এই গাইড অপ্রয়োজনীয় ডেভেলপমেন্ট স্ট্যান্ডার্ড, on-save lint, এবং prop-types এরর শো করবে।

---

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- Windows / macOS / Linux

---

## Step 1: Vite দিয়ে React 19 প্রজেক্ট তৈরি

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
```

> Vite 8 automatically provides latest React 19 (`react@19.2.8`, `react-dom@19.2.8`).

---

## Step 2: Tailwind CSS v4 Install ও Setup

### 2.1 Tailwind CSS এবং Vite Plugin Install

```bash
npm install tailwindcss @tailwindcss/vite
```

### 2.2 `vite.config.js` এ Tailwind Plugin যোগ করুন

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### 2.3 CSS File এ Tailwind Import করুন

```css
/* src/index.css */
@import "tailwindcss";

body {
  margin: 0;
  min-height: 100vh;
}

#root {
  min-height: 100vh;
}
```

---

## Step 3: ESLint Setup (ESLint 10 Flat Config)

> আপনার আছলে ESLint 10 (flat config by default) এবং Vite 8। Legacy `.eslintrc.cjs` ফরম্যাট পরিবর্তে `eslint.config.js` (flat config) ব্যবহার করুন।

### 3.1 ESLint এবং Plugins Install

```bash
'npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-jsx-a11y @eslint/js globals --legacy-peer-deps'
```

> **নোট:** `eslint-plugin-jsx-a11y` currently has peer dependency conflict with ESLint 10। তাই `--legacy-peer-deps` flag ব্যবহার করতে হবে।

### 3.2 `eslint.config.js` File তৈরি করুন (Flat Config)

```js
// eslint.config.js
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "19.0.0",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "error",
      "react/self-closing-comp": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
    },
  },
];
```

### 3.3 `package.json` এ ESLint Script যোগ করুন

```json
{
  "scripts": {
    "lint": "eslint . --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --fix"
  }
}
```

---

## Step 4: Prettier Setup

### 4.1 Prettier এবং Related Plugins Install

```bash
npm install -D prettier eslint-plugin-prettier --legacy-peer-deps
```

> **নোট:** ESLint 10 flat config এ `eslint-config-prettier` লাগবে না। বরং `eslint-plugin-prettier` ব্যবহার করুন।

### 4.2 `.prettierrc` File তৈরি করুন

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true
}
```

### 4.3 `.prettierignore` File তৈরি করুন

```
node_modules
dist
build
.next
out
.env
.env.local
.env.*.local
coverage
*.min.js
*.min.css
```

### 4.4 ESLint এবং Prettier Integrate করুন

`eslint.config.js` এ Prettier plugin import ও rules যোগ করুন:

```js
import prettier from "eslint-plugin-prettier";

// ... inside plugins:
plugins: {
  // ... existing plugins
  prettier,
},

// ... inside rules:
rules: {
  // ... existing rules
  "prettier/prettier": "error",
},
```

### 4.5 `package.json` এ Prettier Script যোগ করুন

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,css,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,css,json,md}\""
  }
}
```

---

## Step 5: VS Code Settings — On Save Auto Lint ও Format

### 5.1 `.vscode/settings.json` File তৈরি করুন

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "javascriptreact"],
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 5.2 Required VS Code Extensions

| Extension                 | ID                          |
| ------------------------- | --------------------------- |
| ESLint                    | `dbaeumer.vscode-eslint`    |
| Prettier                  | `esbenp.prettier-vscode`    |
| Tailwind CSS IntelliSense | `bradlc.vscode-tailwindcss` |

> **save করার সময় automatically:**
>
> - ESLint errors fix হবে (`source.fixAll.eslint`)
> - Code format হবে Prettier rules অনুসারে
> - **`react/prop-types` error** missing prop-type থাকলে দেখাবে

---

## Step 6: PropTypes এবং On-Save Lint Verification

### 6.1 PropTypes Install

```bash
npm install prop-types --legacy-peer-deps
```

### 6.2 PropType না দিলে Error Demo

```jsx
// src/components/UserCard.jsx
function UserCard({ name, email }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600">{email}</p>
    </div>
  );
}

// PropTypes NOT defined — ESLint will show error on save
export default UserCard;
```

**Result:**

```
src/components/UserCard.jsx
   1:21  error  'name' is missing in props validation   react/prop-types
   1:27  error  'email' is missing in props validation  react/prop-types
```

### 6.3 PropType সঠিকভাবে Define করা

```jsx
// src/components/UserCard.jsx
import PropTypes from "prop-types";

function UserCard({ name, email }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600">{email}</p>
    </div>
  );
}

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
};

export default UserCard;
```

> **save করার সময় VS Code automatically error highlight করবে:**
>
> - রঙের underline দেখাবে
> - Problems panel তে error দেখাবে
> - Quick Fix option দেবে

---

## Step 7: Project Folder Structure (Best Practice)

```
my-react-app/
├── .vscode/
│   └── settings.json
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Button/
│   │   │   └── Button.jsx
│   │   ├── Card/
│   │   │   └── Card.jsx
│   │   └── Input/
│   │       └── Input.jsx
│   ├── hooks/
│   │   └── useCustomHook.js
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── styles/
│   │   └── index.css
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Step 8: Best Developer Practice Guidelines

### ✅ DO (করণীয়)

| Practice                    | Description                                                                                        |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| **Component Naming**        | PascalCase ব্যবহার করুন (`UserCard`, not `userCard`)                                               |
| **File Naming**             | Component file গুলো PascalCase (`Button.jsx`), hook/utility lowercase (`useAuth.js`, `helpers.js`) |
| **One Component Per File**  | প্রতিটি file তে শুধুমাত্র একটি component রাখুন                                                     |
| **Props Destructuring**     | `function Button({ label, onClick })` এভাবে destructure করুন                                       |
| **PropTypes or TypeScript** | সব component এ PropTypes বা TypeScript use করুন                                                    |
| **Custom Hooks**            | Reusable logic গুলো custom hooks তে রাখুন (`useAuth`, `useFetch`)                                  |
| **Key Prop**                | List rendering তে সবসময় unique `key` prop দিন                                                     |
| **Event Handlers**          | `onClick`, `onChange` — camelCase convention follow করুন                                           |
| **CSS Classes**             | Tailwind classes এ logical grouping করুন, excessive classes এড়ান                                  |
| **Imports Order**           | Third-party → Internal → Relative import order follow করুন                                         |

### ❌ DON'T (এড়ানীয়)

| Practice                    | Description                                                                    |
| --------------------------- | ------------------------------------------------------------------------------ |
| **Inline Functions in JSX** | `onClick={() => fetchData()}` এড়ান — use `useCallback`                        |
| **index as Key**            | List তে index key ব্যবহার করবেন না                                             |
| **Mutation in Render**      | State mutate করবেন render phase এ                                              |
| **Direct State Update**     | `.setState` directly modification এড়ান                                        |
| **Prop Drilling**           | অনেক level porjonto props pass এড়ান — useContext or state management use করুন |
| **Large Components**        | 200+ line component ছোট chunk তে ভাগ করুন                                      |
| **Inline Styles**           | Tailwind ব্যবহার করুন, inline style এড়ান                                      |
| **Hardcoded URLs/Strings**  | `.env` file বা constants file use করুন                                         |

---

## Step 9: Environment Variables

`.env` file create করুন project root এ:

```env
# .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My React App
```

> **নোট:** Vite তে সব environment variable `VITE_` prefix দিয়ে শুরু হতে হবে।

```jsx
// ব্যবহার করার নিয়ম:
const apiUrl = import.meta.env.VITE_API_URL;
```

`.env` file `.gitignore` এ রাখুন।

---

## Step 10: Gitignore Setup

```gitignore
# .gitignore
node_modules
dist
dist-ssr
*.local
.env
.env.local
.env.*.local
coverage
.vscode/settings.json
```

---

## Step 11: Dev Server Run

```bash
npm run dev
```

Output হবে:

```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Step 12: Verification Checklist

প্রজেক্ট setup সঠিকভাবে complete হয়েছে কিনা verify করুন:

```bash
# 1. Lint Check
npm run lint

# 2. Format Check
npm run format:check

# 3. Build Check
npm run build

# 4. Dev Server
npm run dev
```

যদি কোনো error না থাকে এবং dev server চলছে, তাহলে setup সফল হয়েছে।

---

## Step 13: Optional — Husky + lint-staged (Pre-commit Hook)

```bash
npm install -D husky lint-staged --legacy-peer-deps
npx husky init
```

`package.json` এ add করুন:

```json
{
  "lint-staged": {
    "*.{js,jsx}": ["eslint --fix", "prettier --write"]
  }
}
```

`.husky/pre-commit` file:

```bash
npx lint-staged
```

---

## Troubleshooting

| Problem                                     | Solution                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `react/prop-types` error showing না         | `eslint.config.js` এ `"react/prop-types": "error"` rule আছে কিনা চেক করুন                   |
| Tailwind classes কাজ করছে না                | `@import "tailwindcss"` `index.css` এ আছে কিনা, এবং Vite config তে plugin আছে কিনা চেক করুন |
| ESLint error highlight না                   | VS Code তে ESLint extension install ও enable আছে কিনা চেক করুন                              |
| Prettier format না                          | `"editor.formatOnSave": true` enable আছে কিনা `.vscode/settings.json` তে চেক করুন           |
| `npm install` এর সময় peer dependency error | `--legacy-peer-deps` flag ব্যবহার করুন                                                      |

---

## Quick Reference Commands

```bash
npm run dev          # Dev server start
npm run build        # Production build
npm run preview      # Preview build locally
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check formatting
```

---

**Setup Complete!** আপনার React 19 + Vite + Tailwind CSS প্রজেক্ট ready, এবং on-save এ ESLint automatically prop-type errors detect ও fix করবে।

Tested with:

- `react@19.2.8`
- `vite@8.2.0`
- `tailwindcss@4.3.3`
- `eslint@10.8.0`
- `prettier@3.9.6`
