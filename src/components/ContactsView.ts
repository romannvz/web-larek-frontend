import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';

export class ContactsView {
	temp: HTMLElement = cloneTemplate('#contacts');
	submitButton: HTMLButtonElement = this.temp.querySelector('.button');
	emailInput: HTMLInputElement = this.temp.querySelector("[name='email']");
	phoneInput: HTMLInputElement = this.temp.querySelector("[name='phone']");
	email: string;
	emailSpan: HTMLElement = this.temp.querySelector('.email_error');
	phone: string;
	phoneSpan: HTMLElement = this.temp.querySelector('.phone_error');
	events: EventEmitter;

	constructor(broker: EventEmitter) {
		this.emailSpan.textContent = '';
		this.phoneSpan.textContent = '';
		this.events = broker;
		this.submitButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.email = this.emailInput.value;
			this.phone = this.phoneInput.value;
			this.events.emit('contactsForm:success', {
				email: this.email,
				phone: this.phone,
			});
		});
		this.emailInput.addEventListener('input', () => this.validation());
		this.phoneInput.addEventListener('input', () => this.validation());
	}

	validation() {
		this.submitButton.disabled = true;
		this.events.emit('validation:contactsView', {
			firstElem: this.emailInput,
			firstErrorSpan: this.emailSpan,
			secondElem: this.phoneInput,
			secondErrorSpan: this.phoneSpan,
		});

		if (this.emailSpan.textContent === '' && this.phoneSpan.textContent === '')
			this.submitButton.disabled = false;
	}

	clear() {
		this.emailInput.value = '';
		this.emailSpan.textContent = '';
		this.phoneInput.value = '';
		this.phoneSpan.textContent = '';
		this.submitButton.disabled = true;
	}
}
