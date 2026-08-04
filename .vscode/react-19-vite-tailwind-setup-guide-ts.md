# React 19 + Vite + TypeScript + Tailwind CSS Setup Guide (বাংলা)

> এই গাইড TypeScript ভিততে রিয়্যাক ১৯ + Vite + Tailwind CSS স্ট্যাকের জন্য on-save lint, format, এবং type-safety এরর শো করবে। (JS সংস্করণের পরিপূরক, TypeScript-এর জন্য)

---

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0
- Windows / macOS / Linux

---

## Step 1: Vite দিয়ে React 19 + TypeScript প্রজেক্ট তৈরি

```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
```

> Vite 8 `react-ts` template স্বয়ংক্রিয়ভাবে React 19 (`react@19.2.8`, `react-dom@19.2.8`) এবং TypeScript সাপোর্ট দিয়ে সেটাপ করে।

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
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
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

## Step 3: TypeScript Configuration (tsconfig.json)

Vite-এর `react-ts` template স্বয়ংক্রিয়ভাবে `tsconfig.json` তৈরি করে দেয়। নিচে সুপারিশকৃত কন্টেন্ট:

```json
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "ESNext",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",

    /* Modules */
    "module": "ESNext",
    "moduleResolution": "bundler",
    "moduleDetection": "force",

    /* JavaScript Support */
    "allowJs": false,

    /* Emit */
    "noEmit": true,
    "isolatedModules": true,

    /* Type Checking */
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": true,

    /* Interop */
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,

    /* Performance */
    "skipLibCheck": true,

    /* Path Aliases */
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Step 4: ESLint Setup (TypeScript + ESLint 10 Flat Config)

> JS সংস্করণের পরিপূরক, এখানে `typescript-eslint` যোগ করা হয়েছে TypeScript ফাইলগুলোর জন্য।

### 4.1 ESLint এবং Plugins Install

```bash
npm install -D eslint eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-jsx-a11y @eslint/js globals typescript-eslint --legacy-peer-deps
```

> **নোট:** `eslint-plugin-jsx-a11y` এবং `typescript-eslint` ESLint 10 এর সাথে peer dependency conflict হতে পারে। তাই `--legacy-peer-deps` ব্যবহার করুন।

### 4.2 `eslint.config.js` File তৈরি করুন (Flat Config + TypeScript)

```js
// eslint.config.js
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parser: tseslint.parser,
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
      "@typescript-eslint": tseslint.plugin,
      prettier,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/self-closing-comp": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "prettier/prettier": "error",
    },
  },
];
```

### 4.3 `package.json` এ ESLint Script যোগ করুন

```json
{
  "scripts": {
    "lint": "eslint . --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --fix"
  }
}
```

---

## Step 5: Prettier Setup

### 5.1 Prettier এবং Related Plugins Install

```bash
npm install -D prettier eslint-plugin-prettier --legacy-peer-deps
```

> **নোট:** ESLint 10 flat config এ `eslint-config-prettier` লাগবে না। বরং `eslint-plugin-prettier` ব্যবহার করুন (ESLint config-এ আগেই যুক্ত করা হয়েছে)।

### 5.2 `.prettierrc` File তৈরি করুন

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

### 5.3 `.prettierignore` File তৈরি করুন

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

### 5.4 `package.json` এ Prettier Script যোগ করুন (TypeScript ফাইলও অন্তর্ভুক্ত)

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,css,json,md}\""
  }
}
```

---

## Step 6: VS Code Settings — On Save Auto Lint ও Format

### 6.1 `.vscode/settings.json` File তৈরি করুন

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
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

### 6.2 Required VS Code Extensions

| Extension                 | ID                          |
| ------------------------- | --------------------------- |
| ESLint                    | `dbaeumer.vscode-eslint`    |
| Prettier                  | `esbenp.prettier-vscode`    |
| Tailwind CSS IntelliSense | `bradlc.vscode-tailwindcss` |

> **save করার সময় automatically:**
>
> - ESLint errors fix হবে (`source.fixAll.eslint`)
> - Code format হবে Prettier rules অনুসারে
> - **TypeScript type errors** এবং **ESLint rule violations** দুটোই দেখাবে

---

## Step 7: TypeScript Interface দিয়ে Component এবং Type Safety

### 7.1 PropTypes এর বদলে TypeScript Interfaces ব্যবহার করুন

```tsx
// src/components/UserCard.tsx
interface UserCardProps {
  name: string;
  email: string;
}

function UserCard({ name, email }: UserCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600">{email}</p>
    </div>
  );
}

export default UserCard;
```

