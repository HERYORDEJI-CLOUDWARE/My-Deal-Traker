import createDataContext from './createDataContext';
import { Alert, Platform } from 'react-native';
import { Toast } from 'native-base';
import { catchError, displayError, fetchAuthToken } from '../utils/misc';
import appApi from '../api/appApi';
import { navigate } from '../nav/RootNav';
import axios from 'axios';

const userStoreReducer = (state, action) => {
	switch (action.type) {
		case 'AUTH':
			return { ...state, user: action.payload };
		case 'LOGOUT':
			return { user: null };
		case 'SA_LISTINGS':
			return { ...state, salistings: action.payload };
		case 'LAWYERS_PROPS':
			return { ...state, lawyersProp: action.payload };
		case 'FETCH_B_LAWYER_PROPS':
			return { ...state, b_lawyerProps: action.payload };
		case 'SELLER_TRANS':
			return { ...state, sellerTrans: action.payload };
		case 'FETCH_BUYER_TRANS':
			return { ...state, buyerTrans: action.payload };
		case 'SUBSCRIPTION_STATUS':
			return { ...state, subStatus: action.payload };
		default:
			return state;
	}
};

const logout = (dispatch) => async () => {
	try {
		dispatch({
			type: 'LOGOUT',
		});
	} catch (error) {}
};

const registerAccount = (dispatch) => async (values) => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.post('/register_user.php', values, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		if (response.data.response.status == 200) {
			Toast.show({
				type: 'success',
				text: response.data.response.message,
				duration: 6000,
			});
			navigate('loginScreen');
		} else {
			Toast.show({
				type: 'warning',
				text: response.data.response.message,
				duration: 6000,
			});
		}
	} catch (error) {
		displayError(error);
	}
};

const userLogin = (dispatch) => async (values, role) => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.post('/login_user.php', values, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		// // console.log(response.data.response.status)
		// console.log("I'm in login action");
		if (response.data.response.status == 200) {
			Toast.show({
				type: 'success',
				text: response.data.response.message,
			});
			const userObj = response.data.response.data;
			dispatch({
				type: 'AUTH',
				payload: response.data.response.data,
			});
			// navigate("");

			// if (role == "7") {
			//   navigate("mortgageBrokerHome");
			//   // console.log("He is a mortgage Broker")
			// }

			// if (role == "2") {
			//   // navigate("sellerStack");
			//   navigate("screenStack");
			// }

			// if (role == "3") {
			//   // navigate("baStack");
			//   navigate("screenStack");
			// }
			// if (role == "4") {
			//   // navigate("saStack");
			//   navigate("screenStack");
			// }
			// if (role == "5") {
			//   // navigate("slStack");
			//   navigate("screenStack");
			// }
			// if (role == "6") {
			//   // navigate("blStack");
			//   navigate("screenStack");
			// }
			// if (role == "7") {
			//   // navigate("baStack");
			//   navigate("screenStack");
			// }
		} else {
			Toast.show({
				type: 'danger',
				text: response.data.response.message,
			});
		}
	} catch (error) {
		displayError(error);
	}
};

const createNewListing = (dispatch) => async (data) => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.post(`/list_property.php`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (response.data.response.status == 200) {
			Toast.show({
				type: 'success',
				text: response.data.response.message,
			});
			navigate('saHomepage');
		} else {
			Toast.show({
				type: 'danger',
				text: response.data.response.message,
			});
		}
	} catch (error) {
		displayError(error);
	}
};

const fetchSAListings = (dispatch) => async (email) => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.get(
			`/listing_agent_property.php?user_id=${email}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		// // console.log(response.data)
		if (response.data.response.status == 200) {
			dispatch({
				type: 'SA_LISTINGS',
				payload: response.data.response.data,
			});
			// Toast.show({
			//   type: "success",
			//   text: response.data.response.message,
			// });
			// navigate("saHomepage");
		} else {
			Toast.show({
				type: 'warning',
				text: response.data.response.message,
			});
		}
	} catch (error) {
		displayError(error);
	}
};

const fetchLawyerTrans = (dispatch) => async (email) => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.get(
			`/fetch_seller_lawyer_properties.php?phone_email=${email}`,
			{
				headers: {
					Authorization: 'Bearer ' + token,
				},
			},
		);
		if (response.data.response.status === 200) {
			dispatch({
				type: 'LAWYERS_PROPS',
				payload: response.data.response.data,
			});
		} else {
			Toast.show({
				type: 'warning',
				text: response.data.response.message,
			});
		}
	} catch (error) {
		displayError(error);
	}
};

const fetchBuyerLawyerTrans = (dispatch) => async (email) => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.get(
			`/fetch_buyer_lawyer_properties.php?phone_email=${email}`,
			{
				headers: {
					Authorization: 'Bearer ' + token,
				},
			},
		);
		if (response.data.response.status === 200) {
			dispatch({
				type: 'FETCH_B_LAWYER_PROPS',
				payload: response.data.response.data,
			});
		} else {
			Toast.show({
				type: 'warning',
				text: response.data.response.message,
			});
		}
	} catch (error) {
		displayError(error);
	}
};

const fetchSellerTrans = (dispatch) => async (email) => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.get(
			`/fetch_transaction_for_seller.php?seller_email=${email}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		if (response.data.response.status == 200) {
			dispatch({
				type: 'SELLER_TRANS',
				payload: response.data.response.data,
			});
		} else {
			Toast.show({
				type: 'warning',
				text: response.data.response.message,
			});
		}
	} catch (error) {
		displayError(error);
	}
};

