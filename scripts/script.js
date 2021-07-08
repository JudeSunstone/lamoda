'use strict';
const headerCityButton = document.querySelector('.header__city-button'); // ПОЧЕМУ НЕ getElement..

let hash = location.hash.substring(1); // location - объект, есть и хэш.
// сабстринг - удаляем решетку - хэш еред значением, которое будем потом использовать 

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

//*тут были addEventListener, переносим их вниз*


// db.json - обычно, конечно, база данных не с формате json, но ее данные преобразованы в этот формат
// данные в виде строк, объектов и т.д - одна больашя строка

// чтобы получить данные с сервера

//async обязательно перед function
const getData = async () => {
    const data = await fetch('db.json'); // await не дает делать присваивание пока fetch не вернет данные
// без await возвращает promise , response нет. если данные запрашиваются медленно, то будет невозможно их увидеть 
    if (data.ok) { // 200 - статус от сервера, готова
        return data.json();// в виде строки
    } else {
        throw new Error(`Данные не были получены. Ошибка ${data.status} ${data.statusText}`); // выкидываем ошибку, 
        //которую сами и сделали
        // прикладываем в статусе ее данные также
    }


};
// запрашивает данные с сервера, универсально
getData()
    .then(data => {
        console.log(data);
    })//, err => {
        //console.error(err); } // then метод может 2 аргумента принять, на второй коллбэк ф-и 
        // выводи ошибку при помощи консоли
        // здесь можем вывести сообщение пользователю, можем попробовать перезапутстить функцию 
        //и отправить через запасной сервис 
        // и без сообщения, например, чтобы все-таки полчить результат
        // можно не пользоваться этим, а вообще 
        // после then нельзя ;
    .catch(err => {
        console.error(err); 
    });
// then это функ-я которая обрабатывает метод, который содержится у промисов, 
//вызовет коллбэк, когда будет выполнена ф-уя гетдата

// для нашего варианта: 
const getGoods = (callback, value) => {
    getData()
        .then(data => {
            if (value) {
                callback(data.filter(item => item.category === value));
            } else {
                 callback(data);
            }
           
        })
        .catch(err => {
            console.error(err); 
        });
};
 /*getGoods(() => {
    console.warn(data); // warn желтым цветом 
}); */ 

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

// надо записать скрипт, чтобы он работал только на страницу goods а не везде

try { // если этот блок ловит ошибку, то работает следующий 
    const goodsList = document.querySelector('.goods__list');
    if (!goodsList) { //меняет тру на фолс
        throw 'this is not a goods page'; //исключение
    }

    // работаем с базой данных

    const createCard = data => {

        /*const id = data.id;
        const prewiev = data.prewiev;
        const cost = data.cost;
        const brand = data.brand;
        const name =data.name;
        const sizes = data.sizes; // вытащили из описания объекта*/
        // это можно сделать деструктуризацией 
     const {id, preview, cost, brand, name, sizes} = data;

     // это тоже можно упростить
     // const createCard = ({id, preview, cost, brand, name, sizes}) => {... и то что внутри дальше}

        const li = document.createElement('li');

        li.classList.add('goods__item');

        li.innerHTML = `
        <article class="good">
        <a class="good__link-img" href="card-good.html#${id}">
            <img class="good__img" src="goods-image/${preview}" alt="">
        </a>
        <div class="good__description">
            <p class="good__price">${cost} &#8381;</p>
            <h3 class="good__title">${brand} <span class="good__title__grey">/ Тайтсы</span></h3>
            ${sizes ? 
                `<p class="good__sizes">Размеры (RUS): <span class="good__sizes-list">${sizes.join(' ')}</span></p> `
                : 
                 ``   
            }
            
            <a class="good__link" href="card-good.html#${id}">Подробнее</a>
        </div>
    </article>
        `; // join объединяет желементы массика и ставим медлу ними  пробел
        // не у всех товаров есть размеры и т.п, потому и делаем условие ? : 
        return li; // ??? 
    };
// вот вся эта часть это надо пояснить ???
    const renderGoodsList = data => {
       goodsList.textContent = ''; //делаем пустую строку 
// перебираем цикл 
       for (let i = 0; i < data.lenght; i++) {
           //console.log(data[i]);  выводится не просто список-массив теперь. а все объекты-элементы отдельно
            const card = createCard(item);
            goodsList.append(card);
       
        }
       /*
       еще один способ

       for (const item of data) {
           console.log(item);
       }

       и еще один

       data.forEach((item) => {
           console.log(item);
       })
       */ 
    };

    window.addEventListener('hashchange', () => {
        let hash = location.hash.substring(1); // 
        getGoods(renderGoodsList, hash);// вызывает очищение и заполняет новыми без перезагрузки страницы
    });
    


} catch(err) {
    console.warn(err);
}
// работает, на других страницах, если это не в товарами, высчевичается наддпись, что это не гудс пейдж

