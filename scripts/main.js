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
    methods: {
        putInBasket(event, newElem){
            let eventID = Number(event.target.dataset.id);
            let newNum = Number(document.querySelector(`input[data-id="${eventID}"]`).value);

            let alreadyExist = this.basketContent.content.find(item => item.id_product == eventID);
            if (alreadyExist){
                alreadyExist.quantity += newNum;
                this.basketContent.content.countGoods += newNum;
            }else{
                let newElem = this.products.find(item => item.id_product == eventID);
                newElem.quantity = newNum;
                this.basketContent.content.push(newElem);
            };
            this.checkAmount();
        },

        checkAmount(){
            let temp_count = 0;
            for (let elem of this.basketContent.content){
                temp_count += elem.price * elem.quantity;
            }
            this.basketContent.amount = temp_count;
        },

        incrementNum(event){
            let field = document.querySelector(`input[data-id="${event.target.dataset.id}"]`);
            let currentNum = Number(field.value);
            currentNum++;
            field.value = currentNum;
        },

        decrementNum(event){
            let field = document.querySelector(`input[data-id="${event.target.dataset.id}"]`);
            let currentNum = Number(field.value);
            if (currentNum > 1){
                currentNum--;
            }
            field.value = currentNum;
        }
    },
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
//         document.querySelector('.search-form').addEventListener('submit', e => {
//             // если событие не обрабатывается явно, его действие по умолчанию не должно выполняться так, как обычно
//             e.preventDefault();
//             this.filter(document.querySelector('.search-field').value);
//         })
//     }
// }