> **গুরুত্বপূর্ণ পরিবর্তন:** `prop-types` প্যাকেজ দরকার নেই! TypeScript নিজেই prop types চেক করে।
>
> **save করার সময় VS Code automatically error highlight করবে:**
>
> - TypeScript compilation errors দেখাবে (যেমন: wrong type, missing prop)
> - Problems panel তে error দেখাবে
> - ESLint rule violations (যেমন: unused vars) দেখাবে

### 7.2 Type Error Demo

```tsx
// src/components/UserCard.tsx
interface UserCardProps {
  name: string;
  email: string;
}

function UserCard({ name, email }: UserCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">{name}</h2>
      <p className="text-gray-600">{email}</p>
    </div>
  );
}

export default UserCard;
```

```tsx
// src/pages/Home.tsx
import UserCard from "@/components/UserCard";

function Home() {
  return (
    // ❌ এখানে 'name' পাঠানো হয়নি — TypeScript এরর দেখাবে
    <UserCard email="user@example.com" />
  );
}
```

**Result:**

```
src/pages/Home.tsx
  6:10  error  Type 'undefined' is not assignable to type 'string'  @typescript-eslint/...
```

---

## Step 8: Project Folder Structure (TypeScript Best Practice)

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
│   │   │   └── Button.tsx
│   │   ├── Card/
│   │   │   └── Card.tsx
│   │   └── Input/
│   │       └── Input.tsx
│   ├── hooks/
│   │   └── useCustomHook.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── styles/
│   │   └── index.css
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── helpers.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── .prettierignore
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

---

## Step 9: Best Developer Practice Guidelines (TypeScript)

### ✅ DO (করণীয়)

| Practice                   | Description                                                                       |
| -------------------------- | --------------------------------------------------------------------------------- |
| **Component Naming**       | PascalCase ব্যবহার করুন (`UserCard`, not `userCard`)                              |
| **File Naming**            | Component `.tsx` (`Button.tsx`), hook/utility `.ts` (`useAuth.ts`, `helpers.ts`)  |
| **One Component Per File** | প্রতিটি file তে শুধুমাত্র একটি component রাখুন                                    |
| **Props Destructuring**    | `function Button({ label, onClick }: ButtonProps)` এভাবে destructure করুন         |
| **Interfaces/Types**       | সব component এর জন্য interface ব্যবহার করুন (`interface Props { ... }`)           |
| **Custom Hooks**           | Reusable logic গুলো custom hooks তে রাখুন (`useAuth`, `useFetch`) — `.ts` ফাইলে   |
| **Key Prop**               | List rendering তে সবসময় unique `key` prop দিন                                    |
| **Event Handlers**         | `onClick`, `onChange` — camelCase convention follow করুন                          |
| **CSS Classes**            | Tailwind classes এ logical grouping করুন, excessive classes এড়ান                 |
| **Imports Order**          | Third-party → Internal → Relative import order follow করুন                        |
| **Path Aliases**           | `tsconfig.json` এ `@/*` alias সেট করুন, relative import এর ঝামেলা থেকে মুক্তি পান |
| **Strict Mode**            | `tsconfig.json` এ `"strict": true` রাখুন — type safety সর্বোচ্চ পেতে পারেন        |

### ❌ DON'T (এড়ানীয়)

| Practice                    | Description                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| **Inline Functions in JSX** | `onClick={() => fetchData()}` এড়ান — use `useCallback`                                       |
| **index as Key**            | List তে index key ব্যবহার করবেন না                                                            |
| **Mutation in Render**      | State mutate করবেন render phase এ                                                             |
| **Direct State Update**     | `.setState` directly modification এড়ান                                                       |
| **Prop Drilling**           | অনেক level পর্যন্ত props pass এড়ান — useContext or state management use করুন                 |
| **Large Components**        | 200+ line component ছোট chunk তে ভাগ করুন                                                     |
| **Inline Styles**           | Tailwind ব্যবহার করুন, inline style এড়ান                                                     |
| **Hardcoded URLs/Strings**  | `.env` file বা constants file use করুন                                                        |
| **`any` Type**              | `@typescript-eslint/no-explicit-any` রুল অনুযায়ী `any` use এড়া� — proper types ব্যবহার করুন |
| **PropTypes**               | TypeScript ব্যবহার করলে `prop-types` দরকার নেই — `react/prop-types` rule বন্ধ রাখুন           |

---

## Step 10: Environment Variables

`.env` file create করুন project root এ:

