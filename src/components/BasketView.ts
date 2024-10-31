import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';
import { BasketItem } from './BasketItem';

export class BasketView {
	temp: HTMLElement = cloneTemplate('#basket');
	ul: HTMLElement = this.temp.querySelector('.basket__list');
	index: HTMLElement = this.temp.querySelector('.basket__item-index');
	total: number = 0;
	totalPrice: HTMLElement = this.temp.querySelector('.basket__price');
	basketSubmitButton: HTMLButtonElement;
	list: BasketItem[] = [];
	events: EventEmitter;

	constructor(broker: EventEmitter) {
		this.events = broker;
		this.basketSubmitButton = this.temp.querySelector('.button');
		this.basketSubmitButton.disabled = true;
		this.basketSubmitButton.addEventListener('click', () =>
			this.events.emit('basket:confirm')
		);
		this.setList();
	}

	setList() {
		this.list.forEach((item) => this.ul.append(item.temp));
	}

	render() {
		this.setList();
		return this.temp;
	}
}
