import { cloneTemplate } from '../utils/utils';

export class BasketItem {
	temp: HTMLElement = cloneTemplate('#card-basket');
	index: HTMLElement = this.temp.querySelector('.basket__item-index');
	title: HTMLElement = this.temp.querySelector('.card__title');
	price: number;
	priceElem: HTMLElement = this.temp.querySelector('.card__price');
	itemDelete: HTMLButtonElement = this.temp.querySelector(
		'.basket__item-delete'
	);
	id: string;

	constructor(title: string, price: number, id: string) {
		this.id = id;
		this.title.textContent = title;
		this.price = price;
		this.priceElem.textContent = `${price.toString()} синапсов`;
	}
}
