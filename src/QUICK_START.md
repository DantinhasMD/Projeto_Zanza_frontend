# 🚀 Guia Rápido - Zanza

Este guia te ajudará a ter o projeto rodando em **menos de 10 minutos**.

---

## ⚡ Início Rápido (5 minutos)

### 1️⃣ Clone e Instale (2 min)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/zanza.git
cd zanza

# Instale dependências
npm install
```

### 2️⃣ Execute o Projeto (1 min)

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

Abra: **http://localhost:5173** 🎉

### 3️⃣ Teste o App (2 min)

1. **Clique em "Entrar sem conta"** para modo visitante
2. **Explore o mapa** - veja ruas coloridas por segurança
3. **Navegue pelas tabs** - Mapa, Rotas, Comunidade
4. **Veja estatísticas** da comunidade

✅ **Pronto!** O app está rodando com dados mockados.

---

## 📱 Android (10 minutos)

### Pré-requisitos
- Android Studio instalado
- JDK 11+

### Setup Rápido

```bash
# 1. Instale Capacitor
npm run android:install

# 2. Adicione plataforma Android
npm run android:add

# 3. Build e abra no Android Studio
npm run android:dev
```

No Android Studio:
1. Aguarde sincronização do Gradle
2. Conecte dispositivo ou inicie emulador
3. Clique em **Run** ▶️

🎉 **App rodando no Android!**

---

## 🔌 Conectar Backend (5 minutos)

### Se você tem backend Spring Boot rodando:

1. **Configure a URL da API**

Edite `/config/environment.ts`:

```typescript
development: {
  API_BASE_URL: 'http://localhost:8080/api',
  // ou IP da sua máquina para testar no Android
  // API_BASE_URL: 'http://192.168.1.100:8080/api',
}
```

2. **Reinicie o app**

```bash
# Ctrl+C para parar
npm run dev
```

3. **Teste login real**
- Use credenciais do seu backend
- As chamadas API serão feitas automaticamente

✅ **App conectado ao backend!**

---

## 🎯 Próximos Passos

### Desenvolvimento Web

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Verificar erros
npm run lint
npm run type-check
```

### Desenvolvimento Android

```bash
# A cada mudança no código
npm run android:sync

# Abrir Android Studio
npm run android:open

# Build release APK
npm run android:build
```

### Deploy Rápido (Web)

**Vercel:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Netlify:**
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 📚 Documentação Completa

| Documento | Descrição |
|-----------|-----------|
| [README.md](./README.md) | Visão geral do projeto |
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | Estrutura de arquivos |
| [SPRING_BOOT_INTEGRATION.md](./SPRING_BOOT_INTEGRATION.md) | Integração backend |
| [android-setup.md](./android-setup.md) | Setup Android detalhado |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Guia de deploy |
| [PACKAGE_JSON_SCRIPTS.md](./PACKAGE_JSON_SCRIPTS.md) | Scripts npm |

---

## 🐛 Problemas Comuns

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: Android não sincroniza
```bash
npm run android:clean
npm run android:sync
```

### Erro: Build falha
```bash
npm run type-check  # Verifique erros TypeScript
npm run lint        # Verifique erros de código
```

### App não carrega localização
- Habilite permissão de localização no navegador/dispositivo
- O app usa localização padrão (Campinas) se não conseguir

---

## 💡 Dicas Úteis

### 1. Modo Visitante vs Usuário Logado

**Visitante:**
- ✅ Ver mapa e rotas
- ✅ Ver estatísticas
- ❌ Não pode avaliar locais

**Logado:**
- ✅ Tudo do visitante +
- ✅ Avaliar locais
- ✅ Sistema de níveis
- ✅ Histórico de avaliações

### 2. Dados Mock vs API Real

**Por padrão:** App usa dados mockados (em `App.tsx` e componentes)

**Com backend:** Configure `API_BASE_URL` e o app usa API automaticamente

### 3. Estrutura de Código

