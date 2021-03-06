import React, { useState, useEffect } from "react";
import "./Auth.css";

import { logo } from "../Images/Images";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import { dates } from "../TimeStamp/TimeStamp";
import { signin, signup } from './../#Redux/Actions/Auth_Action';
import { warning } from "../Notifications/Notifications";
import { SPINNER } from "../#Redux/Actions/Types";
import API from "../#Api/Api";

import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Loader from "react-loader-spinner";

const Auth = () => {

    const initialState = {
        name: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        createdAt: dates,
    };

    const dispatch = useDispatch();
    const history = useHistory();

    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const [showPassword, setshowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const spinner = useSelector(state => state.SpinnerReducer);

    const handelSubmit = (event) => {
        event.preventDefault();
        dispatch({
            type: SPINNER,
            payload: true
        });
        if(isSignup) {
            if(form.password === form.confirmPassword) {
                dispatch(signup(form,history));
            } else {
                warning("Password Mismatch");
            }
        } else {
            dispatch(signin(form,history));
        }
    };

    const handelShowPassword = () => {
        setshowPassword(preValue => !preValue);
    };

    const handelShowConfirmPassword = () => {
        setShowConfirmPassword(preValue => !preValue);
    };

    const switchMode = () => {
        setIsSignup(preValue => !preValue);
        setshowPassword(false);
    };

    const handelChange = (event) => {
        return setForm({...form, [event.target.name]: event.target.value});
    };

    useEffect(() => {
        API.get("/tests");
        dispatch({
            type: SPINNER,
            payload: false,
        });
    }, []);

    return (<>
        <div className={spinner ? "opacitys auth" : "auth"}>
            <div className="logo">
                <img src={logo} alt=""/>
            </div>
            <div className="text">
                <p> WhatsApp Clone By AYUSH BHATT</p>
            </div>
            <form className="auth_form" onSubmit={handelSubmit}>
                {isSignup ? (
                    <div>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            value={form.name}
                            name="name"
                            onChange={handelChange}
                        />
                    </div>
                ) : null}
                <div>
                    <input
                        type="text"
                        placeholder="Enter Phone Number"
                        value={form.phoneNumber}
                        name="phoneNumber"
                        onChange={handelChange}
                    />
                </div>
                <div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        value={form.password}
                        name="password"
                        onChange={handelChange}
                    />
                    {showPassword ? <VisibilityIcon onClick={handelShowPassword}/> : <VisibilityOffIcon onClick={handelShowPassword}/>}
                </div>
                {isSignup ? (
                    <div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            name="password"
                            onChange={handelChange}
                        />
                        {showConfirmPassword ? <VisibilityIcon onClick={handelShowConfirmPassword}/> : <VisibilityOffIcon onClick={handelShowConfirmPassword}/>}
                    </div>
                ) : null}
                <button className="auth_btn" type="submit">
                    {isSignup ? "Sign Up" : "Log In"}
                </button>
            </form>
            <div className="switch_btn" onClick={switchMode}>
                {isSignup ? "Already have a account? Log In" : "Don't have a account. Sign Up"}
            </div>
        </div>

        <div className={spinner ? "loader" : "loader none"}>
            <Loader
                type="Oval"
                color="#00BFFF"
                height={100}
                width={100}
                timeout={500000000}
                visible={spinner}
            />
        </div>
    </>);
};


export default Auth;