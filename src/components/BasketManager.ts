// import { BaseComponent } from './base/BaseComponent';
// import { createNode, findElement } from './../utils/domHelpers';
import { BaseWidget } from './base/BaseWidgetUtils';
import { createElement, ensureElement } from './../utils/utils';
import { ICartView } from '../types';
import { EventEmitter } from './base/events';

// Класс Cart управляет корзиной покупок на сайте
export class ShoppingCart extends BaseWidget<ICartView> {
    // Элементы интерфейса корзины
	protected itemList: HTMLElement; // Список товаров в корзине
	protected totalPriceElement: HTMLElement; // Элемент для отображения общей стоимости
	protected checkoutButton: HTMLButtonElement; // Кнопка оформления заказа

    // Конструктор класса Cart
	constructor(hostElement: HTMLElement, protected eventHub: EventEmitter) {
		super(hostElement);

        // Находим элементы в DOM
		this.itemList = ensureElement<HTMLElement>('.basket__list', this.containerElement);
		this.totalPriceElement = this.containerElement.querySelector('.basket__price');
		this.checkoutButton = this.containerElement.querySelector('.basket__button');

        // Добавляем обработчик события на кнопку оформления заказа
		if (this.checkoutButton) {
			this.checkoutButton.addEventListener('click', () => {
				eventHub.emit('checkout:initiate');
			});
		}

        // Инициализируем корзину как пустую
		this.cartItems = [];
		this.checkoutButton.disabled = true; // Изначально кнопка не активна
	}

    // Метод для активации/деактивации кнопки оформления заказа
	enableCheckoutButton(enable: boolean) {
		this.checkoutButton.disabled = !enable;
	}

    // Сеттер для обновления списка товаров в корзине
	set cartItems(items: HTMLElement[]) {
		if (items.length) {
			this.itemList.replaceChildren(...items); // Если есть товары, отображаем их
		} else {
			this.itemList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Your cart is empty', // Если товаров нет, показываем сообщение
				})
			);
		}
	}

    // Сеттер для обновления общей стоимости товаров
	set totalAmount(amount: number) {
		this.updateTextContent(this.totalPriceElement, `${amount} credits`); // Обновляем текст с общей стоимостью
	}

    // Приватный метод для обновления текста в элементе
	private updateTextContent(element: HTMLElement, text: string) {
		element.textContent = text; // Устанавливаем текст элемента
	}
}