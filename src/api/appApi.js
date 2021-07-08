import axios from 'axios';

export default axios.create({
	baseURL: 'https://mydealtracker.staging.cloudware.ng/api',
});

export const demoMeLink =
	'https://mydealtracker.staging.cloudware.ng/api/fetch_transaction_for_buyer.php?buyer_email=heryordejy.cloudware@gmail.com';
