import { IProduct } from '../types';
import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';

export class ProductView {
	container: HTMLElement = document.querySelector('.gallery');
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
		this.render();
	}

	render() {
		this.title.textContent = this.product.title;
		if (!this.product.price) this.price.textContent = 'Бесценно';
		else this.price.textContent = `${this.product.price} синапсов`;
		this.category.textContent = this.product.category;
		this.image.src = this.product.image;
		this.template.addEventListener('click', () =>
			this.events.emit('product:open', this.product)
		);
		this.container.append(this.template);
	}
}
