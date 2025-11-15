# Configuração do App Android com Capacitor

Este guia explica como configurar e compilar o aplicativo Zanza para Android.

## Pré-requisitos

1. **Node.js** (versão 16 ou superior)
2. **Android Studio** (versão mais recente)
3. **JDK 11** ou superior
4. **Gradle** (será instalado automaticamente pelo Android Studio)

## Instalação

### 1. Instalar Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npm install @capacitor/geolocation
npm install @capacitor/network
npm install @capacitor/splash-screen
npm install @capacitor/status-bar
npm install @capacitor/push-notifications
npm install @capacitor/local-notifications
npm install @capacitor/app
npm install @capacitor/storage
```

### 2. Inicializar Capacitor

```bash
npx cap init
```

O arquivo `capacitor.config.ts` já está configurado com as seguintes informações:
- **App ID**: `br.com.zanza`
- **App Name**: `Zanza`
- **Web Dir**: `dist`

### 3. Build do Projeto

```bash
npm run build
```

### 4. Adicionar Plataforma Android

```bash
npx cap add android
```

### 5. Sincronizar Código

Sempre que fizer mudanças no código web:

```bash
npm run build
npx cap sync android
```

## Configuração do Android Studio

### 1. Abrir Projeto no Android Studio

```bash
npx cap open android
```

### 2. Configurar Permissões

O arquivo `AndroidManifest.xml` já deve estar configurado com as seguintes permissões:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-feature android:name="android.hardware.location.gps" android:required="false" />
```

### 3. Configurar Ícones e Splash Screen

Crie os ícones nas seguintes dimensões e coloque em `android/app/src/main/res/`:

- **mipmap-ldpi**: 36x36
- **mipmap-mdpi**: 48x48
- **mipmap-hdpi**: 72x72
- **mipmap-xhdpi**: 96x96
- **mipmap-xxhdpi**: 144x144
- **mipmap-xxxhdpi**: 192x192

Para o Splash Screen, crie em `android/app/src/main/res/drawable/`:
- **splash.png**: 2732x2732 (imagem centralizada)

### 4. Build do APK

No Android Studio:

1. Build > Generate Signed Bundle / APK
2. Selecione APK
3. Crie ou selecione sua keystore
4. Escolha "release" build variant
5. Clique em Finish

Ou via linha de comando:

```bash
cd android
./gradlew assembleRelease
```

O APK estará em: `android/app/build/outputs/apk/release/app-release.apk`

## Testando no Dispositivo

### Via USB (Debug)

1. Habilite "Depuração USB" no dispositivo Android
2. Conecte o dispositivo via USB
3. No Android Studio: Run > Run 'app'

### Via APK (Release)

1. Transfira o APK para o dispositivo
2. Habilite "Fontes desconhecidas" nas configurações
3. Instale o APK

## Plugins Capacitor Utilizados

### Geolocation
```typescript
import { Geolocation } from '@capacitor/geolocation';

const position = await Geolocation.getCurrentPosition();
```

### Network
```typescript
import { Network } from '@capacitor/network';

const status = await Network.getStatus();
```

### Status Bar
```typescript
import { StatusBar, Style } from '@capacitor/status-bar';

await StatusBar.setStyle({ style: Style.Light });
await StatusBar.setBackgroundColor({ color: '#4285F4' });
```

### Splash Screen
```typescript
import { SplashScreen } from '@capacitor/splash-screen';

await SplashScreen.hide();
```

### Storage (para dados offline)
```typescript
import { Storage } from '@capacitor/storage';

await Storage.set({ key: 'token', value: 'myToken' });
const { value } = await Storage.get({ key: 'token' });
```

### App (lifecycle events)
```typescript
import { App } from '@capacitor/app';

App.addListener('appStateChange', ({ isActive }) => {
  console.log('App state changed. Is active?', isActive);
});
```

## Configurações Adicionais

### 1. Google Maps API Key (para mapas nativos)

Adicione no `android/app/src/main/AndroidManifest.xml`:

```xml
<application>
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
</application>
```

### 2. Configurar Deep Links

No `AndroidManifest.xml`:

```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="zanza" />
  <data android:host="app" />
</intent-filter>
```

### 3. Notificações Push (Firebase)

1. Crie projeto no Firebase Console
2. Baixe `google-services.json`
3. Coloque em `android/app/`
4. Configure as credenciais no backend Spring Boot

## Troubleshooting

### Erro de Build

```bash
cd android
./gradlew clean
./gradlew build
```

### Erro de Sincronização

```bash
npx cap sync android --force
```

### Problemas com Plugins

```bash
npm install
npx cap update android
```

### Limpar Cache

```bash
cd android
./gradlew clean
rm -rf .gradle
```

## Scripts Úteis

Adicione ao `package.json`:

```json
{
  "scripts": {
    "android:dev": "npm run build && npx cap sync android && npx cap open android",
    "android:build": "npm run build && npx cap sync android",
    "android:run": "npx cap run android",
    "android:sync": "npx cap sync android"
  }
}
```

## Próximos Passos

1. **Publicar na Play Store**
   - Criar conta de desenvolvedor Google Play ($25 taxa única)
   - Preparar screenshots e descrição
   - Configurar política de privacidade
   - Enviar APK para revisão

2. **Configurar CI/CD**
   - GitHub Actions para builds automatizados
   - Fastlane para distribuição

3. **Analytics e Crash Reporting**
   - Firebase Analytics
   - Firebase Crashlytics

4. **Testes**
   - Testes unitários com Jest
   - Testes E2E com Detox ou Appium
