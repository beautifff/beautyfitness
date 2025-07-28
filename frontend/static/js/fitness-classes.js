/**
 * Fitness Classes Page Module
 * Функциональность для страницы фитнес-классов
 */

class FitnessClassesPage {
    constructor() {
        this.classes = [];
        this.filteredClasses = [];
        this.filters = {
            difficulty: '',
            type: '',
            duration: ''
        };
        this.init();
    }

    init() {
        this.setupFilters();
        this.setupScheduleTable();
        this.setupBookingForm();
        this.loadClasses();
    }

    setupFilters() {
        const difficultyFilter = document.getElementById('difficulty-filter');
        const typeFilter = document.getElementById('type-filter');
        const durationFilter = document.getElementById('duration-filter');
        const clearFiltersBtn = document.getElementById('clear-filters');

        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', (e) => {
                this.filters.difficulty = e.target.value;
                this.applyFilters();
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.filters.type = e.target.value;
                this.applyFilters();
            });
        }

        if (durationFilter) {
            durationFilter.addEventListener('change', (e) => {
                this.filters.duration = e.target.value;
                this.applyFilters();
            });
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }

    setupScheduleTable() {
        const scheduleTable = document.querySelector('.schedule-table');
        if (!scheduleTable) return;

        // Добавляем обработчики для ячеек с классами
        const classSlots = scheduleTable.querySelectorAll('.class-slot');
        classSlots.forEach(slot => {
            slot.addEventListener('click', (e) => {
                const className = slot.getAttribute('data-class');
                this.showClassInfo(className, slot);
            });

            // Добавляем hover эффекты
            slot.addEventListener('mouseenter', (e) => {
                this.highlightClassSlots(className);
            });

            slot.addEventListener('mouseleave', (e) => {
                this.clearHighlight();
            });
        });

        // Добавляем обработчики для временных слотов
        const timeSlots = scheduleTable.querySelectorAll('.time-slot');
        timeSlots.forEach(slot => {
            slot.addEventListener('click', (e) => {
                const time = slot.textContent;
                this.showTimeInfo(time, slot);
            });
        });
    }

    setupBookingForm() {
        const bookingForm = document.getElementById('booking-form');
        if (!bookingForm) return;

        // Автозаполнение класса при клике на кнопку записи
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-modal="booking-modal"]') && e.target.hasAttribute('data-class')) {
                const className = e.target.getAttribute('data-class');
                this.prefillBookingForm(className);
            }
        });

        // Обработка отправки формы бронирования
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBookingSubmit(bookingForm);
        });

        // Валидация даты (нельзя записаться на прошедшую дату)
        const dateInput = document.getElementById('booking-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }

    loadClasses() {
        // Получаем все карточки классов
        const classCards = document.querySelectorAll('.class-card');
        this.classes = Array.from(classCards).map(card => ({
            element: card,
            difficulty: card.getAttribute('data-difficulty'),
            type: card.getAttribute('data-type'),
            duration: card.getAttribute('data-duration'),
            name: card.querySelector('.class-card__title').textContent,
            description: card.querySelector('.class-card__description').textContent
        }));

        this.filteredClasses = [...this.classes];
    }

    applyFilters() {
        this.filteredClasses = this.classes.filter(classItem => {
            // Фильтр по сложности
            if (this.filters.difficulty && classItem.difficulty !== this.filters.difficulty) {
                return false;
            }

            // Фильтр по типу
            if (this.filters.type && classItem.type !== this.filters.type) {
                return false;
            }

            // Фильтр по длительности
            if (this.filters.duration && classItem.duration !== this.filters.duration) {
                return false;
            }

            return true;
        });

        this.updateClassesDisplay();
    }

    updateClassesDisplay() {
        const classesGrid = document.getElementById('classes-grid');
        const noResults = document.getElementById('no-results');

        if (!classesGrid) return;

        // Скрываем все классы
        this.classes.forEach(classItem => {
            classItem.element.style.display = 'none';
        });

        // Показываем отфильтрованные классы
        this.filteredClasses.forEach(classItem => {
            classItem.element.style.display = 'block';
        });

        // Показываем сообщение если нет результатов
        if (this.filteredClasses.length === 0) {
            if (noResults) {
                noResults.style.display = 'block';
            }
        } else {
            if (noResults) {
                noResults.style.display = 'none';
            }
        }

        // Анимация появления
        this.animateFilteredClasses();
    }

    animateFilteredClasses() {
        this.filteredClasses.forEach((classItem, index) => {
            classItem.element.style.opacity = '0';
            classItem.element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                classItem.element.style.transition = 'all 0.3s ease-out';
                classItem.element.style.opacity = '1';
                classItem.element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    clearFilters() {
        this.filters = {
            difficulty: '',
            type: '',
            duration: ''
        };

        // Сбрасываем значения в селектах
        const difficultyFilter = document.getElementById('difficulty-filter');
        const typeFilter = document.getElementById('type-filter');
        const durationFilter = document.getElementById('duration-filter');

        if (difficultyFilter) difficultyFilter.value = '';
        if (typeFilter) typeFilter.value = '';
        if (durationFilter) durationFilter.value = '';

        this.applyFilters();
    }

    showClassInfo(className, element) {
        const classInfo = this.getClassInfo(className);
        if (!classInfo) return;

        // Создаем всплывающую подсказку
        const tooltip = document.createElement('div');
        tooltip.className = 'class-tooltip';
        tooltip.innerHTML = `
            <h4>${classInfo.name}</h4>
            <p>${classInfo.description}</p>
            <div class="tooltip-meta">
                <span><i class="fas fa-clock"></i> ${classInfo.duration} мин</span>
                <span><i class="fas fa-star"></i> ${classInfo.level}</span>
            </div>
            <button class="btn btn--primary btn--small" data-modal="booking-modal" data-class="${className}">
                Записаться
            </button>
        `;

        tooltip.style.cssText = `
            position: absolute;
            background: var(--background-primary);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-md);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-tooltip);
            max-width: 300px;
            animation: fadeIn 0.2s ease-out;
        `;

        // Позиционируем подсказку
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = rect.bottom + 10 + 'px';

        document.body.appendChild(tooltip);

        // Удаляем подсказку при клике вне её
        const removeTooltip = (e) => {
            if (!tooltip.contains(e.target) && !element.contains(e.target)) {
                tooltip.remove();
                document.removeEventListener('click', removeTooltip);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', removeTooltip);
        }, 100);
    }

    getClassInfo(className) {
        const classMap = {
            'aerobics': {
                name: 'Аэробика',
                description: 'Динамичные тренировки под музыку для развития выносливости и сжигания калорий',
                duration: 45,
                level: 'Начинающий'
            },
            'bodypump': {
                name: 'BodyPump',
                description: 'Силовые тренировки с отягощениями для тонизирования мышц всего тела',
                duration: 60,
                level: 'Средний'
            },
            'crossfit': {
                name: 'Кроссфит',
                description: 'Высокоинтенсивные функциональные тренировки для развития силы и выносливости',
                duration: 60,
                level: 'Продвинутый'
            },
            'yoga': {
                name: 'Йога',
                description: 'Практики для развития гибкости, силы и внутреннего спокойствия',
                duration: 60,
                level: 'Начинающий'
            },
            'pilates': {
                name: 'Пилатес',
                description: 'Система упражнений для укрепления мышц кора и улучшения осанки',
                duration: 45,
                level: 'Средний'
            },
            'hiit': {
                name: 'HIIT',
                description: 'Высокоинтенсивные интервальные тренировки для максимального сжигания калорий',
                duration: 30,
                level: 'Продвинутый'
            }
        };

        return classMap[className];
    }

    highlightClassSlots(className) {
        const classSlots = document.querySelectorAll(`.class-slot[data-class="${className}"]`);
        classSlots.forEach(slot => {
            slot.style.backgroundColor = 'var(--primary-color)';
            slot.style.color = 'white';
        });
    }

    clearHighlight() {
        const classSlots = document.querySelectorAll('.class-slot');
        classSlots.forEach(slot => {
            slot.style.backgroundColor = '';
            slot.style.color = '';
        });
    }

    showTimeInfo(time, element) {
        const tooltip = document.createElement('div');
        tooltip.className = 'time-tooltip';
        tooltip.innerHTML = `
            <h4>Время: ${time}</h4>
            <p>Доступные классы в это время:</p>
            <ul>
                ${this.getClassesAtTime(time).map(cls => `<li>${cls}</li>`).join('')}
            </ul>
        `;

        tooltip.style.cssText = `
            position: absolute;
            background: var(--background-primary);
            border: 1px solid var(--border-color);
            border-radius: var(--border-radius-lg);
            padding: var(--spacing-md);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-tooltip);
            max-width: 250px;
            animation: fadeIn 0.2s ease-out;
        `;

        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.right + 10 + 'px';
        tooltip.style.top = rect.top + 'px';

        document.body.appendChild(tooltip);

        const removeTooltip = (e) => {
            if (!tooltip.contains(e.target) && !element.contains(e.target)) {
                tooltip.remove();
                document.removeEventListener('click', removeTooltip);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', removeTooltip);
        }, 100);
    }

    getClassesAtTime(time) {
        const scheduleTable = document.querySelector('.schedule-table');
        if (!scheduleTable) return [];

        const classes = [];
        const rows = scheduleTable.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const timeSlot = row.querySelector('.time-slot');
            if (timeSlot && timeSlot.textContent === time) {
                const classSlots = row.querySelectorAll('.class-slot');
                classSlots.forEach(slot => {
                    const className = slot.getAttribute('data-class');
                    if (className) {
                        const classInfo = this.getClassInfo(className);
                        if (classInfo) {
                            classes.push(classInfo.name);
                        }
                    }
                });
            }
        });

        return classes;
    }

    prefillBookingForm(className) {
        const classSelect = document.getElementById('booking-class');
        if (classSelect) {
            classSelect.value = className;
        }

        // Устанавливаем минимальную дату
        const dateInput = document.getElementById('booking-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
            if (!dateInput.value) {
                dateInput.value = today;
            }
        }
    }

    async handleBookingSubmit(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');

        // Показываем состояние загрузки
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        }

        try {
            // Здесь будет интеграция с backend API
            const response = await this.submitBooking(formData);
            
            if (response.success) {
                this.handleBookingSuccess(form, response);
            } else {
                this.handleBookingError(form, response);
            }
        } catch (error) {
            console.error('Booking submission error:', error);
            this.handleBookingError(form, { message: 'Произошла ошибка при бронировании' });
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-calendar-check"></i> Записаться';
            }
        }
    }

    async submitBooking(formData) {
        // Заглушка для backend интеграции
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Бронирование успешно создано! Мы отправили подтверждение на ваш email.'
                });
            }, 2000);
        });
    }

    handleBookingSuccess(form, response) {
        // Показываем уведомление об успехе
        if (window.beautyFitnessApp) {
            window.beautyFitnessApp.showNotification(response.message, 'success');
        }

        // Сбрасываем форму
        form.reset();

        // Закрываем модальное окно
        if (window.modalManager) {
            window.modalManager.hide();
        }

        // Событие успешного бронирования
        this.dispatchBookingEvent(form, 'booking:success', response);
    }

    handleBookingError(form, response) {
        // Показываем уведомление об ошибке
        if (window.beautyFitnessApp) {
            window.beautyFitnessApp.showNotification(response.message, 'error');
        }

        // Событие ошибки бронирования
        this.dispatchBookingEvent(form, 'booking:error', response);
    }

    dispatchBookingEvent(form, eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: { form, formId: form.id, ...data }
        });
        document.dispatchEvent(event);
    }

    // Публичные методы
    getFilteredClasses() {
        return this.filteredClasses;
    }

    getClassSchedule(className) {
        const scheduleTable = document.querySelector('.schedule-table');
        if (!scheduleTable) return [];

        const schedule = [];
        const classSlots = scheduleTable.querySelectorAll(`.class-slot[data-class="${className}"]`);
        
        classSlots.forEach(slot => {
            const row = slot.closest('tr');
            const timeSlot = row.querySelector('.time-slot');
            const dayIndex = Array.from(row.children).indexOf(slot);
            const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
            
            schedule.push({
                day: days[dayIndex - 1], // -1 потому что первый столбец - время
                time: timeSlot.textContent
            });
        });

        return schedule;
    }
}

// Инициализация страницы фитнес-классов
let fitnessClassesPage;

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.classes-section')) {
        fitnessClassesPage = new FitnessClassesPage();
    }
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FitnessClassesPage;
} 