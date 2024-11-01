import { IProduct } from '../types';
import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';

export class ProductDetailView {
	temp: HTMLElement = cloneTemplate('#card-preview');
	image: HTMLImageElement = this.temp.querySelector('.card__image');
	category: HTMLElement = this.temp.querySelector('.card__category');
	title: HTMLElement = this.temp.querySelector('.card__title');
	description: HTMLElement = this.temp.querySelector('.card__text');
	price: HTMLElement = this.temp.querySelector('.card__price');
	submitButton: HTMLButtonElement = this.temp.querySelector('.button');
	id: string;
	events: EventEmitter;

	constructor(product: IProduct, broker: EventEmitter) {
		this.events = broker;
		this.id = product.id;
		this.image.src = product.image;
		this.category.textContent = product.category;
		if (product.category === 'другое')
			this.category.classList.add('card__category_other');
		else if (product.category === 'софт-скил')
			this.category.classList.add('card__category_soft');
		else if (product.category === 'дополнительное')
			this.category.classList.add('card__category_additional');
		else if (product.category === 'кнопка')
			this.category.classList.add('card__category_button');
		else this.category.classList.add('card__category_hard');
		this.title.textContent = product.title;
		this.description.textContent = product.description;
		if (product.price === null) {
			this.price.textContent = `Бесценно`;
			this.submitButton.disabled = true;
		} else this.price.textContent = `${product.price} синапсов`;
		this.submitButton.addEventListener('click', () =>
			this.events.emit('product:basketed', this)
		);
	}

	getButtonText() {
		return this.submitButton.textContent;
	}

	setButtonText(text: string){
		this.submitButton.textContent = text;
	}
}
