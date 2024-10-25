export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IProductsData {
    products: IProduct[];
    currentId: Pick<IProduct, 'id'> | null;
    addProduct(product: IProduct): void;
    deleteProduct(product: IProduct, action: Function | null): void;
    getProduct(productId: Pick<IProduct, 'id'>): IProduct;
}

export type TProductsMainPage = Pick<IProduct, 'category' | 'title' | 'image' | 'price'>

export type TProductShowMore = Pick<IProduct, 'category' | 'title' | 'description' | 'image' | 'price'>

export type TProductInBasket = Pick<IProduct, 'title' | 'price'>

export interface IClientInfo {
    paymentMethod: string;
    address: string;
    email: string;
    phone: string;
    getInfo(): IClientInfo;
    setInfo(clientData: IClientInfo): void;
    checkValidation(data: Record<keyof IClientInfo, string>): boolean;
}

export interface IOrder {
    payment: Pick<IClientInfo, 'paymentMethod'>;
    email: Pick<IClientInfo, 'email'>;
    phone: Pick<IClientInfo, 'phone'>;
    address: Pick<IClientInfo, 'address'>;
    total: Pick<IProduct, 'price'>;
    items: Pick<IProduct, 'id'>[];
    sendOrder(): void;
}