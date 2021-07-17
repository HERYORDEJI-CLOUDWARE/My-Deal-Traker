import React, { useContext, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	StyleSheet,
	Text,
	TouchableOpacity,
} from 'react-native';
import { View } from 'react-native';
import LogoPage from '../../../components/LogoPage';
import { Context as UserContext } from '../../../context/UserContext';
import { catchError, displayError, fetchAuthToken } from '../../../utils/misc';
import appApi from '../../../api/appApi';
import { Icon, Toast } from 'native-base';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from '../../../constants/colors';
import _font from '../../../styles/fontStyles';
import ButtonPrimaryBig from '../../../components/ButtonPrimaryBig';

const SLChecklist = ({ route, navigation }) => {
	const [fetchedList, setFetchedList] = useState([]);
	const [propertyCheckList, setPropertyCheckList] = useState([]);
	const [fetchingList, setFetchingList] = useState(true);
	const [isSending, setIsSending] = useState(false);
	const [newProptChecklist, setNewProptChecklist] = useState(undefined);
	const [checklistList, setChecklistList] = useState([]);
	const [loadingList, setLoadingList] = useState(false);
	const {
		state: { user },
	} = useContext(UserContext);

	const { transaction, property } = route.params;

	console.log(transaction, '\n\n', property);

	const readOnlyMode = user?.role === '1' || user?.role === '2' ? true : false;

	// if (!transaction) {
	// 	return (
	// 		<LogoPage>
	// 			<View style={{ alignItems: 'center', justifyContent: 'center' }}>
	// 				<Text style={{ ..._font.Big, color: colors.white }}>
	// 					You have not shown interest in this property
	// 				</Text>
	// 			</View>
	// 		</LogoPage>
	// 	);
	// }

	const fetchTransactionCheckList = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/fetch_buyer_agent_checked_lists_for_property.php?transaction_id=${
					transaction.transaction_id ?? property.transaction_id
				}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (response.data.response.status == 200) {
				if (response.data.response.data) {
					setFetchedList(JSON.parse(response.data.response.data.task_array));
				} else {
					// setFetchedList(response.data.response.data);
				}
			}
			setFetchingList(false);
		} catch (error) {
			setFetchingList(false);
			displayError(error);
			catchError(error);
		}
	};

	// const fetchPropertyCheckList = async () => {
	// 	try {
	// 		const token = await fetchAuthToken();
	// 		const response = await appApi.get(
	// 			`/fetch_tasks.php?property_transaction_id=${property.transaction_id}`,
	// 			{
	// 				headers: {
	// 					Authorization: `Bearer ${token}`,
	// 				},
	// 			},
	// 		);
	// 		if (response.data.response.status == 200) {
	// 			setPropertyCheckList(response.data.response.data);
	// 		}
	// 		setFetchingList(false);
	// 	} catch (error) {
	// 		setFetchingList(false);
	// 		displayError(error);
	// 	}
	// };

	const newFetchPropertyCheckList = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/fetch_tasks.php?property_transaction_id=${property.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			if (response.data.response.status === 200) {
				return response.data.response.data;
			}
		} catch (error) {
			return error;
		}
	};

	let renderedList = [];

	// if (!fetchedList.length) {
	// 	renderedList = propertyCheckList;
	// } else {
	// 	renderedList = fetchedList;
	// }

	const newArr = [];
	for (let index = 0; index < propertyCheckList.length; index++) {
		const element = propertyCheckList[index];
		if (!fetchedList.length) {
			newArr.push(element);
		} else {
			const findOldArr = fetchedList.find(
				(val) => val.task_id == element.unique_id,
			);
			if (!findOldArr) {
				const alreadyExists = renderedList.find((e) => {
					// console.log(e.task_id + ' ======' + element.unique_id);
					return e.task_id == element.unique_id;
				});
				if (!alreadyExists) {
					renderedList.push({
						status: element.status,
						task: element.task,
						task_id: element.unique_id,
					});
				}
			}
		}
	}

	const newOnToggleCheckList = React.useCallback(
		(id) => {
			let list;
			let checked;
			list = newProptChecklist.map((list, index) =>
				list.id !== id
					? list
					: list.status === '1'
					? { ...list, status: '0' }
					: { ...list, status: '1' },
			);
			checked = newProptChecklist.filter((list, index) => list.status === '1');
			setNewProptChecklist(list);
			setChecklistList(list.filter((list, index) => list.status === '1'));
		},
		[newProptChecklist],
	);

	const updateCheckList = async () => {
		try {
			const newList = [];
			newProptChecklist.map((list) => {
				return newList.push({
					task_id: list.task_id || list.unique_id,
					task: list.task,
					status: list.status,
				});
			});

			setIsSending(true);
			const data = new FormData();
			const token = await fetchAuthToken();
			const fdata = JSON.stringify(newList);
			data.append('buyer_agent_id', user.unique_id);
			data.append('transaction_id', transaction.transaction_id);
			data.append('task_array', fdata);
			const response = await appApi.post(`/check_list.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.data.response.status == 200) {
				Toast.show({
					type: 'success',
					text: response.data.response.message,
				});
				await fetchTransactionCheckList();
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
			}
			setIsSending(false);
		} catch (error) {
			setIsSending(false);
			displayError(error);
		}
	};

	const submitChecklist = async () => {
		try {
			const newList = [];
			newProptChecklist.map((list) => {
				return newList.push({
					task_id: list.task_id || list.unique_id,
					task: list.task,
					status: list.status,
				});
			});

			setIsSending(true);
			const data = new FormData();
			const token = await fetchAuthToken();
			const fdata = JSON.stringify(newList);
			data.append('buyer_agent_id', user.unique_id);
			data.append('transaction_id', transaction.transaction_id);
			data.append('task_array', fdata);
			//buyer_agent_id, transaction_id, task_array
			const response = await appApi.post(`/check_list.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.data.response.status == 200) {
				Toast.show({
					type: 'success',
					text: response.data.response.message,
				});
				await fetchTransactionCheckList();
			} else {
				Toast.show({
					type: 'warning',
					text: `${response.data.response.message}`,
				});
				// console.log('error 000');
			}
			setIsSending(false);
		} catch (error) {
			setIsSending(false);
			displayError(error);
			// console.log(error);
		}
	};

	const listDemo = [
		{
			comment: null,
			date_created: '2020-12-13 21:40:43',
			id: '2',
			notify_who: '1',
			property_transaction_id: '65931578',
			status: '0',
			task: 'Purchase & Sale Agreement',
			unique_id: 'b0b4404cb55eeb190379d00b4da0de18',
		},
	];

	const ListItem = ({ text, checked, index, id, ...props }) => {
		return (
			<TouchableOpacity {...props} onPress={() => newOnToggleCheckList(id)}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginBottom: RFValue(15),
					}}
				>
					<Icon
						name={
							parseInt(checked) === 1
								? 'checkbox-marked-outline'
								: 'checkbox-blank-outline'
						}
						type={'MaterialCommunityIcons'}
						style={{ color: colors.white, paddingRight: RFValue(5) }}
					/>
					<Text style={styles.text}>{text} </Text>
				</View>
			</TouchableOpacity>
		);
	};

	// if (fetchingList) {
	// 	return (
	// 		<View>
	// 			<ActivityIndicator color={colors.white} size='large' />
	// 		</View>
	// 	);
	// }

	useEffect(() => {
		setLoadingList(true);
		if (transaction) {
			// fetchTransactionCheckList();
			// fetchPropertyCheckList();

			newFetchPropertyCheckList().then((res) => {
				setNewProptChecklist(res);
				setLoadingList(false);
			});
		}
	}, []);
	// console.log(transaction, '\n \n', property);

	return (
		<LogoPage
			style={{
				// flex: 1,
				// padding: RFValue(20),
				// paddingTop: RFValue(90),
				backgroundColor: colors.bgBrown,
			}}
		>
			<FlatList
				data={newProptChecklist}
				ListEmptyComponent={
					loadingList ? (
						<ActivityIndicator size={'large'} color={colors.white} />
					) : (
						<React.Fragment>
							<Text style={{ ..._font.Medium, color: colors.white }}>
								No check list has been added to this property
							</Text>
						</React.Fragment>
					)
				}
				ListHeaderComponent={
					<View
						style={{ flexDirection: 'row', justifyContent: 'space-between' }}
					>
						<Text style={styles.title}>Requirement Checklist</Text>
						{/*{repairReqSelectModal}*/}
					</View>
				}
				keyExtractor={(v, i) => i.toString()}
				renderItem={({ item, index }) => {
					return (
						<View>
							{item.task_id || item.unique_id ? (
								<ListItem
									disabled={readOnlyMode}
									checked={item.status}
									text={item.task}
									index={index}
									id={item.id}
								/>
							) : null}
						</View>
					);
				}}
				ListFooterComponent={
					!readOnlyMode &&
					!loadingList && (
						<ButtonPrimaryBig
							disabled={checklistList.length > 0 ? false : true}
							containerStyle={{
								backgroundColor:
									checklistList.length > 0 ? colors.brown : colors.brown + '50',
								marginVertical: RFValue(20),
							}}
							title={isSending ? 'Loading...' : 'Send'}
							titleStyle={{
								color:
									checklistList.length > 0 ? colors.white : colors.white + '50',
							}}
							onPress={updateCheckList}
							// onPress={newUpdateChecklist}
						/>
					)
				}
			/>
		</LogoPage>
	);
};

export default SLChecklist;

const styles = StyleSheet.create({
	title: { ..._font.H5, color: colors.white, marginVertical: RFValue(20) },
	text: { ..._font.Small, color: colors.white, fontSize: RFValue(14) },
	btn: {
		backgroundColor: colors.brown,
		alignSelf: 'center',
		paddingHorizontal: RFValue(30),
		paddingVertical: RFValue(10),
		borderRadius: RFValue(20),
		elevation: RFValue(2),
		marginVertical: RFValue(20),
	},
});