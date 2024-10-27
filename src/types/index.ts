export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IProductsData {
	_products: IProduct[];
	currentId: Pick<IProduct, 'id'> | null;
	addProduct(product: IProduct): void;
	deleteProduct(product: IProduct, action: Function | null): void;
	getProduct(productId: Pick<IProduct, 'id'>): IProduct;
}

export type TProductsMainPage = Pick<
	IProduct,
	'category' | 'title' | 'image' | 'price'
>;

export type TProductShowMore = Pick<
	IProduct,
	'category' | 'title' | 'description' | 'image' | 'price'
>;

export type TProductInBasket = Pick<IProduct, 'title' | 'price'>;

export interface IOrder {
	paymentMethod: string;
	email: string;
	phone: string;
	address: string;
	total: Pick<IProduct, 'price'>;
	items: Pick<IProduct, 'id'>[];
	getInfo(): void;
	checkValidation(data: Record<string, string>): boolean;
	setInfo(clientData: string[]): void;
	sendOrder(): void;
}
