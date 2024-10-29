import { cloneTemplate } from '../utils/utils';
import { EventEmitter } from './base/events';

export class SuccessView {
	temp: HTMLElement = cloneTemplate('#success');
	submitButton: HTMLButtonElement = this.temp.querySelector(
		'.order-success__close'
	);
	total: HTMLElement = this.temp.querySelector('.order-success__description');
	events: EventEmitter;

	constructor(broker: EventEmitter) {
		this.events = broker;
		this.submitButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.events.emit('success:exit');
		});
	}
}
