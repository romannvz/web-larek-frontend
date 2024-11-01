import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';
import { BasketItem } from './BasketItem';

export class BasketView {
	temp: HTMLElement = cloneTemplate('#basket');
	ul: HTMLElement = this.temp.querySelector('.basket__list');
	index: HTMLElement = this.temp.querySelector('.basket__item-index');
	_total: number = 0;
	totalPrice: HTMLElement = this.temp.querySelector('.basket__price');
	basketSubmitButton: HTMLButtonElement;
	_list: BasketItem[] = [];
	events: EventEmitter;

	constructor(broker: EventEmitter) {
		this.events = broker;
		this.basketSubmitButton = this.temp.querySelector('.button');
		this.basketSubmitButton.disabled = true;
		this.basketSubmitButton.addEventListener('click', () =>
			this.events.emit('basket:confirm')
		);
		this.ul.textContent = 'Здесь пока пусто ):';
	}

	set total(count: number) {
		if (count === 0) this._total = count;
		else this._total += count;
	}

	get total() {
		return this._total;
	}

	set list(content: BasketItem[]) {
		this._list = content;
		if (this._list.length === 0) {
			this.basketSubmitButton.disabled = true;
			this.ul.textContent = 'Здесь пока пусто ):';
		} else this.basketSubmitButton.disabled = false;
		this.totalPrice.textContent = `${this._total} синапсов`;
	}

	setUl(elem: HTMLElement) {
		this.ul.append(elem);
	}

	render() {
		return this.temp;
	}
}
