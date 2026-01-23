export default defineEventHandler(async (event) => {
  // Удаляем cookie с токеном
  deleteCookie(event, 'admin-token')

  return {
    success: true
  }
})
