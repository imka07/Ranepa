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

export const useOrderForm = () => {
  // Инициализируем зависимости на верхнем уровне
  const { user } = useAuth()
  const { createOrder } = useOrders()

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

    isLoading.value = true

    try {
      // Убедимся что пользователь инициализирован
      if (!user.value) {
        console.error('❌ Пользователь не авторизован:', user.value)
        throw new Error('Пользователь не авторизован')
      }

      console.log('👤 Пользователь авторизован:', user.value)

      // Подготавливаем данные для сохранения
      const orderData: any = {
        workType: form.workType,
        subject: form.subject,
        theme: form.theme,
        deadline: form.deadline,
        volume: form.volume,
        comment: form.comment,
        name: form.name,
        contactType: form.contactType,
        phone: form.phone,
        telegram: form.telegram
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

      // Сохраняем заказ в localStorage
      const newOrder = createOrder(orderData)
      console.log('✅ Заказ создан:', newOrder)

      // Отправляем в ТГ бот если есть эндпоинт
      try {
        await $fetch('/api/orders', {
          method: 'POST',
          body: orderData
        })
      } catch (telegramError) {
        // Не провалить если ТГ не работает - заказ все равно сохраняется
        console.warn('Telegram notification failed, but order was saved locally')
      }

      // Успешная отправка
      showAlert('success', 'Успешно!', 'Ваша заявка отправлена. Мы скоро свяжемся с вами!')
      closeOrderModal()
    } catch (error: any) {
      console.error('Error submitting order:', error)
      const errorMessage = error?.data?.message || 'Произошла ошибка при отправке заявки. Попробуйте позже.'
      showAlert('error', 'Ошибка', errorMessage)
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
