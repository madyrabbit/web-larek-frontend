import { EntityBase } from './base/BasicModel';
import { IItem, IOrderInfo, IShippingInfo, IStoreStateData, ErrorList, IContactInfo } from '../types';

// Определение типа для события обновления списка товаров
export type ProductListUpdateEvent = {
    updatedList: IItem[];
};

// Класс для управления состоянием магазина
export class StoreState extends EntityBase<IStoreStateData> {
    inventory: IItem[]; // Список товаров на складе
    shoppingBasket: IItem[] = []; // Товары в корзине покупателя
    currentTransaction: IOrderInfo = { // Текущий заказ
        methodOfPayment: 'card',
        deliveryAddress: '',
        buyerEmail: '',
        buyerPhone: '',
        totalAmount: 0,
        lineItems: [],
    };
    highlightedProduct: string | null; // ID выделенного товара для детального просмотра
    validationErrors: ErrorList = {}; // Ошибки при вводе данных

    // Очистить корзину
    clearBasket() {
        this.shoppingBasket = [];
        this.notifyBasketChange();
    }

    // Сбросить данные заказа
    resetTransaction() {
        this.currentTransaction = {
            methodOfPayment: 'card',
            deliveryAddress: '',
            buyerEmail: '',
            buyerPhone: '',
            totalAmount: 0,
            lineItems: [],
        };
    }

    // Обновить список товаров
    refreshInventory(newItems: IItem[]) {
        this.inventory = newItems;
        this.broadcastChange('inventoryRefreshed', { updatedList: this.inventory });
    }

    // Установить выделенный товар
    setHighlightedProduct(product: IItem) {
        this.highlightedProduct = product.id;
        this.broadcastChange('productHighlighted', product);
    }

    // Добавить товар в корзину
    putInBasket(product: IItem) {
        if (!this.shoppingBasket.includes(product)) {
            this.shoppingBasket.push(product);
            this.notifyBasketChange();
        }
    }

    // Удалить товар из корзины
    takeOutOfBasket(product: IItem) {
        this.shoppingBasket = this.shoppingBasket.filter(p => p !== product);
        this.notifyBasketChange();
    }

    // Уведомить об изменении корзины
    notifyBasketChange() {
        this.broadcastChange('basketChanged', this.shoppingBasket);
    }

    // Установить информацию о доставке
    updateShippingDetails(field: keyof IShippingInfo, value: string) {
        this.currentTransaction[field] = value;
        if (this.validateShipping()) {
            this.broadcastChange('shippingDetailsConfirmed', this.currentTransaction);
        }
    }

    // Установить контактные данные
    updateContactDetails(field: keyof IContactInfo, value: string) {
        this.currentTransaction[field] = value;
        if (this.validateContactDetails()) {
            this.broadcastChange('contactDetailsConfirmed', this.currentTransaction);
        }
    }

    // Проверить информацию о доставке
    validateShipping() {
        const errors: typeof this.validationErrors = {};
        const addressPattern = /^[а-яА-ЯёЁa-zA-Z0-9\s\/.,-]{10,}$/;
        if (!this.currentTransaction.deliveryAddress) {
            errors.deliveryAddress = 'Необходимо указать адрес';
        } else if (!addressPattern.test(this.currentTransaction.deliveryAddress)) {
            errors.deliveryAddress = 'Адрес должен содержать только буквы, цифры, пробелы, точки, запятые и "/", состоять как минимум из 10 символов';
        }
        this.validationErrors = errors;
        this.broadcastChange('errorsUpdated', this.validationErrors);
        return Object.keys(errors).length === 0;
    }

    // Проверить контактные данные
    validateContactDetails() {
        const errors: typeof this.validationErrors = {};
        const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        const phonePattern = /^\+7[0-9]{10}$/;
        if (!this.currentTransaction.buyerEmail) {
            errors.buyerEmail = 'Необходимо указать email';
        } else if (!emailPattern.test(this.currentTransaction.buyerEmail)) {
            errors.buyerEmail = 'Некорректный адрес электронной почты';
        }
        let phoneValue = this.currentTransaction.buyerPhone;
        if (phoneValue.startsWith('8')) {
            phoneValue = '+7' + phoneValue.slice(1);
        }
        if (!phoneValue) {
            errors.buyerPhone = 'Необходимо указать телефон';
        } else if (!phonePattern.test(phoneValue)) {
            errors.buyerPhone = 'Некорректный формат номера телефона, номер следует указывать в формате +7ХХХХХХХХХХ';
        } else {
            this.currentTransaction.buyerPhone = phoneValue;
        }
        this.validationErrors = errors;
        this.broadcastChange('errorsUpdated', this.validationErrors);
        return Object.keys(errors).length === 0;
    }
}