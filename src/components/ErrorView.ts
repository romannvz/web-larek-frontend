import { createElement } from '../utils/utils';

export class ErrorView {
	errorElement: HTMLParagraphElement;
	errorText: string;

	constructor(errorMessage: string) {
		this.errorElement = createElement('p');
		this.errorElement.classList.add('errorElement');
		this.errorElement.textContent = errorMessage;
	}

	render() {
		return this.errorElement;
	}
}
