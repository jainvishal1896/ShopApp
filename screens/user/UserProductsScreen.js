import React from "react";
import {
	Text,
	StyleSheet,
	FlatList,
	Button,
	Platform,
	Alert,
	View,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import CustomHeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/ProductItem";
import Color from "../../constants/Color";
import { deleteProduct } from "../../store/action/products";

const UserProductsScreen = (props) => {
	const dispatch = useDispatch();
	const userProductsList = useSelector((state) => state.products.userProducts);

	const deleteProductHandler = (id) => {
		Alert.alert("Are you sure", "you want ot delete?", [
			{ text: "NO", style: "default" },
			{
				text: "YES",
				style: "destructive",
				onPress: () => {
					dispatch(deleteProduct(id));
				},
			},
		]);
	};

	const editProductHandler = (id) => {
		props.navigation.navigate("EditProduct", { productId: id });
	};

	if (userProductsList.length === 0) {
		return (
			<View
				style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
			>
				<Text style={{ fontFamily: "open-sans-reg" }}>
					No products available, start adding some.
				</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={userProductsList}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					image={itemData.item.imageUrl}
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={() => {
						editProductHandler(itemData.item.id);
					}}
				>
					<Button
						color={Color.primary}
						title="Edit"
						onPress={() => {
							editProductHandler(itemData.item.id);
						}}
					/>
					<Button
						color={Color.primary}
						title="Delete"
						onPress={() => {
							deleteProductHandler(itemData.item.id);
						}}
						//Alternate Way
						//onPress={
						// 	deleteProductHandler.bind(this,itemData.item.id);}
					/>
				</ProductItem>
			)}
		/>
	);
};

UserProductsScreen.navigationOptions = (navData) => {
	return {
		headerTitle: "Your Products",
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="Menu"
					iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
					onPress={() => {
						navData.navigation.toggleDrawer();
					}}
				/>
			</HeaderButtons>
		),
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
				<Item
					title="Add"
					iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
					onPress={() => {
						navData.navigation.navigate("EditProduct");
					}}
				/>
			</HeaderButtons>
		),
	};
};

export default UserProductsScreen;
