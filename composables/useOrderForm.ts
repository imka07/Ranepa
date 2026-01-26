import { ref, computed, reactive } from 'vue'

type ContactType = 'phone' | 'telegram'
type WorkType = 'essay' | 'coursework' | 'diploma' | 'report' | 'presentation' | 'solution' | 'other' | ''

interface FormData {
  workType: WorkType
  subject: string
  theme: string
  deadline: string
  volume: string
  file: File | null
  comment: string
  name: string
  contactType: ContactType
  phone: string
  telegram: string
}

interface AlertState {
  show: boolean
  type: 'success' | 'error'
  title: string
  message: string
}

/**
 * Генерирует уникальный ID запроса
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export const useOrderForm = () => {
  // Инициализируем зависимости на верхнем уровне
  const { user } = useAuth()
  const router = useRouter()

  // Состояние формы
  const form = reactive<FormData>({
    workType: '',
    subject: '',
    theme: '',
    deadline: '',
    volume: '',
    file: null,
    comment: '',
    name: '',
    contactType: 'phone',
    phone: '',
    telegram: ''
  })

  // UI состояния
  const isOrderOpen = ref(false)
  const isLoading = ref(false)
  const isDeadlineFocused = ref(false)
  
  // ID последнего запроса для предотвращения дубликатов
  let lastRequestId: string | null = null

  const alert = reactive<AlertState>({
    show: false,
    type: 'success',
    title: '',
    message: ''
  })

  let alertTimer: ReturnType<typeof setTimeout> | null = null

  // Получаем сегодняшнюю дату
  const today = computed(() => new Date().toISOString().split('T')[0])

  // Проверка: все обязательные поля заполнены
  const canSubmit = computed(() => {
    const contact = form.contactType === 'phone' ? form.phone : form.telegram
    return Boolean(
      form.workType &&
      form.subject &&
      form.theme &&
      form.deadline &&
      form.volume &&
      form.name &&
      contact
    )
  })

  /**
   * Открыть модальное окно заявки
   */
  const openOrderModal = () => {
    isOrderOpen.value = true
  }

  /**
   * Закрыть модальное окно заявки
   */
  const closeOrderModal = () => {
    isOrderOpen.value = false
    resetForm()
    // Сбрасываем ID запроса при закрытии
    lastRequestId = null
  }

  /**
   * Обработка выбора файла
   */
  const onFileSelect = (selectedFile: File) => {
    form.file = selectedFile
  }

  /**
   * Удаление выбранного файла
   */
  const onFileRemove = () => {
    form.file = null
  }

  /**
   * Закрыть уведомление
   */
  const closeAlert = () => {
    alert.show = false
    if (alertTimer) {
      clearTimeout(alertTimer)
      alertTimer = null
    }
  }

  /**
   * Показать уведомление
   */
  const showAlert = (type: 'success' | 'error', title: string, message: string) => {
    closeAlert()

    alert.type = type
    alert.title = title
    alert.message = message
    alert.show = true

    alertTimer = setTimeout(() => {
      closeAlert()
    }, 5000)
  }

  /**
   * Форматирование размера файла
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Чтение файла как Base64
   */
  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const result = reader.result
        if (typeof result !== 'string') return reject(new Error('FileReader result is not a string'))

        const base64Data = result.split(',')[1]
        if (!base64Data) return reject(new Error('Failed to read file as base64'))

        resolve(base64Data)
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Сбросить форму
   */
  const resetForm = () => {
    form.workType = ''
    form.subject = ''
    form.theme = ''
    form.deadline = ''
    form.volume = ''
    form.file = null
    form.comment = ''
    form.name = ''
    form.contactType = 'phone'
    form.phone = ''
    form.telegram = ''
  }

  /**
   * Отправить заявку
   */
  const submitOrder = async () => {
    if (!canSubmit.value) {
      showAlert('error', 'Ошибка', 'Пожалуйста, заполните все обязательные поля')
      return
    }

    // Проверка авторизации ПЕРЕД началом загрузки
    if (!user.value) {
      console.error('❌ Пользователь не авторизован')
      showAlert(
        'error',
        'Ошибка',
        'Перед отправкой заявки необходимо зарегистрироваться или войти в аккаунт. Нажмите "Личный кабинет" в верхнем меню.'
      )
      return
    }

    // Защита от повторной отправки
    if (isLoading.value) {
      console.warn('⚠️ Попытка повторной отправки заблокирована (isLoading=true)')
      return
    }

    // Генерируем уникальный ID запроса
    const requestId = generateRequestId()
    console.log(`🆔 Генерация нового запроса: ${requestId}`)

    // Проверяем, не дублируется ли запрос
    if (lastRequestId === requestId) {
      console.warn(`⚠️ Дублирующийся запрос заблокирован: ${requestId}`)
      return
    }

    lastRequestId = requestId
    isLoading.value = true

    try {
      console.log('👤 Пользователь авторизован:', user.value)

      // Подготавливаем данные для сохранения
      const orderData: any = {
        requestId, // Добавляем ID запроса
        workType: form.workType,
        subject: form.subject,
        theme: form.theme,
        deadline: form.deadline,
        volume: form.volume,
        comment: form.comment,
        name: form.name,
        contactType: form.contactType,
        phone: form.phone,
        telegram: form.telegram,
        userId: user.value.id,
        userName: user.value.name,
        userEmail: user.value.email
      }

      // Если есть файл, конвертируем его в Base64
      if (form.file) {
        const base64Data = await readFileAsBase64(form.file)
        orderData.file = {
          base64: base64Data,
          name: form.file.name,
          type: form.file.type,
          size: form.file.size
        }
      }

      console.log(`🚀 Отправка запроса ${requestId} на backend...`)

      // Отправляем заявку на backend (создаётся только ОДИН заказ в Supabase)
      const response = await $fetch('/api/orders', {
        method: 'POST',
        body: orderData
      })

      console.log(`✅ Заказ успешно создан (${requestId}):`, response)

      // Успешная отправка
      showAlert('success', 'Успешно!', 'Ваша заявка отправлена. Мы скоро свяжемся с вами!')
      closeOrderModal()
    } catch (error: any) {
      console.error(`❌ Ошибка при отправке запроса ${requestId}:`, error)
      const errorMessage = error?.data?.message || 'Произошла ошибка при отправке заявки. Попробуйте позже.'
      showAlert('error', 'Ошибка', errorMessage)
      // Сбрасываем lastRequestId при ошибке, чтобы пользователь мог повторить
      lastRequestId = null
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Состояния
    form,
    isOrderOpen,
    isLoading,
    isDeadlineFocused,
    alert,
    today,
    canSubmit,
    // Методы
    openOrderModal,
    closeOrderModal,
    onFileSelect,
    onFileRemove,
    closeAlert,
    showAlert,
    formatFileSize,
    readFileAsBase64,
    resetForm,
    submitOrder
  }
}
