import { Api, ApiListResponse } from './base/api'; // Импорт базового класса API и типа ответа
import { IOrderResult, IItem, IOrderInfo, IProjectAPI, } from '../types'; // Импорт интерфейсов

// Определение класса ProjectAPI, который расширяет базовый класс Api
export class ProjectAPI extends Api implements IProjectAPI{
    readonly serverForImages: string; // Переменная для хранения URL сервера изображений

    // Конструктор класса
    constructor(serverForImages: string, baseApiUrl: string, optionsMaybe?: RequestInit) {
        super(baseApiUrl, optionsMaybe); // Вызов конструктора базового класса
        this.serverForImages = serverForImages; // Инициализация сервера изображений
    }

    // Метод для получения списка продуктов
    getProductList(): Promise<IItem[]> {
        return this.get('/product').then((apiResponse: ApiListResponse<IItem>) => {
            let productsWithImages = []; // Массив для хранения продуктов с полными путями к изображениям
            for (let i = 0; i < apiResponse.items.length; i++) {
                let product = apiResponse.items[i]; // Текущий продукт
                product.image = this.serverForImages + product.image; // Добавление полного пути к изображению
                productsWithImages.push(product); // Добавление продукта в массив
            }
            return productsWithImages; // Возврат массива продуктов
        });
    }

    // Метод для получения деталей продукта по ID
    getProductItem(productId: string): Promise<IItem> {
        return this.get(`/product/${productId}`).then((productDetail: IItem) => {
            productDetail.image = this.serverForImages + productDetail.image; // Добавление полного пути к изображению
            return productDetail; // Возврат деталей продукта
        });
    }

    // Метод для создания заказа
    orderProducts(orderInfo: IOrderInfo): Promise<IOrderResult> {
        return this.post(`/order`, orderInfo).then((orderResult: IOrderResult) => {
            return orderResult; // Возврат результата заказа
        });
    }
}