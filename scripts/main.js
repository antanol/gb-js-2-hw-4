// чтобы sass-loader корректно работал, указываем путь до файла scss
import '../style/main.scss';


const app = new Vue({
    el: '#app',
    data: {
        linkData: {
            catalogData: "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/catalogData.json",
            getBasket: "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/getBasket.json"
        },
        showBasket: false,
        products: [],
        basketContent: {
            amount: 0,
            countGoods: 0,
            content: []
        }
    },
    // methods: {
    // },
    mounted(){
        // аналог window.onload

        fetch(this.linkData.catalogData)
            .then(result => {
                result.json()
                .then(data => {
                    this.products = [...data];
                })
            })
            .catch(error => {
                document.querySelector('.catalog').innerHTML = `<h1>Что-то пошло не так...</h1> Простите, но мы не смогли найти товары. Пожалуйста, зайдите позже!`
            });

        fetch(this.linkData.getBasket)
            .then(result => {
                result.json()
                .then(data => {
                    // this.basketContent = [...data];
                    this.basketContent.content = data.contents;
                    this.basketContent.amount = data.amount;
                    this.basketContent.countGoods = data.countGoods;
                })
            })
            .catch(err=>{
                // если файлик не найден, берём пустую корзину
                this.basketContent.content = [];
                this.basketContent.amount = 0;
                this.basketContent.countGoods = 0;
            });

        console.log(this);
        console.log(this.basketContent.amount)
    }
});

// class CatalogPage{  
//     filter(value){
//         const regexp = new RegExp(value, 'i');
//         this.filtered = this.content.filter(product => regexp.test(product.product_name));
//         this.content.forEach(el => {
//             const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
//             if(!this.filtered.includes(el)){
//                 block.classList.add('hidden-screen');
//             } else {
//                 block.classList.remove('hidden-screen');
//             }
//         })
//     }

//     listeners(){
//         // обработка кнопок
//         let btnsMinus = document.querySelectorAll('.btnMinus'),
//             btnsPlus = document.querySelectorAll('.btnPlus'),
//             btnsBuy = document.querySelectorAll('.btnBuyIt');
//         for (let btn of btnsMinus){
//             btn.addEventListener('click', (event)=>{
//                 if (document.querySelector(`input[data-id="${event.target.dataset.id}"]`).value > 1){
//                     document.querySelector(`input[data-id="${event.target.dataset.id}"]`).value--;
//                 }
//             });
//         }

//         for (let btn of btnsPlus){
//             btn.addEventListener('click', (event)=>{
//                 document.querySelector(`input[data-id="${event.target.dataset.id}"]`).value++;
//             });
//         }

//         for (let btn of btnsBuy){
//             btn.addEventListener('click', (event)=>{
//                 console.log(basket);
//                 let buyingElem =  this.content.find(item => item.id_product === Number(event.target.dataset.id));
//                 console.log(buyingElem);
//                 let newNum = Number(document.querySelector(`input[data-id="${event.target.dataset.id}"]`).value);
//                 if (!buyingElem.quantity){
//                     buyingElem.quantity = newNum;
//                 }else{
//                     buyingElem.quantity += newNum;
//                 }

//                 basket.putInBasket(buyingElem, newNum);
//             });
//         }

//         document.querySelector('.search-form').addEventListener('submit', e => {
//             // если событие не обрабатывается явно, его действие по умолчанию не должно выполняться так, как обычно
//             e.preventDefault();
//             this.filter(document.querySelector('.search-field').value);
//         })
//     }
// }

// class Basket{
//     checkAmount(elem, quantity){
//         let temp_count = 0;
//         // for (let i=0; i<this.content.length; i++){
//         //     temp_count += quantity * this.content[i].price;
//         // }
//         temp_count = this.amount + elem.price * quantity;

//         this.amount = temp_count;
//         this.countGoods += quantity;
//         document.querySelector(".basketContent").innerHTML = `${this.amount} рублей`
//     }

//     putInBasket(newElem, newNum){
//         let alreadyExist = this.content.find(item => item.product_name == newElem.product_name);
//         if (!alreadyExist){
//             this.content.push(newElem);
//         };
//         let basketGoods = this.render(newElem);
//         let oldNumGoods = document.querySelector(`.basket-item[data-id="${newElem.id_product}"]`);
//         if (oldNumGoods){
//             oldNumGoods.remove();
//         }
//         if (!document.querySelector(".basket-item")) {
//             document.querySelector(".basketList").innerHTML = basketGoods;
//         }else{
//             document.querySelector(".basketList").innerHTML += basketGoods;
//         }
//         this.checkAmount(newElem, newNum);
//     }
// };

// // инициирует корзину товаров
// let basket = new Basket();
// // инициирует страницу каталога товаров
// let catalog = new CatalogPage();