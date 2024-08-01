import { BaseWidget } from '../base/BaseWidgetUtils';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IModalData } from '../../types';

// Класс Modal, который расширяет базовый компонент
export class Modal extends BaseWidget<IModalData> {
	protected _closeButton: HTMLButtonElement; // Кнопка закрытия модального окна
	protected _content: HTMLElement; // Контент модального окна

	// Конструктор класса Modal
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container); // Вызов конструктора базового класса

		// Находим элементы в контейнере
		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		// Добавляем обработчики событий
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.containerElement.addEventListener('mousedown', this.close.bind(this));
		this._content.addEventListener('mousedown', (event) => event.stopPropagation());
	}

	// Сеттер для установки контента модального окна
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	// Метод для открытия модального окна
	open() {
		this.containerElement.classList.add('modal_active'); // Добавляем класс для активации
		this.events.emit('modal:open'); // Отправляем событие об открытии
	}

	// Метод для закрытия модального окна
	close() {
		this.containerElement.classList.remove('modal_active'); // Удаляем класс активации
		this.content = null; // Очищаем контент
		this.events.emit('modal:close'); // Отправляем событие о закрытии
	}

	// Метод для рендеринга модального окна с данными
	render(data: IModalData): HTMLElement {
		super.renderWidget(data); // Вызов рендеринга из базового класса
		this.open(); // Открываем модальное окно
		return this.containerElement; // Возвращаем контейнер
	}
}