```
Como adicionar uma feature:

1. Crie tipos em /types/index.ts
2. Crie serviço em /services/
3. Use hook useApi nos componentes
4. Componente em /components/
```

### 4. Hot Reload

O app recarrega automaticamente ao salvar arquivos. Se não funcionar:
```bash
# Ctrl+C e reinicie
npm run dev
```

---

## 🎨 Customização Rápida

### Mudar Cores do App

Edite `/config/environment.ts`:

```typescript
export const SAFETY_COLORS = {
  safe: '#34A853',     // Verde
  warning: '#FBBC04',  // Amarelo
  danger: '#EA4335',   // Vermelho
};
```

### Mudar Localização Padrão

Edite `/config/environment.ts`:

```typescript
DEFAULT_LOCATION: {
  lat: -22.9055,     // Sua latitude
  lng: -47.0625,     // Sua longitude
  name: 'Sua Cidade',
},
```

### Adicionar Novo Tipo de Problema

Edite `/config/environment.ts`:

```typescript
export const ISSUE_TYPES = [
  'Iluminação precária',
  'Movimento baixo',
  'Seu novo problema aqui', // Adicione aqui
];
```

---

## 🧪 Teste Rápido da API

### Teste com curl:

```bash
# Health check
curl http://localhost:8080/api/health

# Login (se backend implementado)
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Buscar ruas
curl http://localhost:8080/api/streets
```

### Teste no navegador:

Abra Console (F12) e execute:

```javascript
// Teste chamada API
fetch('http://localhost:8080/api/streets')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## 📝 Checklist de Setup

### Desenvolvimento Web
- [ ] Node.js 18+ instalado
- [ ] `npm install` executado
- [ ] `npm run dev` funcionando
- [ ] App abre em http://localhost:5173
- [ ] Consegue navegar pelas telas

### Desenvolvimento Android
- [ ] Android Studio instalado
- [ ] JDK 11+ instalado
- [ ] Capacitor instalado (`npm run android:install`)
- [ ] Projeto Android criado (`npm run android:add`)
- [ ] Abre no Android Studio
- [ ] Build funciona

### Backend (Opcional)
- [ ] Spring Boot rodando
- [ ] PostgreSQL configurado
- [ ] `API_BASE_URL` configurada
- [ ] Endpoints respondem
- [ ] Login funciona

---

## 🆘 Precisa de Ajuda?

1. **Consulte a documentação detalhada**
   - Ver [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

2. **Veja exemplos de código**
   - Arquivo: `/examples/ServiceUsageExamples.tsx`

3. **Problemas com Android**
   - Ver [android-setup.md](./android-setup.md)

4. **Problemas com Backend**
   - Ver [SPRING_BOOT_INTEGRATION.md](./SPRING_BOOT_INTEGRATION.md)

5. **Abra uma issue no GitHub**
   - Descreva o problema
   - Inclua logs de erro
   - Mencione sistema operacional

---

## ⭐ Próximos Passos Recomendados

### Agora que está rodando:

1. **Explore o código**
   - Leia `/examples/ServiceUsageExamples.tsx`
   - Veja como os componentes usam os serviços

2. **Customize o app**
   - Mude cores, ícones, textos
   - Adicione sua logo

3. **Implemente o backend**
   - Siga [SPRING_BOOT_INTEGRATION.md](./SPRING_BOOT_INTEGRATION.md)
   - Teste integração

4. **Build para produção**
   - Deploy web (Vercel/Netlify)
   - Build Android (Play Store)

---

## 🎉 Parabéns!

Você tem o Zanza rodando! 

**Tempo total:** ~10 minutos  
**Status:** ✅ Funcionando

Agora você pode:
- ✅ Desenvolver novas features
- ✅ Integrar com backend
- ✅ Build para Android
- ✅ Deploy em produção

**Boa sorte com seu projeto!** 🚀

---

**Dúvidas?** Consulte [README.md](./README.md) ou [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
