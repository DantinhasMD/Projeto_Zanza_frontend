# Estrutura do Projeto Zanza

## 📁 Visão Geral dos Arquivos

Este documento serve como um guia para navegar pelo projeto Zanza.

---

## 📂 Estrutura de Diretórios

```
zanza/
├── 📁 components/              # Componentes React
│   ├── 📁 ui/                 # Componentes shadcn/ui
│   ├── 📁 figma/              # Componentes do Figma
│   ├── LoginScreen.tsx        # Tela de login/cadastro
│   ├── MapView.tsx            # Mapa interativo
│   ├── RateStreetDialog.tsx   # Modal de avaliação
│   ├── RouteCard.tsx          # Card de rota
│   ├── FilterSheet.tsx        # Filtros
│   └── UserProfile.tsx        # Perfil do usuário
│
├── 📁 services/               # Camada de serviços (integração API)
│   ├── api.ts                 # Cliente HTTP base
│   ├── auth.service.ts        # Autenticação
│   ├── street.service.ts      # Ruas e avaliações
│   ├── route.service.ts       # Cálculo de rotas
│   ├── community.service.ts   # Dados da comunidade
│   ├── user.service.ts        # Perfil e estatísticas
│   └── location.service.ts    # Geolocalização
│
├── 📁 hooks/                  # Custom React Hooks
│   ├── useApi.ts              # Hook para chamadas API
│   └── useLocation.ts         # Hook de geolocalização
│
├── 📁 types/                  # Definições TypeScript
│   └── index.ts               # Tipos compartilhados
│
├── 📁 config/                 # Configurações
│   └── environment.ts         # Variáveis de ambiente
│
├── 📁 examples/               # Exemplos de uso
│   └── ServiceUsageExamples.tsx
│
├── 📁 public/                 # Assets públicos
│   └── manifest.json          # PWA manifest
│
├── 📁 android/                # Projeto Android (Capacitor)
│   └── ...                    # Gerado automaticamente
│
├── 📁 styles/                 # Estilos globais
│   └── globals.css            # CSS global e Tailwind
│
├── 📄 App.tsx                 # Componente principal
├── 📄 capacitor.config.ts     # Configuração Capacitor
│
└── 📚 Documentação
    ├── README.md                       # Documentação principal
    ├── SPRING_BOOT_INTEGRATION.md      # Integração com backend
    ├── DEPLOYMENT.md                   # Guia de deploy
    ├── PACKAGE_JSON_SCRIPTS.md         # Scripts úteis
    ├── android-setup.md                # Setup Android
    └── PROJECT_STRUCTURE.md (este)    # Estrutura do projeto
```

---

## 🗂️ Documentação Detalhada

### 1. README.md
**Propósito:** Documentação principal do projeto  
**Conteúdo:**
- Visão geral do projeto
- Tecnologias utilizadas
- Como começar
- Scripts principais
- Build e deploy básico

### 2. SPRING_BOOT_INTEGRATION.md
**Propósito:** Guia completo de integração com Spring Boot  
**Conteúdo:**
- Estrutura de pacotes Java
- Endpoints REST
- Modelos JPA
- Configuração de segurança
- Dependências Maven
- Queries SQL

### 3. android-setup.md
**Propósito:** Configuração do aplicativo Android  
**Conteúdo:**
- Instalação do Capacitor
- Build para Android
- Configuração de permissões
- Plugins Capacitor
- Troubleshooting

### 4. DEPLOYMENT.md
**Propósito:** Guia completo de deploy  
**Conteúdo:**
- Deploy Web (Vercel, Netlify, AWS)
- Deploy Android (Play Store)
- Deploy Backend (Railway, Heroku, AWS)
- Configuração SSL
- Monitoramento

### 5. PACKAGE_JSON_SCRIPTS.md
**Propósito:** Scripts úteis do npm  
**Conteúdo:**
- Scripts de desenvolvimento
- Scripts Android
- Scripts de teste
- Configuração CI/CD

