'use strict';
const headerCityButton = document.querySelector('.header__city-button'); // ПОЧЕМУ НЕ getElement..

let hash = location.hash.substring(1); // location - объект, есть и хэш.
// сабстринг - удаляем решетку - хэш еред значением, которое будем потом использовать 

//if(localStorage.getItem('lomoda-location')) {
    //headerCityButton.textContent = localStorage.getItem('lomoda-location');
//}
// если мы получили данные, то сохранить их и использовать,
//чтобы город оставался тот же после перезагрузки

const updateLocation = () => {
    const lsLocation = localStorage.getItem('lomoda-location');

    headerCityButton.textContent = 
    lsLocation && lsLocation !== 'null' ? lsLocation : 'Ваш город';
   }; // при введении не уиарается после обновления.  При отмене осается Ваш город

headerCityButton.addEventListener('click', () => { 
    // если аргумент внтури стрелочной функции один, то скобки можно убрать
    const city = prompt('Укажите ваш город').trim(); // trim убирает пробелы
    
    if (city!== null) {
        localStorage.setItem('lomoda-location', city);
        //добавить local storage чтобы хранить там после обновление вводенные данные
        }
    updateLocation();
    
});
updateLocation();


//убираем скролл страницы при открытом модальном окне

const disableScroll = () => {
    
if (document.disableScroll) {return;} // это КАК???? 

    const widthScroll = window.innerWidth - document.body.offsetWidth; //offset - без скролла, получаем разницу
    
    document.disableScroll = true; 
    // делаем, чтобы при нажатии пробела при открытой корзине ничего бы не дергалось

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
    document.disableScroll = false; 
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
const getGoods = (callback, prop, value) => {
    getData('db.json')
        .then(data => {
            if (value) {
                callback(data.filter(item => item.[prop] === value));
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









// страница товаров

try { // если этот блок ловит ошибку, то работает следующий 
    const goodsList = document.querySelector('.goods__list');
    if (!goodsList) { //меняет тру на фолс
        throw 'this is not a goods page'; //исключение
    }

//
    const goodsTitle = document.createElement('li');
    const changeTitle = () => {
        goodsTitle.textContent = document.querySelector(`[href*="#${hash}"]`).textContent;
        //обратные кавычки. ищем по хэшу ссылку и берем оттуда контекстное значение чтобы сменить название
    };
    //changeTitle(); // только после обновления преключаются названия, если написать сюда, нао в hashchange 


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
        data.forEach((item) => {

         const card = createCard(item);
         goodsList.append(card);
        });
       //for (let i = 0; i < data.lenght; i++) {
           //console.log(data[i]);  выводится не просто список-массив теперь. а все объекты-элементы отдельно
           // const card = createCard(item);
           // goodsList.append(card);
       
        //}
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
        getGoods(renderGoodsList, 'category', hash);// вызывает очищение и заполняет новыми без перезагрузки страницы
        changeTitle();
    });
    getGoods(renderGoodsList, 'category', hash);


} catch(err) {
    console.warn(err);
}
// работает, на других страницах, если это не в товарами, высвечивается надпись, что это не гудс пейдж

// чтобы при переключении на рубрики Женщинаи Дети и т.д менялся заголовок а 

// формируем страницу товара

try {
    
    if (!document.querySelector('.card-good')) { // если не нужная страница с товаром
        throw 'this is no a card good page';
    }
    const cardGoodImage = document.querySelector('.card-good__image');
    const cardGoodBrand = document.querySelector('.card-good__brand');
    const cardGoodTitle = document.querySelector('.card-good__title');
    const cardGoodPrice = document.querySelector('.card-good__price'); 
    const cardGoodColor = document.querySelector('.card-good__color');
    const cardGoodColorLIst = document.querySelector('.card-good__color-list'); 
    const cardGoodSizes = document.querySelector('.card-good__sizes'); 
    const cardGoodSizesLIst = document.querySelector('. card-good__sizes-list');
    const cardGoodBuy = document.querySelector('. card-good__buy');
    const cardGoodSelectWrapper = document.querySelectorAll('.arcd-good__select__wrapper');

const generateList = data => data.reduce((html, item, i) => html + 
    `<li class="card-good__select-item" data-id="${i}">${item}</li>`,  ''); // выводятся разные размеры и цвета и чтобы выбирали нами выбранный вариант


    const renderCardGood = ([{brand, name, cost, color, sizes, photo}]) => {
        cardGoodImage.src = `goods-image/${photo}`;
        cardGoodImage.alt = `${brand} ${name}`;
        cardGoodBrand.textContent = brand;
        cardGoodTitle.textContent =  name;
        cardGoodPrice.textContent = `${cost} p`;
        
        //не у всего есть размеры и цвета
        if (color) {
            cardGoodColor.textContent = color[0];
            cardGoodColor.dataset.id = 0; // по умолчанию как и индекс
            cardGoodColorList.innerHTML = generateList(color);
        } else {
            cardGoodColor.style.display = 'none';
        }

        if (sizes) {
            cardGoodSizes.textContent = sizes[0];
            cardGoodSizes.dataset.id = 0;
            cardGoodSizesList.innerHTML = generateList(sizes);
        } else {
            cardGoodSizes.style.display = 'none';
        }


    };
    cardGoodSelectWrapper.forEach(item => {
        item.addEventListener('click', e => {
            const target = e.target;

            if (target.closest('.card-good__select')) {
                target.classList.toggle('card-good__select__open'); //еtoggle добавляет класс, если его нет, убиарет, если есть. переключатель. 
            }

            if (target.closest('.card-good__select-item')) {
                const cardGoodSelect = item.querySelector('.card-good__select');
                cardGoodSelect.textContent = target.textContent;
                cardGoodSelect.dataset.id = target.dataset.id;
                
                cardGoodSelect.classList.remove('card-good__select__open');
            }
        });
    });
    getGoods(renderCardGood, 'id', hash);

} catch (err) {
    console.warn(err);
}