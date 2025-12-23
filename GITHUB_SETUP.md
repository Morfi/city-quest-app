# Инструкция по добавлению проекта на GitHub

## Шаг 1: Создайте репозиторий на GitHub

1. Откройте [github.com](https://github.com) и войдите в свой аккаунт
2. Нажмите кнопку "+" в правом верхнем углу
3. Выберите "New repository"
4. Заполните:
   - **Repository name:** `city-quest-app` (или другое имя)
   - **Description:** "Мобильное приложение для городских квестов на React Native"
   - **Visibility:** Public или Private (на ваше усмотрение)
   - **НЕ** добавляйте README, .gitignore или лицензию (они уже есть)
5. Нажмите "Create repository"

## Шаг 2: Подключите локальный репозиторий к GitHub

После создания репозитория GitHub покажет инструкции. Выполните команды:

```bash
cd /Users/morfi/city-quest-app

# Добавьте удаленный репозиторий (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/city-quest-app.git

# Или если используете SSH:
# git remote add origin git@github.com:YOUR_USERNAME/city-quest-app.git

# Отправьте код на GitHub
git branch -M main
git push -u origin main
```

## Альтернативный способ через GitHub CLI

Если у вас установлен GitHub CLI (`gh`):

```bash
cd /Users/morfi/city-quest-app

# Создайте репозиторий и отправьте код одной командой
gh repo create city-quest-app --public --source=. --remote=origin --push
```

## Проверка

После успешной отправки откройте ваш репозиторий на GitHub:
```
https://github.com/YOUR_USERNAME/city-quest-app
```

Вы должны увидеть все файлы проекта!

## Дополнительные команды Git

```bash
# Проверить статус
git status

# Посмотреть историю коммитов
git log

# Добавить изменения
git add .
git commit -m "Описание изменений"
git push

# Посмотреть удаленные репозитории
git remote -v
```