### 6. PROJECT_STRUCTURE.md (este arquivo)
**Propósito:** Guia de navegação do projeto  
**Conteúdo:**
- Estrutura de diretórios
- Índice de documentação
- Descrição de cada arquivo

---

## 🔧 Arquivos de Serviço

### /services/api.ts
**Responsabilidade:** Cliente HTTP base  
**Recursos:**
- GET, POST, PUT, DELETE, PATCH
- Autenticação JWT automática
- Tratamento de erros
- Upload de arquivos

**Uso:**
```typescript
import { apiClient } from './services/api';
const response = await apiClient.get('/endpoint');
```

### /services/auth.service.ts
**Responsabilidade:** Gerenciamento de autenticação  
**Recursos:**
- Login / Logout
- Registro de usuário
- Refresh token
- Modo visitante
- Verificação de autenticação

**Uso:**
```typescript
import { authService } from './services/auth.service';
await authService.login({ email, password });
```

### /services/street.service.ts
**Responsabilidade:** Operações com ruas  
**Recursos:**
- Buscar ruas
- Ruas próximas (geolocalização)
- Criar/editar avaliações
- Filtros de segurança

**Uso:**
```typescript
import { streetService } from './services/street.service';
const streets = await streetService.getNearbyStreets(lat, lng, 1000);
```

### /services/route.service.ts
**Responsabilidade:** Cálculo de rotas  
**Recursos:**
- Calcular rota segura
- Salvar rotas favoritas
- Cálculo de distância
- Estimativa de duração

**Uso:**
```typescript
import { routeService } from './services/route.service';
const route = await routeService.calculateRoute(request);
```

### /services/community.service.ts
**Responsabilidade:** Dados da comunidade  
**Recursos:**
- Estatísticas gerais
- Top bairros
- Áreas perigosas
- Atividade recente

**Uso:**
```typescript
import { communityService } from './services/community.service';
const stats = await communityService.getCommunityStats();
```

### /services/user.service.ts
**Responsabilidade:** Perfil do usuário  
**Recursos:**
- Perfil e estatísticas
- Sistema de níveis
- Histórico de avaliações
- Badges

**Uso:**
```typescript
import { userService } from './services/user.service';
const level = userService.calculateLevel(totalReviews);
```

### /services/location.service.ts
**Responsabilidade:** Geolocalização  
**Recursos:**
- Obter localização atual
- Observar mudanças de localização
- Calcular distâncias
- Reverse geocoding

**Uso:**
```typescript
import { locationService } from './services/location.service';
const location = await locationService.getCurrentLocation();
```

---

## 🎣 Custom Hooks

### /hooks/useApi.ts
**Hooks disponíveis:**
- `useApi` - Chamadas API com loading/error
- `usePaginatedApi` - Chamadas paginadas
- `useOptimisticUpdate` - Updates otimistas

**Exemplo:**
```typescript
const { data, loading, error, execute } = useApi(
  () => streetService.getStreets(),
  { immediate: true }
);
```

### /hooks/useLocation.ts
**Hooks disponíveis:**
- `useLocation` - Obter localização
- `useDistance` - Calcular distância
- `useNearby` - Verificar proximidade

**Exemplo:**
```typescript
const { location, loading, requestLocation } = useLocation(true);
```

---

## 📝 Tipos TypeScript

### /types/index.ts
**Tipos exportados:**
- `User` - Usuário
- `Street` - Rua
- `StreetReview` - Avaliação
- `Route` - Rota
- `CommunityStats` - Estatísticas
- `ApiResponse<T>` - Resposta API
- E muito mais...

**Uso:**
```typescript
import type { User, Street, CreateReviewRequest } from './types';
```

---

## ⚙️ Configuração

### /config/environment.ts
**Conteúdo:**
- URLs da API (dev, staging, prod)
- Endpoints
- Constantes do app
- Storage keys
- Cores de segurança

