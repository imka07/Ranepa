# Миграция системы заказов на Supabase

## Что изменилось

Система хранения заказов переведена с **localStorage** на **Supabase** (централизованная база данных).

### Преимущества:
- ✅ Заказы доступны с любого устройства
- ✅ Админ видит все заказы, отправленные пользователями
- ✅ Данные не теряются при очистке браузера
- ✅ Telegram уведомления продолжают работать

## Структура таблицы `orders` в Supabase

```sql
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  work_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  theme TEXT NOT NULL,
  deadline TEXT NOT NULL,
  volume TEXT NOT NULL,
  comment TEXT,
  name TEXT NOT NULL,
  contact_type TEXT NOT NULL,
  phone TEXT,
  telegram TEXT,
  file JSONB,
  status TEXT DEFAULT 'в работе',
  sections JSONB DEFAULT '[
    {"id": "plan", "name": "План", "completed": false},
    {"id": "chapter1", "name": "1 глава", "completed": false},
    {"id": "chapter2", "name": "2 глава", "completed": false},
    {"id": "chapter3", "name": "3 глава", "completed": false},
    {"id": "presentation", "name": "Преза", "completed": false}
  ]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
```

## API эндпоинты

### 1. Создание заказа
**POST** `/api/orders`

Сохраняет заказ в Supabase и отправляет уведомление в Telegram.

### 2. Получение всех заказов
**GET** `/api/orders`

Возвращает все заказы из базы (для админа).

### 3. Обновление заказа
**PATCH** `/api/orders/[id]`

Обновляет статус заказа или статус разделов.

**Body примеры:**
```json
// Обновление статуса
{
  "status": "решен"
}

// Обновление раздела
{
  "sectionId": "chapter1",
  "completed": true
}
```

### 4. Удаление заказа
**DELETE** `/api/orders/[id]`

Удаляет заказ из базы (только для админа).

## Изменения в `composables/useOrders.ts`

### До:
- Хранение в `localStorage`
- Синхронные операции
- Данные только на устройстве

### После:
- HTTP запросы к API
- Асинхронные операции (`async/await`)
- Добавлены состояния `loading` и `error`
- Добавлен метод `fetchOrders()` для загрузки заказов

### Новые методы:
```typescript
const { 
  orders,        // ref<Order[]>
  loading,       // ref<boolean> - состояние загрузки
  error,         // ref<string | null> - ошибка
  fetchOrders,   // async () => Promise<void> - загрузка заказов
  ...           // остальные методы теперь async
} = useOrders()
```

## Как это работает

1. **Пользователь отправляет заявку:**
   - Заявка сохраняется в Supabase
   - Отправляется уведомление в Telegram

2. **Админ заходит в личный кабинет:**
   - При монтировании страницы вызывается `fetchOrders()`
   - Загружаются все заявки из Supabase
   - Админ видит все заявки с любого устройства

3. **Админ обновляет статус:**
   - Изменения сохраняются в Supabase
   - Обновляется локальное состояние для быстрого отображения

## Настройка переменных окружения

Убедись, что в `.env` указаны:

```env
# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_public_key_here

# Telegram (опционально)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

## Миграция старых данных

Старые заявки из localStorage **не мигрируются** автоматически. Система начинает работу с чистого листа в Supabase.

Если нужно перенести старые данные, можно:
1. Экспортировать их из localStorage (через консоль браузера)
2. Вручную загрузить в Supabase

## Тестирование

1. Отправь тестовую заявку с любого устройства
2. Зайди в личный кабинет админа с другого устройства
3. Убедись, что заявка видна
4. Обнови статус и проверь синхронизацию

---

✅ **Система готова к работе!**
