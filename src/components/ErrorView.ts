import { createElement } from '../utils/utils';
import { EventEmitter } from './base/events';

export class ErrorView {
	container: HTMLElement = document.querySelector('#modal-container');
	content: HTMLElement = this.container.querySelector('.modal__content');
	errorElement: HTMLParagraphElement;
	errorText: string;
	event: EventEmitter;

	constructor(broker: EventEmitter) {
		this.event = broker;
		this.errorElement = createElement('p');
		this.errorElement.classList.add('errorElement');
	}

	render(errorMessage: string) {
		this.errorElement.classList.add('errorElement');
		this.errorElement.textContent = errorMessage;
		this.content.append(this.errorElement);
		this.event.emit('errorModal:open');
	}
}
