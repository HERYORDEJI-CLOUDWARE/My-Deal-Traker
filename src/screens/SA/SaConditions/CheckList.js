import { AntDesign } from '@expo/vector-icons';
import { Toast, Icon } from 'native-base';
import React, { useState } from 'react';
import { useEffect } from 'react';
import {
	Text,
	ActivityIndicator,
	Dimensions,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import { Input } from 'react-native-elements';
import { Checkbox } from 'react-native-paper';
import appApi from '../../../api/appApi';
import ButtonPrimaryBig from '../../../components/ButtonPrimaryBig';
import colors from '../../../constants/colors';
import { displayError, fetchAuthToken } from '../../../utils/misc';
import _font from './../../../styles/fontStyles';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');

const ListItem = ({ text, checked }) => {
	return (
		<View>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: 20,
				}}
			>
				<Checkbox
					color={colors.white}
					uncheckedColor={colors.white}
					status={checked ? 'checked' : 'unchecked'}
					disabled
				/>
				<Text style={styles.text}>{text}</Text>
			</View>
		</View>
	);
};

//SaConditions/SaConditions

const CheckList = ({ route, property, transaction, proptTrans }) => {
	// const { property } = route.params;

	const [showAddNew, setShowAddNew] = useState(false);
	const [isAddingTask, setIsAddingTask] = useState(false);
	const [taskLists, setTask] = useState([]);
	const [fetchedList, setFetchedList] = useState([]);
	const [isFetchingList, setIsFetchingList] = useState(true);
	const [buyersCheckedList, setBuyersCheckedList] = useState(null);

	useEffect(() => {
		fetchCheckList();
		let fetched = fetchedList
			.slice()
			.reverse()
			.filter((v, i, a) => a.findIndex((t) => t.task === v.task) === i)
			.reverse();

		newFetchPropertyCheckList().then((res) => {
			const filteredArr = [...res, ...fetchedList].reduce((acc, current) => {
				const x = acc.find((item) => item.task === current.task);
				if (!x) {
					return acc.concat([current]);
				} else {
					return acc;
				}
			}, []);

			let list = [...res, ...fetchedList].filter(
				(v, i, a) => a.findIndex((t) => t.task === v.task) === i,
			);
			setBuyersCheckedList(filteredArr);
		});
	}, []);

	const addNewForm = () => {
		setShowAddNew(!showAddNew);
	};

	console.log('proptTrans', fetchedList);

	const fetchCheckList = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/fetch_tasks.php?property_transaction_id=${property?.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			setFetchedList(response.data.response.data);
			setIsFetchingList(false);
		} catch (error) {
			displayError(error);
			setIsFetchingList(false);
		}
	};

	const newFetchPropertyCheckList = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/fetch_buyer_agent_checked_lists_for_property.php?transaction_id=${proptTrans[0].transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			// return response;
			return JSON.parse(response.data.response.data?.task_array);
		} catch (error) {
			console.log(error);
		}
		``;
	};

	const onAddNewTask = async () => {
		try {
			setIsAddingTask(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('task', taskLists);
			data.append('notify', true);
			data.append('property_transaction_id', property.transaction_id);
			const response = await appApi.post(`/add_task.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.data.response.status == 200) {
				setTask('');
				setShowAddNew(false);
				await fetchCheckList();
				setIsAddingTask(false);
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
					duration: 3500,
				});
			}
		} catch (error) {
			setIsAddingTask(true);
			displayError(error);
		}
	};

	const ListItem = ({ text, checked }) => {
		return (
			<TouchableOpacity disabled={true}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginBottom: RFValue(15),
					}}
				>
					<Icon
						name={
							checked ? 'checkbox-marked-outline' : 'checkbox-blank-outline'
						}
						type={'MaterialCommunityIcons'}
						style={{ color: colors.white, paddingRight: RFValue(5) }}
					/>
					<Text style={styles.text}>{text} </Text>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View>
			<Text style={styles.title}>Requirement Checklist</Text>

			{isFetchingList ? (
				<ActivityIndicator size='large' color={colors.white} />
			) : (
				<View>
					<FlatList
						data={buyersCheckedList ?? fetchedList}
						// data={}
						keyExtractor={(item, index) => index.toString()}
						renderItem={({ item }) => {
							return (
								<View>
									{item.task_id || item.unique_id ? (
										<ListItem
											task_id={item.task_id}
											checked={String(item.status) === '1'}
											text={item.task}
											// index={index}
										/>
									) : null}
								</View>
							);
						}} // renderItem={({ item }) => {
						// 	return (
						// 		<ListItem checked={parseInt(item.status)} text={item.task} />
						// 	);
						// }}
						ListEmptyComponent={
							<Text style={{ ..._font.Medium, color: colors.white }}>
								No checklist for this property
							</Text>
						}
						ListFooterComponent={
							<React.Fragment>
								{showAddNew ? (
									<View>
										<View>
											<View
												style={{
													flexDirection: 'row',
													alignItems: 'center',
													justifyContent: 'center',
												}}
											>
												<Input
													containerStyle={{ width: width * 0.8 }}
													inputContainerStyle={{
														backgroundColor: colors.white,
														paddingHorizontal: 10,
													}}
													placeholder='Enter New Task'
													value={`${taskLists}`}
													onChangeText={(text) => setTask(text)}
												/>
											</View>
										</View>
									</View>
								) : null}

								{taskLists && showAddNew ? (
									<TouchableOpacity style={styles.btn} onPress={onAddNewTask}>
										<Text style={{ color: colors.brown }}>
											{isAddingTask ? 'Loading...' : 'Save'}
										</Text>
									</TouchableOpacity>
								) : null}

								<ButtonPrimaryBig
									containerStyle={{
										marginVertical: RFValue(20),
										backgroundColor: colors.brown,
										// height: RFValue(40),
									}}
									title={
										showAddNew ? (
											<AntDesign name='close' size={30} />
										) : (
											'Add New'
										)
									}
									onPress={addNewForm}
								/>
							</React.Fragment>
						}
					/>
				</View>
			)}
		</View>
	);
};

export default CheckList;

const styles = StyleSheet.create({
	title: {
		..._font.H5,
		color: colors.white,
		marginBottom: RFValue(20),
	},
	text: { ..._font.Medium, color: colors.white },
	btn: {
		backgroundColor: colors.white,
		alignSelf: 'center',
		paddingHorizontal: 30,
		paddingVertical: 10,
		borderRadius: 20,
		elevation: 2,
		marginVertical: 20,
	},
});