```env
# .env
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My React App
```

> **নোট:** Vite তে সব environment variable `VITE_` prefix দিয়ে শুরু হতে হবে।

```tsx
// ব্যবহার করার নিয়ম:
const apiUrl = import.meta.env.VITE_API_URL;
```

`.env` file `.gitignore` এ রাখুন।

---

## Step 11: Gitignore Setup

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

## Step 12: Dev Server Run

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

## Step 13: Verification Checklist

প্রজেক্ট setup সঠিকভাবে complete হয়েছে কিনা verify করুন:

```bash
# 1. Lint Check
npm run lint

# 2. Format Check
npm run format:check

# 3. TypeScript Type Check
npx tsc --noEmit

# 4. Build Check
npm run build

# 5. Dev Server
npm run dev
```

> **গুরুত্বপূর্ণ:** `npx tsc --noEmit` চালিয়ে TypeScript errors আলাদাভাবে চেক করুন। ESLint শুধু lint rules চেক করে, কিন্তু TypeScript compiler type errors আলাদাভাবে রান করতে হয়।

`package.json` এ এই স্ক্রিপ্টটি যোগ করুন:

```json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

যদি কোনো error না থাকে এবং dev server চলছে, তাহলে setup সফল হয়েছে।

---

## Step 14: Optional — Husky + lint-staged (Pre-commit Hook)

```bash
npm install -D husky lint-staged --legacy-peer-deps
npx husky init
```

`package.json` এ add করুন:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write", "tsc --noEmit"]
  }
}
```

`.husky/pre-commit` file:

```bash
npx lint-staged
```

---

## Troubleshooting

| Problem                                   | Solution                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| TypeScript type errors দেখা দিচ্ছে        | `npx tsc --noEmit` চালিয়ে আসল এররগুলো দেখুন                                                     |
| `react/prop-types` error অথবা কাজ না করছে | TypeScript প্রকল্পে `"react/prop-types": "off"` সেট করুন — TS নিজেই type check করে               |
| ESLint TS rules কাজ করছে না               | `eslint.config.js` এ `tseslint` import ও `...tseslint.configs.recommended` যোগ করুন              |
| `typescript-eslint` install এ সমস্যা      | `--legacy-peer-deps` flag ব্যবহার করুন                                                           |
| Tailwind classes কাজ করছে না              | `@import "tailwindcss"` `index.css` এ আছে কিনা, এবং Vite config তে plugin আছে কিনা চেক করুন      |
| ESLint error highlight না                 | VS Code তে ESLint extension install ও enable আছে কিনা চেক করুন                                   |
| Prettier format না                        | `"editor.formatOnSave": true` enable আছে কিনা `.vscode/settings.json` তে চেক করুন                |
| Path alias (`@/*`) কাজ করছে না            | `tsconfig.json` এ paths সঠিকভাবে সেট করা আছে কিনা, এবং `vite.config.js` এ resolve alias যোগ করুন |

Path alias (Vite config-এ যোগ করুন):

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

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
npx tsc --noEmit     # TypeScript type check (কোনো output ফাইল তৈরি করে না)
```

---

## JS vs TS সংস্করণের পার্থক্য (সংক্ষিপ্ত তালিকা)

| Feature            | JS Guide (`.jsx`)    | TS Guide (`.tsx`)                |
| ------------------ | -------------------- | -------------------------------- |
| Template           | `--template react`   | `--template react-ts`            |
| File Extensions    | `.jsx`               | `.tsx`, `.ts`                    |
| Prop Validation    | `prop-types` প্যাকেজ | TypeScript `interface`           |
| ESLint Plugin      | —                    | `typescript-eslint` যোগ করতে হয় |
| `react/prop-types` | `"error"`            | `"off"` (দরকার নেই)              |
| Type Check         | নেই                  | `tsc --noEmit` দরকার             |
| `prop-types` dep   | দরকার                | দরকার নেই                        |
| `@types/*`         | ঐচ্ছিক               | স্বয়ংক্রিয়ভাবে থাকে            |

---

**Setup Complete!** আপনার React 19 + Vite + TypeScript + Tailwind CSS প্রজেক্ট ready, এবং on-save এ ESLint + TypeScript automatically type errors এবং prop-type সংক্রান্ত সমস্যাগুলো detect ও fix করবে।

Tested with:

- `react@19.2.8`
- `vite@8.2.0`
- `tailwindcss@4.3.3`
- `eslint@10.8.0`
- `typescript-eslint@8.x`
- `prettier@3.9.6`
- `typescript@5.x`
