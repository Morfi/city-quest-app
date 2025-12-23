# Настройка Android для разработки

## Проблема: Android SDK не найден

Если вы видите ошибку `Failed to resolve the Android SDK path`, это означает, что Android SDK не установлен или не настроен.

## Решение 1: Использовать Expo Go (САМЫЙ ПРОСТОЙ способ) ⭐

Это самый простой способ запустить приложение без установки Android Studio:

1. **Установите Expo Go на ваше Android устройство:**
   - Откройте Google Play Store
   - Найдите и установите "Expo Go"

2. **Запустите Metro bundler:**
   ```bash
   npm start
   ```

3. **Подключите устройство:**
   - Убедитесь, что телефон и компьютер в одной Wi-Fi сети
   - Отсканируйте QR-код из терминала приложением Expo Go
   - Или введите URL вручную в Expo Go

4. **Альтернатива - через USB:**
   ```bash
   npm start
   # Затем нажмите 'a' для Android
   # Expo попытается открыть на подключенном устройстве
   ```

## Решение 2: Установить Android Studio (для эмулятора)

Если вы хотите использовать эмулятор Android:

### Шаг 1: Установите Android Studio

1. Скачайте Android Studio с [developer.android.com](https://developer.android.com/studio)
2. Установите Android Studio
3. При первом запуске выберите "Standard" установку
4. Дождитесь загрузки Android SDK

### Шаг 2: Настройте переменные окружения

Добавьте в `~/.zshrc` (или `~/.bash_profile` если используете bash):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Затем перезагрузите терминал:
```bash
source ~/.zshrc
```

### Шаг 3: Создайте эмулятор

1. Откройте Android Studio
2. Tools → Device Manager
3. Create Device
4. Выберите устройство (например, Pixel 5)
5. Выберите системный образ (рекомендуется API 33 или выше)
6. Завершите создание эмулятора

### Шаг 4: Запустите приложение

```bash
npm run android
```

Или:
```bash
npm start
# Затем нажмите 'a' для Android
```

## Решение 3: Использовать физическое устройство через USB

1. **Включите режим разработчика на Android:**
   - Настройки → О телефоне
   - Нажмите 7 раз на "Номер сборки"
   - Вернитесь в Настройки → Параметры разработчика
   - Включите "Отладка по USB"

2. **Подключите устройство через USB**

3. **Установите ADB (Android Debug Bridge):**
   ```bash
   # Если установлен Android Studio, ADB уже есть
   # Или установите через Homebrew:
   brew install android-platform-tools
   ```

4. **Проверьте подключение:**
   ```bash
   adb devices
   # Должно показать ваше устройство
   ```

5. **Запустите приложение:**
   ```bash
   npm start
   # Нажмите 'a' для Android
   ```

## Проверка установки

Проверьте, что Android SDK настроен правильно:

```bash
echo $ANDROID_HOME
# Должно показать: /Users/morfi/Library/Android/sdk

adb version
# Должна показать версию ADB
```

## Рекомендация

Для быстрого старта используйте **Решение 1 (Expo Go)** - это самый простой способ без установки Android Studio.

Для полноценной разработки с эмулятором используйте **Решение 2 (Android Studio)**.

