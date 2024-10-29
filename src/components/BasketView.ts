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
		this.basketSubmitButton.addEventListener('click', () =>
			this.events.emit('basket:confirm')
		);
	}

	render() {
		this.total = 0;
		if (this.list.length === 0) {
			this.basketSubmitButton.disabled = true;
			this.ul.textContent = 'Здесь пока пусто ):';
			this.totalPrice.textContent = '0 синапсов';
		} else {
			this.ul.textContent = '';
			this.basketSubmitButton.disabled = false;
			let counter = 0;
			this.list.forEach((item) => {
				counter++;
				item.index.textContent = counter.toString();
				item.itemDelete.addEventListener('click', () => {
					this.events.emit('basket:pop', {
						id: item.id,
						title: item.title.textContent,
						price: item.priceElem.textContent,
					});
				});
				this.total += item.price;
				this.ul.append(item.temp);
			});
		}
		this.totalPrice.textContent = `${this.total} синапсов`;
		return this.temp;
	}
}
