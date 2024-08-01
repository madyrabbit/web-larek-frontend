import './scss/styles.scss';

import { ProjectAPI } from './components/ProjectAPI';
import { API_URL, CDN_URL, elementCategories } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { StoreState, ProductListUpdateEvent } from './components/AppState';
import { Page } from './components/PageComponents';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/ModalComponent';
import { IContactInfo, IShippingInfo, IOrderInfo, IItem } from './types';
import { ProductCard } from './components/CardComponent';
import { ShoppingCart } from './components/BasketManager';
import { PaymentForm, ContactDetailsForm } from './components/UserInteractionForms';
import { OperationResult } from './components/ActionResultDisplay';

// Создаем объекты для управления событиями и сервисами
const eventHub = new EventEmitter();
const larekService = new ProjectAPI(CDN_URL, API_URL);

// Находим шаблоны в HTML
const productCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const productCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const shippingTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Создаем основные компоненты приложения
const appState = new StoreState({}, eventHub);
const page = new Page(document.body, eventHub);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), eventHub);
const shoppingCart = new ShoppingCart(cloneTemplate(cartTemplate), eventHub);
const paymentForm = new PaymentForm(cloneTemplate(shippingTemplate), eventHub, {
    onClick: (ev: Event) => eventHub.emit('payment:change', ev.target),
});
const contactDetailsForm = new ContactDetailsForm(cloneTemplate(contactTemplate), eventHub);

// Обработка событий
eventHub.on<ProductListUpdateEvent>('products:updated', () => {
    page.catalog = appState.inventory.map((product) => {
        const card = new ProductCard(cloneTemplate(productCatalogTemplate), {
            onClick: () => eventHub.emit('product:select', product),
        });
        return card.renderWidget({
            title: product.title,
            image: product.image,
            price: product.price,
            category: product.category,
        });
    });
});

eventHub.on('product:select', (product: IItem) => {
    appState.setHighlightedProduct(product);
});

eventHub.on('preview:updated', (product: IItem) => {
    const card = new ProductCard(cloneTemplate(productPreviewTemplate), {
        onClick: () => {
            eventHub.emit('product:toggle', product);
            card.actionLabel = appState.shoppingBasket.includes(product) ? 'Remove from Cart' : 'Add to Cart';
        },
    });
    modal.render({
        content: card.renderWidget({
            title: product.title,
            description: product.description,
            image: product.image,
            price: product.price,
            category: product.category,
            buttonTitle: appState.shoppingBasket.includes(product) ? 'Remove from Cart' : 'Add to Cart',
        }),
    });
});

// Добавление и удаление продуктов из корзины
eventHub.on('product:toggle', (product: IItem) => {
    if (!appState.shoppingBasket.includes(product)) {
        eventHub.emit('product:add', product);
    } else {
        eventHub.emit('product:remove', product);
    }
});

eventHub.on('product:add', (product: IItem) => {
    appState.putInBasket(product);
});

eventHub.on('product:remove', (product: IItem) => appState.takeOutOfBasket(product));

// Обновление корзины
eventHub.on('cart:updated', (products: IItem[]) => {
    shoppingCart.cartItems = products.map((product, index) => {
        const card = new ProductCard(cloneTemplate(productCartTemplate), {
            onClick: () => {
                eventHub.emit('product:remove', product);
            },
        });
        return card.renderWidget({
            index: (index + 1).toString(),
            title: product.title,
            price: product.price,
        });
    });
    const total = products.reduce((sum, product) => sum + product.price, 0);
    shoppingCart.totalAmount = total;
    appState.currentTransaction.totalAmount = total;
    shoppingCart.enableCheckoutButton(total === 0);
});

// Открытие корзины
eventHub.on('cart:open', () => {
    modal.render({
        content: shoppingCart.renderWidget({}),
    });
});

// Открытие формы доставки
eventHub.on('order:begin', () => {
    modal.render({
        content: paymentForm.renderForm({
            methodOfPayment: '',
            deliveryAddress: '',
            valid: false,
            errors: [],
        }),
    });
    appState.currentTransaction.lineItems = appState.shoppingBasket.map((product) => product.id);
});

// Смена способа оплаты
eventHub.on('payment:change', (target: HTMLElement) => {
    if (!target.classList.contains('active-button')) {
        paymentForm.switchPaymentMethod(target);
        appState.currentTransaction.methodOfPayment = elementCategories[target.getAttribute('name')];
        console.log(appState.currentTransaction);
    }
});

// Изменение состояния валидации форм
eventHub.on('formErrors:updated', (errors: Partial<IOrderInfo>) => {
    const { methodOfPayment, deliveryAddress, buyerEmail, buyerPhone } = errors;
    paymentForm.isValid = !methodOfPayment && !deliveryAddress;
    contactDetailsForm.isValid = !buyerEmail && !buyerPhone;
    paymentForm.errorMessages = Object.values({ methodOfPayment, deliveryAddress })
        .filter(Boolean)
        .join('; ');
    contactDetailsForm.errorMessages = Object.values({ buyerEmail, buyerPhone })
        .filter(Boolean)
        .join('; ');
});

// Изменение полей доставки
eventHub.on(
    /^order\..*:change/,
    (data: { field: keyof IShippingInfo; value: string }) => {
        appState.updateShippingDetails(data.field, data.value);
    }
);

// Изменение полей контактов
eventHub.on(
    /^contacts\..*:change/,
    (data: { field: keyof IContactInfo; value: string }) => {
        appState.updateContactDetails(data.field, data.value);
    }
);

// Событие заполненности формы доставки
eventHub.on('delivery:ready', () => {
    paymentForm.isValid = true;
});

// Событие заполненности формы контактов
eventHub.on('contact:ready', () => {
    contactDetailsForm.isValid = true;
});

// Событие перехода к форме контактов
eventHub.on('order:proceed', () => {
    modal.render({
        content: contactDetailsForm.renderForm({
            buyerEmail: '',
            buyerPhone: '',
            valid: false,
            errors: [],
        }),
    });
});

// Оформление заказа
eventHub.on('contacts:confirm', () => {
    larekService
        .orderProducts(appState.currentTransaction)
        .then((result) => {
            appState.clearBasket();
            appState.resetTransaction();
            const success = new OperationResult(cloneTemplate(successTemplate), {
                onAction: () => {
                    modal.close();
                },
            });
            success.resultText = result.total.toString();

            modal.render({
                content: success.renderWidget({}),
            });
        })
        .catch((err) => {
            console.error(err);
        });
});

// Модальное окно открыто
eventHub.on('Modal:open', () => {
    page.locked = true;
});

// Модальное окно закрыто
eventHub.on('Modal:close', () => {
    page.locked = false;
});

// Получение и отображение списка продуктов при загрузке страницы
larekService
    .getProductList()
    .then(appState.refreshInventory.bind(appState))
    .catch((err) => {
        console.log(err);
    });