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
import { ProductsData } from './components/ProductsData';

const mainBroker = new EventEmitter();
const api = new Api(API_URL);
const gallery: HTMLElement = document.querySelector('.gallery');
const modal: Modal = new Modal();
const productsData = new ProductsData();
const productsDetailView: ProductDetailView[] = [];
const basketModel = new BasketModel();
const basketView = new BasketView(mainBroker);
document
	.querySelector('.header__basket')
	.addEventListener('click', () => mainBroker.emit('basket:open'));
const basketLabel = document.querySelector('.header__basket-counter');
const order = new Order();
const addressView = new AddressView(mainBroker);
const contactsView = new ContactsView(mainBroker);
const successView = new SuccessView(mainBroker);

api
	.get('/product')
	.then((data: ApiListResponse<IProduct>) => {
		data.items.forEach((elem) => {
			elem.image = `${CDN_URL}` + elem.image;
			productsData.addItem(elem);
		});
		productsData.products.forEach((item) => {
			gallery.append(new ProductView(item, mainBroker).render());
			productsDetailView.push(new ProductDetailView(item, mainBroker));
		});
	})
	.catch((err) => {
		modal.setContent(
			new ErrorView(
				`Произошла ошибка при загрузке информации с сервера. Пожалуйста, попробуйте повторить запрос позднее.(Сервер вернул ошибку: ${err})`
			).render()
		);
		modal.open();
	});

mainBroker.on('product:open', (data: IProduct) => {
	modal.setContent(
		productsDetailView.find(
			(product) => product.title.textContent == data.title
		).temp
	);
	modal.open();
});

mainBroker.on('product:basketed', (obj: ProductDetailView) => {
	const elem = {
		id: obj.id,
		title: obj.title.textContent,
		price: Number.parseInt(obj.price.textContent.split(' ')[0]),
	};
	if (obj.submitButton.textContent === 'В корзину') {
		mainBroker.emit('basket:push', elem);
		obj.submitButton.textContent = 'Удалить';
	} else {
		mainBroker.emit('basket:pop', elem);
		obj.submitButton.textContent = 'В корзину';
	}
});

mainBroker.on('basket:open', () => {
	modal.setContent(basketView.render());
	modal.open();
});

mainBroker.on('basket:push', (data: TProductInBasketModel) => {
	if (!basketModel.list.includes(data)) {
		basketModel.add(data);
		mainBroker.emit('basket:change');
	}
});

mainBroker.on('basket:pop', (data: TProductInBasketModel) => {
	basketModel.remove(data);
	productsDetailView.find(
		(product) => product.id == data.id
	).submitButton.textContent = 'В корзину';
	mainBroker.emit('basket:change');
});

mainBroker.on('basket:change', () => {
	basketLabel.textContent = basketModel.list.length.toString();
	basketView.list = basketModel.list.map(
		(item) => new BasketItem(item.title, item.price, item.id)
	);
	if (basketView.list.length === 0) {
		basketView.basketSubmitButton.disabled = true;
		basketView.ul.textContent = 'Здесь пока пусто ):';
		basketView.total = 0;
	} else {
		basketView.ul.textContent = '';
		basketView.basketSubmitButton.disabled = false;
		let counter = 0;
		basketView.list.forEach((item) => {
			counter++;
			item.index.textContent = counter.toString();
			item.itemDelete.addEventListener('click', () => {
				mainBroker.emit('basket:pop', {
					id: item.id,
					title: item.title.textContent,
					price: item.price,
				});
			});
		});
		basketView.total = basketModel.total;
	}
	basketView.totalPrice.textContent = `${basketView.total} синапсов`;
	basketView.render();
});

mainBroker.on('basket:confirm', () => {
	addressView.clear();
	modal.setContent(addressView.temp);
});

mainBroker.on(
	'validation:addressView',
	(data: {
		firstElem: HTMLInputElement;
		firstErrorSpan: HTMLElement;
		secondElem: HTMLInputElement;
		secondErrorSpan: HTMLElement;
	}) => {
		order.checkViewValidity(data);
	}
);

mainBroker.on(
	'validation:contactsView',
	(data: {
		firstElem: HTMLInputElement;
		firstErrorSpan: HTMLElement;
		secondElem: HTMLInputElement;
		secondErrorSpan: HTMLElement;
	}) => {
		order.checkViewValidity(data);
	}
);

mainBroker.on('addressForm:success', (data: TFirstPartOrder) => {
	if (data.payment === 'Онлайн') order.payment = 'online';
	else order.payment = 'cash';
	order.address = data.address;
	contactsView.clear();
	modal.setContent(contactsView.temp);
	contactsView.submitButton.textContent = 'Оплатить';
});

mainBroker.on('contactsForm:success', (data: TSecondPartOrder) => {
	order.email = data.email;
	order.phone = data.phone;
	order.total = basketModel.total;
	basketModel.list.forEach((item) => order.items.push(item.id));
	modal.submitButton.textContent = 'Ожидайте...';
	api
		.post('/order', order as IOrder)
		.then((res) => {
			if (Object.keys(res).includes('id')) {
				successView.total.textContent = `Списано ${order.total.toString()} синапсов`;
				mainBroker.emit('order:success');
			}
		})
		.catch((err) => {
			modal.setContent(
				new ErrorView(
					`Произошла ошибка при отправке информации о заказе на сервер. Пожалуйста, попробуйте повторить запрос позднее.(Сервер вернул ошибку: ${err})`
				).render()
			);
		});
});

mainBroker.on('order:success', () => {
	modal.setContent(successView.temp);
	modal.open();
	order.items = [];
	basketModel.list = [];
	basketModel.total = 0;
	productsDetailView.forEach(
		(item) => (item.submitButton.textContent = 'В корзину')
	);
	mainBroker.emit('basket:change');
	addressView.clear();
	contactsView.clear();
});

mainBroker.on('success:exit', () => modal.close());
