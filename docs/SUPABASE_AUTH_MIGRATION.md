# Миграция на Supabase Auth для пользователей

## Что изменилось

Теперь каждый пользователь имеет индивидуальную авторизацию через **Supabase Auth** и видит только свои заказы.

### Преимущества:
- ✅ Реальная аутентификация пользователей
- ✅ Каждый пользователь видит только свои заказы
- ✅ Безопасное хранение паролей
- ✅ Готовая система управления пользователями
- ✅ Возможность восстановления пароля (в будущем)

## SQL миграция для Supabase

### 1. Создание таблицы профилей

```sql
-- Создаем таблицу профилей пользователей
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи могут читать только свой профиль
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Политика: пользователи могут обновлять только свой профиль
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Политика: пользователи могут создавать свой профиль
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Индексы для производительности
CREATE INDEX idx_profiles_email ON profiles(email);
```

### 2. Обновление таблицы заказов

```sql
-- Обновляем таблицу orders: привязываем к auth.users
ALTER TABLE orders
  ALTER COLUMN user_id TYPE UUID USING user_id::uuid,
  ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Включаем RLS для таблицы orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Политика: пользователи видят только свои заказы
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Политика: пользователи могут создавать свои заказы
CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Политика: пользователи могут обновлять свои заказы
CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Политика: пользователи могут удалять свои заказы
CREATE POLICY "Users can delete own orders"
  ON orders FOR DELETE
  USING (auth.uid() = user_id);

-- Индекс для быстрой фильтрации заказов по пользователю
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

### 3. Функция для автоматического создания профиля

```sql
-- Функция для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Изменения в коде

### 1. `composables/useAuth.ts`

- ✅ Интеграция с Supabase Auth
- ✅ Реальная регистрация и вход
- ✅ Хранение данных пользователя в таблице `profiles`
- ✅ Автоматическая синхронизация состояния авторизации

### 2. `pages/login.vue`

- ✅ Страница входа/регистрации
- ✅ Переключение между режимами
- ✅ Валидация полей
- ✅ Обработка ошибок

### 3. `middleware/user-auth.ts`

- ✅ Защита страницы личного кабинета
- ✅ Перенаправление неавторизованных на `/login`

### 4. `pages/dashboard.vue`

- ✅ Отображение только заказов текущего пользователя
- ✅ Кнопка выхода
- ✅ Личные данные пользователя

### 5. `nuxt.config.ts`

- ✅ Добавлены переменные окружения для Supabase

## Настройка переменных окружения

Добавь в `.env`:

```env
# Supabase Auth
NUXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Как это работает

### Регистрация нового пользователя:

1. Пользователь заполняет форму регистрации
2. Создается аккаунт в Supabase Auth
3. Автоматически создается запись в таблице `profiles`
4. Пользователь перенаправляется в личный кабинет

### Вход существующего пользователя:

1. Пользователь вводит email и пароль
2. Supabase Auth проверяет данные
3. Загружается профиль из таблицы `profiles`
4. Пользователь перенаправляется в личный кабинет

### Создание заказа:

1. Пользователь заполняет форму заказа на главной странице
2. Заказ сохраняется с `userId` = ID авторизованного пользователя
3. Заказ отправляется в Telegram админу

### Просмотр заказов:

1. Пользователь заходит в личный кабинет (`/dashboard`)
2. Загружаются ВСЕ заказы из Supabase
3. Фронтенд фильтрует и показывает только заказы текущего пользователя

## Row Level Security (RLS)

Supabase автоматически фильтрует данные на уровне базы:

- ✅ Пользователи видят только свои заказы
- ✅ Пользователи видят только свой профиль
- ✅ Невозможно получить чужие данные через API

## Тестирование

### Шаг 1: Создай тестового пользователя

1. Перейди на `/login`
2. Переключись на регистрацию
3. Зарегистрируй пользователя:
   - Имя: `User 1`
   - Email: `user1@test.com`
   - Пароль: `password123`

### Шаг 2: Создай заказ

1. Перейди на главную страницу
2. Заполни форму заказа
3. Отправь заказ

### Шаг 3: Проверь личный кабинет

1. Перейди в `/dashboard`
2. Убедись, что видишь свой заказ

### Шаг 4: Проверь изоляцию данных

1. Выйди из аккаунта
2. Зарегистрируй второго пользователя (`user2@test.com`)
3. Убедись, что не видишь заказы первого пользователя

## Миграция существующих тестовых данных

Если в базе есть старые заказы с `user_id = '1'` или `'guest'`, они останутся, но будут недоступны пользователям (т.к. эти ID не существуют в `auth.users`).

Чтобы очистить старые данные:

```sql
-- Удаление заказов с недействительными user_id
DELETE FROM orders 
WHERE user_id NOT IN (SELECT id::text FROM auth.users);
```

## Следующие шаги (опционально)

- [ ] Восстановление пароля через email
- [ ] Подтверждение email при регистрации
- [ ] Вход через Google/GitHub
- [ ] Редактирование профиля
- [ ] Изменение пароля

---

✅ **Авторизация настроена и готова к использованию!**
