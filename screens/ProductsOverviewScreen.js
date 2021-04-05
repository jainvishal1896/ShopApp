import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	ActivityIndicator,
	StyleSheet,
	FlatList,
	Button,
	Platform,
	Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import CustomHeaderButton from "../components/UI/HeaderButton";
import ProductItem from "../components/ProductItem";
import * as cartActions from "../store/action/cart";
import * as productActions from "../store/action/products";
import Color from "../constants/Color";

const ProductsOverviewScreen = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState("");
	const dispatch = useDispatch();
	const product = useSelector((state) => state.products.availableProducts);

	const loadedProducts = useCallback(async () => {
		setError(null);
		setIsRefreshing(true);
		try {
			await dispatch(productActions.fetchProducts());
		} catch (err) {
			setError(err.message);
		}
		setIsRefreshing(false);
	}, [dispatch, setIsLoading, setError]);

	useEffect(() => {
		setIsLoading(true);
		loadedProducts().then(() => {
			setIsLoading(false);
		});
	}, [dispatch, loadedProducts]);

	useEffect(() => {
		const willFocusHandler = props.navigation.addListener(
			"willFocus",
			loadedProducts
		);
		return () => {
			willFocusHandler.remove();
		};
	}, [loadedProducts]);

	const selectItemHandler = (id, title) => {
		props.navigation.navigate("ProductsDetail", {
			productId: id,
			productTitle: title,
		});
	};

	if (error) {
		return (
			<View style={styles.centered}>
				<Text>An Error Occured</Text>
				<Button
					title="Try Again"
					onPress={loadedProducts}
					color={Color.primary}
				/>
			</View>
		);
	}

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator size={70} color={Color.primary} />
			</View>
		);
	}

	return (
		<FlatList
			onRefresh={loadedProducts}
			refreshing={isRefreshing}
			style={styles.screen}
			data={product}
			keyExtractor={(item) => item.id}
			renderItem={(itemData) => (
				<ProductItem
					title={itemData.item.title}
					price={itemData.item.price}
					onSelect={() => {
						selectItemHandler(itemData.item.id, itemData.item.title);
					}}
					image={itemData.item.imageUrl}
				>
					<Button
						color={Color.primary}
						title="View Details"
						onPress={() => {
							selectItemHandler(itemData.item.id, itemData.item.title);
						}}
					/>
					<Button
						color={Color.primary}
						title="To Cart"
						onPress={() => {
							dispatch(cartActions.addToCart(itemData.item));
						}}
					/>
				</ProductItem>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: "white",
	},
	centered: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});

ProductsOverviewScreen.navigationOptions = (navData) => {
	return {
		headerTitle: "All Products",
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
					title="Cart"
					iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
					onPress={() => {
						navData.navigation.navigate("Cart");
					}}
				/>
			</HeaderButtons>
		),
	};
};

export default ProductsOverviewScreen;
