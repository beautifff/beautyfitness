/**
 * Forms Management Module
 * Управление формами и валидация
 */

class FormManager {
    constructor() {
        this.forms = new Map();
        this.init();
    }

    init() {
        this.setupFormHandlers();
        this.setupInputHandlers();
    }

    setupFormHandlers() {
        // Обработка всех форм на странице
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                e.preventDefault();
                this.handleFormSubmit(e.target);
            }
        });

        // Инициализация существующих форм
        document.addEventListener('DOMContentLoaded', () => {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => this.initializeForm(form));
        });
    }

    setupInputHandlers() {
        // Обработка ввода в полях
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.handleInputChange(e.target);
            }
        });

        // Обработка потери фокуса
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.validateField(e.target);
            }
        }, true);

        // Обработка получения фокуса
        document.addEventListener('focus', (e) => {
            if (e.target.matches('input, textarea, select')) {
                this.clearFieldError(e.target);
            }
        }, true);
    }

    initializeForm(form) {
        const formId = form.id || `form-${Date.now()}`;
        const formConfig = this.getFormConfig(form);
        
        this.forms.set(formId, {
            element: form,
            config: formConfig,
            isValid: false,
            fields: new Map()
        });

        // Инициализация полей формы
        const fields = form.querySelectorAll('input, textarea, select');
        fields.forEach(field => this.initializeField(field, formId));

        // Добавляем обработчики для кнопок отправки
        const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
        submitButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }

    initializeField(field, formId) {
        const fieldId = field.id || field.name || `field-${Date.now()}`;
        const fieldConfig = this.getFieldConfig(field);
        
        const formData = this.forms.get(formId);
        if (formData) {
            formData.fields.set(fieldId, {
                element: field,
                config: fieldConfig,
                isValid: false,
                errors: []
            });
        }

        // Добавляем атрибуты для доступности
        if (!field.id) {
            field.id = fieldId;
        }

        // Создаем label если его нет
        this.createLabelIfNeeded(field);
    }

    getFormConfig(form) {
        return {
            validateOnSubmit: form.hasAttribute('data-validate-on-submit'),
            validateOnInput: form.hasAttribute('data-validate-on-input'),
            showErrors: !form.hasAttribute('data-hide-errors'),
            customValidation: form.getAttribute('data-custom-validation'),
            submitHandler: form.getAttribute('data-submit-handler')
        };
    }

    getFieldConfig(field) {
        return {
            required: field.hasAttribute('required'),
            type: field.type || field.tagName.toLowerCase(),
            pattern: field.getAttribute('pattern'),
            minLength: field.getAttribute('minlength'),
            maxLength: field.getAttribute('maxlength'),
            min: field.getAttribute('min'),
            max: field.getAttribute('max'),
            customValidation: field.getAttribute('data-custom-validation'),
            errorMessages: this.parseErrorMessages(field)
        };
    }

    parseErrorMessages(field) {
        const messages = {};
        const dataAttributes = field.getAttributeNames().filter(attr => attr.startsWith('data-error-'));
        
        dataAttributes.forEach(attr => {
            const errorType = attr.replace('data-error-', '');
            messages[errorType] = field.getAttribute(attr);
        });

        return messages;
    }

    createLabelIfNeeded(field) {
        if (field.type === 'hidden' || field.type === 'submit' || field.type === 'button') {
            return;
        }

        const existingLabel = document.querySelector(`label[for="${field.id}"]`);
        if (existingLabel) {
            return;
        }

        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.className = 'form-label';
        
        // Пытаемся найти подходящий текст для label
        const placeholder = field.placeholder;
        const name = field.name;
        
        if (placeholder) {
            label.textContent = placeholder;
        } else if (name) {
            label.textContent = this.capitalizeFirst(name.replace(/[-_]/g, ' '));
        }

        // Вставляем label перед полем
        field.parentNode.insertBefore(label, field);
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    handleInputChange(field) {
        const formId = this.getFormId(field);
        if (!formId) return;

        const formData = this.forms.get(formId);
        if (!formData) return;

        // Валидация при вводе если включена
        if (formData.config.validateOnInput) {
            this.validateField(field);
        }

        // Очистка ошибок при вводе
        this.clearFieldError(field);

        // Обновление состояния формы
        this.updateFormState(formId);
    }

    handleFormSubmit(form) {
        const formId = form.id || this.getFormId(form);
        if (!formId) return;

        const formData = this.forms.get(formId);
        if (!formData) return;

        // Валидация всех полей
        const isValid = this.validateForm(formId);
        
        if (!isValid) {
            this.showFormErrors(formId);
            return false;
        }

        // Отправка формы
        this.submitForm(formId);
        return true;
    }

    validateForm(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return false;

        let isValid = true;
        formData.fields.forEach((fieldData, fieldId) => {
            const fieldIsValid = this.validateField(fieldData.element);
            if (!fieldIsValid) {
                isValid = false;
            }
        });

        formData.isValid = isValid;
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldConfig = this.getFieldConfig(field);
        const errors = [];

        // Проверка обязательности
        if (fieldConfig.required && !value) {
            errors.push(this.getErrorMessage(field, 'required'));
        }

        // Проверка типа поля
        if (value) {
            switch (fieldConfig.type) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        errors.push(this.getErrorMessage(field, 'email'));
                    }
                    break;
                case 'tel':
                    if (!this.isValidPhone(value)) {
                        errors.push(this.getErrorMessage(field, 'phone'));
                    }
                    break;
                case 'url':
                    if (!this.isValidUrl(value)) {
                        errors.push(this.getErrorMessage(field, 'url'));
                    }
                    break;
                case 'number':
                    if (!this.isValidNumber(value, fieldConfig)) {
                        errors.push(this.getErrorMessage(field, 'number'));
                    }
                    break;
            }
        }

        // Проверка длины
        if (value) {
            if (fieldConfig.minLength && value.length < parseInt(fieldConfig.minLength)) {
                errors.push(this.getErrorMessage(field, 'minLength', { min: fieldConfig.minLength }));
            }
            if (fieldConfig.maxLength && value.length > parseInt(fieldConfig.maxLength)) {
                errors.push(this.getErrorMessage(field, 'maxLength', { max: fieldConfig.maxLength }));
            }
        }

        // Проверка паттерна
        if (fieldConfig.pattern && value) {
            const regex = new RegExp(fieldConfig.pattern);
            if (!regex.test(value)) {
                errors.push(this.getErrorMessage(field, 'pattern'));
            }
        }

        // Пользовательская валидация
        if (fieldConfig.customValidation) {
            const customError = this.runCustomValidation(field, fieldConfig.customValidation);
            if (customError) {
                errors.push(customError);
            }
        }

        // Обновляем состояние поля
        const formId = this.getFormId(field);
        if (formId) {
            const formData = this.forms.get(formId);
            if (formData) {
                const fieldId = field.id || field.name;
                const fieldData = formData.fields.get(fieldId);
                if (fieldData) {
                    fieldData.isValid = errors.length === 0;
                    fieldData.errors = errors;
                }
            }
        }

        // Показываем ошибки
        if (errors.length > 0) {
            this.showFieldErrors(field, errors);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }

    getErrorMessage(field, errorType, params = {}) {
        const fieldConfig = this.getFieldConfig(field);
        const customMessage = fieldConfig.errorMessages[errorType];
        
        if (customMessage) {
            return this.interpolateMessage(customMessage, params);
        }

        // Стандартные сообщения
        const defaultMessages = {
            required: 'Это поле обязательно для заполнения',
            email: 'Введите корректный email адрес',
            phone: 'Введите корректный номер телефона',
            url: 'Введите корректный URL',
            number: 'Введите корректное число',
            minLength: `Минимальная длина: ${params.min} символов`,
            maxLength: `Максимальная длина: ${params.max} символов`,
            pattern: 'Значение не соответствует требуемому формату'
        };

        return defaultMessages[errorType] || 'Неверное значение';
    }

    interpolateMessage(message, params) {
        return message.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] || match;
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    isValidNumber(value, config) {
        const num = parseFloat(value);
        if (isNaN(num)) return false;
        
        if (config.min && num < parseFloat(config.min)) return false;
        if (config.max && num > parseFloat(config.max)) return false;
        
        return true;
    }

    runCustomValidation(field, validationName) {
        // Здесь можно добавить пользовательские валидации
        const customValidations = {
            'phone-ua': (value) => {
                const phoneRegex = /^[\+]?380[0-9]{9}$/;
                return phoneRegex.test(value) ? null : 'Введите корректный украинский номер телефона';
            },
            'name': (value) => {
                const nameRegex = /^[а-яёa-z\s-]{2,50}$/i;
                return nameRegex.test(value) ? null : 'Имя должно содержать 2-50 символов';
            }
        };

        const validation = customValidations[validationName];
        if (validation) {
            return validation(field.value);
        }

        return null;
    }

    showFieldErrors(field, errors) {
        this.clearFieldError(field);

        const errorContainer = document.createElement('div');
        errorContainer.className = 'field-errors';
        errorContainer.style.cssText = `
            color: var(--error-color);
            font-size: var(--font-size-sm);
            margin-top: var(--spacing-xs);
        `;

        errors.forEach(error => {
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = error;
            errorContainer.appendChild(errorElement);
        });

        field.parentNode.appendChild(errorContainer);
        field.style.borderColor = 'var(--error-color)';
        field.classList.add('field--error');
    }

    clearFieldError(field) {
        const errorContainer = field.parentNode.querySelector('.field-errors');
        if (errorContainer) {
            errorContainer.remove();
        }
        
        field.style.borderColor = '';
        field.classList.remove('field--error');
    }

    showFormErrors(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return;

        formData.fields.forEach((fieldData, fieldId) => {
            if (!fieldData.isValid && fieldData.errors.length > 0) {
                this.showFieldErrors(fieldData.element, fieldData.errors);
            }
        });
    }

    updateFormState(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return;

        let isValid = true;
        formData.fields.forEach((fieldData, fieldId) => {
            if (!fieldData.isValid) {
                isValid = false;
            }
        });

        formData.isValid = isValid;

        // Обновляем состояние кнопок отправки
        const submitButtons = formData.element.querySelectorAll('button[type="submit"], input[type="submit"]');
        submitButtons.forEach(button => {
            button.disabled = !isValid;
        });
    }

    getFormId(element) {
        const form = element.closest('form');
        return form ? (form.id || form.getAttribute('data-form-id')) : null;
    }

    async submitForm(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return;

        const form = formData.element;
        const formDataObj = new FormData(form);

        // Показываем состояние загрузки
        this.setFormLoading(form, true);

        try {
            // Здесь будет интеграция с backend API
            const response = await this.sendFormData(formDataObj, formId);
            
            if (response.success) {
                this.handleFormSuccess(form, response);
            } else {
                this.handleFormError(form, response);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.handleFormError(form, { message: 'Произошла ошибка при отправке формы' });
        } finally {
            this.setFormLoading(form, false);
        }
    }

    async sendFormData(formData, formId) {
        // Заглушка для backend интеграции
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Форма успешно отправлена'
                });
            }, 2000);
        });
    }

    setFormLoading(form, isLoading) {
        const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
        
        submitButtons.forEach(button => {
            if (isLoading) {
                button.disabled = true;
                button.dataset.originalText = button.textContent;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            } else {
                button.disabled = false;
                if (button.dataset.originalText) {
                    button.textContent = button.dataset.originalText;
                    delete button.dataset.originalText;
                }
            }
        });
    }

    handleFormSuccess(form, response) {
        // Показываем уведомление об успехе
        if (window.beautyFitnessApp) {
            window.beautyFitnessApp.showNotification(response.message || 'Форма успешно отправлена', 'success');
        }

        // Сбрасываем форму
        form.reset();

        // Закрываем модальное окно если форма в модалке
        const modal = form.closest('.modal');
        if (modal && window.modalManager) {
            window.modalManager.hide();
        }

        // Событие успешной отправки
        this.dispatchFormEvent(form, 'form:success', response);
    }

    handleFormError(form, response) {
        // Показываем уведомление об ошибке
        if (window.beautyFitnessApp) {
            window.beautyFitnessApp.showNotification(response.message || 'Ошибка при отправке формы', 'error');
        }

        // Событие ошибки отправки
        this.dispatchFormEvent(form, 'form:error', response);
    }

    dispatchFormEvent(form, eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: { form, formId: form.id, ...data }
        });
        document.dispatchEvent(event);
    }

    // Публичные методы
    validateFormById(formId) {
        return this.validateForm(formId);
    }

    resetForm(formId) {
        const formData = this.forms.get(formId);
        if (formData) {
            formData.element.reset();
            formData.fields.forEach((fieldData, fieldId) => {
                this.clearFieldError(fieldData.element);
            });
        }
    }

    getFormData(formId) {
        const formData = this.forms.get(formId);
        if (!formData) return null;

        const data = {};
        formData.fields.forEach((fieldData, fieldId) => {
            data[fieldId] = fieldData.element.value;
        });
        return data;
    }
}

// Инициализация менеджера форм
let formManager;

document.addEventListener('DOMContentLoaded', () => {
    formManager = new FormManager();
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
 