import React, { useState, useEffect } from "react";
import "./SidebarInfo.css";
import img from "../#Images/img.png";
import img2 from "../#Images/img2.png";
import { Avatar, IconButton  } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import Drawers from "../Drawer/Drawer";

import { logouts, getsStatus } from './../#Redux/Actions/Auth_Action';
import { SWITCH, SELECTED } from "../#Redux/Actions/Types";
import { useHistory, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pusher from "pusher-js";
import API from "../#Api/Api";


const SidebarInfo = () => {  

    const user = JSON.parse(localStorage.getItem("profile"));
    const [room, setRoom] = useState([]);
    const [input, setInput] = useState("");
    const [filteredRooms, setFilteredRooms] = useState([]);
    const id  = user?.result._id;
    const Select = useSelector(state => state.SelectReducer);
    const dispatch = useDispatch();
    const history = useHistory();

    const logout = () => {
        dispatch(logouts(user?.result._id, history));
    };

    const handelClick = () => {
        dispatch({
           type: SWITCH,
           payload: false 
        });
        dispatch({
            type: SELECTED,
            payload: null 
        });
    }; 

    const handelClicks = (id, name) => {
        dispatch({
           type: SWITCH,
           payload: true 
        });
        dispatch({
            type: SELECTED,
            payload: id 
        });
        dispatch(getsStatus(name));
    };

    useEffect(() => {
        API.get(`/room/${id}`)
            .then(res => {
                setRoom(res.data);
            });
    }, []);

    useEffect(() => {
        setFilteredRooms(room.filter((arr) => arr.userName2.toLowerCase().includes(input.toLowerCase())));
    }, [input, room]);

    useEffect(() => {
        const pusher = new Pusher("ba02fea1a55cbc251adf", {
            cluster: "ap2"
        });

        const channel = pusher.subscribe("rooms");
        channel.bind("inserted", ((data) => {
            if(data.userId1 === user?.result._id || data.userId2 === user?.result._id) {
                setRoom([...room, data]);
            }
        }));

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [room]);

    useEffect(() => {
        const pusher = new Pusher("ba02fea1a55cbc251adf", {
            cluster: "ap2"
        });

        const channel = pusher.subscribe("rooms");
        channel.bind("deleted", ((data) => {
            API.get("/room")
                .then(res => (
                    setRoom(res.data)
            ));
        }));

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        }
    }, [room]);

    return (
        <div className="sidebar">

            <div className="sidebar_info">
                <div className="infos">
                    <Link to="/" className="info_link" onClick={handelClick}>
                        <Avatar src={img}/>
                        <p> {user?.result.name} </p>
                    </Link>
                    <div>
                        <div className="drawers"> <IconButton> <Drawers/> </IconButton> </div>
                        <IconButton > <ExitToAppIcon onClick={logout}/> </IconButton>
                    </div>
                </div>
                <div className="search_bar">
                    <div className="search"> 
                        <SearchIcon/>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Search here for chat"
                        />
                    </div> 
                </div>
            </div>

            <div className="sidebar_chat">
                {filteredRooms && filteredRooms.map((arr) => (
                    <Link className={Select===arr._id ? "selected container" : "container"} key={arr._id} to={`/${arr._id}`} onClick={(() => handelClicks(arr._id, arr.userName2))}>
                        <div className="user_info">
                            <Avatar src={img2}/>
                            <div>
                                {arr.userId1 === user?.result._id ? (
                                    <h4> {arr.userName2} </h4>
                                ) : (
                                    <h4> {arr.userName1} </h4>
                                )}
                                <p> ... </p>
                            </div>
                        </div>
                        <div className="date">
                            <p> ... </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SidebarInfo;