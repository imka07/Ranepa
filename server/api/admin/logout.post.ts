export default defineEventHandler(async (event) => {
  try {
    // Удаляем cookie с токеном
    setCookie(event, 'admin_token', '', {
      httpOnly: true,
      maxAge: 0
    })

    return {
      success: true,
      message: 'Logout successful'
    }
  } catch (error: any) {
    console.error('Admin logout error:', error)

    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
