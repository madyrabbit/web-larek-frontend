import { IEvents } from '../base/events';

// Проверка, что переданный объект является экземпляром IEvents
export function checkEntityType(obj: any): obj is EntityBase<any> {
    // Возвращает true, если obj является экземпляром IEvents
    return obj instanceof EntityBase;
}

/**
 * Класс IEvents предназначен для создания объектов, которые могут взаимодействовать с системой событий
 */
export abstract class EntityBase<DataType> {
    // Конструктор принимает начальные данные и систему управления событиями
    constructor(protected data: Partial<DataType>, protected broadcaster: IEvents) {
        // Присваиваем начальные данные свойствам объекта
        Object.assign(this, data);
    }

    // Метод для оповещения о изменениях в данных
    broadcastChange(eventType: string, details?: object) {
        // Если детали не заданы, используем пустой объект
        const changeDetails = details ?? {};
        // Оповещаем систему событий о произошедших изменениях
        this.broadcaster.emit(eventType, changeDetails);
    }

    // Дополнительные методы для работы с данными можно добавить здесь
}