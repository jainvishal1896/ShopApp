import { ADD_TO_CART, DELETE_FROM_CART } from "../action/cart";
import CartItem from "../../models/cart-item";
import { ADD_ORDER } from "../action/orders";
import { DELETE_PRODUCT } from "../action/products";

const initialState = {
	items: {},
	totalAmount: 0,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_TO_CART:
			const addedProduct = action.product;
			const prodPrice = addedProduct.price;
			const prodTitle = addedProduct.title;
			let updatedOrNewCardItem;
			if (state.items[addedProduct.id]) {
				//item is already in the list.
				updatedOrNewCardItem = new CartItem(
					state.items[addedProduct.id].quantity + 1,
					prodPrice,
					prodTitle,
					state.items[addedProduct.id].sum + prodPrice
				);
			} else {
				updatedOrNewCardItem = new CartItem(
					1,
					prodPrice,
					prodTitle,
					prodPrice
				);
			}
			return {
				...state,
				items: { ...state.items, [addedProduct.id]: updatedOrNewCardItem },
				totalAmount: state.totalAmount + prodPrice,
			};
		case DELETE_FROM_CART:
			const selectedCartItem = state.items[action.pid];
			const currentOty = selectedCartItem.quantity;
			let updatedCartItems;
			if (currentOty > 1) {
				//need to reduce it.
				const updatedCartItem = new CartItem(
					selectedCartItem.quantity - 1,
					selectedCartItem.productPrice,
					selectedCartItem.productTitle,
					selectedCartItem.sum - selectedCartItem.productPrice
				);
				updatedCartItems = {
					...state.items,
					[action.pid]: updatedCartItem,
				};
			} else {
				updatedCartItems = { ...state.items };
				delete updatedCartItems[action.pid];
			}
			return {
				...state,
				items: updatedCartItems,
				totalAmount: state.totalAmount - selectedCartItem.productPrice,
			};
		case ADD_ORDER:
			return initialState;
		case DELETE_PRODUCT:
			if (!state.items[action.pid]) {
				return state;
			}
			const updatedItems = { ...state.items };
			delete updatedItems[action.pid];
			const itemTotal = state.items[action.pid].sum;
			return {
				...state,
				items: updatedItems,
				totalAmount: state.totalAmount - itemTotal,
			};
	}
	return state;
};
