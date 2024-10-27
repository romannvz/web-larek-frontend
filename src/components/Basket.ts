import { TProductInBasket } from '../types';
import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';

export class Basket {
	container: HTMLElement;
	interanceContainer: HTMLElement;
	basketTemp: HTMLElement;
	interanceBasket: HTMLElement;
	basketItemTemp: HTMLElement;
	basketCloseButton: HTMLButtonElement;
	basketSubmitButton: HTMLButtonElement;
	basketLabel: HTMLElement;
	index: HTMLElement;
	title: HTMLElement;
	price: HTMLElement;
	itemDelete: HTMLButtonElement;
	list: TProductInBasket[] = [];
	length: number;
	total: number;
	totalPrice: HTMLElement;
	events: EventEmitter;

	constructor(
		container: HTMLElement,
		interanceContainer: HTMLElement,
		basketTemp: string,
		interanceBasket: string,
		basketItemTemp: HTMLElement,
		broker: EventEmitter
	) {
		this.container = container;
		this.interanceContainer = interanceContainer;
		this.basketTemp = cloneTemplate(`${basketTemp}`);
		this.basketSubmitButton = this.basketTemp.querySelector('.button');
		this.interanceBasket = this.basketTemp.querySelector(`.${interanceBasket}`);
		this.basketItemTemp = basketItemTemp;
		this.itemDelete = this.basketItemTemp.querySelector('.basket__item-delete');
		this.events = broker;
		this.basketLabel = document.querySelector('.header__basket-counter');
		this.totalPrice = this.basketTemp.querySelector('.basket__price');
		this.basketSubmitButton.addEventListener('click', () =>
			this.events.emit('order')
		);
	}

	getIl(temp: HTMLElement, item: TProductInBasket, count: number) {
		this.basketItemTemp = temp.cloneNode(true) as HTMLElement;
		this.index = this.basketItemTemp.querySelector('.basket__item-index');
		this.title = this.basketItemTemp.querySelector('.card__title');
		this.price = this.basketItemTemp.querySelector('.card__price');
		this.index.textContent = count.toString();
		this.title.textContent = item.title;
		if (item.price) this.price.textContent = `${item.price} синапсов`;
		else this.price.textContent = 'Бесценно';

		this.itemDelete = this.basketItemTemp.querySelector('.basket__item-delete');
		this.itemDelete.addEventListener('click', () =>
			this.remove(this.title.textContent)
		);
		return this.basketItemTemp;
	}

	getFullBask(temp: HTMLElement): HTMLElement {
		let counter = 1;
		this.total = 0;
		this.list.forEach((item) => {
			this.interanceBasket.append(this.getIl(temp, item, counter));
			counter++;
			this.total += item.price;
		});
		this.totalPrice.textContent = `${this.total} синапсов`;
		return this.interanceBasket;
	}

	add(item: TProductInBasket) {
		this.list.push(item);
		this.length = this.list.length;
		this.basketLabel.textContent = this.length.toString();
	}

	remove(obj: string) {
		console.log();
		this.list = this.list.filter((item) => {
			return item != this.list.find((item) => item.title == obj);
		});
		this.length = this.list.length;
		this.basketLabel.textContent = this.length.toString();
	}
}
