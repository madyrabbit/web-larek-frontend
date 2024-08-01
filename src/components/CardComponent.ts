// import { ProductInfo, UserActions } from '../definitions';
// import { findElement } from '../helpers/domHelpers';

import { BaseWidget } from './base/BaseWidgetUtils';
import { IProductInfo, IActions } from '../types';
import { ensureElement } from '../utils/utils';
import { elementCategories } from '../utils/constants';

// Класс ProductCard управляет отображением карточки товара
export class ProductCard extends BaseWidget<IProductInfo> {
    // Элементы интерфейса карточки товара
    protected headerElement: HTMLElement; // Заголовок товара
    protected costElement: HTMLElement; // Цена товара
    protected pictureElement?: HTMLImageElement; // Изображение товара
    protected detailsElement?: HTMLElement; // Описание товара
    protected actionButton?: HTMLButtonElement; // Кнопка действия
    protected typeElement?: HTMLElement; // Тип товара
    protected positionElement?: HTMLElement; // Позиция в списке
    protected actionButtonLabel: string; // Текст кнопки действия

    // Конструктор класса
    constructor(element: HTMLElement, userActions?: IActions) {
        super(element);

        // Инициализация элементов интерфейса
        this.headerElement = ensureElement<HTMLElement>('.product__header', element);
        this.costElement = ensureElement<HTMLElement>('.product__cost', element);
        this.pictureElement = element.querySelector('.product__picture');
        this.actionButton = element.querySelector('.product__action');
        this.detailsElement = element.querySelector('.product__details');
        this.typeElement = element.querySelector('.product__type');
        this.positionElement = element.querySelector('.cart__item-position');

        // Назначение обработчика событий для кнопки
        if (this.actionButton && userActions) {
            this.actionButton.addEventListener('click', (event: MouseEvent) => {
                userActions.onClick(event);
            });
        }
    }

    // Метод для активации или деактивации кнопки действия
    disableActionButton(isDisabled: boolean) {
        if (this.actionButton) {
            this.actionButton.disabled = isDisabled;
        }
    }

    // Сеттеры и геттеры для свойств карточки товара
    set productId(id: string) {
        this.containerElement.dataset.productId = id;
    }

    get productId(): string {
        return this.containerElement.dataset.productId || '';
    }

    set header(title: string) {
        this.updateText(this.headerElement, title);
    }

    get header(): string {
        return this.headerElement.textContent || '';
    }

    set cost(value: number | null) {
        this.updateText(
            this.costElement,
            value ? `${value} credits` : 'Priceless'
        );
        this.disableActionButton(value === null);
    }

    get cost(): number {
        return parseFloat(this.costElement.textContent || '0');
    }

    set type(value: string) {
        this.updateText(this.typeElement, value);
        this.typeElement.classList.add(elementCategories[value]);
    }

    get type(): string {
        return this.typeElement.textContent || '';
    }

    set position(value: string) {
        this.positionElement.textContent = value;
    }

    get position(): string {
        return this.positionElement.textContent || '';
    }

    set picture(url: string) {
        if (this.pictureElement) {
            this.pictureElement.src = url;
            this.pictureElement.alt = `Image of ${this.header}`;
        }
    }

    set details(info: string) {
        this.updateText(this.detailsElement, info);
    }

    set actionLabel(value: string) {
        if (this.actionButton) {
            this.actionButton.textContent = value;
        }
    }

    // Вспомогательный метод для обновления текста в элементе
    private updateText(element: HTMLElement, text: string) {
        element.textContent = text;
    }
}