import * as React from 'react';
import * as RN from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';
// import { SearchBar } from 'react-native-elements';
import { Searchbar as SearchBar } from 'react-native-paper';

import _font from '../styles/fontStyles';
import _colors from '../constants/colors';
import colors from '../constants/colors';
import { fetchAuthToken } from '../utils/misc';
import axios from 'axios';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

interface Props {
	value?: string;
	placeholder?: string;
	searchScreen?: string;
	placeholderTextColor?: string;
	onChangeText?: (e: string) => void;
	onSubmitSearch?: (e?: string) => void;
	containerStyle?: RN.ViewStyle;
	inputStyle?: RN.TextStyle;
	searchItemViewScreen?: string;
}

export default function SearchInputBar(props: Props) {
	const navigation = useNavigation();

	const [searchValue, setSearchValue] = useState('');

	const [searchResult, setSearchResult] = useState(undefined);

	const submitSearch = async () => {
		const token = await fetchAuthToken();
		const data = new FormData();
		// console.log(searchValue);
		data.append('keyword', searchValue);
		axios
			.post(
				'https://mydealtracker.staging.cloudware.ng/api/search_property.php',
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
			.then((res) => {
				const data = res.data.response.data;
				setSearchResult(data);
				navigation.navigate(props.searchScreen ?? 'searchScreen', {
					search: searchValue,
					searchScreen: props.searchScreen,
				});
			})
			.catch((err) => {
				// console.log(err);
			});
	};

	const onSubmitSearch = () =>
		navigation.navigate(props.searchScreen ?? 'searchScreen', {
			search: searchValue,
			searchScreen: props.searchScreen,
			searchItemViewScreen: props.searchItemViewScreen,
		});

	return (
		<SearchBar
			placeholder={props.placeholder ?? 'Search here'}
			placeholderTextColor={props.placeholderTextColor ?? 'grey'}
			value={searchValue}
			autoCapitalize='none'
			// containerStyle={{ ...styles.container }}
			style={{ ...styles.container }}
			inputStyle={{ ...styles.input }}
			// inputContainerStyle={styles.input}
			// lightTheme={true}
			onSubmitEditing={() => onSubmitSearch()}
			// onSubmitEditing={() => props.onSubmitSearch()}
			onIconPress={() => onSubmitSearch()}
			// platform={'default'}
			// searchIcon={false}
			onChangeText={(text) => setSearchValue(text)}
			// clearIcon={false}
		/>
	);
}

const styles = RN.StyleSheet.create({
	container: {
		height: RFValue(50),
	},
	input: { ..._font.Medium, height: RFValue(50) },
});
