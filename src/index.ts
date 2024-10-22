import './scss/styles.scss';

class API implements IAPI { ///model
    //здесь указываются параметры подключения, like :
    // const config = {
    //     baseUrl: "https://larek-api.nomoreparties.co",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    // };
    //происходит подключение к апи, парсится информация о всех карточках и возвращается массивом объектов карточек, которые впоследствии передаются в класс Item

    baseURL: string;
    config: [];

    constructor(config: IAPI) {
        this.config = config.config;
        this.baseURL = config.baseURL;
    }

    async getItemsFromAPI() {
        return fetch(`${this.baseURL}/product/`)
        .then((res) => {
            if(res.ok) return res.json()
                else console.error(res.status)
        })
    }


    
}

class Item extends API implements IItem { ///model
    //класс получает на входе массив объектов карточек из апи, далее путём array.foreach() передаёт готовую под вывод карточку и выводит её
    
    itemInfo: Array<string>;
    id: string;
    category: string;
    title: string;
    description: string;
    price: number | null;
    image: string;

    constructor(data: IItem, config: IAPI) {
        super(config);
        this.id = data.id;
        this.category = data.category;
        this.title = data.title;
        this.description = data.description;
        this.price = data.price;
        this.image = data.image;
        this.config = config.config;
    }
    
    displayItems() {
        this.getItemsFromAPI()
        .then((data) => {
            data.forEach((item: []) => {
                let card = new createCard();
                card.someFunc(item);
                ///здесь будет дописана логика вывода карточки на страницу
            })
        })
    }
}

class createCard { ///view
    //использует подготовленные данные в Item и возвращает конкретную карточку

    public someFunc(card:any): void {
        /// здесь будет описана логика вытаскивания из переданного item всех свойств и дальнейшее их преобразование для вывода
    }
}

class EventEmitter { ///presenter 
    //устанавливает слушатели на кнопки сабмита, а также следит за открытием нужных модалок в нужный момент. аналогично следит за закрытием всего перечисленного
    
    // element: HTMLElement;

    // setEvent(): void {
    //     ///this.element..... дальше логика
    // }
}

class openModal implements Modal{ ///view
    //класс, принимающий конкретную модалку и открывающий её. также здесь создаётся коллбек на закрытие модалки

    modal: HTMLElement;
    body: Array<HTMLElement>;

    constructor(modal: HTMLElement) {
        this.modal = modal;
    }
    
    submitAction() {
        ///здесь будет вызов EventEmmiter для сообщения о совершении действия. кодом пока описать этот метод не могу
    }

    closeModal() {
        ///подробнее пока описать этот метод не могу
        let action = new closeModal(this.modal);
    }

}

class closeModal { ///view
    //закрывает конкретную модалку
    modal: HTMLElement;

    constructor(modal: HTMLElement) {
        this.modal = modal;
    }

    close(): void {
        ///this.modal ... далее здесь пойдёт логика
    }

}

class validation { ///view
    element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    check(): void {
        ///this.element.textContent ..... и так далее
    }
    //логика валидации всех форм и textInput'ов
}