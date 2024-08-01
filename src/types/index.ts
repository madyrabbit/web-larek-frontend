//КОМПОНЕНТЫ БИЗНЕС ЛОГИКЕ

/// Методы  API
export interface IProjectAPI {
	getProductList: () => Promise<IItem[]>;
	getProductItem: (id: string) => Promise<IItem>;
	orderProducts: (order: IOrderInfo) => Promise<IOrderResult>;
}

// Действия пользователя
export interface IActions {
    onClick: (event: MouseEvent) => void; // Обработчик клика 
}

// Информация о заказе
export interface IOrderInfo extends IShippingInfo, IContactInfo {
	totalAmount: number; // Общая стоимость
	lineItems: string[]; // Список товаров
}

/// Ответа с сервера о заказе
export interface IOrderResult {
    id: string; // ID заказа
	total: number; // Общая стоимость заказа
}

//КОМПОНЕНТЫ БИЗНЕС ЛОГИКЕ

//Состояние приложения
export interface IStoreStateData {
    catalog: IItem[]; // Каталог товаров
    basket: IItem[]; // Корзина товаров
    preview: string | null; // Предпросмотр товаров
    delivery: IShippingInfo | null; // Доставка товаров
    contact: IContactInfo| null; // Контакты покупателя
    order: IOrderInfo| null; // Заказ 
}

// Успешное выполнение действия
export interface ILuckActions {
    onAction: ()  => void; // Обработчик клика
}

// Информация о доставке товара
export interface IShippingInfo  {
    methodOfPayment: string; // Способ оплаты
    deliveryAddress: string; // Адрес доставки
}

// Информация покупатели
export interface IContactInfo {
    buyerEmail: string; // Электронная почта покупателя
    buyerPhone: string; // Телефон покупателя
}

// Отображения успешного заказа
export interface ILuck {
	total: number; // Общая стоимость заказа
}

// ПОЛЬЗОВАТЕЛЬСКИЙ ИНТЕРФЕЙС СТРАНИЦЫ (VIEW) 

// Отображение главной страницы
export interface IPageInterface  {
    counter: number; // Счетчик
	catalog: HTMLElement[]; // Каталога товара
}

// Информация о товарах
export interface IItem {
	id: string; // ID товара
	title: string; // Наименование товара
	price: number | null; // Цена товара
	description: string; // Описание товара
	category: string; // Категория товара
	image: string; // Изображение товара
}

// Отображения карточки товара
export interface IProductInfo extends IItem {
	index?: string; // Индекс карточки товара
	buttonTitle?: string; // Текст кнопки
}

// Товар открытый в модальном окне
export interface IModalData {
	content: HTMLElement; // Содержимое модального окна
}

// Состоянии формы
export interface FormStateInterface {
	valid: boolean; // Валидность формы
	errors: string[]; // Ошибки формы
}

// Отображения успешного заказа
export interface ICartView {
	total: number; // Общая стоимость заказа
}

// Ошибки формы
export type ErrorList = Partial<Record<keyof IOrderInfo, string>>; // Ошибки формы