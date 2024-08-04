import { BaseWidget } from './base/BaseWidgetUtils';
import { createElement, ensureElement } from './../utils/utils';
import { ICartView } from '../types';
import { EventEmitter } from './base/events';

// Класс Cart управляет корзиной покупок на сайте
export class ShoppingCart extends BaseWidget<ICartView> {
    // Элементы интерфейса корзины
	protected _itemList: HTMLElement; // Список товаров в корзине
	protected _totalPriceElement: HTMLElement; // Элемент для отображения общей стоимости
	protected _checkoutButton: HTMLButtonElement; // Кнопка оформления заказа

    // Конструктор класса Cart
	constructor(container: HTMLElement, protected eventHub: EventEmitter) {
		super(container);

    // Находим элементы в DOM
		this._itemList = ensureElement<HTMLElement>('.basket__list', this.container);
		this._totalPriceElement = this.container.querySelector('.basket__price');
		this._checkoutButton = this.container.querySelector('.basket__button');

    // Добавляем обработчик события на кнопку оформления заказа
		if (this._checkoutButton) {
				this._checkoutButton.addEventListener('click', () => {
					eventHub.emit('checkout:open');
				});
		}

    // Инициализируем корзину как пустую
		this.cartItems = [];
		this._checkoutButton.disabled = true; // Изначально кнопка не активна
	}

  // Метод для активации/деактивации кнопки оформления заказа
	enableCheckoutButton(enable: boolean) {
		this._checkoutButton.disabled = enable;
	}

  // Сеттер для обновления списка товаров в корзине
	set cartItems(items: HTMLElement[]) {
		if (items.length) {
			this._itemList.replaceChildren(...items); // Если есть товары, отображаем их
		} else {
			this._itemList.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста', // Если товаров нет, показываем сообщение
				})
			);
		}
	}

  // Сеттер для обновления общей стоимости товаров
	set totalAmount(amount: number) {
		this.updateTextContent(this._totalPriceElement, `${amount} синапсов`); // Обновляем текст с общей стоимостью
	}

  // Приватный метод для обновления текста в элементе
	private updateTextContent(element: HTMLElement, text: string) {
		element.textContent = text; // Устанавливаем текст элемента
	}

    // Метод рендеринга корзины
    renderWidget(data: {}): HTMLElement {
        console.log('ShoppingCart.renderWidget вызван');
        console.log('ShoppingCart отрендерен');
        return this.container;
    }
}