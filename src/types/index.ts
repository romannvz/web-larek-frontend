export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
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

export type TProductInBasketModel = Pick<IProduct, 'id' | 'title' | 'price'>;

export type TFirstPartOrder = Pick<IOrder, 'payment' | 'address'>;

export type TSecondPartOrder = Pick<IOrder, 'email' | 'phone'>;

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}
