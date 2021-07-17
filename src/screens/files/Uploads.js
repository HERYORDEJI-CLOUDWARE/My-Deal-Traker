import React, { useCallback, useContext, useState } from 'react';
import {
	Alert,
	Pressable,
	ScrollView,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import LogoPage from '../../components/LogoPage';
import { Text } from 'react-native';
import colors from '../../constants/colors';
import { Input } from 'react-native-elements';
import { View } from 'react-native';
import { FAB, Switch } from 'react-native-paper';
import {
	displayError,
	fetchAuthToken,
	fileUploadCategory,
} from '../../utils/misc';
import appApi from '../../api/appApi';
import { Fab, Textarea, Toast, Icon } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import { Context as UserContext } from '../../context/UserContext';
import * as DocumentPicker from 'expo-document-picker';
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native';
import { Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { RFValue } from 'react-native-responsive-fontsize';
import _font from '../../styles/fontStyles';
import ButtonSecondaryBig from '../../components/ButtonSecondaryBig';
import _colors from '../../constants/colors';
import ButtonPrimaryBig from '../../components/ButtonPrimaryBig';
import axios from 'axios';
import Modal from 'react-native-modal';
import AddFile from '../../components/AddFile';

const Uploads = ({ route, navigation }) => {
	const [text, setText] = useState('');
	const [file, setFile] = useState();
	const [isUploading, setIsUploading] = useState(false);
	const [addResponse, setAddResponse] = useState(undefined);
	const [loadingFile, setLoadingFile] = useState(true);
	const [myUploads, setMyUploads] = useState([]);
	const [validFile, setValidFile] = useState(false);
	const [showAddFile, setShowAddFile] = useState(false);
	const [fileCategory, setFileCategory] = useState(undefined);
	const [fileValidModal, setFileValidShow] = useState({ visible: false });
	const {
		state: { user },
	} = useContext(UserContext);

	// const readOnlyMode = user?.role === '1' || user?.role === '2' ? true : false;

	const { transaction, property } = route.params;

	console.log('...', transaction, '...');

	const validateDocument = (fileName) => {
		if (
			fileName.substr(-3) === 'png' ||
			fileName.substr(-3) === 'jpg' ||
			fileName.substr(-3) === 'jpeg' ||
			fileName.substr(-3) === 'pdf'
		) {
			setValidFile(true);
		} else {
			setValidFile(false);
		}
	};

	useFocusEffect(
		useCallback(() => {
			fetchUploads();
			// getUploads();
		}, []),
	);

	const getUploads = async () => {
		try {
			const endpoint = `${appApi}/get_document_by_transaction.php?transaction_id=${transaction.transaction_id}`;
			const token = await fetchAuthToken();
			const res = await axios.get(endpoint, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log(res.data.response.data);
			// return res.data;
		} catch (err) {
			console.log('API conection failed');
		}
	};

	const fetchUploads = async () => {
		try {
			setLoadingFile(true);
			const token = await fetchAuthToken();
			const response = await appApi.get(
				`/get_document_by_transaction.php?transaction_id=${transaction.transaction_id}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			// `/get_document_by_transaction.php?transaction_id=9967a45923e62242f8e8e9c0fb700559`,
			if (response.data.response.status == 200) {
				console.log('response.data.', response.data.response.data);
				setMyUploads(
					response.data.response.data.filter((file, index) =>
						file.allowed_roles.includes(user.role),
					),
				);
				Toast.show({
					type: 'success',
					text: response.data.response.message,
				});
			} else {
				Toast.show({
					type: 'warning',
					text: response.data.response.message,
				});
			}
			setLoadingFile(false);
		} catch (error) {
			displayError(error);
		}
	};

	const uploadFile = async () => {
		try {
			// if (!text || !file) {
			// 	return Toast.show({
			// 		type: 'danger',
			// 		text: 'Select file and enter filename/info',
			// 	});
			// }
			setIsUploading(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('user_id', user.unique_id);
			data.append('transaction_id', transaction.transaction_id);
			data.append('document_name', text);
			if (file) {
				data.append('file', {
					name: file.name,
					type: 'application/octet',
					uri: file.uri,
				});
			}
			const response = await appApi.post(`/upload_document.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setIsUploading(false);
			setText('');
			setFile();
			fetchUploads();
		} catch (error) {
			setIsUploading(false);
			displayError(error);
		}
	};

	// const cls = () => console.log(myUploads);

	const submittingAlert = () =>
		isUploading && (
			<Modal
				// swipeDirection={'down'}
				isVisible={isUploading}
				// onBackButtonPress={() => setFileValidShow({ visible: false })}
			>
				<View
					showsVerticalScrollIndicator={false}
					bounces={false}
					style={{
						// flex: 1,
						backgroundColor: '#fff',
						justifyContent: 'center',
						width: '100%',
						padding: RFValue(20),
					}}
				>
					{addResponse === undefined && (
						<Text style={styles.fileValidModalText}>Wait</Text>
					)}
					{addResponse === false && (
						<Text style={styles.fileValidModalText}>Sorry</Text>
					)}
					{addResponse === true && (
						<Text style={styles.fileValidModalText}>Congrats</Text>
					)}
					{addResponse === undefined && (
						<Text style={styles.fileValidModalText}>Submitting file...</Text>
					)}
					{addResponse === false && (
						<Text style={styles.fileValidModalText}>
							File not submitted, please try again
						</Text>
					)}
					{addResponse === true && (
						<Text style={styles.fileValidModalText}>
							File successfully submitted
						</Text>
					)}

					{addResponse !== undefined && (
						<Pressable
							onPress={() => setIsUploading(false)}
							style={{
								padding: RFValue(10),
								alignItems: 'flex-end',
								paddingBottom: RFValue(0),
							}}
						>
							<Text>Okay</Text>
						</Pressable>
					)}
				</View>
			</Modal>
		);

	const newUploadFile = async (text, file) => {
		const newAdd = [{ document_name: text, documentInfo: file }];
		setMyUploads([...myUploads, ...newAdd]);
		setShowAddFile(false);
		setText('');
		setFile(null);
	};
	// console.log(myUploads);}

	const renderFileValidModal = () => (
		<Modal
			swipeDirection={'down'}
			isVisible={fileValidModal.visible}
			onBackButtonPress={() => setFileValidShow({ visible: false })}
		>
			<View
				showsVerticalScrollIndicator={false}
				bounces={false}
				style={{
					// flex: 1,
					backgroundColor: '#fff',
					justifyContent: 'center',
					width: '100%',
					padding: RFValue(20),
				}}
			>
				<Text style={styles.fileValidModalText}>Wrong file format</Text>
				<Text style={styles.fileValidModalText}>
					Accepted formats are PNG, JPG, JPEG, PDF
				</Text>
				<Pressable
					onPress={() => setFileValidShow({ visible: false })}
					style={{
						padding: RFValue(10),
						alignItems: 'flex-end',
						paddingBottom: RFValue(0),
					}}
				>
					<Text>Okay</Text>
				</Pressable>
			</View>
		</Modal>
	);

	const onUpload = async () => {
		const data = await DocumentPicker.getDocumentAsync();
		if (data.type === 'success') {
			setFile(data);
			validateDocument(data.name);
		}
	};

	const SubmitDocumentsButton = myUploads.length > 0 && (
		<ButtonPrimaryBig
			title={'Update'}
			onPress={() => {
				uploadFile();
				// cls();
			}}
			containerStyle={{
				backgroundColor: '#FFFFFF50',
				paddingHorizontal: RFValue(20),
				height: RFValue(40),
				borderRadius: RFValue(5),
				marginTop: RFValue(20),
			}}
			disabled={isUploading === true || myUploads.length > 0 ? false : true}
		/>
	);

	const toggleAddFileModal = (status) => setShowAddFile(status);

	const onSelectCategory = (category) => {
		setFileCategory(category);
		toggleCategoryModal(false);
	};

	const renderAddFileModal = () => (
		<Modal
			isVisible={showAddFile}
			// swipeDirection={'left' || 'right'}
			animationIn={'slideInUp'}
			animationOut={'slideOutDown'}
			onBackButtonPress={() => toggleAddFileModal(false)}
			style={{ padding: 0, flex: 1 }}
			backdropColor={'#000000'}
			backdropOpacity={0.8}
		>
			<AddFile
				onAddFile={newUploadFile}
				toggleAddFileModal={toggleAddFileModal}
				setIsUploading={(state) => setIsUploading(state)}
				setAddResponse={(state) => setAddResponse(state)}
				transaction={transaction}
			/>
		</Modal>
	);

	return (
		<LogoPage
			dontShow={true}
			title='Files & Uploads'
			bottomRightComponent={
				<FAB
					style={styles.fab}
					small
					icon='plus'
					onPress={() => {
						setShowAddFile(true);
					}}
				/>
			}
		>
			<FlatList
				ListHeaderComponent={
					<View style={{ marginTop: RFValue(0) }}>
						<Text
							style={{
								..._font.Medium,
								color: colors.white,
								textAlign: 'center',
								borderBottomColor: colors.brown,
								borderBottomWidth: RFValue(1),
							}}
						>
							Added Files
						</Text>
					</View>
				}
				data={myUploads}
				keyExtractor={(item, index) => item.id ?? index.toString()}
				renderItem={({ item }) => {
					return (
						<View>
							<TouchableOpacity
								onPress={async () => {
									// Linking.openURL( "http://mydealtrackerweb.staging.cloudware.ng/" + item.image_url);
									await WebBrowser.openBrowserAsync(item.image_url);
								}}
								style={{
									borderWidth: RFValue(0.5),
									borderColor: colors.fairGrey,
									marginVertical: RFValue(10),
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
									padding: RFValue(10),
								}}
							>
								<Text
									style={{
										..._font.Medium,
										color: colors.white,
										fontSize: RFValue(14),
									}}
								>
									{item.document_name?.substring(0, 20) ??
										item.comment?.substring(0, 20)}
								</Text>

								<Text
									style={{
										color: colors.white,
										fontSize: RFValue(12),
									}}
								>
									View
								</Text>
								{/* <Text>{item.image_url} </Text> */}
							</TouchableOpacity>
						</View>
					);
				}}
				ListEmptyComponent={
					<View style={styles.emptyListWrapper}>
						{loadingFile ? (
							<ActivityIndicator size={'large'} color={colors.white} />
						) : (
							<Text style={styles.emptyListText}>No file(s) available...</Text>
						)}
					</View>
				}
				// ListFooterComponent={SubmitDocumentsButton}
			/>
			{/* {SubmitDocumentsButton} */}
			{renderAddFileModal()}
			{submittingAlert()}
		</LogoPage>
	);
};

export default Uploads;

const styles = StyleSheet.create({
	btn: {
		alignSelf: 'center',
		backgroundColor: colors.white,
		alignItems: 'center',
		justifyContent: 'center',
		height: RFValue(50),
		borderRadius: RFValue(10),
	},
	textInputWrapper: {
		backgroundColor: colors.white,
		justifyContent: 'center',
		height: RFValue(50),
		borderRadius: RFValue(10),
		marginTop: RFValue(20),
		paddingHorizontal: RFValue(10),
	},
	textInput: {
		..._font.Medium,
		backgroundColor: colors.white,
		height: RFValue(50),
		borderRadius: RFValue(10),
	},
	textArea: {
		..._font.Medium,
		backgroundColor: colors.white,
		height: RFValue(100),
		borderRadius: RFValue(10),
	},
	emptyListWrapper: { alignItems: 'center', marginVertical: RFValue(10) },
	emptyListText: { ..._font.Medium, color: colors.white },
	fileValidModalText: { ..._font.Medium, color: colors.brown },
	fab: {
		// position: 'absolute',
		margin: RFValue(16),
		padding: RFValue(5),
		backgroundColor: colors.brown,
		right: 0,
		bottom: 0,
	},
});
