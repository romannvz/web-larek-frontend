import { IProduct } from '../types';

export class ProductsData {
	_products: IProduct[] = [];

	constructor() {}

	addItem(card: IProduct) {
		this._products.push(card);
	}

	get products(): IProduct[] {
		return this._products;
	}
}
