export const API_URL = `https://larek-api.nomoreparties.co/api/weblarek`;
export const CDN_URL = `https://larek-api.nomoreparties.co/content/weblarek`;

export const settings = {

};

// Настройки приложения (пока пустые)
export const appSettings = {};

// Классы CSS для различных категорий элементов на странице
export const elementCategories: { [key: string]: string } = {
	'soft-skill': 'item__type_softSkill',
	'hard-skill': 'item__type_hardSkill',
	button: 'item__type_button',
	additional: 'item__type_additional',
	other: 'item__type_other',
};

// Способы оплаты, доступные в системе
export const paymentOptions: { [key: string]: string } = {
	cardPayment: 'online_payment',
	cashPayment: 'cash_payment',
};