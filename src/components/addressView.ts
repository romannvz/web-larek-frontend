import { cloneTemplate, createElement } from '../utils/utils';
import { EventEmitter } from './base/events';

export class AddressView {
	temp: HTMLElement = cloneTemplate('#order');
	submitButton: HTMLButtonElement = this.temp.querySelector('.order__button');
	buttonSpan: HTMLElement = this.temp.querySelector('.payment_error');
	input: HTMLInputElement = this.temp.querySelector('.form__input');
	inputSpan: HTMLElement = this.temp.querySelector('.address_error');
	paymentMethod: HTMLInputElement;
	address: string;
	events: EventEmitter;

	constructor(broker: EventEmitter) {
		this.events = broker;
		this.paymentMethod = this.input.cloneNode(true) as HTMLInputElement;
		this.paymentMethod.value = '';
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
		this.paymentMethod.value = method.trimEnd();
		console.log('paymentMethod: ', this.paymentMethod.value)
	}

	validation() {
		this.submitButton.disabled = true;
		this.events.emit('validation:addressView',{firstElem: this.paymentMethod, firstErrorSpan: this.buttonSpan, secondElem: this.input, secondErrorSpan: this.inputSpan});
		if(this.buttonSpan.textContent === '' && this.inputSpan.textContent === '')
			this.submitButton.disabled = false;
	}

	clear() {
		this.input.value = '';
		this.paymentMethod.value = '';
		this.submitButton.disabled = true;
	}
}
