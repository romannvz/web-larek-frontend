import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';

export class AddressView {
	temp: HTMLElement = cloneTemplate('#order');
	submitButton: HTMLButtonElement = this.temp.querySelector('.order__button');
	buttonSpan: HTMLElement = this.temp.querySelector('.payment_error');
	input: HTMLInputElement = this.temp.querySelector('.form__input');
	inputSpan: HTMLElement = this.temp.querySelector('.address_error');
	paymentMethod: string;
	address: string;
	events: EventEmitter;

	constructor(broker: EventEmitter) {
		this.events = broker;
		this.paymentMethod = '';
		this.input.addEventListener('input', () => this.validation());
		this.temp.querySelectorAll('#card').forEach((element) => {
			element.addEventListener('click', () => {
				this.chooseMethod(element.textContent.trimStart());
				this.validation();
			});
		});
		this.submitButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.address = this.input.value;
			this.events.emit('addressForm:success', {
				payment: this.paymentMethod,
				address: this.address,
			});
		});
	}

	chooseMethod(method: string) {
		this.paymentMethod = method.trimEnd();
	}

	validation() {
		this.submitButton.disabled = true;
		if (!this.paymentMethod) {
			this.buttonSpan.textContent = 'Выберите способ оплаты';
		} else if (this.input.validity.valueMissing || !this.input.value)
			this.inputSpan.textContent = this.input.dataset.missValue;
		else {
			this.inputSpan.textContent = '';
			this.buttonSpan.textContent = '';
			this.submitButton.disabled = false;
		}
	}

	clear() {
		this.input.value = '';
		this.paymentMethod = '';
		this.submitButton.disabled = true;
	}
}
