/**
 * Locations functionality
 * Handles map, location search, and location details
 */

class LocationsManager {
    constructor() {
        this.locations = [];
        this.map = null;
        this.markers = [];
        this.currentLocation = null;
        
        this.init();
    }
    
    init() {
        this.loadLocations();
        this.bindEvents();
        this.initMap();
    }
    
    loadLocations() {
        // В реальном приложении здесь будет загрузка с сервера
        this.locations = [
            {
                id: 'center',
                name: 'BeautyFitness Центр',
                address: 'ул. Крещатик, 15, Киев',
                phone: '+380 44 123 45 67',
                email: 'center@beautyfitness.com',
                hours: 'Пн-Вс: 06:00 - 23:00',
                coordinates: { lat: 50.4501, lng: 30.5234 },
                features: ['Парковка', 'Душ', 'Сауна', 'Детская комната', 'Wi-Fi', 'Кафе'],
                description: 'Наш главный клуб в центре города с полным набором услуг и современным оборудованием.',
                image: 'img/1.jpg',
                status: 'open',
                capacity: 200,
                trainers: 15,
                classes: 25
            },
            {
                id: 'podil',
                name: 'BeautyFitness Подол',
                address: 'ул. Нижний Вал, 25, Киев',
                phone: '+380 44 234 56 78',
                email: 'podil@beautyfitness.com',
                hours: 'Пн-Вс: 07:00 - 22:00',
                coordinates: { lat: 50.4640, lng: 30.5190 },
                features: ['Парковка', 'Бассейн', 'SPA', 'Кафе', 'Массаж', 'Солярий'],
                description: 'Уютный клуб в историческом районе Подол с бассейном и SPA-зоной.',
                image: 'img/2.jpg',
                status: 'open',
                capacity: 150,
                trainers: 12,
                classes: 20
            },
            {
                id: 'pechersk',
                name: 'BeautyFitness Печерск',
                address: 'ул. Институтская, 42, Киев',
                phone: '+380 44 345 67 89',
                email: 'pechersk@beautyfitness.com',
                hours: 'Пн-Вс: 06:00 - 24:00',
                coordinates: { lat: 50.4433, lng: 30.5367 },
                features: ['VIP зона', 'Персональные тренеры', 'Анализ тела', 'Консультации', 'Парковка'],
                description: 'Премиум клуб с VIP-зоной и индивидуальным подходом к каждому клиенту.',
                image: 'img/3.jpg',
                status: 'open',
                capacity: 100,
                trainers: 8,
                classes: 15
            },
            {
                id: 'obolon',
                name: 'BeautyFitness Оболонь',
                address: 'пр. Героев Сталинграда, 18, Киев',
                phone: '+380 44 456 78 90',
                email: 'obolon@beautyfitness.com',
                hours: 'Пн-Вс: 06:00 - 23:00',
                coordinates: { lat: 50.5030, lng: 30.4980 },
                features: ['Большая парковка', 'Групповые занятия', 'Детский фитнес', 'Магазин', 'Кафе'],
                description: 'Семейный клуб с большим выбором групповых занятий и детским фитнесом.',
                image: 'img/4.jpg',
                status: 'open',
                capacity: 300,
                trainers: 20,
                classes: 35
            }
        ];
    }
    
