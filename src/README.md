# Zanza - Rotas Seguras para Pedestres

Aplicativo mobile para auxiliar pedestres na escolha de rotas mais seguras em Campinas, utilizando contribuições da comunidade.

## 🚀 Características

- ✅ Autenticação de usuários (com opção de acesso sem conta)
- ✅ Mapa interativo com visualização de segurança por cores
- ✅ Avaliação colaborativa de ruas e locais
- ✅ Cálculo de rotas seguras
- ✅ Estatísticas da comunidade
- ✅ Rankings de bairros
- ✅ Sistema de níveis e gamificação
- ✅ Suporte offline (PWA)
- ✅ App nativo Android (Capacitor)

## 📱 Tecnologias

### Frontend
- **React** 18+ com TypeScript
- **Tailwind CSS** v4.0 para estilização
- **shadcn/ui** para componentes
- **Lucide React** para ícones
- **Leaflet** para mapas (desenvolvimento)
- **Capacitor** para app Android

### Backend (Integração)
- **Spring Boot** 3.x
- **PostgreSQL** com **PostGIS**
- **JWT** para autenticação
- **Spring Security**

## 🏗️ Estrutura do Projeto

```
/
├── components/          # Componentes React
│   ├── ui/             # Componentes shadcn/ui
│   └── figma/          # Componentes importados do Figma
├── services/           # Camada de serviços para API
│   ├── api.ts          # Cliente API
│   ├── auth.service.ts # Autenticação
│   ├── street.service.ts # Ruas e avaliações
│   ├── route.service.ts # Cálculo de rotas
│   ├── community.service.ts # Dados da comunidade
│   ├── user.service.ts # Perfil do usuário
│   └── location.service.ts # Geolocalização
├── hooks/              # Custom React Hooks
│   ├── useApi.ts       # Hook para chamadas API
│   └── useLocation.ts  # Hook para geolocalização
├── types/              # Definições TypeScript
│   └── index.ts        # Tipos compartilhados
├── config/             # Configurações
│   └── environment.ts  # Variáveis de ambiente
├── public/             # Assets estáticos
│   └── manifest.json   # PWA manifest
├── android/            # Projeto Android (Capacitor)
└── capacitor.config.ts # Configuração Capacitor
```

## 🚦 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Android Studio (para build Android)
- Java JDK 11+ (para build Android)

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/zanza.git
cd zanza
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Edite `/config/environment.ts` com suas URLs de API:

```typescript
development: {
  API_BASE_URL: 'http://localhost:8080/api',
  // ...
}
```

4. **Execute em desenvolvimento**
```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`

## 📦 Build

### Web (PWA)

```bash
npm run build
```

### Android

1. **Instale o Capacitor**
```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
```

2. **Adicione a plataforma Android**
```bash
npx cap add android
```

3. **Build e sincronize**
```bash
npm run build
npx cap sync android
```

4. **Abra no Android Studio**
```bash
npx cap open android
```

Consulte [android-setup.md](./android-setup.md) para instruções detalhadas.

## 🔌 Integração com Backend

O frontend está preparado para integração com Spring Boot. Consulte [SPRING_BOOT_INTEGRATION.md](./SPRING_BOOT_INTEGRATION.md) para:

- Estrutura de endpoints REST
- Modelos de entidade JPA
- Configuração de segurança
- Exemplos de código

### Endpoints Principais

```
POST   /api/auth/register     - Registro de usuário
POST   /api/auth/login        - Login
GET    /api/auth/me           - Usuário atual
GET    /api/streets           - Listar ruas
GET    /api/streets/nearby    - Ruas próximas
POST   /api/reviews           - Criar avaliação
POST   /api/routes/calculate  - Calcular rota
GET    /api/community/stats   - Estatísticas
```

## 🗺️ Funcionalidades

### 1. Autenticação
- Login com email/senha
- Registro de novos usuários
- Acesso sem conta (modo visitante)
- JWT para autenticação

### 2. Mapa Interativo
- Visualização de ruas com cores de segurança
  - 🟢 Verde: Seguro (≥4.0 estrelas)
  - 🟡 Amarelo: Atenção (2.5-3.9 estrelas)
  - 🔴 Vermelho: Perigoso (<2.5 estrelas)
- Pontos de interesse (farmácias, mercados, etc)
- Localização em tempo real

### 3. Avaliação de Locais
- Sistema de 1-5 estrelas
- Problemas específicos (iluminação, movimento, etc)
- Comentários opcionais
- Horário do dia

### 4. Rotas Seguras
- Cálculo de rotas considerando segurança
- Múltiplas opções de rota
- Distância e tempo estimado
- Preferências de segurança

### 5. Comunidade
- Estatísticas gerais (usuários, avaliações)
- Top bairros mais seguros
- Áreas de atenção
- Atividade recente

### 6. Perfil do Usuário
- Sistema de níveis (1-6)
- Badges e conquistas
- Histórico de avaliações
- Progresso para próximo nível

## 🎨 Design System

O projeto usa:
- **Cores principais**: Baseadas no Google Maps
  - Primary: `#4285F4` (Azul)
  - Success: `#34A853` (Verde)
  - Warning: `#FBBC04` (Amarelo)
  - Danger: `#EA4335` (Vermelho)
- **Tipografia**: System fonts (-apple-system, Segoe UI, etc)
- **Componentes**: shadcn/ui com Tailwind CSS
- **Ícones**: Lucide React

## 🧪 Testando

### Modo Development

```bash
npm run dev
```

### Mock Data

O app funciona com dados mockados por padrão. Para conectar ao backend:

1. Configure `API_BASE_URL` em `/config/environment.ts`
2. Inicie o backend Spring Boot
3. O app detectará automaticamente a API disponível

## 📱 PWA (Progressive Web App)

O app é instalável como PWA:

1. Acesse via HTTPS
2. Clique em "Instalar app" no navegador
3. Use como app nativo

Recursos PWA:
- ✅ Funciona offline
- ✅ Instalável na home screen
- ✅ Service worker para cache
- ✅ Push notifications (configurável)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Equipe Zanza** - *Desenvolvimento inicial*

## 🙏 Agradecimentos

- Comunidade de Campinas
- Contribuidores do projeto
- OpenStreetMap
- shadcn/ui
- Capacitor

## 📞 Suporte

Para suporte, envie um email para suporte@zanza.com.br ou abra uma issue no GitHub.

---

**Desenvolvido com ❤️ para tornar Campinas mais segura para pedestres**
