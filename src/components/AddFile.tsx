import React, { useState } from 'react';
import {
	Text,
	View,
	TouchableOpacity,
	TextInput,
	StyleSheet,
	Pressable,
	ScrollView,
	Alert,
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';
import * as DocumentPicker from 'expo-document-picker';

import ButtonPrimaryBig from './ButtonPrimaryBig';
import Modal from 'react-native-modal';
import _font from '../styles/fontStyles';
import colors from '../constants/colors';
import { Textarea, Toast, Fab } from 'native-base';
import {
	displayError,
	fetchAuthToken,
	fileUploadCategory,
} from './../utils/misc';
import appApi from '../api/appApi';

import { Context as UserContext } from '../context/UserContext';

interface Props {
	fileCategory: [];
	onAddFile: (e: string, file: []) => void;
	toggleAddFileModal: (e: boolean) => void;
	transaction: {};
	setIsUploading: (e: boolean) => void;
	setAddResponse: (e: boolean) => void;
}

export default function AddFile(props: Props) {
	const [text, setText] = useState('');
	const [file, setFile] = useState({});
	const [isUploading, setIsUploading] = useState(false);
	const [myUploads, setMyUploads] = useState([]);
	const [validFile, setValidFile] = useState(false);
	const [showCategory, setShowCategory] = useState(false);
	const [fileCategory, setFileCategory] = useState(undefined);
	const [allCategory, setAllCategory] = useState([]);
	const [fileValidModal, setFileValidModal] = useState({ visible: false });
	const [fileDataType, setFileDataType] = useState(undefined);

	const {
		state: { user },
	} = React.useContext(UserContext);

	const validateDocument = (fileName) => {
		let type = fileName.substr(-3);
		if (type == 'pdf') {
			setFileDataType('application/pdf');
			setValidFile(true);
			setFileValidModal({ visible: false });
		} else if (type == 'png') {
			setFileDataType('image/png');
			setValidFile(true);
			setFileValidModal({ visible: false });
		} else if (type == 'jpg') {
			setFileDataType('image/jpeg');
			setValidFile(true);
			setFileValidModal({ visible: false });
		} else if (type == 'jpeg') {
			setFileDataType('image/jpeg');
			setValidFile(true);
			setFileValidModal({ visible: false });
		} else {
			setFileDataType(undefined);
			setValidFile(false);
			setFileValidModal({ visible: true });
			setFile({});
		}
	};

	const toggleCategoryModal = (status) => setShowCategory(status);

	const onSelectCategory = (category) => {
		setFileCategory(category);
		toggleCategoryModal(false);
	};

	const submitDocuments = async () => {
		try {
			// Alert.alert('Wait... Submitting file');
			props.setIsUploading(true);
			const token = await fetchAuthToken();
			const data = new FormData();
			data.append('user_id', user.unique_id);
			data.append('transaction_id', '9967a45923e62242f8e8e9c0fb700559');
			// data.append('transaction_id', props.transaction.transaction_id);
			data.append('document_category', fileCategory?.category_id);
			data.append('comment', text);
			data.append('role', user.role);
			data.append('file', {
				name: file.name,
				type: `${fileDataType}`,
				// type: 'application/octet-stream',
				uri: file.uri,
			});
			/* 
			Parameters: user_id, transaction_id, document_category, comment, role(Role of the logged in user), file(The file object)
			*/

			const response = await appApi.post(`/upload_document.php`, data, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			console.log('response==', response);
			props.setAddResponse(true);
			// props.setIsUploading(false);
			// setText('');
			// setFile();
			// fetchUploads();
		} catch (error) {
			// props.setIsUploading(false);
			props.setAddResponse(false);
			displayError(error);
			console.log('error..err', error);
		}
	};

	const getAllDocCategory = async () => {
		try {
			const token = await fetchAuthToken();
			const response = await appApi.get('/fetch_document_categories.php', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response;
		} catch (error) {
			displayError(error);
		}
	};

	const renderFileValidModal = () => (
		<Modal
			swipeDirection={'down'}
			isVisible={fileValidModal.visible}
			onBackButtonPress={() => setFileValidModal({ visible: false })}
		>
			<View
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
					onPress={() => {
						setFileValidModal({ visible: false });
						setFile({});
					}}
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

	const renderCategoryModal = () => (
		<Modal
			isVisible={showCategory}
			// swipeDirection={'left' || 'right'}
			animationIn={'slideInUp'}
			animationOut={'slideOutDown'}
			onBackButtonPress={() => toggleCategoryModal(false)}
			style={{ padding: 0 }}
		>
			<ScrollView
				showsVerticalScrollIndicator={false}
				bounces={false}
				style={{ flex: 1 }}
				contentContainerStyle={{
					backgroundColor: '#fff',
					justifyContent: 'center',
					width: '100%',
					paddingTop: RFValue(20),
				}}
			>
				{allCategory.map((file, index) => (
					<Pressable
						key={index.toString()}
						onPress={() => onSelectCategory(file)}
						style={{
							marginHorizontal: RFValue(10),
							marginBottom: RFValue(20),
							padding: RFValue(10),
							borderWidth: RFValue(1),
							borderBottomColor: '#EEE',
							// backgroundColor: file.allowed_roles.includes(user.role)
							// 	? '#EEE'
							// 	: '#FFF',
						}}
						disabled={file.allowed_roles.includes(user.role) ? false : true}
					>
						<Text
							style={{
								..._font.Medium,
								color: file.allowed_roles.includes(user.role)
									? colors.black
									: '#EEE',
							}}
						>
							{file?.category_name}
						</Text>
					</Pressable>
				))}
			</ScrollView>
		</Modal>
	);

	const newUploadFile = async () => {
		if (validFile === false) {
			setFileValidShow({ visible: true });
			// setTimeout(() => {
			// 	setFileValidShow({ visible: false });
			// }, 2000);
		} else {
			const newAdd = [{ document_name: text, documentInfo: file }];
			setMyUploads([...myUploads, ...newAdd]);
			setText('');
			setFile(null);
		}
		// console.log(myUploads);}
	};
	const onUpload = async () => {
		const data = await DocumentPicker.getDocumentAsync();
		validateDocument(data.name);
		if (data.type === 'success') {
			setFile(data);
		}
	};

	React.useEffect(() => {
		getAllDocCategory().then((res) => {
			// console.log(res.data.response.data);
			setAllCategory(res.data.response.data);
		});
	});

	return (
		<View style={{ flex: 1 }}>
			<View style={{}}>
				<>
					<Text
						style={{
							..._font.Medium,
							fontSize: RFValue(16),
							color: colors.white,
							// paddingBottom: RFValue(10),
						}}
					>
						Category (Required)
					</Text>
					<Pressable
						style={{
							...styles.textInputWrapper,
							marginTop: RFValue(0),
							marginBottom: RFValue(20),
						}}
						onPress={() => toggleCategoryModal(true)}
					>
						<TextInput
							value={fileCategory?.category_name}
							placeholder={'Select category'}
							// onChangeText={(text) => setText(text)}
							placeholderTextColor={colors.fair}
							style={styles.textInput}
							editable={false}
						/>
					</Pressable>
				</>

				<>
					<Text
						style={{
							..._font.Medium,
							fontSize: RFValue(16),
							color: colors.white,
							// paddingBottom: RFValue(10),
						}}
					>
						Document
					</Text>
					<View
						style={
							{
								// ...styles.textInputWrapper,
								// marginTop: RFValue(0),
								// marginBottom: RFValue(20),
							}
						}
					>
						{/*<TextInput*/}
						{/*	value={file?.name}*/}
						{/*	placeholder={}*/}
						{/*	// onChangeText={(text) => setText(text)}*/}
						{/*	placeholderTextColor={}*/}
						{/*	*/}
						{/*	editable={false}*/}
						{/*/>*/}
						<Pressable
							onPress={onUpload}
							style={{
								...styles.textInput,
								justifyContent: 'center',
								paddingLeft: RFValue(10),
								marginBottom: RFValue(20),
							}}
						>
							<Text
								style={{
									..._font.Medium,
									color: file?.name ? colors.black : colors.fair,
									// color: colors.white,
								}}
							>
								{file?.name ?? 'Select file'}
							</Text>
						</Pressable>
					</View>
				</>

				{/*<ButtonSecondaryBig*/}
				{/*	title={'Select file'}*/}
				{/*	onPress={onUpload}*/}
				{/*/>*/}
			</View>
			<View>
				<Text
					style={{
						..._font.Medium,
						fontSize: RFValue(16),
						color: colors.white,
						// paddingBottom: RFValue(10),
					}}
				>
					Comment
				</Text>

				<View
					style={
						{
							// ...styles.textInputWrapper,
						}
					}
				>
					<Textarea
						value={text}
						placeholder={'Comment'}
						onChangeText={(text) => setText(text)}
						placeholderTextColor={colors.fair}
						style={{ ...styles.textArea, flex: 0 }}
					/>
				</View>
			</View>

			<TouchableOpacity
				disabled={file.name ? false : true}
				style={[styles.btn, { marginTop: RFValue(20), alignSelf: 'stretch' }]}
				onPress={() => {
					submitDocuments();
					props.onAddFile(text, file);
				}}
			>
				<Text
					style={{
						..._font.Medium,
						color: colors.lightBrown,
						opacity: file.name ? 1 : 0.5,
					}}
				>
					Add File
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				disabled={file ? false : true}
				style={[
					styles.btn,
					{
						marginTop: RFValue(20),
						alignSelf: 'stretch',
						backgroundColor: colors.lightBrown,
					},
				]}
				onPress={() => props.toggleAddFileModal(false)}
			>
				<Text
					style={{
						..._font.Medium,
						color: colors.black,
						opacity: file ? 1 : 0.5,
					}}
				>
					Cancel
				</Text>
			</TouchableOpacity>
			{renderCategoryModal()}
			{renderFileValidModal()}
		</View>
	);
}

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
});
