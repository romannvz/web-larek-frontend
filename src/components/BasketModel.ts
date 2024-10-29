import { TProductInBasket, TProductInBasketModel } from '../types';
import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';

export class BasketModel {
	temp: HTMLElement = cloneTemplate('#basket');
	ul: HTMLElement = this.temp.querySelector('.basket__list');
	list: TProductInBasketModel[] = [];
	total: number = 0;
	events: EventEmitter;

	constructor() {}

	add(data: TProductInBasketModel) {
		this.list.push(data);
		if (data.price !== null) this.total += data.price;
	}

	remove(data: TProductInBasket) {
		this.list = this.list.filter((item) => {
			return item != this.list.find((item) => item.title == data.title);
		});
		this.total -= data.price;
	}
}
