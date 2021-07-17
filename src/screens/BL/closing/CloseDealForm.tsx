import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActionSheet, Picker, Toast } from 'native-base';
import LogoPage from '../../../components/LogoPage';
import { StyleSheet } from 'react-native';
import colors from '../../../constants/colors';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { displayError, fetchAuthToken } from '../../../utils/misc';
import { Context } from '../../../context/UserContext';
import { Input } from 'react-native-elements';
import MultiSelect from 'react-native-multiple-select';
import appApi from '../../../api/appApi';
import { ActivityIndicator, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const CloseDealForm = ({ checklist, route }) => {
	const {
		state: { user },
	} = useContext(Context);

	const { transaction, property } = route.params;

	const [closingProcess, setClosingProcess] = useState('');
	const [closingExt, setClosingExt] = useState('');
	const [amendmentBtns, setAmendmentBtns] = useState('');

	const [extReason, setExtReason] = useState('');

	const [selectedItems, setSelectedItems] = useState([]);

	const [isLoading, setIsLoading] = useState(false);

	var CLOSING_PROCESS_BUTTONS = ['No', 'Yes', 'Cancel'];
	var CLOSING_CANCEL_INDEX = 2;

	var CLOSING_EXT_BUTTONS = ['Seller', 'Buyer', 'Cancel'];
	var CLOSING_EXT_CANCEL_INDEX = 2;

	var AMENDMENT_BUTTONS = ['No', 'Yes', 'Cancel'];
	var AMENDMENT_CANCEL_INDEX = 2;

	const [newProptChecklist, setNewProptChecklist] = useState(undefined);
	const [checklistList, setChecklistList] = useState([]);
	const [loadingList, setLoadingList] = useState(false);

	const newFetchPropertyCheckList = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/fetch_buyer_agent_checked_lists_for_property.php?transaction_id=${transaction.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			// return response;
			return JSON.parse(response.data.response.data?.task_array);
		} catch (error) {
			// displayError(error);
		}
		``;
	};

	// console.log(transaction);

	useEffect(() => {
		setLoadingList(true);
		if (transaction) {
			// fetchTransactionCheckList();
			// fetchPropertyCheckList();
			newFetchPropertyCheckList().then((res) => {
				setNewProptChecklist(res);
				setChecklistList(res?.filter((list, index) => list.status == '1'));
				setLoadingList(false);
				console.log('res', res);
			});
		}
	}, []);
	// console.log(transaction, '\n \n', property);

	const onSubmitForm = async () => {
		try {
			setIsLoading(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('user_id', user.unique_id);
			// data.append('offer_id', user.unique_id);
			data.append('closing_process_status', closingProcess);
			data.append('outstanding_tasks', JSON.stringify(selectedItems));
			data.append('closing_date_extension_request_by', closingExt);
			data.append('extension_reason', extReason);
			data.append('amendment_status', amendmentBtns);
			data.append('transaction_id', transaction.transaction_id);

			const response = await appApi.post(`/close_deal.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.data.response.status == 200) {
				Toast.show({
					type: 'success',
					text: response.data.response.message,
					duration: 5000,
				});
				console.log(response.data.response.message);
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
					duration: 5000,
				});
				console.log(response.data.response.message);
			}
			setIsLoading(false);
		} catch (error) {
			displayError(error);
			setIsLoading(false);
			console.log(error);
		}
	};

	// const items = [];
	// checklist.map((c) => items.push({ id: c.id, name: c.task }));

	const selectRef = useRef(null);

	const onSelectedItemsChange = (sI) => {
		setSelectedItems(sI);
	};

	const dropDownItems = newProptChecklist?.map((item, index) => ({
		id: index,
		name: item.task,
	}));

	if (loadingList) {
		return (
			<LogoPage>
				<ActivityIndicator size={'large'} color={colors.white} />
			</LogoPage>
		);
	}

	return (
		<React.Fragment>
			<LogoPage dontShow={true}>
				<View style={{ marginVertical: RFValue(20) }}>
					<TouchableOpacity
						style={styles.selects}
						onPress={() =>
							ActionSheet.show(
								{
									options: CLOSING_PROCESS_BUTTONS,
									cancelButtonIndex: CLOSING_CANCEL_INDEX,
									title: 'Has the agent completed all necessary tasks?',
								},
								(buttonIndex) => {
									if (buttonIndex !== CLOSING_CANCEL_INDEX) {
										setClosingProcess(buttonIndex);
									}
								},
							)
						}
					>
						<Text style={styles.title}>Closing Process Status?</Text>
						<Text style={styles.body}>
							{' '}
							{CLOSING_PROCESS_BUTTONS[closingProcess] ||
								'Has the agent completed all necessary tasks?'}{' '}
						</Text>
					</TouchableOpacity>

					{closingProcess === 0 ? (
						<View style={{ backgroundColor: colors.brown }}>
							<MultiSelect
								styleDropdownMenu={{ backgroundColor: colors.brown }}
								styleItemsContainer={{ backgroundColor: colors.brown }}
								styleListContainer={{ backgroundColor: colors.lightBrown }}
								styleMainWrapper={{ backgroundColor: colors.lightGrey }}
								hideTags
								items={dropDownItems}
								uniqueKey='name'
								ref={selectRef}
								onSelectedItemsChange={onSelectedItemsChange}
								selectedItems={selectedItems}
								selectText='Pick Items'
								// searchInputPlaceholderText='Search Items...'
								onChangeInput={(text) => {}}
								tagRemoveIconColor='#CCC'
								tagBorderColor='#CCC'
								tagTextColor='#CCC'
								selectedItemTextColor='#CCC'
								selectedItemIconColor='#CCC'
								itemTextColor='#000'
								displayKey='name'
								searchInputStyle={{ color: '#CCC' }}
								submitButtonColor='#CCC'
								submitButtonText='Submit'
							/>
							<View>
								{selectRef.current &&
									selectRef.current.getSelectedItemsExt(selectedItems)}
							</View>
						</View>
					) : null}

					<TouchableOpacity
						style={styles.selects}
						onPress={() =>
							ActionSheet.show(
								{
									options: CLOSING_EXT_BUTTONS,
									cancelButtonIndex: CLOSING_EXT_CANCEL_INDEX,
									title: 'Closing Date Extension Requested by?',
								},
								(buttonIndex) => {
									if (buttonIndex !== CLOSING_EXT_CANCEL_INDEX) {
										setClosingExt(buttonIndex);
									}
								},
							)
						}
					>
						<Text style={styles.title}>
							Closing Date Extension Requested by?
						</Text>
						<Text style={styles.body}>
							{' '}
							{CLOSING_EXT_BUTTONS[closingExt] ||
								'Closing Date Extension Requested by?'}{' '}
						</Text>
					</TouchableOpacity>

					{closingExt === 0 || closingExt === 1 ? (
						<View>
							<Input
								placeholder='Reason'
								label='Enter reason'
								labelStyle={{ color: colors.white }}
								placeholderTextColor={colors.lightGrey}
								value={extReason}
								onChangeText={setExtReason}
							/>
						</View>
					) : null}

					<TouchableOpacity
						style={styles.selects}
						onPress={() =>
							ActionSheet.show(
								{
									options: AMENDMENT_BUTTONS,
									cancelButtonIndex: AMENDMENT_CANCEL_INDEX,
									title: 'Amendment Status?',
								},
								(buttonIndex) => {
									if (buttonIndex !== AMENDMENT_CANCEL_INDEX) {
										setAmendmentBtns(buttonIndex);
									}
								},
							)
						}
					>
						<Text style={styles.title}>Amendment Status?</Text>
						<Text style={styles.body}>
							{' '}
							{AMENDMENT_BUTTONS[amendmentBtns] ||
								'Has all repairs been done?'}{' '}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={{ backgroundColor: colors.white, paddingVertical: 10 }}
						onPress={onSubmitForm}
					>
						{isLoading ? (
							<ActivityIndicator />
						) : (
							<Text style={{ textAlign: 'center', color: colors.bgBrown }}>
								Submit
							</Text>
						)}
					</TouchableOpacity>
				</View>
			</LogoPage>
		</React.Fragment>
	);
};

export default CloseDealForm;

const styles = StyleSheet.create({
	title: {
		fontSize: 18,
		color: colors.black,
		fontWeight: 'bold',
	},
	body: {
		paddingVertical: 10,
		color: colors.white,
	},
	selects: {
		marginVertical: 10,
	},
});
