import { IProduct } from '../types';
import { EventEmitter } from './base/events';

export class Modal {
	modalContainer: HTMLElement;
	modalContent: HTMLElement;
	template: HTMLElement;
	events: EventEmitter;
	submitButton: HTMLButtonElement;
	submitButtonText: string;
	closeButton: HTMLButtonElement;
	data: IProduct;
	image: HTMLImageElement;
	category: HTMLElement;
	title: HTMLElement;
	description: HTMLElement;
	price: HTMLElement;
	submitObject: [HTMLElement, IProduct?];
	basketItemIndex: HTMLSpanElement;
	payment: string;
	buttonCard: HTMLButtonElement;
	buttonCash: HTMLButtonElement;
	addressField: HTMLInputElement;
	orderSubmitButton: HTMLButtonElement;

	constructor(
		modalContainer: HTMLElement,
		modalContent: HTMLElement,
		template: HTMLElement,
		closeButton: HTMLButtonElement,
		broker: EventEmitter
	) {
		this.modalContainer = modalContainer;
		this.modalContent = modalContent;
		this.template = template;
		this.closeButton = closeButton;
		this.events = broker;
		this.submitButton = this.template.querySelector('.button');
		this.image = this.template.querySelector('.card__image');
		this.category = this.template.querySelector('.card__category');
		this.title = this.template.querySelector('.card__title');
		this.description = this.template.querySelector('.card__text');
		this.price = this.template.querySelector('.card__price');
		this.closeButton.addEventListener('click', () => this.close());
		this.basketItemIndex = this.template.querySelector('.basket__item-index');
		this.submitObject = [this.template];
		this.addressField = this.template.querySelector('.form__input');
		this.orderSubmitButton = this.template.querySelector('.order__button');
		this.modalContainer.addEventListener('click', (event: Event) => {
			if (event.target === event.currentTarget) this.close();
		});
	}

	setContent(data: IProduct) {
		this.data = data;
		this.image.src = data.image;
		this.category.textContent = data.category;
		this.title.textContent = data.title;
		this.description.textContent = data.description;
		if (!data.price) this.price.textContent = `Бесценно`;
		else this.price.textContent = `${data.price} синапсов`;
		this.submitObject.push(this.data);
		this.submitButton.addEventListener('click', (event) => {
			this.events.emit('modalSubmitButton', event);
		});
		this.open(this.template);
	}

	open(temp: HTMLElement) {
		this.modalContent.append(temp);
		this.modalContainer.classList.add('modal_active');
		document.addEventListener('keydown', (evt) => {
			if (evt.key === 'Escape') this.close();
		});
		this.events.emit('openModal', this.data);
	}

	close() {
		this.modalContainer.classList.remove('modal_active');
		this.events.emit('closeModal', this.submitObject);
		this.modalContent.textContent = '';
	}

	validation() {
		if (this.addressField.textContent) {
			this.orderSubmitButton.disabled = false;
		}
	}
}
