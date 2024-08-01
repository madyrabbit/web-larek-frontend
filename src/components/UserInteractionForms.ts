import { FormClass } from './common/FormComponent';
import { IShippingInfo, IContactInfo, IActions } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';


// Класс для управления формой оплаты
export class PaymentForm extends FormClass<IShippingInfo> {
	protected cardPaymentButton: HTMLButtonElement; // Кнопка оплаты картой
	protected cashPaymentButton: HTMLButtonElement; // Кнопка оплаты наличными

	constructor(formElement: HTMLFormElement, events: IEvents, eventHandlers?: IActions) {
		super(formElement, events);

		// Находим элементы кнопок в форме
		this.cardPaymentButton = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this.formContainer
		);
		this.cashPaymentButton = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.formContainer
		);
		this.cardPaymentButton.classList.add('button_alt-active'); // Активируем кнопку карты по умолчанию

		// Назначаем обработчики событий для кнопок
		if (eventHandlers.onClick) {
			this.cardPaymentButton.addEventListener('click', eventHandlers.onClick);
			this.cashPaymentButton.addEventListener('click', eventHandlers.onClick);
		}
	}

	// Метод для переключения активной кнопки оплаты
	switchPaymentMethod(target: HTMLElement) {
		this.cardPaymentButton.classList.toggle('button_alt-active');
		this.cashPaymentButton.classList.toggle('button_alt-active');
	}

	// Установка адреса доставки
	set deliveryAddress(address: string) {
		(this.formContainer.elements.namedItem('address') as HTMLInputElement).value = address;
	}
}

// Класс для управления формой контактных данных
export class ContactDetailsForm extends FormClass<IContactInfo> {
	constructor(formElement: HTMLFormElement, events: IEvents) {
		super(formElement, events);
	}

	// Установка номера телефона
	set phoneNumber(phone: string) {
		(this.formContainer.elements.namedItem('phone') as HTMLInputElement).value = phone;
	}

	// Установка электронной почты
	set emailAddress(email: string) {
		(this.formContainer.elements.namedItem('email') as HTMLInputElement).value = email;
	}
}