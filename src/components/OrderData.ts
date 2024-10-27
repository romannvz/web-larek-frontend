import { IProduct } from '../types';

export class Order {
	paymentMethod: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: Pick<IProduct, 'id'>[];

	constructor() {}

	sendOrder(): void {}

	validation() {}
}
