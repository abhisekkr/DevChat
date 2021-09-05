import React, { useRef, useState } from "react";
import "./styles/AttachmentModal.css";
import db from "../Resources/firebase";
import firebase from "firebase";
import { storage } from "../Resources/firebase";
import { useStateValue } from "../Resources/StateProvider";
//Icons
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import { IconButton } from "@material-ui/core";

function AttachmentModal({ showModal, handleClick, roomId }) {
	const inputRef = useRef("");
	const [{ user }] = useStateValue();
	const filePickerRef = useRef(null);
	const [image, setImage] = useState(null);

	const reset = (e) => {
		setImage(null);
		handleClick(e);
	};

	const sendImage = (e) => {
		e.preventDefault();

		if (!inputRef.current.value) return;

		db.collection("rooms")
			.doc(roomId)
			.collection("messages")
			.add({
				message: inputRef.current.value,
				name: user.displayName,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			})
			.then((doc) => {
				if (image) {
					const uploadTask = storage
						.ref(`messages/${doc.id}`)
						.putString(image, "data_url");

					uploadTask.on(
						"state_change",
						null,
						(error) => console.log(error),
						() => {
							storage
								.ref("messages")
								.child(doc.id)
								.getDownloadURL()
								.then((url) => {
									db.collection("rooms")
										.doc(roomId)
										.collection("messages")
										.doc(doc.id)
										.set({ photoURL: url }, { merge: true });
								});
						}
					);
				}
			});
		reset();
		inputRef.current.value = "";
	};

	const imageToSend = (e) => {
		const reader = new FileReader();
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
		}
		reader.onload = (readerEvent) => {
			setImage(readerEvent.target.result);
		};
	};

	return (
		<>
			{showModal === "open" && (
				<div className="attachment__modal">
					<div className="content">
						<div className="content__header">
							<input
								type="file"
								id="attachmentImage"
								ref={filePickerRef}
								onChange={imageToSend}
								onClick={() => {
									filePickerRef.current.click();
								}}
								style={{ display: "none" }}
							/>
							<label htmlFor="attachmentImage">
								<p style={{ padding: "5px", border: "2px solid lightgray" }}>
									Choose File to send
								</p>
							</label>

							<IconButton>
								<CancelPresentationIcon onClick={(e) => reset(e)} />
							</IconButton>
						</div>
						{image && (
							<div className="content__body">
								<img className="content__bodyImage" src={image} alt="" />
								<input
									className="content__bodyDesc"
									type="text"
									ref={inputRef}
									placeholder="Description (Optional)"
								/>
								<button className="content__bodyButton" onClick={sendImage}>
									Send
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}

export default AttachmentModal;
