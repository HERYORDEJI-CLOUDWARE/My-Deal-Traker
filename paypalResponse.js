const res = {
	id: '9GS12241FC738951B',
	intent: 'CAPTURE',
	status: 'COMPLETED',
	purchase_units: [
		{
			reference_id: 'default',
			amount: { currency_code: 'USD', value: '25.00' },
			payee: {
				email_address: 'sb-ufpo14939560@business.example.com',
				merchant_id: 'P8YMR6SCGYKEU',
			},
			soft_descriptor: 'PAYPAL *JOHNDOESTES',
			shipping: {
				name: { full_name: 'AYODEJI YUSUF OYEBODE' },
				address: {
					address_line_1: 'Ashi Rd',
					admin_area_2: 'Ibadan',
					admin_area_1: 'OYO STATE',
					country_code: 'NG',
				},
			},
			payments: {
				captures: [
					{
						id: '2JG37468BE762340H',
						status: 'COMPLETED',
						amount: { currency_code: 'USD', value: '25.00' },
						final_capture: true,
						seller_protection: {
							status: 'ELIGIBLE',
							dispute_categories: [
								'ITEM_NOT_RECEIVED',
								'UNAUTHORIZED_TRANSACTION',
							],
						},
						create_time: '2021-07-19T09:04:27Z',
						update_time: '2021-07-19T09:04:27Z',
					},
				],
			},
		},
	],
	payer: {
		name: { given_name: 'AYODEJI YUSUF', surname: 'OYEBODE' },
		email_address: 'heryordejy.cloudware@gmail.com',
		payer_id: '52Y9C6372XGDY',
		address: { country_code: 'NG' },
	},
	create_time: '2021-07-19T09:03:11Z',
	update_time: '2021-07-19T09:04:27Z',
	links: [
		{
			href: 'https://api.sandbox.paypal.com/v2/checkout/orders/9GS12241FC738951B',
			rel: 'self',
			method: 'GET',
		},
	],
};

const yusuf = {
	allow_rollover: '0',
	allowed_listings: '5',
	date_subscribed: '2021-06-30 11:22:37',
	description: 'Enjoy free plan',
	expiry_date: '2021-07-10 11:22:37',
	has_rollover: '0',
	listings_made: '3',
	maximum: '5',
	name: 'Free',
	period: 'day',
	period_length: '10',
	plan_id: '1',
	price: null,
	remaining_listings: '2',
	subscription_id: 'ea0cfe159a37b724241887146912ed3a',
	supposed_total_allowed_listings: '275',
	supposed_total_allowed_listings_in_active_plans: '270',
	supposed_total_remaining_listings: '271',
	supposed_total_remaining_listings_in_active_plans: '275',
	total_allowed_listings: '275',
	total_allowed_listings_in_active_plans: '270',
	total_property_listed: '4',
	total_property_listed_in_active_plans: '1',
	total_remaining_listings: '271',
	total_remaining_listings_in_active_plans: '269',
	total_subscription: '3',
	total_subscription_in_active_plans: '2',
	unique_id: '1',
	user_id: 'cfd18a638ec697bcfb3723deb529842b',
};

const femi = {
	allow_rollover: '0',
	allowed_listings: '5',
	date_subscribed: '2021-06-30 11:22:37',
	description: 'Enjoy free plan',
	expiry_date: '2021-07-10 11:22:37',
	has_rollover: '0',
	listings_made: '3',
	maximum: '5',
	name: 'Free',
	period: 'day',
	period_length: '10',
	plan_id: '1',
	price: null,
	remaining_listings: '2',
	subscription_id: 'ea0cfe159a37b724241887146912ed3a',
	supposed_total_allowed_listings: '275',
	supposed_total_allowed_listings_in_active_plans: '270',
	supposed_total_remaining_listings: '271',
	supposed_total_remaining_listings_in_active_plans: '275',
	total_allowed_listings: '275',
	total_allowed_listings_in_active_plans: '270',
	total_property_listed: '4',
	total_property_listed_in_active_plans: '1',
	total_remaining_listings: '271',
	total_remaining_listings_in_active_plans: '269',
	total_subscription: '3',
	total_subscription_in_active_plans: '2',
	unique_id: '1',
	user_id: 'cfd18a638ec697bcfb3723deb529842b',
};

let bundleReason = `This will determine whether to generate multiple APKs 
for different CPU architectures or a single APK bundle that works on all 
devices despite the CPU you're running it on but at the cost of APK bundle size.`;
