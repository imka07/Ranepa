export default defineEventHandler(async (event) => {
  try {
    console.log('🔍 [LOGOUT] Logout attempt')

    // Удаляем cookie с токеном
    setCookie(event, 'admin_token', '', {
      httpOnly: true,
      maxAge: 0
    })

    console.log('✅ [LOGOUT] Cookie deleted')

    return {
      success: true,
      message: 'Logout successful'
    }
  } catch (error: any) {
    console.error('🔴 [LOGOUT] Error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
