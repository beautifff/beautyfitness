/**
 * Modal Management Module
 * Управление модальными окнами
 */

class ModalManager {
    constructor() {
        this.activeModal = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardHandlers();
    }

    setupEventListeners() {
        // Открытие модальных окон
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-modal]');
            if (trigger) {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                this.openModal(modalId);
            }
        });

        // Закрытие модальных окон
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__overlay') || 
                e.target.classList.contains('modal__close') ||
                e.target.closest('.modal__close')) {
                e.preventDefault();
                this.closeActiveModal();
            }
        });

        // Предотвращение закрытия при клике на контент
        document.addEventListener('click', (e) => {
            if (e.target.closest('.modal__content')) {
                e.stopPropagation();
            }
        });
    }

    setupKeyboardHandlers() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeActiveModal();
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with id "${modalId}" not found`);
            return;
        }

        // Закрываем предыдущее модальное окно если есть
        if (this.activeModal) {
            this.closeModal(this.activeModal);
        }

        // Показываем новое модальное окно
        modal.classList.add('modal--active');
        this.activeModal = modal;

        // Блокируем скролл на body
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = this.getScrollbarWidth() + 'px';

        // Фокус на первый инпут или кнопку закрытия
        this.focusFirstElement(modal);

        // Анимация появления
        this.animateModalIn(modal);

        // Событие открытия
        this.dispatchModalEvent(modal, 'modal:opened');
    }

    closeModal(modal) {
        if (!modal) return;

        // Анимация закрытия
        this.animateModalOut(modal, () => {
            modal.classList.remove('modal--active');
            this.activeModal = null;

            // Восстанавливаем скролл
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';

            // Событие закрытия
            this.dispatchModalEvent(modal, 'modal:closed');
        });
    }

    closeActiveModal() {
        if (this.activeModal) {
            this.closeModal(this.activeModal);
        }
    }

    animateModalIn(modal) {
        const content = modal.querySelector('.modal__content');
        if (content) {
            content.style.transform = 'translateY(-20px) scale(0.95)';
            content.style.opacity = '0';
            
            requestAnimationFrame(() => {
                content.style.transition = 'all 0.3s ease-out';
                content.style.transform = 'translateY(0) scale(1)';
                content.style.opacity = '1';
            });
        }
    }

    animateModalOut(modal, callback) {
        const content = modal.querySelector('.modal__content');
        if (content) {
            content.style.transition = 'all 0.2s ease-in';
            content.style.transform = 'translateY(-20px) scale(0.95)';
            content.style.opacity = '0';
            
            setTimeout(callback, 200);
        } else {
            callback();
        }
    }

    focusFirstElement(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    getScrollbarWidth() {
        const outer = document.createElement('div');
        outer.style.visibility = 'hidden';
        outer.style.overflow = 'scroll';
        document.body.appendChild(outer);

        const inner = document.createElement('div');
        outer.appendChild(inner);

        const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
        outer.parentNode.removeChild(outer);

        return scrollbarWidth;
    }

    dispatchModalEvent(modal, eventName) {
        const event = new CustomEvent(eventName, {
            detail: { modal, modalId: modal.id }
        });
        document.dispatchEvent(event);
    }

    // Публичные методы для внешнего использования
    show(modalId) {
        this.openModal(modalId);
    }

    hide() {
        this.closeActiveModal();
    }

    isOpen() {
        return this.activeModal !== null;
    }

    getActiveModal() {
        return this.activeModal;
    }
}

// Инициализация менеджера модальных окон
let modalManager;

document.addEventListener('DOMContentLoaded', () => {
    modalManager = new ModalManager();
    
    // Глобальные обработчики для кнопок заявки
    const applyButtons = document.querySelectorAll('#apply-btn, #hero-apply-btn');
    applyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            modalManager.show('application-modal');
        });
    });
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalManager;
} 