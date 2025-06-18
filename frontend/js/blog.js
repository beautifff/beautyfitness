/**
 * Blog functionality
 * Handles filtering, sorting, and pagination for blog articles
 */

class BlogManager {
    constructor() {
        this.articles = [];
        this.filteredArticles = [];
        this.currentPage = 1;
        this.articlesPerPage = 6;
        this.currentCategory = '';
        this.currentSort = 'latest';
        
        this.init();
    }
    
    init() {
        this.loadArticles();
        this.bindEvents();
        this.renderArticles();
    }
    
    loadArticles() {
        // В реальном приложении здесь будет загрузка с сервера
        this.articles = [
            {
                id: 1,
                title: 'Как начать свой фитнес-путь: полное руководство для начинающих',
                excerpt: 'Начать заниматься фитнесом может быть непросто, особенно если вы никогда раньше не тренировались. В этой статье мы расскажем о том, как правильно начать свой путь к здоровью и красоте, избежав типичных ошибок новичков.',
                category: 'fitness',
                date: '2024-04-25',
                readTime: 12,
                views: 2847,
                comments: 23,
                likes: 156,
                image: 'img/21.jpg',
                featured: true
            },
            {
                id: 2,
                title: 'Правильное питание для набора мышечной массы',
                excerpt: 'Узнайте, как правильно питаться для эффективного набора мышечной массы. Советы по выбору продуктов, расчету калорий и времени приема пищи.',
                category: 'nutrition',
                date: '2024-04-20',
                readTime: 8,
                views: 1234,
                comments: 15,
                likes: 89,
                image: 'img/22.jpg',
                featured: false
            },
            {
                id: 3,
                title: 'Влияние сна на результаты тренировок',
                excerpt: 'Качественный сон - важнейший фактор для достижения фитнес-целей. Разбираем, как сон влияет на восстановление, рост мышц и общую производительность.',
                category: 'health',
                date: '2024-04-18',
                readTime: 6,
                views: 987,
                comments: 8,
                likes: 67,
                image: 'img/23.jpg',
                featured: false
            },
            {
                id: 4,
                title: 'Как сохранить мотивацию в долгосрочной перспективе',
                excerpt: 'Мотивация - ключ к успеху в фитнесе. Узнайте эффективные стратегии для поддержания энтузиазма и достижения долгосрочных целей.',
                category: 'motivation',
                date: '2024-04-15',
                readTime: 10,
                views: 1567,
                comments: 12,
                likes: 134,
                image: 'img/24.jpg',
                featured: false
            },
            {
                id: 5,
                title: '5 ошибок новичков в тренажерном зале',
                excerpt: 'Избегайте типичных ошибок, которые совершают начинающие спортсмены. Советы по технике безопасности и эффективности тренировок.',
                category: 'tips',
                date: '2024-04-12',
                readTime: 7,
                views: 2134,
                comments: 18,
                likes: 178,
                image: 'img/25.jpg',
                featured: false
            },
            {
                id: 6,
                title: 'Кардио vs силовые тренировки: что выбрать?',
                excerpt: 'Разбираем различия между кардио и силовыми тренировками, их влияние на организм и как правильно комбинировать оба типа нагрузок.',
                category: 'fitness',
                date: '2024-04-10',
                readTime: 9,
                views: 1789,
                comments: 14,
                likes: 145,
                image: 'img/26.jpg',
                featured: false
            },
            {
                id: 7,
                title: 'Протеиновые коктейли: мифы и реальность',
                excerpt: 'Развеиваем мифы о протеиновых добавках и рассказываем, когда и как их правильно использовать для достижения целей.',
                category: 'nutrition',
                date: '2024-04-08',
                readTime: 5,
                views: 1456,
                comments: 9,
                likes: 98,
                image: 'img/27.jpg',
                featured: false
            }
        ];
        
        this.filteredArticles = [...this.articles];
    }
    
    bindEvents() {
        // Фильтры
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');
        const clearFiltersBtn = document.getElementById('clear-filters');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.applyFilters();
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }
        
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
        
