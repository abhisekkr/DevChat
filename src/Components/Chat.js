import React, { useState, useEffect } from "react";
import "./styles/Chat.css";
import { useParams } from "react-router-dom";
import db from "../Resources/firebase";
import { useStateValue } from "../Resources/StateProvider";
import firebase from "firebase";
//Icons
import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, SearchOutlined } from "@material-ui/icons";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
//components
import AttachmentModal from "./AttachmentModal";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

function Chat() {
	const [input, setInput] = useState("");
	const [seed, setSeed] = useState("");
	const { roomId } = useParams();
	const [roomName, setRoomName] = useState("");
	const [messages, setMessages] = useState([]);
	const [{ user }] = useStateValue();
	const [showEmoji, setShowEmoji] = useState(false);
	const [showModal, setShowModal] = useState("close");

	useEffect(() => {
		if (roomId) {
			db.collection("rooms")
				.doc(roomId)
				.onSnapshot((snapshot) => setRoomName(snapshot.data().name));

			db.collection("rooms")
				.doc(roomId)
				.collection("messages")
				.orderBy("timestamp", "asc")
				.onSnapshot((snapshot) =>
					setMessages(snapshot.docs.map((doc) => doc.data()))
				);
		}
	}, [roomId]);

	useEffect(() => {
		setSeed(Math.floor(Math.random() * 5000));
	}, [roomId]);

	const handleClick = (e) => {
		switch (showModal) {
			case "open":
				setShowModal("close");
				break;
			case "close":
				setShowModal("open");
				break;
			default:
				setShowModal("close");
				break;
		}
	};

	const sendMessage = (e) => {
		e.preventDefault();
		console.log(input);

		db.collection("rooms").doc(roomId).collection("messages").add({
			message: input,
			name: user.displayName,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});

		setInput("");
	};

	const handleEmojiSelect = (e) => {
		setInput((text) => (text += e.native));
	};

	const handleEmojiShow = () => {
		setShowEmoji((v) => !v);
	};

	return (
		<div className="chat">
			<div className="chat__header">
				<Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
				<div className="chat__headerInfo">
					<h3>{roomName}</h3>
					<p>
						last seen{" "}
						{new Date(
							messages[messages.length - 1]?.timestamp?.toDate()
						).toUTCString()}
					</p>
				</div>
				<div className="chat__headerRight">
					<IconButton>
						<SearchOutlined />
					</IconButton>
					<IconButton onClick={handleClick}>
						<AttachFile />
					</IconButton>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</div>
			</div>
			<div className="chat__body">
				{messages.map((message) => (
					<div key={message.timestamp}>
						<p
							className={`chat__message ${
								message.name === user.displayName && `chat__reciever`
							}`}>
							<span className="chat__name">{message.name}</span>
							{message.message}
							<span className="chat__timestamp">
								{new Date(message.timestamp?.toDate()).toUTCString()}
							</span>
							{message.photoURL && (
								<img
									className="chat__attachment"
									src={message.photoURL}
									alt=""
								/>
							)}
						</p>
					</div>
				))}
			</div>
			<div className="chat__footer">
				<div className="chat__footerEmoji" onClick={handleEmojiShow}>
					<InsertEmoticonIcon />
				</div>
				<form>
					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type a message"
						type="text"
					/>
					<button onClick={sendMessage} type="submit">
						Send a message
					</button>
				</form>
				<MicIcon />
			</div>
			{showEmoji && (
				<Picker
					onSelect={handleEmojiSelect}
					emojiSize={20}
					style={{ position: "absolute", bottom: "80px", left: "300px" }}
					title="Pick your emoji…"
					emoji="point_up"
				/>
			)}
			<AttachmentModal
				showModal={showModal}
				handleClick={handleClick}
				roomId={roomId}
			/>
		</div>
	);
}

export default Chat;
