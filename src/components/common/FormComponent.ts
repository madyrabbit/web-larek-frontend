// Импорт необходимых модулей
import { BaseWidget } from '../base/BaseWidgetUtils';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';
import { FormStateInterface } from '../../types';

// Объявление класса FormClass, который наследуется от BaseWidget
export class FormClass<T> extends BaseWidget<FormStateInterface> {
	// Объявление защищенных свойств _submitButton и _errorDisplay
	protected _submitButton: HTMLButtonElement;
	protected _errorDisplay: HTMLElement;

	// Конструктор класса FormClass
	constructor(protected formContainer: HTMLFormElement, protected eventHandlers: IEvents) {
		super(formContainer);

		// Инициализация _submitButton и _errorDisplay
		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.formContainer
		);
		this._errorDisplay = ensureElement<HTMLElement>('.form__errors', this.formContainer);

		// Обработчик события input
		this.formContainer.addEventListener('input', (event: Event) => {
			const inputTarget = event.target as HTMLInputElement;
			const inputField = inputTarget.name as keyof T;
			const inputValue = inputTarget.value;
			this.handleInputChange(inputField, inputValue);
		});

		// Обработчик события submit
		this.formContainer.addEventListener('submit', (event: Event) => {
			event.preventDefault();
			this.eventHandlers.emit(`${this.formContainer.name}:submit`);
		});
	}

	// Метод для обработки изменения ввода
	protected handleInputChange(inputField: keyof T, inputValue: string) {
		this.eventHandlers.emit(`${this.formContainer.name}.${String(inputField)}:change`, {
			inputField,
			inputValue,
		});
	}

	// Сеттер для установки значения isValid
	set isValid(isValid: boolean) {
		this._submitButton.disabled = !isValid;
	}

	// Сеттер для установки значения errorMessages
	set errorMessages(errorMessage: string) {
		this.setTextContent(this._errorDisplay, errorMessage);
	}

	// Метод для отрисовки формы
	renderForm(state: Partial<T> & FormStateInterface) {
		const { valid, errors, ...inputFields } = state;
		super.renderWidget({ valid, errors });
		Object.assign(this, inputFields);
		return this.formContainer;
	}
}