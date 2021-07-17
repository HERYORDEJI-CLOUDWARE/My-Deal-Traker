import { Toast } from 'native-base';
import appApi from '../api/appApi';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import numbro from 'numbro';

export function _currency(c) {
	// let _c = c.toString();
	return numbro(c).formatCurrency({
		thousandSeparated: true,
	});
}

//  Create our number formatter.
// export var cFormatter = new Intl.NumberFormat('en-US', {
// 	style: 'currency',
// 	currency: 'NGN',

// 	// These options are needed to round to whole numbers if that's what you want.
// 	//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
// 	//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
// });

// export function currencyFormat1(n, currency) {
// 	return n.toFixed(2).replace(/./g, function (c, i, a) {
// 		return i > 0 && c !== '.' && (a.length - i) % 3 === 0 ? ',' + c : c;
// 	});
// }

// export function currencyFormat2(n, currency) {
// 	return currency + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
// }

// export function currencyFormat3(n, currency) {
// 	return new Intl.NumberFormat('ru', {
// 		style: 'currency',
// 		currency: currency,
// 	}).format(n);
// }

export const _consologger = (data) => console.log(data);

export const catchError = (error) => {
	if (error.response) {
		// Request made and server responded
		// console.log(error.response.data);
		// console.log(error.response.status);
		// console.log(error.response.headers);
	} else if (error.request) {
		// The request was made but no response was received
		// console.log(error.request);
	} else {
		// Something happened in setting up the request that triggered an Error
		// console.log('Error', error.message);
	}
};

export const displayError = (error) => {
	let errm = 'Error occured, ' + error.message;
	if (error.response) {
		if (error.response.data) {
			if (error.response.data.error) {
				errm = error.response.data.error;
			}
			if (error.response.data.message) {
				errm = error.response.data.error;
			}
		}
	}
	Toast.show({
		text: errm,
		type: 'danger',
		duration: 6500,
	});
};

export const capitalize = (s) => {
	if (typeof s !== 'string') return '';
	return s.charAt(0).toUpperCase() + s.slice(1);
};

export const average = (numbers) => {
	let sum = 0;
	for (let i = 0; i < numbers.length; i++) {
		sum += numbers[i];
	}
	return sum / numbers.length;
};

export const fetchAuthToken = async () => {
	try {
		const data = new FormData();
		data.append('email', 'similoluwa@similoluwaodeyemi.com');
		data.append('password', 'similoluwa');
		const response = await appApi.post('/generate_token.php', data);
		return response.data.response.message.token;
	} catch (error) {
		displayError(error);
		throw new Error("Couldn't complete authentication");
	}
};

export const createFormData = (arr) => {
	const data = new FormData();
	arr.forEach((element) => {
		data.append(element, element);
	});
	return data;
};

export function validateEmail(email) {
	const re =
		/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

export function numberWithCommas(x) {
	return x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const formatListType = (item) => {
	switch (item) {
		case '0':
			return 'Sale';
		case '1':
			return 'Lease';
		default:
			break;
	}
};

export const propertyType = (item) => {
	switch (item) {
		case '0':
			return 'Commercial';
		case '1':
			return 'Residential';
		default:
			break;
	}
};

export const formatOccupancy = (item) => {
	switch (item) {
		case '0':
			return 'Owner Occupied';
		case '1':
			return 'Tenant Occupied';
		case '2':
			return 'Vacant';
		default:
			break;
	}
};

export const formatStatus = (item) => {
	switch (item) {
		case '0':
			return 'Active';
		case '1':
			return 'Offer-in place';
		case '2':
			return 'Suspended';
		case '3':
			return 'Sold';
		default:
			break;
	}
};

export const getRole = (role) => {
	switch (role) {
		case '1':
			return 'Buyer';
		case '2':
			return 'Seller';
		case '3':
			return "Buyer's Agent";
		case '4':
			return "Seller's Agent";
		case '5':
			return "Seller's Lawyer";
		case '6':
			return "Buyer's Lawyer";
		case '7':
			return 'Mortgage Broker';
		default:
			return 'Error';
	}
};

const saveToDisk = async (uri) => {
	await MediaLibrary.getPermissionsAsync();
	await MediaLibrary.requestPermissionsAsync();
	const asset = await MediaLibrary.createAssetAsync(uri);
	return asset;
};

const downloadResumable = (url, name, onCallback) =>
	FileSystem.createDownloadResumable(
		url,
		FileSystem.documentDirectory + name,
		{},
		(downloadProgress) => {
			const progress =
				downloadProgress.totalBytesWritten /
				downloadProgress.totalBytesExpectedToWrite;
			onCallback(progress);
		},
	);

export const downloadFile = async (link, name, onCallback) => {
	try {
		const { uri } = await downloadResumable(
			link,
			name,
			onCallback,
		).downloadAsync();
		const asset = await saveToDisk(uri);
		const album = await MediaLibrary.createAlbumAsync(
			'My Deal Tracker',
			asset,
			false,
		);
		Toast.show({
			type: 'success',
			text: 'Download successful',
		});
	} catch (error) {
		displayError(error);
	}
};

export const androidPlanIds = [
	'mdt_bronze_plan',
	'mdt_gold_plan',
	'mdt_plat_plan',
	'mdt_sapphire_plan',
	'mdt_master_plan',
	// "mdt_test"
	// "mdt_master_plan"
];

export const plans_unique_id = {
	mdt_bronze_plan: '60ab37fd106b4c086e6c1643a69f0243',
	mdt_gold_plan: 'eb8d4b2794eb6a1f0a0dbd2ef907de45',
	mdt_plat_plan: '8bfaf857732b49ede44f837b6492ac90',
	mdt_sapphire_plan: 'a552ac9385f854e403dff10214174196',
	mdt_master_plan: 'c89aa2880290114883422cb3b75249a8',
};
//plans_unique_id

export const fileUploadCategory = [
	{
		id: '001',
		title: 'Credit Bureau',
		key: '1',
	},
	{
		id: '002',
		title: 'P&S Agreement',
		key: '1',
	},
	{
		id: '001',
		title: 'Amendments & Waiver',
		key: '1',
	},
	{
		id: '001',
		title: 'Credit Bureau',
		key: '1',
	},
	{
		id: '001',
		title: 'Credit Bureau',
		key: '1',
	},
	{
		id: '001',
		title: 'Credit Bureau',
		key: '1',
	},
	{
		id: '001',
		title: 'Credit Bureau',
		key: '1',
	},
	{
		id: '001',
		title: 'Credit Bureau',
		key: '1',
	},
	{
		id: '001',
		title: 'Credit Bureau',
		key: '1',
	},
	{
		id: '001',
		title: 'Credit Bureau',
		key: '1',
	},
	{
		id: '001',
		title: 'Credit Bureau',
		key: '1',
	},
];
