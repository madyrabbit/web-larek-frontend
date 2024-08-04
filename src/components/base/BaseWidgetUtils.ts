// Базовые компоненты

export abstract class BaseWidget<T> {
	protected constructor(protected readonly container: HTMLElement) {
	    // Код в конструкторе выполняется до всех объявлений в дочернем классе
	}
    
    // Методы для работы с DOM в дочерних компонентах
    
    // Переключаем класс
	toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

    // Устанавливаем текстовое содержимое
	protected setTextContent(element: HTMLElement, textValue: unknown) {
	    if (element) {
			element.textContent = String(textValue);
		}
	}

    // Изменяем статус блокировки
	setElementDisabled(element: HTMLElement, isDisabled: boolean) {
		if (element) {
			if (isDisabled) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
		}
	}

    // Скрываем элемент
	protected hideElement(element: HTMLElement) {
        if (element) {
		    element.style.display = 'none';
        }
	}

    // Показываем элемент
	protected showElement(element: HTMLElement) {
        if (element) {
		    element.style.removeProperty('display');
        }
	}

    // Устанавливаем изображение с альтернативным текстом
	protected setImageWithAltText(imageElement: HTMLImageElement, imageUrl: string, altText?: string) {
		if (imageElement) {
			imageElement.src = imageUrl;
			if (altText) {
				imageElement.alt = altText;
			}
		}
	}

  // Возвращаем корневой DOM-элемент
	renderWidget(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}