import {
	requestOneTimePayment,
	requestBillingAgreement,
} from 'react-native-paypal';

// For one time payments
export const RNPayPay = async ({
	nonce,
	payerId,
	email,
	firstName,
	lastName,
	phone,
}) =>
	await requestOneTimePayment(token, {
		amount: '5', // required
		// any PayPal supported currency (see here: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/#paypal-account-payments)
		currency: 'GBP',
		// any PayPal supported locale (see here: https://braintree.github.io/braintree_ios/Classes/BTPayPalRequest.html#/c:objc(cs)BTPayPalRequest(py)localeCode)
		localeCode: 'en_GB',
		shippingAddressRequired: false,
		userAction: 'commit', // display 'Pay Now' on the PayPal review page
		// one of 'authorize', 'sale', 'order'. defaults to 'authorize'. see details here: https://developer.paypal.com/docs/api/payments/v1/#payment-create-request-body
		intent: 'authorize',
	});
