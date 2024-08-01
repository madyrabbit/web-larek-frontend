import { BaseWidget } from './base/BaseWidgetUtils';
import { ensureElement } from './../utils/utils';
import { ILuck, ILuckActions } from '../types';

// Класс OperationResult отвечает за отображение результата операции
export class OperationResult extends BaseWidget<ILuck> {
	protected closeButton: HTMLElement; // Элемент кнопки закрытия
	protected resultInfo: HTMLElement; // Элемент для вывода информации о результате

	constructor(showElement: HTMLElement, userActions: ILuckActions) {
		super(showElement);
		// Поиск и инициализация элементов
		this.closeButton = ensureElement<HTMLElement>('.modal-close', this.containerElement);
		this.resultInfo = ensureElement<HTMLElement>('.result-info', this.containerElement);

		// Назначение обработчика клика
		if (userActions?.onAction) {
			this.closeButton.addEventListener('click', userActions.onAction);
		}
	}

	// Метод для установки информации о результате
	set resultText(value: string) {
		this.resultInfo.textContent = `Total deducted: ${value} points`;
	}
}