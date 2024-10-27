import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';
import { IProduct, TProductsMainPage, TProductInBasket } from './types';
import { ProductsData } from './components/ProductsData';
import { EventEmitter } from './components/base/events';
import { Product } from './components/Product';
import { Modal } from './components/Modal';
import { cloneTemplate } from './utils/utils';
import { Basket } from './components/Basket';
import { Order } from './components/OrderData';

const mainBroker = new EventEmitter();
let orderItems: Record<number, TProductInBasket> = {};
const productsClass: ProductsData = new ProductsData(mainBroker);
const productsElements: IProduct[] = [];
const api = new Api(API_URL);
const galleryContainer: HTMLElement = document.querySelector('.gallery');
const modalContainer: HTMLElement = document.querySelector('#modal-container');
const modalCloseButton: HTMLButtonElement =
	modalContainer.querySelector('.modal__close');
const modalContent: HTMLElement =
	modalContainer.querySelector('.modal__content');

const productsModal: Record<string, Modal> = {};

const basket = new Basket(
	modalContainer,
	modalContent,
	'#basket',
	'basket__list',
	cloneTemplate('#card-basket'),
	mainBroker
);

const basketButton: HTMLButtonElement =
	document.querySelector('.header__basket');
basketButton.addEventListener('click', () => mainBroker.emit('openBasket'));

const basketModal = new Modal(
	basket.container,
	basket.interanceContainer,
	basket.basketTemp,
	modalCloseButton,
	basket.events
);

const orderTemp: HTMLElement = cloneTemplate('#order');
const contactsTemp: HTMLElement = cloneTemplate('#contacts');
const successTemp: HTMLElement = cloneTemplate('#success');

const orderModal: Modal = new Modal(
	modalContainer,
	modalContent,
	orderTemp,
	modalCloseButton,
	mainBroker
);

orderModal.addressField.addEventListener('input', () => {
	orderModal.validation;
});

const getCardFromApi = api.get('/product').then((data: ApiListResponse<[]>) => {
	data.items.forEach((elem) => {
		productsClass.addItem(Object.assign(elem));
	});
});

getCardFromApi.then(() => {
	productsClass._products.forEach((item) => {
		item.image = `${CDN_URL}` + item.image;
		productsElements.push(item);
	});
	productsElements.forEach((item) => {
		let product = new Product(item, mainBroker);
		product.setDataInTemplate(cloneTemplate('#card-catalog'));
		product.render(galleryContainer);
	});
});

mainBroker.on('openBasket', () => {
	basket.interanceBasket.textContent = '';
	basket.getFullBask(cloneTemplate('#card-basket'));
	if (basket.list.length === 0) {
		basket.basketSubmitButton.disabled = true;
		basket.interanceBasket.textContent = 'Здесь пока пусто ):';
	} else basket.basketSubmitButton.disabled = false;
	basketModal.open(basket.basketTemp);
});

mainBroker.on('closeBasket', () => {
	basket.basketTemp = null;
});

mainBroker.on('basketChange', () => {
	basket.getFullBask(cloneTemplate('#card-basket'));
});

mainBroker.on('modalSubmitButton', (evt: Event) => {
	let elem = evt.target as HTMLElement;
	if (elem.textContent === 'В корзину') {
		elem.textContent = 'Удалить';
		let title =
			elem.parentElement.parentElement.querySelector(
				'.card__title'
			).textContent;
		let price = elem.parentElement.querySelector('.card__price').textContent;
		basket.add({ title, price: Number.parseInt(price) });
	} else if (elem.textContent === 'Удалить') {
		elem.textContent = 'В корзину';
		let title =
			elem.parentElement.parentElement.querySelector(
				'.card__title'
			).textContent;
		let price = elem.parentElement.querySelector('.card__price').textContent;
		basket.remove(title);
	}
});

mainBroker.on('clickOnCard', (data: IProduct) => {
	if (!productsModal[data.id]) {
		productsModal[data.id] = new Modal(
			modalContainer,
			modalContent,
			cloneTemplate('#card-preview'),
			modalCloseButton,
			mainBroker
		);
		productsModal[data.id].setContent(data);
	} else {
		productsModal[data.id].open(productsModal[data.id].template);
	}
});

mainBroker.on('order', () => {
	basketModal.close();
	orderModal.open(orderTemp);
	const order = new Order();
});

mainBroker.on('paymentMethod:selected', (evt: Event) => {});
