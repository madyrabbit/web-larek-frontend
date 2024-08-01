// import { BaseComponent } from './base/BaseComponent';
// import { EventManager } from './base/EventManager';
// import { findElement } from '../helpers/domHelpers';
// import { PageInterface } from '../definitions';

import { BaseWidget } from './base/BaseWidgetUtils';
import { IEvents } from './base/events';
import { IPageInterface } from '../types';
import { ensureElement } from '../utils/utils';

// Класс Page управляет основными элементами страницы
export class Page extends BaseWidget<IPageInterface> {
	protected _countElement: HTMLElement; // Элемент счетчика
	protected _galleryElement: HTMLElement; // Элемент галереи
	protected _mainWrapper: HTMLElement; // Основной контейнер страницы
	protected _shoppingCart: HTMLElement; // Элемент корзины

	constructor(hostElement: HTMLElement, protected eventManager: IEvents) {
		super(hostElement);

		// Инициализация элементов страницы
		this._countElement = ensureElement<HTMLElement>('.header__basket-counter', hostElement);
		this._galleryElement = ensureElement<HTMLElement>('.gallery', hostElement);
		this._mainWrapper = ensureElement<HTMLElement>('.page__wrapper', hostElement);
		this._shoppingCart = ensureElement<HTMLElement>('.header__basket', hostElement);

		// Назначение обработчика клика для корзины
		this._shoppingCart.addEventListener('click', () => {
			this.eventManager.trigger('cart:open');
		});
	}

	// Установка значения счетчика
	set counter(value: number) {
		this.updateTextContent(this._countElement, String(value));
	}

	// Обновление элементов галереи
	set catalog(items: HTMLElement[]) {
		this._galleryElement.replaceChildren(...items);
	}

	// Блокировка или разблокировка страницы
	set locked(isLocked: boolean) {
		if (isLocked) {
			this._mainWrapper.classList.add('locked');
		} else {
			this._mainWrapper.classList.remove('locked');
		}
	}

	// Вспомогательный метод для обновления текста в элементе
	private updateTextContent(element: HTMLElement, text: string) {
		element.textContent = text;
	}
}