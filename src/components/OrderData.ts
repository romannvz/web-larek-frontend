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
}
