import React from 'react';
import '../css/style.css';
import '../css/components.css';
import '../css/responsive.css';

function App() {
  return (
    <>
      {/* Здесь будет твоя большая разметка сайта, адаптированная под JSX */}
      <div className="container">
        <header className="header" id="header">
          <nav className="navbar">
            <div className="navbar__content">
              <a href="index.html" className="navbar__logo">
                <span className="navbar__logo-text">Beauty</span>Fitness
              </a>
              <div className="navbar__menu" id="navbar-menu">
                <ul className="navbar__list">
                  <li className="navbar__item">
                    <a href="index.html" className="navbar__link navbar__link--active">Главная</a>
                  </li>
                  <li className="navbar__item">
                    <a href="fitness-classes.html" className="navbar__link">Фитнес классы</a>
                  </li>
                  <li className="navbar__item">
                    <a href="personal-training.html" className="navbar__link">Персональные тренировки</a>
                  </li>
                  <li className="navbar__item">
                    <a href="blog.html" className="navbar__link">Блог</a>
                  </li>
                  <li className="navbar__item">
                    <a href="locations.html" className="navbar__link">Локации</a>
                  </li>
                </ul>
              </div>
              <div className="navbar__actions">
                <button className="btn btn--primary" id="apply-btn">Подать заявку</button>
                <button className="navbar__toggle" id="navbar-toggle">
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
              </div>
            </div>
          </nav>
        </header>
        {/* ...дальше основная разметка сайта, секции, футер и т.д. ... */}
        <main className="main">
          <section className="section about-section" id="about">
            <div className="about-section__content">
              <div className="about-section__text">
                <h2 className="section__title">
                  BeautyFitness - <span className="section__title-accent">Здоровье и Спорт</span>
                </h2>
                <div className="about-section__description">
                  <p>Мы создаем пространство, где каждый может найти свой путь к здоровью и красоте. Наша миссия - помочь вам достичь ваших фитнес-целей в комфортной и поддерживающей атмосфере.</p>
                  <p>С профессиональными тренерами, современным оборудованием и разнообразными программами тренировок, мы делаем фитнес доступным и приятным для всех уровней подготовки.</p>
                  <p>Присоединяйтесь к нашему сообществу и откройте для себя новый уровень здоровья, энергии и уверенности в себе.</p>
                </div>
              </div>
              <div className="about-section__image">
                <img src="img/1.jpg" alt="Тренировка в BeautyFitness" className="about-section__img" />
              </div>
            </div>
          </section>
          {/* ...другие секции сайта... */}
        </main>
        <footer className="footer">
          <div className="footer__content">
            <div className="footer__section">
              <div className="footer__brand">
                <h3 className="footer__logo">
                  <span className="footer__logo-text">Beauty</span>Fitness
                </h3>
                <p className="footer__description">Ваш путь к здоровью и красоте начинается здесь</p>
              </div>
            </div>
            <div className="footer__section">
              <h4 className="footer__title">Навигация</h4>
              <ul className="footer__list">
                <li><a href="index.html" className="footer__link">Главная</a></li>
                <li><a href="fitness-classes.html" className="footer__link">Фитнес классы</a></li>
                <li><a href="personal-training.html" className="footer__link">Персональные тренировки</a></li>
                <li><a href="blog.html" className="footer__link">Блог</a></li>
                <li><a href="locations.html" className="footer__link">Локации</a></li>
              </ul>
            </div>
            <div className="footer__section">
              <h4 className="footer__title">Поддержка</h4>
              <ul className="footer__list">
                <li><a href="#" className="footer__link">FAQ</a></li>
                <li><a href="#" className="footer__link">Контакты</a></li>
                <li><a href="#" className="footer__link">Карьера</a></li>
                <li><a href="#" className="footer__link">Сообщество</a></li>
              </ul>
            </div>
            <div className="footer__section">
              <h4 className="footer__title">Контакты</h4>
              <div className="footer__contacts">
                <div className="contact-item">
                  <span>+380 66 567 10 18</span>
                </div>
                <div className="contact-item">
                  <span>info@beautyfitness.com</span>
                </div>
                <div className="contact-item">
                  <span>Киев, Украина</span>
                </div>
              </div>
              <div className="footer__social">
                <h5 className="footer__social-title">Мы в соцсетях</h5>
                <div className="social-links">
                  <a href="#" className="social-link" aria-label="Facebook">FB</a>
                  <a href="#" className="social-link" aria-label="Instagram">IG</a>
                  <a href="#" className="social-link" aria-label="Twitter">TW</a>
                  <a href="#" className="social-link" aria-label="YouTube">YT</a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer__bottom">
            <div className="footer__copyright">
              <p>&copy; 2024 BeautyFitness. Все права защищены.</p>
            </div>
            <div className="footer__legal">
              <a href="#" className="footer__link">Политика конфиденциальности</a>
              <a href="#" className="footer__link">Условия использования</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App; 