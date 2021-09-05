export const initialState = {
	user: null,
};

export const actionTypes = {
	SET_USER: "SET_USER",
	SIGNOUT_USER: "SIGNOUT_USER",
};

const reducer = (state, action) => {
	switch (action.type) {
		case actionTypes.SET_USER:
			return {
				...state,
				user: action.user,
			};
		case actionTypes.SIGNOUT_USER:
			return {
				user: null,
			};
		default:
			return state;
	}
};

export default reducer;
