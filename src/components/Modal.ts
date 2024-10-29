import { EventEmitter } from './base/events';

export class Modal {
	modalContainer: HTMLElement = document.querySelector('#modal-container');
	modalContent: HTMLElement =
		this.modalContainer.querySelector('.modal__content');
	content: HTMLElement;
	events: EventEmitter;
	submitButton?: HTMLButtonElement;
	closeButton: HTMLButtonElement =
		this.modalContainer.querySelector('.modal__close');

	constructor(content: HTMLElement, broker: EventEmitter) {
		this.content = content;
		this.events = broker;
		this.closeButton.addEventListener('click', () => this.close());
		this.modalContainer.addEventListener('click', (event: Event) => {
			if (event.target === event.currentTarget) this.close();
		});
	}

	open() {
		this.submitButton = this.content.querySelector('.button');
		this.modalContent.append(this.content);
		this.modalContainer.classList.add('modal_active');
		document.addEventListener('keydown', (evt) => {
			if (evt.key === 'Escape') this.close();
		});
	}

	close() {
		this.modalContainer.classList.remove('modal_active');
		this.modalContent.textContent = '';
	}
}
