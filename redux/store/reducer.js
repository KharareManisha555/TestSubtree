const initialState = {
	vendorID 			: "",
	vendorLocationID 	: ""
}

const reducer = (state = initialState, action) => {
	const newState = {...state}; 
	if(action.type === "VENDOR"){
		newState.vendorID 			= action.vendorID;
		newState.vendorLocationID 	= action.vendorLocationID;
	}
	return newState;
}

export default reducer;