**Uso:**
```typescript
import { config, API_ENDPOINTS } from './config/environment';
console.log(config.API_BASE_URL);
```

---

## 📱 Android (Capacitor)

### /capacitor.config.ts
**Configuração:**
- App ID: `br.com.zanza`
- Plugins habilitados
- Splash screen
- Status bar
- Permissões

### /android/
**Gerado automaticamente após:**
```bash
npx cap add android
```

**Contém:**
- Código nativo Android
- Gradle build files
- AndroidManifest.xml
- Resources (ícones, splash)

---

## 💡 Exemplos de Uso

### /examples/ServiceUsageExamples.tsx
**10 exemplos completos:**
1. Login Component
2. Lista de ruas
3. Criar avaliação
4. Calcular rota
5. Estatísticas
6. Perfil do usuário
7. Geolocalização
8. Verificar autenticação
9. Tratamento de erros
10. Integração completa

**Como usar:**
Copie e adapte os exemplos para seus componentes.

---

## 🚀 Fluxo de Trabalho Recomendado

### 1. Desenvolvimento Local
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (Spring Boot)
cd backend
./mvnw spring-boot:run
```

### 2. Desenvolvimento Android
```bash
# Build e sincronizar
npm run android:dev

# Desenvolver no Android Studio
```

### 3. Testes
```bash
# Testes unitários
npm test

# Type checking
npm run type-check

# Lint
npm run lint
```

### 4. Deploy
```bash
# Web
npm run build
vercel --prod

# Android
npm run android:build
# Upload no Play Console
```

---

## 📊 Arquitetura do Sistema

```
┌─────────────────────────────────────────────┐
│           Frontend (React/TS)               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │Components│  │  Hooks   │  │ Services │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │             │             │        │
│       └─────────────┴─────────────┘        │
│                     │                       │
└─────────────────────┼───────────────────────┘
                      │
                      ↓ HTTP/REST
┌─────────────────────┼───────────────────────┐
│                     ↓                        │
│         Backend (Spring Boot)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │Controller│→ │ Service  │→ │Repository│ │
│  └──────────┘  └──────────┘  └────┬─────┘ │
│                                    │        │
└────────────────────────────────────┼────────┘
                                     │
                                     ↓
                        ┌────────────────────┐
                        │  PostgreSQL +      │
                        │    PostGIS         │
                        └────────────────────┘
```

---

## 🔗 Links Úteis

### Documentação Externa
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Capacitor](https://capacitorjs.com/)
- [Spring Boot](https://spring.io/projects/spring-boot)

### Ferramentas
- [Vercel](https://vercel.com/)
- [Android Studio](https://developer.android.com/studio)
- [PostgreSQL](https://www.postgresql.org/)
- [PostGIS](https://postgis.net/)

---

## ❓ FAQ

**P: Onde adiciono uma nova feature?**  
R: Crie componentes em `/components`, serviços em `/services`, e tipos em `/types`.

**P: Como testo a integração com o backend?**  
R: Configure `API_BASE_URL` em `/config/environment.ts` e use os exemplos em `/examples`.

**P: Como adiciono um novo endpoint?**  
R: Adicione em `API_ENDPOINTS` no `/config/environment.ts` e crie/atualize o serviço correspondente.

**P: Como customizo o tema?**  
R: Edite `/styles/globals.css` e as cores em `/config/environment.ts`.

**P: Onde estão os dados mock?**  
R: Em `/App.tsx` e nos componentes. Serão substituídos pelas chamadas API reais.

---

## 📞 Suporte

Para dúvidas específicas sobre cada parte do projeto, consulte a documentação correspondente:

- **Frontend:** README.md
- **Backend:** SPRING_BOOT_INTEGRATION.md
- **Android:** android-setup.md
- **Deploy:** DEPLOYMENT.md
- **Scripts:** PACKAGE_JSON_SCRIPTS.md

---

**Última atualização:** Janeiro 2024  
**Versão do projeto:** 1.0.0
