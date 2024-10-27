import { IProduct, IProductsData } from '../types';
import { EventEmitter } from './base/events';

export class ProductsData implements IProductsData {
	_products: IProduct[];
	currentId: Pick<IProduct, 'id'> | null;
	events: EventEmitter;

	constructor(broker: EventEmitter) {
		if (!this._products) {
			this._products = [];
		}
		this.events = broker;
	}

	addItem(card: IProduct) {
		this._products.push(card);
	}

	get products(): IProduct[] {
		return this._products;
	}

	addProduct(product: IProduct): void {
		let addingProduct = this._products.filter((item) => item === product);
		console.log(addingProduct);
	}

	deleteProduct(product: IProduct, action: Function | null): void {
		let deletingProduct = this._products.filter((item) => item === product);
		console.log(deletingProduct);
	}

	getProduct(productId: Pick<IProduct, 'id'>): IProduct {
		let findingProduct = this._products.filter((item) => item === productId);
		return;
	}
}
