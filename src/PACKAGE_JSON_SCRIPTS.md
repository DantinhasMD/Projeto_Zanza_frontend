# Scripts para package.json

Adicione estes scripts ao seu `package.json` para facilitar o desenvolvimento e build do projeto.

```json
{
  "name": "zanza",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    
    "android:install": "npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/geolocation @capacitor/network @capacitor/splash-screen @capacitor/status-bar @capacitor/push-notifications @capacitor/local-notifications @capacitor/app @capacitor/storage",
    "android:init": "npx cap init",
    "android:add": "npx cap add android",
    "android:sync": "npm run build && npx cap sync android",
    "android:open": "npx cap open android",
    "android:run": "npx cap run android",
    "android:build": "npm run build && npx cap sync android && cd android && ./gradlew assembleRelease",
    "android:dev": "npm run build && npx cap sync android && npx cap open android",
    "android:clean": "cd android && ./gradlew clean && cd ..",
    
    "pwa:generate-icons": "node scripts/generate-pwa-icons.js",
    "pwa:sw": "node scripts/generate-service-worker.js",
    
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-sheet": "^1.0.4",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "vitest": "^1.0.4",
    "@capacitor/core": "^5.0.0",
    "@capacitor/cli": "^5.0.0",
    "@capacitor/android": "^5.0.0",
    "@capacitor/geolocation": "^5.0.0",
    "@capacitor/network": "^5.0.0",
    "@capacitor/splash-screen": "^5.0.0",
    "@capacitor/status-bar": "^5.0.0",
    "@capacitor/push-notifications": "^5.0.0",
    "@capacitor/local-notifications": "^5.0.0",
    "@capacitor/app": "^5.0.0",
    "@capacitor/storage": "^1.2.5"
  }
}
```

## Descrição dos Scripts

### Desenvolvimento
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Compila para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Verifica erros no código
- `npm run type-check` - Verifica tipos TypeScript

### Android (Capacitor)
- `npm run android:install` - Instala todas as dependências do Capacitor
- `npm run android:init` - Inicializa Capacitor no projeto
- `npm run android:add` - Adiciona plataforma Android
- `npm run android:sync` - Sincroniza código web com Android
- `npm run android:open` - Abre projeto no Android Studio
- `npm run android:run` - Executa no dispositivo/emulador
- `npm run android:build` - Gera APK de release
- `npm run android:dev` - Build + sync + abre Android Studio
- `npm run android:clean` - Limpa build do Android

### PWA
- `npm run pwa:generate-icons` - Gera ícones PWA em múltiplos tamanhos
- `npm run pwa:sw` - Gera service worker

### Testes
- `npm test` - Executa testes
- `npm run test:ui` - Interface de testes
- `npm run test:coverage` - Relatório de cobertura

## Workflow Recomendado

### Desenvolvimento Web
```bash
npm run dev
# Desenvolver e testar
npm run build
npm run preview
```

### Desenvolvimento Android
```bash
# Primeira vez
npm run android:install
npm run android:init
npm run android:add

# A cada mudança
npm run android:dev
# Desenvolver no Android Studio
```

### Deploy Produção
```bash
npm run lint
npm run type-check
npm run build
npm run android:build  # Se for para Android
```

## Configuração Adicional

### ESLint (.eslintrc.json)
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["react-refresh"],
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      { "allowConstantExport": true }
    ],
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Vite (vite.config.ts)
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true, // Para acessar via rede local
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
});
```

## CI/CD com GitHub Actions

### .github/workflows/build.yml
```yaml
name: Build and Test

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Type check
      run: npm run type-check
    
    - name: Build
      run: npm run build
    
    - name: Test
      run: npm test
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/

  android-build:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Setup Java
      uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '11'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build Android
      run: npm run android:build
    
    - name: Upload APK
      uses: actions/upload-artifact@v3
      with:
        name: app-release
        path: android/app/build/outputs/apk/release/app-release.apk
```

## Dicas de Produtividade

1. **Alias úteis** (adicione ao ~/.bashrc ou ~/.zshrc):
```bash
alias zd='npm run dev'
alias zb='npm run build'
alias za='npm run android:dev'
alias zas='npm run android:sync'
```

2. **VS Code Settings** (.vscode/settings.json):
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

3. **Extensões VS Code Recomendadas** (.vscode/extensions.json):
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "mhutchie.git-graph",
    "formulahendry.auto-rename-tag"
  ]
}
```
