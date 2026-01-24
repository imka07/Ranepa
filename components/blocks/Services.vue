<template>
  <section id="services" class="w-full py-16 sm:py-20 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Заголовок секции -->
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Наши услуги для студентов
        </h2>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Профессиональная помощь с любыми учебными работами с гарантией качества и сроков
        </p>
      </div>

      <!-- Сетка услуг -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Дипломы -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-shadow duration-300">
          <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-3">Дипломные работы</h3>
          <p class="text-slate-700 text-sm leading-relaxed mb-4">
            Написание дипломных работ любой сложности для бакалавров, магистров и специалистов. Полное сопровождение от создания плана до защиты. Проверка на уникальность, оформление по ГОСТу. Срок от 14 дней.
          </p>
          <span class="text-blue-600 font-semibold text-sm">От 15 000 ₽</span>
        </div>

        <!-- Курсовые -->
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:shadow-lg transition-shadow duration-300">
          <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-3">Курсовые работы</h3>
          <p class="text-slate-700 text-sm leading-relaxed mb-4">
            Курсовые работы по всем дисциплинам. Глубокая проработка темы, актуальные источники, качественный анализ. Включает теоретическую и практическую части, расчеты, графики. Срок от 7 дней.
          </p>
          <span class="text-green-600 font-semibold text-sm">От 5 000 ₽</span>
        </div>

        <!-- Рефераты -->
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 hover:shadow-lg transition-shadow duration-300">
          <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-3">Рефераты и эссе</h3>
          <p class="text-slate-700 text-sm leading-relaxed mb-4">
            Написание рефератов и эссе по любым темам. Структурированное изложение материала, проработка нескольких источников. Полное соответствие методическим указаниям. Срок от 3 дней.
          </p>
          <span class="text-purple-600 font-semibold text-sm">От 1 000 ₽</span>
        </div>

        <!-- Презентации -->
        <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100 hover:shadow-lg transition-shadow duration-300">
          <div class="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-3">Презентации</h3>
          <p class="text-slate-700 text-sm leading-relaxed mb-4">
            Создание профессиональных презентаций для защиты работ. Современный дизайн, четкая структура, инфографика. Подготовка речи для выступления. Срок от 2 дней.
          </p>
          <span class="text-orange-600 font-semibold text-sm">От 2 000 ₽</span>
        </div>

        <!-- Решение задач -->
        <div class="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100 hover:shadow-lg transition-shadow duration-300">
          <div class="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-3">Решение задач</h3>
          <p class="text-slate-700 text-sm leading-relaxed mb-4">
            Помощь в решении задач по математике, физике, экономике, статистике. Подробные решения с пояснениями. Контрольные, расчетно-графические работы. Срок от 1 дня.
          </p>
          <span class="text-cyan-600 font-semibold text-sm">От 500 ₽</span>
        </div>

        <!-- Помощь на экзамене -->
        <div class="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-100 hover:shadow-lg transition-shadow duration-300">
          <div class="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-3">Помощь на экзамене</h3>
          <p class="text-slate-700 text-sm leading-relaxed mb-4">
            Консультации и поддержка во время экзаменов и зачетов. Помощь в онлайн-тестировании. Подготовка к экзамену, шпаргалки. Конфиденциально и безопасно.
          </p>
          <span class="text-red-600 font-semibold text-sm">От 3 000 ₽</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No props needed for static content
</script>