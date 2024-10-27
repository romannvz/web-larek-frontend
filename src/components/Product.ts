import { IProduct, TProductsMainPage } from '../types';
import { EventEmitter } from './base/events';

export class Product {
	template: HTMLElement;
	product: IProduct;
	events: EventEmitter;

	constructor(prod: IProduct, broker: EventEmitter) {
		this.product = prod;
		this.events = broker;
	}

	setDataInTemplate(temp: HTMLElement) {
		this.template = temp;
		const productInfo: TProductsMainPage = this.product;
		const title: HTMLHeadElement = this.template.querySelector('.card__title');
		const price: HTMLSpanElement = this.template.querySelector('.card__price');
		const category: HTMLSpanElement =
			this.template.querySelector('.card__category');
		const image: HTMLImageElement = this.template.querySelector('.card__image');
		title.textContent = productInfo.title;
		if (!productInfo.price) {
			price.textContent = 'Бесценно';
		} else {
			price.textContent = String(`${productInfo.price} синапсов`);
		}
		category.textContent = productInfo.category;
		image.src = productInfo.image;
		this.template.addEventListener('click', () =>
			this.events.emit('clickOnCard', this.product)
		);
	}

	render(container: any) {
		container.append(this.template);
	}
}
