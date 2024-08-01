// Простые типы лучше выносить в отдельные алиасы для удобства изменений
type ListenKey = string | RegExp;
type Handler = Function;
type Notification = {
    key: string,
    info: any
};

export interface INotifier {
    listen<T extends object>(key: ListenKey, handler: (info: T) => void): void;
    notify<T extends object>(key: string, info?: T): void;
    setupTrigger<T extends object>(key: string, extra?: Partial<T>): (info: T) => void;
}

/**
 * Класс Notifier управляет подписками и уведомлениями
 * Позволяет подписываться на события и отправлять уведомления
 */
export class Notifier implements INotifier {
    private registry: Map<ListenKey, Set<Handler>>;

    constructor() {
        this.registry = new Map<ListenKey, Set<Handler>>();
    }

    /**
     * Подписаться на событие
     */
    listen<T extends object>(key: ListenKey, handler: (info: T) => void) {
        if (!this.registry.has(key)) {
            this.registry.set(key, new Set<Handler>());
        }
        this.registry.get(key)?.add(handler);
    }

    /**
     * Отписаться от события
     */
    stopListening(key: ListenKey, handler: Handler) {
        if (this.registry.has(key)) {
            this.registry.get(key)!.delete(handler);
            if (this.registry.get(key)?.size === 0) {
                this.registry.delete(key);
            }
        }
    }

    /**
     * Отправить уведомление
     */
    notify<T extends object>(key: string, info?: T) {
        this.registry.forEach((handlers, registeredKey) => {
            if (registeredKey instanceof RegExp && registeredKey.test(key) || registeredKey === key) {
                handlers.forEach(handler => handler(info));
            }
        });
    }

    /**
     * Подписаться на все события
     */
    listenAll(handler: (notification: Notification) => void) {
        this.listen("*", handler);
    }

    /**
     * Отписаться от всех событий
     */
    stopAll() {
        this.registry = new Map<ListenKey, Set<Handler>>();
    }

    /**
     * Создать триггер для события
     */
    setupTrigger<T extends object>(key: string, extra?: Partial<T>) {
        return (info: object = {}) => {
            this.notify(key, {
                ...(info || {}),
                ...(extra || {})
            });
        };
    }
}