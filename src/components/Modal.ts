export class Modal {
	modalContainer: HTMLElement = document.querySelector('#modal-container');
	modalContent: HTMLElement =
		this.modalContainer.querySelector('.modal__content');
	content: HTMLElement;
	submitButton?: HTMLButtonElement;
	closeButton: HTMLButtonElement =
		this.modalContainer.querySelector('.modal__close');

	constructor() {
		this.closeButton.addEventListener('click', () => this.close());
		this.modalContainer.addEventListener('click', (event: Event) => {
			if (event.target === event.currentTarget) this.close();
		});
	}

	setContent(content: HTMLElement) {
		this.content = content;
		this.submitButton = this.content.querySelector('.button');
		this.modalContent.replaceChildren(content);
	}

	setButtonText(text: string) {
		this.submitButton.textContent = text;
	}

	open() {
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