    bindEvents() {
        // Поиск адреса
        const searchBtn = document.getElementById('search-btn');
        const addressInput = document.getElementById('address-input');
        
        if (searchBtn && addressInput) {
            searchBtn.addEventListener('click', () => {
                this.searchNearestLocation(addressInput.value);
            });
            
            addressInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchNearestLocation(addressInput.value);
                }
            });
        }
        
        // Загрузка карты
        const loadMapBtn = document.getElementById('load-map-btn');
        if (loadMapBtn) {
            loadMapBtn.addEventListener('click', () => {
                this.loadMap();
            });
        }
        
        // Модальные окна локаций
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-modal="location-modal"]')) {
                const locationId = e.target.getAttribute('data-location');
                this.showLocationModal(locationId);
            }
        });
        
        // Форма контактов
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit(e.target);
            });
        }
    }
    
    initMap() {
        // Заглушка для карты - в реальном приложении здесь будет Google Maps или Leaflet
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;
        
        // Показываем плейсхолдер
        this.showMapPlaceholder();
    }
    
    showMapPlaceholder() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;
        
        mapContainer.innerHTML = `
            <div class="map-overlay">
                <i class="fas fa-map-marked-alt"></i>
                <h3>Интерактивная карта</h3>
                <p>Здесь будет отображаться карта с нашими клубами</p>
                <button class="btn btn--primary" id="load-map-btn">
                    <i class="fas fa-map"></i>
                    Загрузить карту
                </button>
            </div>
        `;
    }
    
    loadMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;
        
        // Имитация загрузки карты
        mapContainer.innerHTML = `
            <div class="map-loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Загрузка карты...</p>
            </div>
        `;
        
        setTimeout(() => {
            this.renderMap();
        }, 2000);
    }
    
    renderMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;
        
        // Создаем интерактивную карту с маркерами
        mapContainer.innerHTML = `
            <div class="map-interactive">
                <div class="map-controls">
                    <button class="map-control" id="zoom-in">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="map-control" id="zoom-out">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="map-control" id="my-location">
                        <i class="fas fa-crosshairs"></i>
                    </button>
                </div>
                <div class="map-markers">
                    ${this.locations.map(location => `
                        <div class="map-marker" data-location="${location.id}" style="left: ${this.getRandomPosition().x}%; top: ${this.getRandomPosition().y}%;">
                            <i class="fas fa-map-marker-alt"></i>
                            <div class="marker-tooltip">
                                <strong>${location.name}</strong>
                                <span>${location.address}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Добавляем обработчики для маркеров
        const markers = mapContainer.querySelectorAll('.map-marker');
        markers.forEach(marker => {
            marker.addEventListener('click', () => {
                const locationId = marker.getAttribute('data-location');
                this.showLocationModal(locationId);
            });
        });
        
        // Обработчики для контролов карты
        const zoomIn = document.getElementById('zoom-in');
        const zoomOut = document.getElementById('zoom-out');
        const myLocation = document.getElementById('my-location');
        
        if (zoomIn) zoomIn.addEventListener('click', () => this.zoomMap('in'));
        if (zoomOut) zoomOut.addEventListener('click', () => this.zoomMap('out'));
        if (myLocation) myLocation.addEventListener('click', () => this.getMyLocation());
    }
    
    getRandomPosition() {
        return {
            x: 20 + Math.random() * 60,
            y: 20 + Math.random() * 60
        };
    }
    
    zoomMap(direction) {
        console.log(`Zoom ${direction}`);
        // В реальном приложении здесь будет логика зума карты
    }
    
    getMyLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.searchNearestLocationByCoords(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    this.showNotification('Не удалось определить ваше местоположение', 'error');
                }
            );
        } else {
            this.showNotification('Геолокация не поддерживается вашим браузером', 'error');
        }
    }
    
    searchNearestLocation(address) {
        if (!address.trim()) {
            this.showNotification('Пожалуйста, введите адрес', 'error');
            return;
        }
        
        // Имитация поиска
        const nearestLocation = this.findNearestLocation(address);
        this.updateNearestLocationDisplay(nearestLocation);
        
        this.showNotification(`Найден ближайший клуб: ${nearestLocation.name}`, 'success');
    }
    
    searchNearestLocationByCoords(lat, lng) {
        // Имитация поиска по координатам
        const nearestLocation = this.findNearestLocationByCoords(lat, lng);
        this.updateNearestLocationDisplay(nearestLocation);
        
        this.showNotification(`Найден ближайший клуб: ${nearestLocation.name}`, 'success');
    }
    
    findNearestLocation(address) {
        // Простая логика поиска - в реальном приложении здесь будет геокодирование
        const searchTerm = address.toLowerCase();
        
        // Ищем по ключевым словам
        if (searchTerm.includes('центр') || searchTerm.includes('крещатик')) {
            return this.locations.find(loc => loc.id === 'center');
        } else if (searchTerm.includes('подол') || searchTerm.includes('нижний вал')) {
            return this.locations.find(loc => loc.id === 'podil');
        } else if (searchTerm.includes('печерск') || searchTerm.includes('институтская')) {
            return this.locations.find(loc => loc.id === 'pechersk');
        } else if (searchTerm.includes('оболонь') || searchTerm.includes('героев')) {
            return this.locations.find(loc => loc.id === 'obolon');
        }
        
        // По умолчанию возвращаем центр
        return this.locations.find(loc => loc.id === 'center');
    }
    
    findNearestLocationByCoords(lat, lng) {
        // Простая логика поиска по координатам
        // В реальном приложении здесь будет расчет расстояний
        return this.locations[0];
    }
    
    updateNearestLocationDisplay(location) {
        const nearestLocation = document.getElementById('nearest-location');
        if (!nearestLocation) return;
        
        nearestLocation.innerHTML = `
            <h4>Ближайший клуб</h4>
            <div class="location-info">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong>${location.name}</strong>
                    <span>${location.address}</span>
                    <span class="location-distance">~2.5 км от вас</span>
                </div>
            </div>
            <div class="location-actions">
                <button class="btn btn--primary btn--small" onclick="getDirections('${location.id}')">
                    <i class="fas fa-route"></i>
                    Построить маршрут
                </button>
            </div>
        `;
    }
    
    showLocationModal(locationId) {
        const location = this.locations.find(loc => loc.id === locationId);
        if (!location) return;
        
        const modal = document.getElementById('location-modal');
        const details = document.getElementById('location-details');
        
        if (!modal || !details) return;
        
        details.innerHTML = `
            <div class="location-modal-content">
                <div class="location-modal-image">
                    <img src="${location.image}" alt="${location.name}">
                </div>
                <div class="location-modal-info">
                    <h3>${location.name}</h3>
                    <p class="location-description">${location.description}</p>
                    
                    <div class="location-details-grid">
                        <div class="detail-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <strong>Адрес</strong>
                                <span>${location.address}</span>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-phone"></i>
                            <div>
                                <strong>Телефон</strong>
                                <span>${location.phone}</span>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <strong>Email</strong>
                                <span>${location.email}</span>
                            </div>
                        </div>
                        
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong>Часы работы</strong>
                                <span>${location.hours}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="location-stats">
                        <div class="stat-item">
                            <span class="stat-number">${location.capacity}</span>
                            <span class="stat-label">Вместимость</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${location.trainers}</span>
                            <span class="stat-label">Тренеров</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">${location.classes}</span>
                            <span class="stat-label">Классов</span>
                        </div>
                    </div>
                    
                    <div class="location-features">
                        <h4>Услуги и удобства</h4>
                        <div class="features-grid">
                            ${location.features.map(feature => `
                                <span class="feature-tag">${feature}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="location-actions">
                        <button class="btn btn--primary" onclick="getDirections('${location.id}')">
                            <i class="fas fa-route"></i>
                            Построить маршрут
                        </button>
                        <button class="btn btn--outline" onclick="callLocation('${location.phone}')">
                            <i class="fas fa-phone"></i>
                            Позвонить
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Показываем модальное окно
        modal.classList.add('modal--show');
        
        // Обработчик закрытия
        const closeBtn = modal.querySelector('.modal__close');
        const overlay = modal.querySelector('.modal__overlay');
        
        const closeModal = () => {
            modal.classList.remove('modal--show');
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (overlay) overlay.addEventListener('click', closeModal);
    }
    
    handleContactSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Валидация
        if (!data.name || !data.email || !data.message) {
            this.showNotification('Пожалуйста, заполните все обязательные поля', 'error');
            return;
        }
        
        if (!this.isValidEmail(data.email)) {
            this.showNotification('Пожалуйста, введите корректный email адрес', 'error');
            return;
        }
        
        // Имитация отправки
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            this.showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification__close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Добавляем в DOM
        document.body.appendChild(notification);
        
        // Показываем с анимацией
        setTimeout(() => {
            notification.classList.add('notification--show');
        }, 100);
        
        // Автоматически скрываем через 5 секунд
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
        
        // Обработчик закрытия
        const closeBtn = notification.querySelector('.notification__close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });
    }
    
    hideNotification(notification) {
        notification.classList.remove('notification--show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Глобальные функции для кнопок
window.getDirections = function(locationId) {
    const location = window.locationsManager.locations.find(loc => loc.id === locationId);
    if (location) {
        // В реальном приложении здесь будет открытие карт с маршрутом
        const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;
        window.open(url, '_blank');
    }
};

window.callLocation = function(phone) {
    window.location.href = `tel:${phone}`;
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.locationsManager = new LocationsManager();
}); 