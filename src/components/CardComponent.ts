import { BaseWidget } from './base/BaseWidgetUtils';
import { IProductInfo, IActions } from '../types';
import { ensureElement } from '../utils/utils';
import { elementCategories } from '../utils/constants';

// Класс ProductCard управляет отображением карточки товара
export class ProductCard extends BaseWidget<IProductInfo> {
    // Элементы интерфейса карточки товара
    protected _title: HTMLElement; // Заголовок товара
    protected _price: HTMLElement; // Цена товара
    protected _image?: HTMLImageElement; // Изображение товара
    protected _description?: HTMLElement; // Описание товара
    protected _button?: HTMLButtonElement; // Кнопка действия
    protected _category?: HTMLElement; // Категория товара
    protected _index?: HTMLElement; // Позиция в списке
    protected _buttonTitle: string; // Текст кнопки действия

    // Конструктор класса
    constructor(container: HTMLElement, userActions?: IActions) {
        super(container);

        // Инициализация элементов интерфейса
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._image = container.querySelector('.card__image');
        this._button = container.querySelector('.card__button');
        this._description = container.querySelector('.card__text');
        this._category = container.querySelector('.card__category');
        this._index = container.querySelector('.basket__item-index');
        
        // Назначение обработчика событий для кнопки
        if (this._button && userActions) {
            this._button.addEventListener('click', (event: MouseEvent) => {
                userActions.onClick(event);
            });
        }

        // Добавление обработчика клика на контейнер карточки
        if (userActions?.onClick) {
            this.container.addEventListener('click', userActions.onClick);
        }
    }
    
    // Метод для активации или деактивации кнопки действия
    disableActionButton(isDisabled: boolean) {
        if (this._button) {
            this._button.disabled = isDisabled;
        }
    }

    // Сеттеры и геттеры для свойств карточки товара
    set productId(id: string) {
        this.container.dataset.productId = id;
    }

    get productId(): string {
        return this.container.dataset.productId || '';
    }

    set title(title: string) {
        if (this._title) {
            this.updateText(this._title, title);
        }
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: number | null) {
        if (this._price) {
            this.updateText(
                this._price,
                value ? `${value} credits` : 'Priceless'
            );
        }
        this.disableActionButton(value === null);
    }

    get price(): number {
        return parseFloat(this._price.textContent || '0');
    }

    set category(value: string) {
        if (this._category) {
            this.updateText(this._category, value);
            this._category.classList.add(elementCategories[value]);
        }
    }

    get category(): string {
        return this._category.textContent || '';
    }

    set index(value: string) {
        if (this._index) {
            this._index.textContent = value;
        }
    }

    get index(): string {
        return this._index.textContent || '';
    }

    set image(value: string) {
        this.setImageWithAltText(this._image, value, this.title);
    }

    set details(info: string) {
        if (this._description) {
            this.updateText(this._description, info);
        }
    }

    set buttonTitle(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }

    // Вспомогательный метод для обновления текста в элементе
    private updateText(element: HTMLElement | null, text: string) {
        if (element) {
            element.textContent = text;
        }
    }
}