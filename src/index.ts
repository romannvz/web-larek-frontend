import './scss/styles.scss';
import { Api, ApiListResponse } from './components/base/api';
import { API_URL, CDN_URL } from './utils/constants';
import {
	IProduct,
	TProductInBasketModel,
	TFirstPartOrder,
	TSecondPartOrder,
	IOrder,
} from './types';
import { EventEmitter } from './components/base/events';
import { ProductView } from './components/ProductView';
import { Modal } from './components/Modal';
import { BasketView } from './components/BasketView';
import { Order } from './components/OrderData';
import { BasketItem } from './components/BasketItem';
import { BasketModel } from './components/BasketModel';
import { AddressView } from './components/addressView';
import { ContactsView } from './components/ContactsView';
import { SuccessView } from './components/SuccessView';
import { ProductDetailView } from './components/ProductDetailView';
import { ErrorView } from './components/ErrorView';

const mainBroker = new EventEmitter();
const api = new Api(API_URL);

const productsElements: IProduct[] = [];
const productsModal: Modal[] = [];
const productsDetailView: ProductDetailView[] = [];
const errorView = new ErrorView(mainBroker);
const errorModal = new Modal(errorView.errorElement, mainBroker);

api
	.get('/product')
	.then((data: ApiListResponse<IProduct>) => {
		data.items.forEach((elem) => {
			elem.image = `${CDN_URL}` + elem.image;
			productsElements.push(elem);
			new ProductView(elem, mainBroker);
			productsDetailView.push(new ProductDetailView(elem, mainBroker));
		});
	})
	.catch((err) => {
		errorView.render(
			`Произошла ошибка при загрузке информации с сервера. Пожалуйста, попробуйте повторить запрос позднее.(Сервер вернул ошибку: ${err})`
		);
	});

mainBroker.on('product:open', (data: IProduct) => {
	const currentProduct = productsDetailView.find(
		(product) => product.title.textContent == data.title
	);
	const productModal = new Modal(currentProduct.temp, mainBroker);
	productsModal.push(productModal);
	productModal.open();
});

mainBroker.on('product:basketed', (obj: ProductDetailView) => {
	let currentPrice;
	if (obj.price.textContent === 'Бесценно') currentPrice = 0;
	else currentPrice = Number.parseInt(obj.price.textContent.split(' ')[0]);
	const elem = {
		id: obj.id,
		title: obj.title.textContent,
		price: currentPrice,
	};
	if (obj.submitButton.textContent === 'В корзину') {
		mainBroker.emit('basket:push', elem);
		obj.submitButton.textContent = 'Удалить';
	} else {
		mainBroker.emit('basket:pop', elem);
		obj.submitButton.textContent = 'В корзину';
	}
});

const basketModel = new BasketModel();

const basketView = new BasketView(mainBroker);

document
	.querySelector('.header__basket')
	.addEventListener('click', () => mainBroker.emit('basket:open'));

const basketLabel = document.querySelector('.header__basket-counter');

const basketModal = new Modal(basketView.temp, basketView.events);

mainBroker.on('basket:open', () => {
	basketModal.content = basketView.render();
	basketModal.open();
});

mainBroker.on('basket:push', (data: TProductInBasketModel) => {
	if (!basketModel.list.includes(data)) {
		basketModel.add(data);
		mainBroker.emit('basket:change');
	}
});

mainBroker.on('basket:pop', (data: TProductInBasketModel) => {
	basketModel.remove(data);
	const popedProduct = productsDetailView.find(
		(product) => product.id == data.id
	);
	popedProduct.submitButton.textContent = 'В корзину';
	mainBroker.emit('basket:change');
});

mainBroker.on('basket:change', () => {
	basketLabel.textContent = basketModel.list.length.toString();
	basketView.list = basketModel.list.map(
		(item) => new BasketItem(item.title, item.price, item.id)
	);
	basketModal.content = basketView.render();
});

const order = new Order(mainBroker);

const addressView = new AddressView(mainBroker);
const addressModal: Modal = new Modal(addressView.temp, mainBroker);

mainBroker.on('basket:confirm', () => {
	const basketListCache = basketModel.list.filter((item) => {
		return item != basketModel.list.find((item) => item.price == 0);
	});
	if (basketListCache.length === 0) {
		errorView.render(
			'К сожалению, нельзя оформить заказ на продукт с бесценной стоимостью. Пожалуйста, вернитесь назад, и добавьте ещё несколько товаров или удалите бесценный.'
		);
		mainBroker.emit('errorModal:open');
	} else {
		basketModal.close();
		addressModal.open();
	}
});

mainBroker.on('errorModal:open', () => {
	errorModal.open();
});

const contactsView = new ContactsView(mainBroker);
const contactsModal: Modal = new Modal(contactsView.temp, mainBroker);

mainBroker.on('validation:addressView', (data: {firstElem: HTMLInputElement, firstErrorSpan: HTMLElement, secondElem: HTMLInputElement, secondErrorSpan: HTMLElement}) => {
	order.checkViewValidity(data);
})

mainBroker.on('validation:contactsView', (data: {firstElem: HTMLInputElement, firstErrorSpan: HTMLElement, secondElem: HTMLInputElement, secondErrorSpan: HTMLElement}) => {
	order.checkViewValidity(data);
})

mainBroker.on('addressForm:success', (data: TFirstPartOrder) => {
	if (data.payment === 'Онлайн') order.payment = 'online';
	else order.payment = 'cash';
	order.address = data.address;
	addressModal.close();
	contactsModal.open();
});

const successView = new SuccessView(mainBroker);
const successModal = new Modal(successView.temp, mainBroker);

mainBroker.on('contactsForm:success', (data: TSecondPartOrder) => {
	order.email = data.email;
	order.phone = data.phone;
	order.total = basketModel.total;
	basketModel.list.forEach((item) => {
		if (item.price !== 0) {
			order.items.push(item.id);
		}
	});
	api
		.post('/order', order as IOrder)
		.then((res) => {
			contactsModal.submitButton.textContent = 'Ожидайте...';
			if (Object.keys(res).includes('id')) {
				successView.total.textContent = `Списано ${order.total.toString()} синапсов`;
				contactsModal.close();
				mainBroker.emit('order:success');
			}
		})
		.catch((err) => {
			errorView.render(
				`Произошла ошибка при отправке информации о заказе на сервер. Пожалуйста, попробуйте повторить запрос позднее.(Сервер вернул ошибку: ${err})`
			);
		})
		.finally(() => (contactsModal.submitButton.textContent = 'Оплатить'));
});

mainBroker.on('order:success', () => {
	successModal.open();
});

mainBroker.on('success:exit', () => {
	basketModel.list = [];
	productsDetailView.forEach(
		(item) => (item.submitButton.textContent = 'В корзину')
	);
	mainBroker.emit('basket:change');
	addressView.clear();
	contactsView.clear();
	successModal.close();
});
