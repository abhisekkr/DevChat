import React, { useEffect, useState } from "react";
import "./styles/SidebarChat.css";
import db from "../Resources/firebase";
import { Link } from "react-router-dom";
import { Avatar } from "@material-ui/core";

function SidebarChat({ id, name, addNewChat }) {
	const [seed, setSeed] = useState("");
	const [messages, setMessages] = useState("");

	useEffect(() => {
		if (id) {
			db.collection("rooms")
				.doc(id)
				.collection("messages")
				.orderBy("timestamp", "desc")
				.onSnapshot((snapshot) =>
					setMessages(snapshot.docs.map((doc) => doc.data()))
				);
		}
	}, [id]);

	useEffect(() => {
		setSeed(Math.floor(Math.random() * 5000));
	}, []);

	const createChat = () => {
		const roomName = prompt("Please enter chat name");
		if (roomName) {
			db.collection("rooms").add({
				name: roomName,
			});
		}
	};

	return !addNewChat ? (
		<Link to={`/rooms/${id}`}>
			<div className="sidebarChat">
				<div className="sidebarChat__rows">
					<Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
					<div className="sidebarChat__info">
						<h2>{name}</h2>
						<p>{messages[0]?.message}</p>
					</div>
				</div>
			</div>
			<div className="sidebarChat__border" />
		</Link>
	) : (
		<div className="sidebarChat__button" onClick={createChat}>
			<button>START NEW CHAT</button>
		</div>
	);
}

export default SidebarChat;
