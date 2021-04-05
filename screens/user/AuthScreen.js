import React, { useState, useEffect, useReducer, useCallback } from "react";
import {
	View,
	ScrollView,
	StyleSheet,
	KeyboardAvoidingView,
	Button,
	ActivityIndicator,
	Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Input from "../../components/UI/Input";
import Card from "../../components/UI/Card";
import Color from "../../constants/Color";
import * as authActions from "../../store/action/auth";

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

const AuthScreen = (props) => {
	const disptach = useDispatch();
	const [isSignUp, setIsSignUp] = useState(false);
	const [error, setError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [formState, dispatchFormState] = useReducer(formReducer, {
		inputValues: {
			email: "",
			password: "",
		},
		inputValidities: {
			email: false,
			password: false,
		},
		formIsValid: false,
	});

	useEffect(() => {
		if (error) {
			Alert.alert("Error Occured", error, [{ text: "Okay" }]);
		}
	}, [error]);

	const authHandler = async () => {
		let actions;
		if (isSignUp) {
			actions = authActions.signup(
				formState.inputValues.email,
				formState.inputValues.password
			);
		} else {
			actions = authActions.login(
				formState.inputValues.email,
				formState.inputValues.password
			);
		}
		setError(null);
		setIsLoading(true);
		try {
			await disptach(actions);
			props.navigation.navigate("Shop");
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
		}
	};

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

	return (
		<KeyboardAvoidingView
			//behavior="padding"
			style={styles.screen}
			//keyboardVerticalOffset={50}
		>
			<LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
				<Card style={styles.authContainer}>
					<ScrollView>
						<Input
							id="email"
							label="E-Mail"
							keyboardType="email-address"
							required
							email
							autoCapitalize="none"
							errorText="Please Enter a valid email address"
							onInputChange={inputHandler}
							initialValue=""
						/>
						<Input
							id="password"
							label="Password"
							keyboardType="default"
							secureTextEntry
							required
							minLength={5}
							autoCapitalize="none"
							errorText="Please Enter a valid password"
							onInputChange={inputHandler}
							initialValue=""
						/>
						<View style={styles.buttonContainer}>
							{isLoading ? (
								<ActivityIndicator size="small" color={Color.primary} />
							) : (
								<Button
									title={isSignUp ? "Sign Up" : "Login"}
									color={Color.primary}
									onPress={authHandler}
								/>
							)}
						</View>
						<View style={styles.buttonContainer}>
							<Button
								title={`Switch to ${isSignUp ? "Login" : "Sign Up"}`}
								color={Color.accent}
								onPress={() => {
									setIsSignUp((prevState) => !prevState);
								}}
							/>
						</View>
					</ScrollView>
				</Card>
			</LinearGradient>
		</KeyboardAvoidingView>
	);
};

AuthScreen.navigationOptions = {
	headerTitle: "Authenticate",
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	gradient: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	authContainer: {
		width: "90%",
		maxWidth: 300,
		maxHeight: 400,
		padding: 20,
	},
	buttonContainer: {
		margin: 10,
	},
});

export default AuthScreen;
