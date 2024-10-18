interface IItem {
    id: string,
    category: string,
    title: string,
    description: string,
    price: number,
    image: string
}

interface IAPI {
    baseURL: string,
    getItemsFromAPI: void,
    displayItems: void
}

interface Modal {
    body: Array<string>,
    submitAction: void,
    closeModal: void
}

class API implements IAPI {
    //здесь указываются параметры подключения, like :
    // const config = {
    //     baseUrl: "https://larek-api.nomoreparties.co",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    // };
    //происходит подключение к апи, парсится информация о всех карточках и возвращается массивом объектов карточек, которые впоследствии передаются в класс Item
}

class Item implements IItem {
    itemInfo: Array<string>;

    constructor() {

    }
    //класс получает на входе массив объектов карточек из апи, далее путём array.foreach() передаёт готовую под вывод карточку

}

class createCard {
    //использует подготовленные данные в Item и выводит на страницу конкретную карточку
}

class EventEmitter {
    //устанавливает слушатели на кнопки сабмита, а также следит за открытием нужных модалок в нужный момент. аналогично следит за закрытием всего перечисленного
}

class openModal implements Modal{
    //класс, принимающий конкретную модалку и открывающий её. также здесь создаётся коллбек на закрытие модалки
}

class closeModal {
    //закрывает конкретную модалку
}

class validation {
    //логика валидации всех форм и textInput'ов
}