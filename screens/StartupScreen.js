import React, { useEffect } from "react";
import {
	StyleSheet,
	ActivityIndicator,
	View,
	// AsyncStorage,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useDispatch } from "react-redux";

import * as authActions from "../store/action/auth";
import Color from "../constants/Color";

const StartupScreen = (props) => {
	const dispatch = useDispatch();
	useEffect(() => {
		const tryLogin = async () => {
			const userData = await AsyncStorage.getItem("userData");
			if (!userData) {
				props.navigation.navigate("Auth");
				return;
			}
			const transformedData = JSON.parse(userData);
			const { token, userId, expiryDate } = transformedData;
			const expirationDate = new Date(expiryDate);
			if (expirationDate <= new Date() || !token || !userId) {
				props.navigation.navigate("Auth");
				return;
			}

			const expirationTime = expirationDate.getTime() - new Date().getTime();
			props.navigation.navigate("Shop");
			dispatch(authActions.authenticate(userId, token, expirationTime));
		};
		tryLogin();
	}, [dispatch]);

	return (
		<View style={styles.centered}>
			<ActivityIndicator size="large" color={Color.primary} />
		</View>
	);
};

const styles = StyleSheet.create({
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

export default StartupScreen;