        // Пагинация
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination__page')) {
                const page = parseInt(e.target.textContent);
                this.goToPage(page);
            }
            
            if (e.target.classList.contains('pagination__btn--prev')) {
                this.previousPage();
            }
            
            if (e.target.classList.contains('pagination__btn--next')) {
                this.nextPage();
            }
        });
        
        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(e.target);
            });
        }
    }
    
    applyFilters() {
        let filtered = [...this.articles];
        
        // Фильтр по категории
        if (this.currentCategory) {
            filtered = filtered.filter(article => article.category === this.currentCategory);
        }
        
        // Сортировка
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'latest':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'popular':
                    return b.views - a.views;
                default:
                    return 0;
            }
        });
        
        this.filteredArticles = filtered;
        this.currentPage = 1;
        this.renderArticles();
        this.updateFiltersUI();
    }
    
    clearFilters() {
        this.currentCategory = '';
        this.currentSort = 'latest';
        
        const categoryFilter = document.getElementById('category-filter');
        const sortFilter = document.getElementById('sort-filter');
        
        if (categoryFilter) categoryFilter.value = '';
        if (sortFilter) sortFilter.value = 'latest';
        
        this.filteredArticles = [...this.articles];
        this.currentPage = 1;
        this.renderArticles();
        this.updateFiltersUI();
    }
    
    updateFiltersUI() {
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            const hasActiveFilters = this.currentCategory || this.currentSort !== 'latest';
            clearFiltersBtn.style.display = hasActiveFilters ? 'block' : 'none';
        }
    }
    
    renderArticles() {
        const blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;
        
        const startIndex = (this.currentPage - 1) * this.articlesPerPage;
        const endIndex = startIndex + this.articlesPerPage;
        const articlesToShow = this.filteredArticles.slice(startIndex, endIndex);
        
        // Очищаем сетку
        blogGrid.innerHTML = '';
        
        // Рендерим статьи
        articlesToShow.forEach(article => {
            if (!article.featured) {
                const articleElement = this.createArticleElement(article);
                blogGrid.appendChild(articleElement);
            }
        });
        
        this.renderPagination();
        this.updateEmptyState();
    }
    
    createArticleElement(article) {
        const articleElement = document.createElement('article');
        articleElement.className = 'blog-card';
        articleElement.setAttribute('data-category', article.category);
        articleElement.setAttribute('data-date', article.date);
        
        const categoryLabels = {
            'fitness': 'Фитнес',
            'nutrition': 'Питание',
            'health': 'Здоровье',
            'motivation': 'Мотивация',
            'tips': 'Советы'
        };
        
        articleElement.innerHTML = `
            <div class="blog-card__image">
                <img src="${article.image}" alt="${article.title}" class="blog-card__img">
                <div class="blog-card__category">${categoryLabels[article.category] || article.category}</div>
            </div>
            <div class="blog-card__content">
                <div class="article-meta">
                    <span class="article-date">${this.formatDate(article.date)}</span>
                    <span class="article-read-time">
                        <i class="fas fa-clock"></i>
                        ${article.readTime} мин
                    </span>
                </div>
                <h3 class="blog-card__title">${article.title}</h3>
                <p class="blog-card__excerpt">${article.excerpt}</p>
                <div class="blog-card__stats">
                    <span class="article-stat">
                        <i class="fas fa-eye"></i>
                        ${this.formatNumber(article.views)}
                    </span>
                    <span class="article-stat">
                        <i class="fas fa-heart"></i>
                        ${this.formatNumber(article.likes)}
                    </span>
                </div>
                <a href="#" class="blog-card__link" data-article-id="${article.id}">
                    Читать далее
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        
        return articleElement;
    }
    
    renderPagination() {
        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        const paginationContainer = document.querySelector('.pagination');
        
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) {
                paginationContainer.style.display = 'none';
            }
            return;
        }
        
        paginationContainer.style.display = 'flex';
        
        const prevBtn = paginationContainer.querySelector('.pagination__btn--prev');
        const nextBtn = paginationContainer.querySelector('.pagination__btn--next');
        const pagesContainer = paginationContainer.querySelector('.pagination__pages');
        
        // Обновляем кнопки prev/next
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }
        
        // Обновляем страницы
        if (pagesContainer) {
            pagesContainer.innerHTML = '';
            
            const maxVisiblePages = 5;
            let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            // Первая страница
            if (startPage > 1) {
                const firstPage = document.createElement('button');
                firstPage.className = 'pagination__page';
                firstPage.textContent = '1';
                pagesContainer.appendChild(firstPage);
                
                if (startPage > 2) {
                    const dots = document.createElement('span');
                    dots.className = 'pagination__dots';
                    dots.textContent = '...';
                    pagesContainer.appendChild(dots);
                }
            }
            
            // Видимые страницы
            for (let i = startPage; i <= endPage; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = 'pagination__page';
                if (i === this.currentPage) {
                    pageBtn.classList.add('pagination__page--active');
                }
                pageBtn.textContent = i;
                pagesContainer.appendChild(pageBtn);
            }
            
            // Последняя страница
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    const dots = document.createElement('span');
                    dots.className = 'pagination__dots';
                    dots.textContent = '...';
                    pagesContainer.appendChild(dots);
                }
                
                const lastPage = document.createElement('button');
                lastPage.className = 'pagination__page';
                lastPage.textContent = totalPages;
                pagesContainer.appendChild(lastPage);
            }
        }
    }
    
    updateEmptyState() {
        const blogGrid = document.getElementById('blog-grid');
        if (!blogGrid) return;
        
        if (this.filteredArticles.length === 0) {
            blogGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>Статьи не найдены</h3>
                    <p>Попробуйте изменить фильтры или поисковый запрос</p>
                    <button class="btn btn--primary" onclick="blogManager.clearFilters()">
                        Сбросить фильтры
                    </button>
                </div>
            `;
        }
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.renderArticles();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }
    
    nextPage() {
        const totalPages = Math.ceil(this.filteredArticles.length / this.articlesPerPage);
        if (this.currentPage < totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    }
    
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }
    
    handleNewsletterSubmit(form) {
        const email = form.querySelector('input[type="email"]').value;
        
        // Валидация email
        if (!this.isValidEmail(email)) {
            this.showNotification('Пожалуйста, введите корректный email адрес', 'error');
            return;
        }
        
        // Имитация отправки
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            this.showNotification('Спасибо! Вы успешно подписались на обновления', 'success');
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

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.blogManager = new BlogManager();
}); 