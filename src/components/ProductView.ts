import { IProduct } from '../types';
import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';

export class ProductView {
	template: HTMLElement = cloneTemplate('#card-catalog');
	title: HTMLElement = this.template.querySelector('.card__title');
	price: HTMLElement = this.template.querySelector('.card__price');
	category: HTMLElement = this.template.querySelector('.card__category');
	image: HTMLImageElement = this.template.querySelector('.card__image');
	product: IProduct;
	events: EventEmitter;

	constructor(prod: IProduct, broker: EventEmitter) {
		this.product = prod;
		this.events = broker;
		this.title.textContent = this.product.title;
		if (!this.product.price) this.price.textContent = 'Бесценно';
		else this.price.textContent = `${this.product.price} синапсов`;
		this.category.textContent = this.product.category;
		if (this.product.category === 'другое')
			this.category.classList.add('card__category_other');
		else if (this.product.category === 'софт-скил')
			this.category.classList.add('card__category_soft');
		else if (this.product.category === 'дополнительное')
			this.category.classList.add('card__category_additional');
		else if (this.product.category === 'кнопка')
			this.category.classList.add('card__category_button');
		else this.category.classList.add('card__category_hard');
		this.image.src = this.product.image;
		this.template.addEventListener('click', () =>
			this.events.emit('product:open', this.product)
		);
		this.render();
	}

	render() {
		return this.template;
	}
}
