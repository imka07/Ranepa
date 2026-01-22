/**
 * Плагин для настройки useFetch на клиенте
 * Убеждаемся, что cookies отправляются с каждым запросом
 */

export default defineNuxtPlugin(() => {
  // Настраиваем fetch для отправки cookies
  $fetch.create = ((...args) => {
    // Получаем оригинальный create
    const ofetch = globalThis.$fetch.create
    // Вызываем с параметром для отправки cookies
    return ofetch(...args, { credentials: 'include' })
  }) as any
})
