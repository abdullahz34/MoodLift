import React, { useEffect, useState, useRef } from "react";
import Paper from "@mui/material/Paper";
import { Button, Divider, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router";

import { db, auth } from "../Firebase";
import {
	addDoc,
	collection,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";

function UsersComponent(props) {
	const handleToggle = (username, userId) => {
		props.setReceiverData({
			username: username,
			userId: userId,
		});

		props.navigate(`/home/${userId}`);
	};

	return (
		<List
			dense
			sx={{
				width: "100%", maxWidth: 360,
				bgcolor: "background.paper"
			}}
		>
			{props.users?.map((value, index) => {
				const labelId = `checkbox-list-secondary-label-${value}`;

				if (props.currentUserId !== value.userId)
					return (
						<ListItem key={value.userId} disablePadding>
							<ListItemButton
								onClick={() => {
									handleToggle(value.username, value.userId);
								}}
							>
								<ListItemAvatar>
									<Avatar
										alt={`${value.username}`}
										src={`${value.username}.jpg`}
									/>
								</ListItemAvatar>
								<ListItemText id={labelId}
									primary={`${value.username}`} />
							</ListItemButton>
						</ListItem>
					);
			})}
		</List>
	);
}

export default function Home() {
	const [users, setUsers] = useState([]);

	const messagesEndRef = useRef(null);

	const [receiverData, setReceiverData] = useState(null);
	const [chatMessage, setChatMessage] = useState("");

	const [allMessages, setAllMessages] = useState([]);

	const user = auth.currentUser;

	const navigate = useNavigate();

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	  };
	
	useEffect(() => {
		scrollToBottom();
	}, [allMessages]);

	useEffect(() => {
		const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
			setUsers(snapshot.docs.map((doc) => doc.data()));
		});
		return unsub;
	}, []);

	useEffect(() => {
		if (receiverData) {
			const unsub = onSnapshot(
				query(
					collection(
						db,
						"users",
						user?.uid,
						"chatUsers",
						receiverData?.userId,
						"messages"
					),
					orderBy("timestamp")
				),
				(snapshot) => {
					setAllMessages(
						snapshot.docs.map((doc) => ({
							id: doc.id,
							messages: doc.data(),
						}))
					);
				}
			);
			return unsub;
		}
	}, [receiverData?.userId]);

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			sendMessage();
		}
	};
	
	const sendMessage = async () => {
		try {
			const trimmedMessage = chatMessage.trim();
			if (trimmedMessage.length > 0) {
				if (user && receiverData) {
					await addDoc(
						collection(
							db,
							"users",
							user.uid,
							"chatUsers",
							receiverData.userId,
							"messages"
						),
						{
							username: user.displayName,
							messageUserId: user.uid,
							message: chatMessage,
							timestamp: new Date(),
						}
					);
	
					await addDoc(
						collection(
							db,
							"users",
							receiverData.userId,
							"chatUsers",
							user.uid,
							"messages"
						),
						{
							username: user.displayName,
							messageUserId: user.uid,
							message: chatMessage,
							timestamp: new Date(),
						}
					);
				}
			}
		} catch (error) {
			console.log(error);
		}
		setChatMessage("");
	};

	return user?.displayName ? (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: "100%", backgroundColor: '#f5f5f5' }}>
		<div style={{ display: 'flex', width: '80%', maxWidth: '1200px', height: '67%', maxHeight: '1200px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
		  <Paper style={{ width: '30%', overflowY: 'auto' }}>
			<div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
			  <h4>{user?.displayName}</h4>
			  <Button color="secondary" onClick={() => { auth.signOut(); navigate("/"); }}>Logout</Button>
			</div>
			<Divider />
			<UsersComponent users={users} setReceiverData={setReceiverData} navigate={navigate} currentUserId={user?.uid}/>
		  </Paper>
  
		  <Paper style={{ width: '70%', display: 'flex', flexDirection: 'column' }}>
			<h4 style={{ padding: '10px' }}> {receiverData ? receiverData.username : user?.displayName}{" "}</h4>
			<Divider />
			<div style={{ flex: 1, overflowY: 'auto', padding: '10px', maxHeight: '500px'}}>
			{allMessages && allMessages.map(({ id, messages }) => (
				<div key={id} style={{ margin: 2, display: 'flex', flexDirection: user?.uid === messages.messageUserId ? 'row-reverse' : 'row', padding: '5px' }}>
				<span style={{
					backgroundColor: "#BB8FCE",
					padding: 6,
					borderTopLeftRadius:
						user?.uid == messages.messageUserId ? 10 : 0,
					borderTopRightRadius:
						user?.uid == messages.messageUserId ? 0 : 10,
					borderBottomLeftRadius: 10,
					borderBottomRightRadius: 10,
					maxWidth: 400,
					fontSize: 15,
					textAlign:
						user?.uid == messages.messageUserId ? "right" : "left",
				}}>
					{messages.message}
				</span>
				</div>
			))}
			</div>
			<div style={{ width: "99%", display: "flex", flex: 0.08}}>
			  <input
				value={chatMessage}
				onChange={(e) => setChatMessage(e.target.value)}
				onKeyPress={handleKeyPress}
				style={{ flex: 1, marginRight: '10px', padding: '10px', borderRadius: '20px', border: '1px solid #ccc' }}
				type="text"
				placeholder="Type message..."
			  />
			  <button onClick={sendMessage} style={{ padding: '10px 15px', borderRadius: '20px', border: 'none', backgroundColor: '#1976d2', color: 'white' }}>
				<SendIcon />
			  </button>
			</div>
		  </Paper>
		</div>
	  </div>
	) : (
		<html>
			<head>
			<meta http-equiv="Refresh" content="4; url='http://127.0.0.1:3000/'" />
			</head>
			<body>
				<p>You are not logged in!</p>
				<p>Redirecting to login page...</p>
			</body>
		</html>

	);
}

const root = {
	display: "flex",
	flexDirection: "row",
	flex: 1,
	width: "100%",
};

const left = {
	display: "flex",
	flex: 0.2,
	height: "95vh",
	margin: 10,
	flexDirection: "column",
};

const right = {
	display: "flex",
	flex: 0.8,
	height: "95vh",
	margin: 10,
	flexDirection: "column",
};

const input = {
	flex: 1,
	outline: "none",
	borderRadius: 5,
	border: "none",
};

const messagesDiv = {
	backgroundColor: "#FBEEE6",
	padding: 5,
	display: "flex",
	flexDirection: "column",
	flex: 1,
	maxHeight: 460,
	overflowY: "scroll",
};
