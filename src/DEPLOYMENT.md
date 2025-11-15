# Guia de Deploy - Zanza

Este documento descreve os processos de deploy do Zanza em diferentes ambientes.

## 📋 Índice

1. [Deploy Web (PWA)](#deploy-web-pwa)
2. [Deploy Android](#deploy-android)
3. [Deploy Backend](#deploy-backend)
4. [Configuração de DNS e SSL](#configuração-de-dns-e-ssl)
5. [Monitoramento](#monitoramento)

---

## Deploy Web (PWA)

### Opção 1: Vercel (Recomendado para React)

1. **Instale a CLI do Vercel**
```bash
npm i -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
npm run build
vercel --prod
```

4. **Configuração** (vercel.json):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/manifest.json",
      "dest": "/manifest.json",
      "headers": {
        "Content-Type": "application/manifest+json"
      }
    },
    {
      "src": "/service-worker.js",
      "dest": "/service-worker.js",
      "headers": {
        "Service-Worker-Allowed": "/"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Opção 2: Netlify

1. **Instale a CLI**
```bash
npm install -g netlify-cli
```

2. **Login e Deploy**
```bash
netlify login
netlify init
netlify deploy --prod
```

3. **Configuração** (netlify.toml):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/service-worker.js"
  [headers.values]
    Service-Worker-Allowed = "/"
```

### Opção 3: AWS S3 + CloudFront

1. **Build do projeto**
```bash
npm run build
```

2. **Configure AWS CLI**
```bash
aws configure
```

3. **Crie bucket S3**
```bash
aws s3 mb s3://zanza-web-app
aws s3 website s3://zanza-web-app --index-document index.html
```

4. **Upload dos arquivos**
```bash
aws s3 sync dist/ s3://zanza-web-app --delete
```

5. **Configure CloudFront** para CDN e HTTPS

### Opção 4: Docker + Nginx

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /manifest.json {
        add_header Content-Type application/manifest+json;
    }

    location /service-worker.js {
        add_header Service-Worker-Allowed /;
        add_header Cache-Control "no-cache";
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Build e Run:**
```bash
docker build -t zanza-web .
docker run -d -p 80:80 zanza-web
```

---

## Deploy Android

### Play Store (Produção)

1. **Prepare o Build**
```bash
npm run android:build
```

2. **Crie Keystore** (primeira vez):
```bash
keytool -genkey -v -keystore zanza-release.keystore \
  -alias zanza -keyalg RSA -keysize 2048 -validity 10000
```

3. **Configure no Android Studio**

Em `android/app/build.gradle`:
```gradle
android {
    signingConfigs {
        release {
            storeFile file("../../zanza-release.keystore")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias "zanza"
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

4. **Build Release APK**
```bash
cd android
./gradlew assembleRelease
```

O APK estará em: `android/app/build/outputs/apk/release/app-release.apk`

5. **Build App Bundle (AAB)** - Recomendado para Play Store:
```bash
./gradlew bundleRelease
```

O AAB estará em: `android/app/build/outputs/bundle/release/app-release.aab`

6. **Upload no Google Play Console**
- Acesse: https://play.google.com/console
- Crie um novo aplicativo
- Preencha informações e screenshots
- Upload do AAB
- Configure testes internos/alpha/beta
- Publique

### Firebase App Distribution (Testes)

1. **Instale Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

2. **Configure Firebase**
```bash
firebase init
```

3. **Deploy para testers**
```bash
firebase appdistribution:distribute \
  android/app/build/outputs/apk/release/app-release.apk \
  --app YOUR_APP_ID \
  --groups testers \
  --release-notes "Nova versão para testes"
```

---

## Deploy Backend (Spring Boot)

### Opção 1: Railway

1. **Conecte repositório GitHub**
2. **Configure variáveis de ambiente**
3. **Deploy automático a cada push**

### Opção 2: Heroku

1. **Crie app Heroku**
```bash
heroku create zanza-api
```

2. **Adicione PostgreSQL**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. **Configure variáveis**
```bash
heroku config:set JWT_SECRET=your-secret
heroku config:set SPRING_PROFILES_ACTIVE=production
```

4. **Deploy**
```bash
git push heroku main
```

### Opção 3: AWS Elastic Beanstalk

1. **Crie JAR**
```bash
./mvnw clean package
```

2. **Instale EB CLI**
```bash
pip install awsebcli
```

3. **Inicialize**
```bash
eb init -p java-11 zanza-api
```

4. **Deploy**
```bash
eb create zanza-production
eb deploy
```

### Opção 4: Docker + AWS ECS

**Dockerfile do Backend:**
```dockerfile
FROM openjdk:11-jre-slim
WORKDIR /app
COPY target/zanza-api.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**docker-compose.yml (completo):**
```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: zanza
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/zanza
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
```

**Deploy:**
```bash
docker-compose up -d
```

---

## Configuração de DNS e SSL

### SSL com Let's Encrypt (Certbot)

```bash
# Instalar Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d zanza.com.br -d www.zanza.com.br

# Renovação automática
sudo certbot renew --dry-run
```

### Cloudflare (Recomendado)

1. Adicione domínio ao Cloudflare
2. Configure DNS:
```
A    @    <seu-ip>
CNAME www  @
```
3. SSL automático (Flexible/Full)
4. Configure Page Rules para cache

---

## Monitoramento

### Sentry (Error Tracking)

**Frontend:**
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

**Backend:**
```xml
<dependency>
    <groupId>io.sentry</groupId>
    <artifactId>sentry-spring-boot-starter</artifactId>
    <version>6.30.0</version>
</dependency>
```

### Google Analytics

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Uptime Monitoring

- **UptimeRobot**: https://uptimerobot.com (Free)
- **Pingdom**: https://pingdom.com
- **StatusCake**: https://statuscake.com

### Logs

**CloudWatch (AWS):**
```bash
aws logs tail /aws/elasticbeanstalk/zanza-api --follow
```

**Heroku:**
```bash
heroku logs --tail
```

---

## Checklist de Deploy

### Antes do Deploy

- [ ] Testes passando
- [ ] Build sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado
- [ ] SSL configurado
- [ ] DNS apontando corretamente
- [ ] Monitoramento configurado
- [ ] Backup configurado

### Pós-Deploy

- [ ] Testar funcionalidades principais
- [ ] Verificar logs
- [ ] Testar performance
- [ ] Verificar SSL
- [ ] Testar PWA install
- [ ] Verificar analytics
- [ ] Criar tag de release no Git

### Rollback Plan

Se algo der errado:

**Vercel/Netlify:**
```bash
vercel rollback  # ou
netlify rollback
```

**Heroku:**
```bash
heroku releases
heroku rollback v123
```

**Docker:**
```bash
docker-compose down
git checkout <previous-commit>
docker-compose up -d
```

---

## Automação com GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-web:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'

  deploy-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'
      - run: npm ci
      - run: npm run android:build
      - uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.SERVICE_ACCOUNT_JSON }}
          packageName: br.com.zanza
          releaseFiles: android/app/build/outputs/bundle/release/app-release.aab
          track: beta
```

---

## Suporte e Troubleshooting

### Problemas Comuns

**Build falha:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Android não sincroniza:**
```bash
npm run android:clean
npm run android:sync
```

**CORS errors:**
- Verifique configuração CORS no backend
- Adicione domínio na lista de origens permitidas

**PWA não instala:**
- Verifique HTTPS
- Valide manifest.json
- Verifique service worker

---

**Última atualização:** Janeiro 2024  
**Versão:** 1.0.0
