import { IOrder } from '../types';
import { EventEmitter } from './base/events';

export class Order implements IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[] = [];
	events: EventEmitter;

	constructor(broker: EventEmitter) {
		this.events = broker;
	}

	checkViewValidity(data: {firstElem: HTMLInputElement, firstErrorSpan: HTMLElement, secondElem: HTMLInputElement, secondErrorSpan: HTMLElement}) {
		if(data.firstElem.value === '')
			data.firstErrorSpan.textContent = data.firstElem.dataset.missValue;
		else if(data.firstElem.validity.patternMismatch)
			console.log(data.firstErrorSpan.textContent = data.firstElem.dataset.errorPattern);
		else data.firstErrorSpan.textContent = '';
		if(data.secondElem.value === '')
			data.secondErrorSpan.textContent = data.secondElem.dataset.missValue;
		else if(data.secondElem.validity.patternMismatch) 
			data.secondErrorSpan.textContent = data.secondElem.dataset.errorPattern;
		else data.secondErrorSpan.textContent = '';
		}
	}