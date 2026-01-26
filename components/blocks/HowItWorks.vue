<template>
  <section id="how-it-works" class="w-full py-16 sm:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Заголовок секции -->
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
          Как мы работаем
        </h2>
        <p class="text-lg text-slate-600 max-w-2xl mx-auto">
          Простой и прозрачный процесс работы от заявки до сдачи работы
        </p>
      </div>

      <!-- Шаги -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Шаг 1 -->
        <div class="relative">
          <div class="bg-white rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg h-full">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
              1
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-3">Оставьте заявку</h3>
            <p class="text-slate-700 text-sm leading-relaxed">
              Заполните форму на сайте, указав тип работы, предмет, тему и срок. Прикрепите методичку или требования к работе. Мы свяжемся с вами в течение 15 минут для уточнения деталей.
            </p>
          </div>
          <!-- Стрелка -->
          <div class="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
            <svg class="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Шаг 2 -->
        <div class="relative">
          <div class="bg-white rounded-xl p-6 border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg h-full">
            <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
              2
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-3">Согласование деталей</h3>
            <p class="text-slate-700 text-sm leading-relaxed">
              Обсуждаем с вами все нюансы работы: структуру, объем, требования к оформлению. Рассчитываем стоимость и сроки выполнения. 
            </p>
          </div>
          <!-- Стрелка -->
          <div class="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
            <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Шаг 3 -->
        <div class="relative">
          <div class="bg-white rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg h-full">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
              3
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-3">Выполнение работы</h3>
            <p class="text-slate-700 text-sm leading-relaxed">
              Наши специалисты приступают к выполнению. Вы получаете промежуточные версии для контроля и корректировки. Мы на связи 24/7 для ответов на вопросы. Все правки вносятся бесплатно.
            </p>
          </div>
          <!-- Стрелка -->
          <div class="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
            <svg class="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>

        <!-- Шаг 4 -->
        <div class="relative">
          <div class="bg-white rounded-xl p-6 border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-lg h-full">
            <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl">
              4
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-3">Сдача работы</h3>
            <p class="text-slate-700 text-sm leading-relaxed">
              Получаете готовую работу с проверкой на уникальность и отчетом. Подготовка к защите и консультации по содержанию. Гарантируем сопровождение до успешной сдачи работы.
            </p>
          </div>
        </div>
      </div>

      <!-- Дополнительная информация -->
      <div class="mt-12 bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <div class="flex-shrink-0">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="flex-1 text-center sm:text-left">
            <h3 class="text-xl font-bold text-slate-900 mb-2">Гарантируем качество и соблюдение сроков</h3>
            <p class="text-slate-700 text-sm">
              Все работы проходят многоуровневую проверку качества. Бесплатные доработки в течение 14 дней после сдачи.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No props needed for static content
</script>