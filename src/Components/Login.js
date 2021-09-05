import React from "react";
import "./styles/Login.css";
import { Button } from "@material-ui/core";
import { auth, provider } from "../Resources/firebase";
import { useStateValue } from "../Resources/StateProvider";
import { actionTypes } from "../Resources/reducer";

function Login() {
	const [{ user }, dispatch] = useStateValue();

	const signIn = () => {
		auth
			.signInWithPopup(provider)
			.then((result) => {
				dispatch({
					type: actionTypes.SET_USER,
					user: result.user,
				});
			})
			.catch((error) => alert(error.message));
	};

	return (
		<div className="login">
			<div className="login__container">
				<img
					src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPBigyFTJJSUAy4ETgWk-cYcn0JNQsLROqZQ&usqp=CAU"
					alt=""
				/>
				<div className="login__text">
					<h1>Sign In to DevChat</h1>
					<p>A Chat Application for Developers</p>
				</div>

				<Button type="submit" onClick={signIn}>
					SIGN IN WITH GOOGLE
				</Button>
			</div>
		</div>
	);
}

export default Login;