const fetchBuyerTrans = (dispatch) => async (email) => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.get(
			`/fetch_transaction_for_buyer.php?buyer_email=${email}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		// console.log('^^^^^^^^^', response.data.response.data);
		if (response.data.response.status == 200) {
			dispatch({
				type: 'FETCH_BUYER_TRANS',
				payload: response.data.response.data,
			});
		} else {
			Toast.show({
				type: 'warning',
				text: response.data.response.message,
			});
		}
	} catch (error) {
		displayError(error);
		catchError(error);
	}
};

export const getBuyerTrans = async (email) => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.get(
			`/fetch_transaction_for_buyer.php?buyer_email=${email}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return response.data.response.data;
	} catch (error) {
		displayError(error);
		catchError(error);
	}
};

export const fetchRandomProperties = async () => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.get(`/fetch_random_properties.php`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (e) {
		catchError(e);
	}
};

export const getRandomProperties = async () => {
	try {
		const endpoint = `https://mydealtracker.staging.cloudware.ng/api/fetch_random_properties.php`;
		const token = await fetchAuthToken();
		const res = await axios.get(endpoint, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res.data;
	} catch (err) {
		// console.log('API conection failed');
	}
};

export const getSellerProperties = async (email) => {
	try {
		const endpoint = `https://mydealtracker.staging.cloudware.ng/api/fetch_seller_properties.php?phone_email=${email}`;
		const token = await fetchAuthToken();
		const res = await axios.get(endpoint, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res.data;
	} catch (err) {
		// console.log('API conection failed');
	}
};

export const getSearchedProperty = async (keyword) => {
	try {
		const token = await fetchAuthToken();
		const data = new FormData();
		data.append('keyword', keyword);
		return await axios.post(
			'https://mydealtracker.staging.cloudware.ng/api/search_property.php',
			data,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		// .then((res) => {
		// 	const data = res.data.response.data;
		// 	search.current = data;
		// 	navigation.navigate('mortgageSearchScreen', { search: search });
		// })
	} catch (e) {
		displayError(e);
	}
};

export const getPropertyTransaction = async (property_transaction_id) => {
	try {
		const token = await fetchAuthToken();
		return await appApi.get(
			`/get_property_transactions.php?property_transaction_id=${property_transaction_id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		// URL: get_property_transactions
		// Parameter: property_transaction_id
		// Type: GET
	} catch (e) {
		displayError(e);
	}
};

export const getProptTrans = async (property) => {
	try {
		const token = await fetchAuthToken();
		const data = new FormData();
		return await appApi.get(
			`/get_property_transactions.php?property_transaction_id=${property.transaction_id}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
	} catch (error) {}
};

export const newFetchBuyerTrans = async (email) => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.get(
			`/fetch_transaction_for_buyer.php?buyer_email=${email}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return response.data.response.data;
		// // console.log('^^^^^^^^^', response.data.response);
		// if (response.data.response.status == 200) {
		// 	return response.data.response.data;
		// } else {
		// 	// console.log('Network too poor');
		// }
	} catch (error) {
		displayError(error);
		catchError(error);
	}
};

const fetchSubStatus = (dispatch) => async (userid) => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.get(
			`/get_user_active_plans_with_details.php?user_id=${userid}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		// console.log(response.data.response.status);
		if (response.data.response.status === 200) {
			dispatch({
				type: 'SUBSCRIPTION_STATUS',
				payload: response.data.response.data[0],
			});
		} else {
			Toast.show({
				type: 'warning',
				text: response.data.response.message,
				duration: 5000,
			});
		}
	} catch (error) {
		displayError(error);
	}
};

const subscribeToPlan = (dispatch) => async (data) => {
	try {
		const token = await fetchAuthToken();
		const response = await appApi.post(`/plan_subscription.php`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		// console.log('===', response.data);
	} catch (error) {
		displayError(error);
	}
};

export const { Provider, Context } = createDataContext(
	userStoreReducer,
	{
		registerAccount,
		userLogin,
		createNewListing,
		fetchSAListings,
		logout,
		fetchLawyerTrans,
		fetchBuyerLawyerTrans,
		fetchSellerTrans,
		fetchBuyerTrans,
		fetchSubStatus,
		subscribeToPlan,
	},
	{
		lawyersProp: [],
	},
);
