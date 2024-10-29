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
		this.temp.querySelectorAll('.form__input').forEach((element) => {
			element.addEventListener('input', () => {
				this.validation();
			});
		});
		this.submitButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.email = this.emailInput.value;
			this.phone = this.phoneInput.value;
			this.events.emit('contactsForm:success', {
				email: this.email,
				phone: this.phone,
			});
		});
	}

	validation() {
		this.submitButton.disabled = true;
		if (this.emailInput.validity.valueMissing || !this.emailInput.value)
			this.emailSpan.textContent = this.emailInput.dataset.missValue;
		else if (this.emailInput.validity.patternMismatch)
			this.emailSpan.textContent = this.emailInput.dataset.errorPattern;
		else if (this.phoneInput.validity.valueMissing || !this.phoneInput.value)
			this.phoneSpan.textContent = this.phoneInput.dataset.missValue;
		else if (this.phoneInput.validity.patternMismatch)
			this.phoneSpan.textContent = this.phoneInput.dataset.errorPattern;
		else {
			this.emailSpan.textContent = '';
			this.phoneSpan.textContent = '';
			this.submitButton.disabled = false;
		}
	}

	clear() {
		this.emailInput.value = '';
		this.phoneInput.value = '';
		this.submitButton.disabled = true;
	}
}
