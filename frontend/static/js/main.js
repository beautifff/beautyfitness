/**
 * BeautyFitness - Main JavaScript
 * Основной файл для управления интерфейсом и интеграции с backend
 */

class BeautyFitnessApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.setupScrollEffects();
        this.setupAnimations();
    }

    setupEventListeners() {
        // Навигация
        document.addEventListener('DOMContentLoaded', () => {
            this.setupNavigation();
            this.setupSmoothScrolling();
            this.setupFormHandlers();
        });

        // Обработка ошибок
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseError.bind(this));
    }

    setupNavigation() {
        const navbar = document.querySelector('.navbar');
        const navbarToggle = document.getElementById('navbar-toggle');
        const navbarMenu = document.getElementById('navbar-menu');
        const navbarLinks = document.querySelectorAll('.navbar__link');

        // Мобильное меню
        if (navbarToggle && navbarMenu) {
            navbarToggle.addEventListener('click', () => {
                navbarMenu.classList.toggle('navbar__menu--active');
                navbarToggle.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Закрытие меню при клике на ссылку
            navbarLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navbarMenu.classList.remove('navbar__menu--active');
                    navbarToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }

        // Эффект скролла для навигации
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (navbar) {
                if (scrollTop > 100) {
                    navbar.classList.add('navbar--scrolled');
                } else {
                    navbar.classList.remove('navbar--scrolled');
                }
            }

            lastScrollTop = scrollTop;
        });
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupScrollEffects() {
        // Анимация появления элементов при скролле
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Наблюдаем за элементами для анимации
        const animatedElements = document.querySelectorAll('.class-card, .stat-item, .about-section__text, .about-us-section__text');
        animatedElements.forEach(el => observer.observe(el));
    }

    setupAnimations() {
        // Анимация счетчиков
        this.animateCounters();
        
        // Анимация прогресс-баров (если есть)
        this.animateProgressBars();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-item__number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent.replace(/\D/g, ''));
                    const suffix = counter.textContent.replace(/\d/g, '');
                    
                    this.animateCounter(counter, 0, target, suffix);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element, start, end, suffix) {
        const duration = 2000;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * this.easeOutQuart(progress));
            element.textContent = current + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const progress = progressBar.getAttribute('data-progress');
                    
                    progressBar.style.width = progress + '%';
                    progressObserver.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => progressObserver.observe(bar));
    }

    setupFormHandlers() {
        // Обработка формы заявки
        const applicationForm = document.getElementById('application-form');
        if (applicationForm) {
            applicationForm.addEventListener('submit', this.handleApplicationSubmit.bind(this));
        }

        // Валидация форм
        this.setupFormValidation();
    }

    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Удаляем предыдущие ошибки
        this.clearFieldError(field);

        // Проверяем обязательные поля
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Это поле обязательно для заполнения';
        }

        // Проверяем email
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный email адрес';
            }
        }

        // Проверяем телефон
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Введите корректный номер телефона';
            }
        }

        // Показываем ошибку если есть
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--error-color)';
        errorDiv.style.fontSize = 'var(--font-size-sm)';
        errorDiv.style.marginTop = 'var(--spacing-xs)';
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = 'var(--error-color)';
    }

    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '';
    }

    async handleApplicationSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Валидация всех полей
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Пожалуйста, исправьте ошибки в форме', 'error');
            return;
        }

        // Показываем состояние загрузки
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        }

        try {
            // Здесь будет интеграция с backend API
            const response = await this.submitApplication(formData);
            
            if (response.success) {
                this.showNotification('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                form.reset();
                this.closeModal('application-modal');
            } else {
                throw new Error(response.message || 'Ошибка при отправке заявки');
            }
        } catch (error) {
            console.error('Application submission error:', error);
            this.showNotification('Произошла ошибка при отправке заявки. Попробуйте еще раз.', 'error');
        } finally {
            // Восстанавливаем кнопку
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить заявку';
            }
        }
    }

    async submitApplication(formData) {
        // Заглушка для backend интеграции
        // В реальном проекте здесь будет fetch запрос к API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Заявка успешно отправлена'
                });
            }, 2000);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification__close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Добавляем стили
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-tooltip);
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Обработчик закрытия
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });

        // Автоматическое закрытие
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: 'var(--success-color)',
            error: 'var(--error-color)',
            warning: 'var(--warning-color)',
            info: 'var(--info-color)'
        };
        return colors[type] || 'var(--info-color)';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('modal--active');
        }
    }

    initializeComponents() {
        // Инициализация компонентов
        this.initializeTooltips();
        this.initializeLazyLoading();
    }

    initializeTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = e.target.getAttribute('data-tooltip');
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--secondary-color);
                    color: white;
                    padding: var(--spacing-sm) var(--spacing-md);
                    border-radius: var(--border-radius-md);
                    font-size: var(--font-size-sm);
                    z-index: var(--z-tooltip);
                    pointer-events: none;
                    white-space: nowrap;
                `;
                
                document.body.appendChild(tooltip);
                
                const rect = e.target.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            });
            
            element.addEventListener('mouseleave', () => {
                const tooltip = document.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    handleError(error) {
        console.error('Application error:', error);
        this.showNotification('Произошла ошибка в приложении', 'error');
    }

    handlePromiseError(event) {
        console.error('Unhandled promise rejection:', event.reason);
        this.showNotification('Произошла ошибка в приложении', 'error');
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.beautyFitnessApp = new BeautyFitnessApp();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BeautyFitnessApp;
} 