# 📦 Настройка Supabase для отзывов

## 👉 Шаг 1: Создание проекта Supabase

1. Зайди на [supabase.com](https://supabase.com)
2. Нажми **"Start your project"** → **"Sign in"** (через GitHub удобнее)
3. После входа → **"New project"**
4. Заполни:
   - **Name**: `ranepa-reviews` (или любое название)
   - **Database Password**: придумай надежный пароль (сохрани его!)
   - **Region**: выбери `Europe - Frankfurt` или `Stockholm`
   - **Pricing Plan**: `Free`
5. Жди 1-2 минуты пока проект создастся ⚡

---

## 📋 Шаг 2: Создание таблицы `reviews`

### Через Table Editor (самый простой способ)

1. В левом меню → **📋 Table Editor**
2. Нажми **"Create a new table"**
3. Заполни форму:

**Table Name**: `reviews`

**Columns** (добавь следующие колонки):

| Column name | Type | Default value | Primary | Nullable |
|------------|------|---------------|---------|----------|
| `id` | `int8` | автоматически (identity) | ✅ | ❌ |
| `created_at` | `timestamptz` | `now()` | ❌ | ❌ |
| `name` | `text` | - | ❌ | ❌ |
| `role` | `text` | - | ❌ | ❌ |
| `rating` | `int2` | - | ❌ | ❌ |
| `content` | `text` | - | ❌ | ❌ |

4. **⚠️ RLS (Row Level Security)**: **ОТКЛЮЧИ** галочку `"Enable Row Level Security (RLS)"`
   - Это важно, чтобы API мог записывать данные
5. Нажми **"Save"**

### Или через SQL Editor (альтернативный способ)

1. В левом меню → **📠 SQL Editor**
2. Нажми **"+ New query"**
3. Скопируй и вставь следующий SQL:

```sql
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL
);

-- Отключаем RLS для таблицы
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- Добавляем индекс по дате (для быстрой сортировки)
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
```

4. Нажми **"Run"** (или `Ctrl+Enter`)

---

## 🔑 Шаг 3: Получение API ключей

1. В левом меню → **⚙️ Settings** (шестеренка)
2. **API** → найди и скопируй:

### Project URL
```
https://xxxxx.supabase.co
```
Скопируй это значение → понадобится для `SUPABASE_URL`

### Project API keys
Найди секцию **"Project API keys"** → скопируй ключ:
- **`anon` `public`** → это значение понадобится для `SUPABASE_ANON_KEY`

⚠️ **Не копируй `service_role` ключ!** (он секретный и не нужен для этой задачи)

---

## 📄 Шаг 4: Настройка `.env` файла

Добавь в свой `.env` файл следующие строки:

```env
# Supabase (для отзывов)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=твой_anon_public_ключ_здесь
```

Замени:
- `https://xxxxx.supabase.co` на твой **Project URL**
- `твой_anon_public_ключ_здесь` на твой **anon public ключ**

---

## 🚀 Шаг 5: Установка зависимостей

Выполни в терминале:

```bash
npm install
```

Это установит `@supabase/supabase-js`, который уже добавлен в `package.json`.

---

## ✅ Шаг 6: Запуск и тестирование

```bash
npm run dev
```

Перейди на страницу отзывов:
```
http://localhost:3000/reviews
```

Заполни форму и отправь тестовый отзыв.

---

## 🔍 Проверка результатов в Supabase

1. Вернись в Supabase панель
2. В левом меню → **📋 Table Editor**
3. Выбери таблицу **`reviews`**
4. Ты должен увидеть новую запись с твоим отзывом! 🎉

---

## 📊 Просмотр всех отзывов

Все отзывы будут храниться в Supabase и доступны **только тебе** через админ-панель Supabase:

- **Table Editor** → `reviews` — просмотр в табличном виде
- **SQL Editor** — выполнение SQL запросов (например, `SELECT * FROM reviews ORDER BY created_at DESC`)

---

## 🛑 Возможные ошибки

### `Missing Supabase credentials`
→ Проверь, что в `.env` файле есть `SUPABASE_URL` и `SUPABASE_ANON_KEY`

### `Failed to save review to database`
→ Убедись, что RLS отключен для таблицы `reviews`

### `Rating must be between 1 and 5`
→ Валидация рейтинга сработала, проверь форму

---

## 🔗 Полезные ссылки

- [📚 Supabase Docs](https://supabase.com/docs)
- [🔌 Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [🔑 Authentication & RLS](https://supabase.com/docs/guides/auth)
