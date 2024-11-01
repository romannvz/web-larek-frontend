import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';

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
	events: EventEmitter;

	constructor(
		index: string,
		title: string,
		price: number,
		id: string,
		broker: EventEmitter
	) {
		this.id = id;
		this.title.textContent = title;
		this.price = price;
		this.priceElem.textContent = `${price.toString()} синапсов`;
		this.index.textContent = index;
		this.events = broker;
		this.itemDelete.addEventListener('click', () => {
			this.events.emit('basket:pop', {
				id: this.id,
				title: this.title.textContent,
				price: this.price,
			});
		});
		return this;
	}
}
