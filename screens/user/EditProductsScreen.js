import React, { useEffect, useCallback, useReducer, useState } from "react";
import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	StyleSheet,
	Platform,
	Alert,
	ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import CustomHeaderButton from "../../components/UI/HeaderButton";
import * as productActions from "../../store/action/products";
import Input from "../../components/UI/Input";
import Color from "../../constants/Color";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";
const formReducer = (state, action) => {
	if (action.type === FORM_INPUT_UPDATE) {
		const updatedValues = {
			...state.inputValues,
			[action.input]: action.value,
		};
		const updatedValidities = {
			...state.inputValidities,
			[action.input]: action.isValid,
		};
		let updatedFormIsValid = true;
		for (const key in updatedValidities) {
			updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
		}
		return {
			formIsValid: updatedFormIsValid,
			inputValues: updatedValues,
			inputValidities: updatedValidities,
		};
	}
	return state;
};

const EditProductsScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();
	const productId = props.navigation.getParam("productId");
	const editedProduct = useSelector((state) =>
		state.products.userProducts.find((prod) => prod.id === productId)
	);

	const dispatch = useDispatch();

	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			title: editedProduct ? editedProduct.title : "",
			imageUrl: editedProduct ? editedProduct.imageUrl : "",
			description: editedProduct ? editedProduct.description : "",
			price: "",
		},
		inputValidities: {
			title: editedProduct ? true : false,
			imageUrl: editedProduct ? true : false,
			description: editedProduct ? true : false,
			price: editedProduct ? true : false,
		},
		formIsValid: editedProduct ? true : false,
	});

	useEffect(() => {
		if (error) {
			Alert.alert("An Error Occurred", error, [{ text: "Okay" }]);
		}
	}, [error]);

	const submitHandler = useCallback(async () => {
		if (!formState.formIsValid) {
			Alert.alert("Wrong Input", "Please check the errors in the form", [
				{ text: "Okay" },
			]);
			return;
		}
		setError(null);
		setIsLoading(true);
		try {
			if (editedProduct) {
				await dispatch(
					productActions.updateProduct(
						productId,
						formState.inputValues.title,
						formState.inputValues.description,
						formState.inputValues.imageUrl
					)
				);
			} else {
				await dispatch(
					productActions.createProduct(
						formState.inputValues.title,
						formState.inputValues.description,
						formState.inputValues.imageUrl,
						+formState.inputValues.price
					)
				);
			}
			props.navigation.goBack();
		} catch (err) {
			setError(err.message);
		}
		setIsLoading(false);
	}, [dispatch, productId, formState]);

	useEffect(() => {
		props.navigation.setParams({ submit: submitHandler });
	}, [submitHandler]);

	const inputHandler = useCallback(
		(inputIdentifier, inputValue, inputValidity) => {
			dispatchFormState({
				type: FORM_INPUT_UPDATE,
				value: inputValue,
				isValid: inputValidity,
				input: inputIdentifier,
			});
		},
		[dispatchFormState]
	);

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size="large" color={Color.primary} />
			</View>
		);
	}

	return (
		<KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={100}>
			<ScrollView>
				<View style={styles.form}>
					<Input
						id="title"
						label="Title"
						errorText="Please enter a valid title"
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						returnKeyType="next"
						onInputChange={inputHandler}
						initialValue={editedProduct ? editedProduct.title : ""}
						initiallyValid={!!editedProduct}
						required
					/>
					<Input
						label="ImageUrl"
						errorText="Please enter a valid image Url"
						keyboardType="default"
						returnKeyType="next"
						initialValue={editedProduct ? editedProduct.imageUrl : ""}
						initiallyValid={!!editedProduct}
						onInputChange={inputHandler}
						id="imageUrl"
						required
					/>
					{editedProduct ? null : (
						<Input
							label="Price"
							errorText="Please enter a valid Price"
							keyboardType="decimal-pad"
							returnKeyType="next"
							onInputChange={inputHandler}
							id="price"
							required
							min={0.1}
						/>
					)}
					<Input
						label="Description"
						errorText="Please enter a valid description."
						keyboardType="default"
						autoCapitalize="sentences"
						autoCorrect
						multiline
						numberOfLines={3}
						initialValue={editedProduct ? editedProduct.description : ""}
						initiallyValid={!!editedProduct}
						onInputChange={inputHandler}
						id="description"
						required
						minLength={5}
					/>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

EditProductsScreen.navigationOptions = (navData) => {
	const submitFn = navData.navigation.getParam("submit");
	return {
		headerTitle: navData.navigation.getParam("productId")
			? "Edit Product"
			: "Add Product",
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="Save"
					iconName={
						Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
					}
					onPress={submitFn}
				/>
			</HeaderButtons>
		),
	};
};

const styles = StyleSheet.create({
	form: {
		margin: 20,
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default EditProductsScreen;
