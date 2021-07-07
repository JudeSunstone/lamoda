'use strict';
const headerCityButton = document.querySelector('.header__city-button'); // ПОЧЕМУ НЕ getElement..

if(localStorage.getItem('lomoda-location')) {
    headerCityButton.textContent = localStorage.getItem('lomoda-location');
}
// если мы получили данные, то сохранить их и использовать,
//чтобы город оставался тот же после перезагрузки
//ПОЧЕМУ ТАК???
//переделанный if  ниже в строку и сверху можно удалить 
headerCityButton.textContent = localStorage.getItem('lomoda-location') || 'Ваш город';


headerCityButton.addEventListener('click', () => { 
    // tесли аргумент внтури стрелочной функции один, то скобки можно убрать
    const city = prompt('Укажите ваш город');
    headerCityButton.textContent = city;
    //добавить local storage чтобы хранить там после обновление вводенные данные
    localStorage.setItem('lomoda-location', city);
});

//убираем скролл страницы при открытом модальном окне

const disableScroll = () => {
    
    const widthScroll = window.innerWidth - document.body.offsetWidth; //offset - без скролла, получаем разницу
    
    document.body.dbScrollY = window.scrollY;
    //первые 3 строки чтобы кроссбраузерн ничего не прыгало оосбенно в айфоне
    document.body.style.cssText = ` 
         position: fixed;
         top: ${-window.scrollY}px;
         left = 0;
         width: 100%;
         height: 100vh;
        overflow: hidden;
        padding-right: ${widthScroll}px; 
    `; 
    // так страница не будет прыгать 

    //  можно делать только строкой снизу, но есть некоторые баги в виде двига документа немного
    //document.body.style.overflow = 'hidden'; 
    
};
const enableScroll = () => {
    //document.body.style.overflow = '';
    document.body.style.cssText = '';
    window.scroll({
           // top: '200' //px не надо
            top: document.body.dbScrollY,
    });
};
//реюзабельно!




//модальное окно
// при клике на корзину должно открываться модальное окно

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverLay = document.querySelector('.cart-overlay');


const cartModalOpen = () => {
    cartOverLay.classList.add('cart-overlay-open');//здесь точку ставить не надо перед. adding classes for modal
    // промотка отключается
    disableScroll();
};

const cartModalClose = () => {
    cartOverLay.classList.remove('cart-overlay-open');
    enableScroll(); // врзврвщаем скролл на страницу после закрытия
}; 

subheaderCart.addEventListener('click', cartModalOpen);
//закрываем окно, делегируем - отвечает за все cartOverLay
cartOverLay.addEventListener('click', event => { // соаздается каждый раз, но мы не используем, когда не нужен
//здесь нужен чтобы определить по какому желемнту произошел клик
    // чтобы псомтреть console.log(event) там покажут target - где клинкуто
    // куда именно кликнуто и тд
    const target = event.target;

    if (target.classList.contains('cart__btn-close') || target.classList.contains('cart-overlay'))  {
        // вместо сonnatins может быть matches (.cart__btn-close) - тогда calssList не надо
        cartModalClose();
    }
});
