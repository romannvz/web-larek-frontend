# Проектная работа "Веб-ларек"

Стек: *HTML*, *SCSS*, *TS*, *Webpack*.

Структура проекта:
- `src/` — исходные файлы проекта;
- `src/components/` — папка с *JS* компонентами;
- `src/components/base/` — папка с базовым кодом.

Важные файлы:
- `src/pages/index.html` — *HTML*-файл главной страницы;
- `src/types/index.ts` — файл с типами и интерфейсами;
- `src/index.ts` — точка входа приложения;
- `src/scss/styles.scss` — корневой файл стилей;
- `src/utils/constants.ts` — файл с константами;
- `src/utils/utils.ts` — файл с утилитами.

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка одного товара:

```
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

Коллекция карточек товаров:

```
export interface IProductsData {
    products: IProduct[];
    currentId: Pick<IProduct, 'id'> | null;
}
```

Тип для отображения карточек на главной странице:

```
export type TProductsMainPage = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>
```

Тип для отображения модального окна с подробным описанием карточки:
```
export type TProductShowMore = Pick<IProduct, 'category' | 'title' | 'description' | 'image' | 'price'>
```

Тип для отображения списка карточек в модальном окне корзины:

```
export type TProductInBasket = Pick<IProduct, 'title' | 'price'>
```

Интерфейс для данных клиента, оформляющего заказ:

```
export interface IClientInfo {
    paymentMethod: string;
    address: string;
    email: string;
    phone: string;
}
```

Интерфейс для отправки на сервер данных о совершенном заказе:

```
export interface IOrder {
    payment: Pick<IClientInfo, 'paymentMethod'>;
    email: Pick<IClientInfo, 'email'>;
    phone: Pick<IClientInfo, 'phone'>;
    address: Pick<IClientInfo, 'address'>;
    total: Pick<IProduct, 'price'>;
    items: Pick<IProduct, 'id'>[];
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме *MVP*:
- слой представления - отвечает за отображение данных на странице;
- слой данных - отвечает за хранение и преобразование данных;
- презентер - отвечает за взаимодействие слоев представления и данных.

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер;
- `post` - принимает объект с данными, которые будут переданы в *JSON* в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове;
- `handleResponse` - принимает ответ сервера при вызовах `get` и `post`, и обрабатывает статус ответа. В случае положительного ответа сервера (*200 status*) - возвращает ответ сервера в *JSON*-формате, в ином случае - возвращает *Promise.reject* с информацией об ошибке (код ошибки и ее текст).

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие;
- `emit` - инициализация события;
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие.

### Слой данных

#### Класс ProductsData
Класс отвечает за хранение и логику работы с данными товаров, полученных с сервера.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- `_products: IProduct[]` - коллекция объектов товаров;
- `_currentId: Pick<IProduct, 'id'> | null` - *ID* товара, выбранного для просмотра в модальном окне;
- `events: IEvents` - экземпляр класса `EventEmitter` для инициации событий при изменении данных.

Также класс предоставляет набор методов для взаимодействия с описанными данными:
- `addProduct(product: IProduct): void` - добавляет товар в корзину;
- `deleteProduct(product: IProduct, action: Function | null): void` - удаляет товар из корзины. Если передан колбэк, то выполняет его после удаления, если нет - вызывает событие изменения массива;
- `getProduct(productId: Pick<IProduct, 'id'>): IProduct` - возвращает товар по его *ID*;
- сеттеры и геттеры для сохранения и получения данных из полей класса.

#### Класс OrderData
Класс отвечает за хранение и логику работы с данными заказов.\
Конструктор класса принимает инстант брокера событий.\
В полях класса хранятся следующие данные:
- `_payment: Pick<IClientInfo, 'paymentMethod'>` - способ оплаты заказа;
- `_email: Pick<IClientInfo, 'email'>` - адрес доставки;
- `_phone: Pick<IClientInfo, 'phone'>` - контактный телефон;
- `_address: Pick<IClientInfo, 'address'>` - контактный адрес эл.почты пользователя;
- `total: Pick<IProduct, 'price'>` - общая сумма заказа;
- `items: Pick<IProduct, 'id'>[]` - коллекция *ID* заказанных товаров.

Также класс предоставляет метод для взаимодействия с перечисленными данными:
- `sendOrder(): void` - предположительно будет использоваться для отправки описанных выше данных. Возможно, внутри этого метода будет расположен вызов метода *post* из класса `Api` с передачей в качестве параметра *data* этого метода описанных выше полей.

### Слой представления
Все классы в слое представления служат для отображения внутри контейнера (*DOM*-элемента) передаваемых в него данных.

#### Класс Product
Класс реализует вывод одного продукта, полученного с сервера. Будет использоваться при выводе товаров и на главную страницу, и в модальное фулл-скрин окно с подробной информацией, и для отображения продуктов в корзине. Также содержит экземпляр брокера событий для корректной реакции на пользовательские действия.\
Содерижт поля:
- `template: HTMLTemplateElement` - темплейт, в который необходимо занести данные товара;
- `product: IProduct` - данные продукта;
- `events: IEvent` - экземпляр `EventEmitter` для инициации событий.

Методы класса:
- `setData(template: HTMLTemplateElement, product: IProduct): void` - метод для заполнения переданного в конструктор класса темплейта данных переданного в метод продукта.


#### Класс Modal
Реализует модальное окно.\
Содержит в себе поля:
- `modal: HTMLTemplateElement` - элемент модального окна;
- `events: IEvents` - брокер событий;
- `submitButton: HTMLButtonElement` - кнопка сабмита;
- `submitButtonText: string` - текст на кнопке сабмита;
- `closeButton: HTMLButtonElement` - кнопка закрытия модального окна;
- `handleSubmit: Function` - функция, которая будет выполнять предназначенное для этого темплейта действие-сабмит;

Также класс содержит методы:
- `open`и `close` - для управления модальными окнами:
- `setEventListener` - для закрытия модального окна по клику на оверлей, нажатию на клавишу *Esc* или нажатию на кнопку-крестик в углу модального окна;

#### Класс ModalWithInputs
Наследует и расширяет класс `Modal`. Используется для создания объектов модальных окон, в которых имеются поля ввода.\
Имеет поля:
- `inputs: NodeListOf<HTMLInputElement>` - коллекция полей ввода;
- `errors: Record<string, HTMLElement>` - объект, содержащий массив элементов для отображения ошибок валидации.

Методы:
- `setValid(isValid: boolean): void` - изменяет состояние кнопки сабмита;
- `getInputValues(): Record<string, string>` - возвращает объект, содержащий в себе поле инпута (по его *ID*) и значения, введенные пользователем в это поле;
- `setInputValues(data: Record<string, string>): void` - принимает объект с данными для заполнения полей (возможно пригодится для сохранения введенных данных пользователя при заказе после закрытия модального окна, тем самым позволить продолжить заполнение ранее начатых данных);
- `setError(data: {field: string, value: string, validationInfo: string}): void` - принимает объект с данными для установки/снятия ошибок у поля ввода;
- `showInputError(field: HTMLInputElement, errorMessage: string): void` - отображает у конкретного поля ввода передаваемый текст ошибки;
- `hideInputError(field: HTMLInputElement): void` - скрывает текст ошибки;
- `checkValidation(data: Record<keyof IClientInfo, string>): boolean` - проверяет валидность данных, предоставленных пользователем.

#### Класс ModalWithContent
Класс для работы с модальными окнами открытия подробных сведений карточки, а также для модального окна успешного завершения заказа.\
Наследует родительский класс `Modal`. Имеет поля:
- `image: HTMLImageElement` - поле для хранения данных об изображении (понадобится для фулл-скрин отображения одной карточки, а также для модального окна с успехом при оформлении заказа);
- `content: TProductShowMore | {}` - содержание модального окна (тип `TProductShowMore` для отображения информации о карточке, пустой объект - для модального окна успешного оформления заказа).

Содержит в себе методы родительского класса.

### Слой коммуникации

#### Класс AppApi
Класс для приема экземпляра класса `Api` и методов для взаимодействия с бэкэндом сервиса.

## Взаимодействие компонентов
Код, описывающий взаимодействие слоев данных и представления, будет расположен в файле `src/index.ts`, выполняющего роль презентера.\
Взаимодействие будет осуществляться с помощью событий, генерируемых брокером событий, и обработчиков этих событий, описанных в приведенном выше файле.\
В файле `index.ts` будут созданы экземпляры всех необходимых классов, а затем - настройка обработки событий.

События, которые могут понадобиться для реализации приложения:
- `product:previewClear` - очистка данных выбранного для показа в модальном окне продукта;
- `product:opened` - открытие подробной информации о выбранном товаре;
- `product:close` - закрытие модального окна с полными сведениями;
- `product:basketed` - добавление товара в корзину;
- `basket:opened` - открытие корзины;
- `product:unbasketed` - удаление товара из корзины;
- `basket:confirming` - нажатие кнопки "*Оформить*" в корзине;
- `userInfo:input` - изменение данных пользователя;
- `userInfo:validation` - необходимость валидации поля ввода;
- `basket:ordered` - успешное формирование заказа.