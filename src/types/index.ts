interface IItem {
    id: string,
    category: string,
    title: string,
    description: string,
    price: number | null,
    image: string
    displayItems(): void    
}

interface IAPI {
    baseURL: string,
    config: []
    getItemsFromAPI(): Promise<[]>,
}

interface Modal {
    modal: HTMLElement,
    body: Array<HTMLElement>,
    submitAction(): void,
    closeModal(): void
}