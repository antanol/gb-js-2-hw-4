// чтобы sass-loader корректно работал, указываем путь до файла scss
import '../style/main.scss';

const pathProductJSON = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json";
const pathBasketContentJSON = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json";

class Product{
    constructor(id_product, name, price, quantity=0){
        this.id_product = id_product;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }

    render(){
        return `<div data-id="${this.id_product}" class="productElem">
                <img src="http://placehold.it/150x200">
                <h4>${this.name}</h4>
                <div class="price">${this.price} рублей</div>
                <button data-id="${this.id_product}" class="btnMinus">-</button>
                <input data-id="${this.id_product}" type="number" name="nunProd" value="1">
                <button data-id="${this.id_product}" class="btnPlus">+</button><br>
                <button data-id="${this.id_product}" class="btnBuyIt">Купить</button>
            </div>`;
    }
}

class CatalogPage{
    constructor(container = '#catalog', content){
        this.container = container;
        this.content = [];
        this._getContent()
            .then(data => { //data - объект js
                this.content = [...data];
                this.renderPage();
                this.listeners();
            });
    }

    _getContent(){
        return fetch(pathProductJSON)
            .then(result => result.json())
            .catch(error => {
                document.querySelector(this.container).innerHTML = `<h1>Что-то пошло не так...</h1> Простите, но мы не смогли найти товары. Пожалуйста, зайдите позже!`
            })
    }

    renderPage(){
        for (let elem of this.content){
            let product = new Product(elem.id_product, elem.product_name, elem.price);
            document.querySelector(this.container).innerHTML += product.render();
        }
    }
    
    filter(value){
        const regexp = new RegExp(value, 'i');
        this.filtered = this.content.filter(product => regexp.test(product.product_name));
        this.content.forEach(el => {
            const block = document.querySelector(`.productElem[data-id="${el.id_product}"]`);
            if(!this.filtered.includes(el)){
                block.classList.add('hidden-screen');
            } else {
                block.classList.remove('hidden-screen');
            }
        })
    }

    listeners(){
        // обработка кнопок
        let btnsMinus = document.querySelectorAll('.btnMinus'),
            btnsPlus = document.querySelectorAll('.btnPlus'),
            btnsBuy = document.querySelectorAll('.btnBuyIt');
        for (let btn of btnsMinus){
            btn.addEventListener('click', (event)=>{
                if (document.querySelector(`input[data-id="${event.target.dataset.id}"]`).value > 1){
                    document.querySelector(`input[data-id="${event.target.dataset.id}"]`).value--;
                }
            });
        }

        for (let btn of btnsPlus){
            btn.addEventListener('click', (event)=>{
                document.querySelector(`input[data-id="${event.target.dataset.id}"]`).value++;
            });
        }

        for (let btn of btnsBuy){
            btn.addEventListener('click', (event)=>{
                console.log(basket);
                let buyingElem =  this.content.find(item => item.id_product === Number(event.target.dataset.id));
                console.log(buyingElem);
                let newNum = Number(document.querySelector(`input[data-id="${event.target.dataset.id}"]`).value);
                if (!buyingElem.quantity){
                    buyingElem.quantity = newNum;
                }else{
                    buyingElem.quantity += newNum;
                }

                basket.putInBasket(buyingElem, newNum);
            });
        }

        document.querySelector('.search-form').addEventListener('submit', e => {
            // если событие не обрабатывается явно, его действие по умолчанию не должно выполняться так, как обычно
            e.preventDefault();
            this.filter(document.querySelector('.search-field').value);
        })
    }
}

class Basket{
    constructor(content=[], amount=0, countGoods=0){
        this._getContent()
            .then(data => {
                this.content = data.contents;
                this.amount = data.amount;
                this.countGoods = data.countGoods;
                this.startState();
            })
            .catch(err=>{
                // если файлик не найден, берём пустую корзину
                this.content = [];
                this.amount = amount;
                this.countGoods = this.countGoods;
                this.startState();
            });
    }

    _getContent(){
        return fetch(pathBasketContentJSON)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }
    
    startState(){
        // если не было чекпоинта, т.е. если pathBasketContentJSON пуст
        if (this.amount == 0){
            document.querySelector(".basketContent").innerHTML = `0 рублей`;
            document.querySelector(".basketList").innerHTML = `Ваша корзина пуста`;
        }else{
            document.querySelector(".basketContent").innerHTML = `${this.amount} рублей`;
            for (let elem of this.content){
                document.querySelector(".basketList").innerHTML += this.render(elem);
            }
        }

        this.listeners();
    }

    listeners(){
        document.querySelector('.basket').addEventListener('click', ()=>{
            document.querySelector('.basketList').classList.toggle("visible");
        });
    }

    checkAmount(elem, quantity){
        let temp_count = 0;
        // for (let i=0; i<this.content.length; i++){
        //     temp_count += quantity * this.content[i].price;
        // }
        temp_count = this.amount + elem.price * quantity;

        this.amount = temp_count;
        this.countGoods += quantity;
        document.querySelector(".basketContent").innerHTML = `${this.amount} рублей`
    }

    render(elem){
        return `<div class="basketElem" data-id="${elem.id_product}">
                    <img src="http://placehold.it/50x50">
                    <b>${elem.product_name}</b>
                    <div class="price">${elem.quantity}шт. на ${elem.price*elem.quantity} рублей</div>
                </div>`;
    }

    putInBasket(newElem, newNum){
        let alreadyExist = this.content.find(item => item.product_name == newElem.product_name);
        if (!alreadyExist){
            this.content.push(newElem);
        };
        let basketGoods = this.render(newElem);
        let oldNumGoods = document.querySelector(`.basketElem[data-id="${newElem.id_product}"]`);
        if (oldNumGoods){
            oldNumGoods.remove();
        }
        if (!document.querySelector(".basketElem")) {
            document.querySelector(".basketList").innerHTML = basketGoods;
        }else{
            document.querySelector(".basketList").innerHTML += basketGoods;
        }
        this.checkAmount(newElem, newNum);
    }
};

// инициирует корзину товаров
let basket = new Basket();
// инициирует страницу каталога товаров
let catalog = new CatalogPage();