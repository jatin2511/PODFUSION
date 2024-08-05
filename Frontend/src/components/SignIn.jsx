import React, { useState, useEffect } from "react";
import { Modal, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch,useSelector } from "react-redux";
import validator from "validator";
import { signIn,googleSignIn } from "../api/index";
import { closeSignin } from "../redux/setsigninSlice";
import { openSnackbar } from "../redux/snackbarSlice";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { loginSuccess, loginFailure } from "../redux/userSlice";

const SignIn = ({ signInOpen, setSignInOpen, setSignUpOpen }) => {
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [values, setValues] = useState({ showPassword: false });
  const [credentialError, setCredentialError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);

  const GOOGLE_CLIENT_ID = "65487570054-kqfu1i9ed9h7rver0irp4qj1ncq8ffs0.apps.googleusercontent.com";

  useEffect(() => {
    setDisabled(!(validator.isEmail(email) && password.length > 5));
  }, [email, password]);
  
  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const { name, email, picture } = response.data;
      const googletoken=await googleSignIn(response.data);
      localStorage.setItem('auth-token',googletoken.data.token)
      return { name, email, picture };
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  useEffect(() => {
    const accessTokenRegex = /access_token=([^&]+)/;
    const isMatch = window.location.href.match(accessTokenRegex);

    if (isMatch) {
      const accessToken = isMatch[1];
      Cookies.set("access_token", accessToken);

      
      const fetchAndSetUserInfo = async () => {
        const userInfo = await fetchUserInfo(accessToken);
        console.log(userInfo);
        if (userInfo) {
          dispatch(loginSuccess({ user: userInfo, token: accessToken }));
          setIsLoggedin(true);
        } else {
          dispatch(loginFailure());
        }
      };

      fetchAndSetUserInfo();
    }
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedin) {
      dispatch(openSnackbar({ message: "Logged In Successfully", severity: "success" }));
      dispatch(closeSignin());
      setSignInOpen(false);
    }
  }, [isLoggedin, navigate, dispatch, setSignInOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!disabled) {
      setLoading(true);
      try {
        const res = await signIn({ email, password });
        if (res.status === 200) {
          const { token, user }=res.data;
          localStorage.setItem('auth-token',token);
         console.log(user);
           dispatch(loginSuccess({ user: user, token: token }));
          setIsLoggedin(true);
          dispatch(openSnackbar({ message: "Logged In Successfully", severity: "success" }));
          setSignInOpen(false); 
          
        } else {
          setCredentialError(res.data.message);
          dispatch(openSnackbar({ message: res.data.message, severity: "error" }));
        }
      } catch (err) {
        setCredentialError(err.message);
        dispatch(openSnackbar({ message: err.message, severity: "error" }));
      } finally {
        setLoading(false);
      }
    } else {
      dispatch(openSnackbar({ message: "Please fill all the fields", severity: "error" }));
    }
  };

  const handleGoogleLogin = () => {
    const callbackUrl = `${window.location.origin}`;
    const googleClientId = GOOGLE_CLIENT_ID;
    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=token&client_id=${googleClientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;
  };

  return (
    <Modal
      open={signInOpen}
      onClose={() => setSignInOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      
    >
      <div
      style={{backgroundColor: currentTheme.backgroundColor,color:currentTheme.color}} 
      className="absolute top-0  left-0 w-full h-full   bg-opacity-70 flex items-center justify-center">
        <div className="max-w-96 m-4  rounded-lg border-2 p-4 flex flex-col relative">
          
          <h2 className="text-lg font-semibold my-4">Welcome Back</h2>
          <div
            className="h-11 border border-gray-300 rounded-lg flex items-center justify-center mt-2 mx-5 bg-blue-500 text-white cursor-pointer"
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </div>
          <div className="flex items-center justify-center text-gray-500 my-3">
            <div className="w-20 h-px bg-gray-300 mr-2"></div> or{" "}
            <div className="w-20 h-px bg-gray-300 ml-2"></div>
          </div>
          <form onSubmit={handleLogin} className="text-black">
            <label className="text-xs mx-5">Email</label>
            <input
              className="h-11 w-72 border border-gray-300 rounded-lg mt-2 mx-5 p-2"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
            />
            <label className="text-xs mx-5 mt-3">Password</label>
            <div className="flex  items-center relative">
              <input
                className="h-11 border border-gray-300 rounded-lg mt-2 mx-5 p-2 w-full"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={values.showPassword ? "text" : "password"}
              />
              <IconButton
              style={{color:currentTheme.color}}
                className="absolute right-5 top-2"
                onClick={() => setValues({ ...values, showPassword: !values.showPassword })}
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </div>
            {credentialError && (
              <div className="text-red-500 mx-5 mt-2 text-xs">{credentialError}</div>
            )}
            <button
              type="submit"
              className="h-11 cursor-pointer bg-red-500 rounded-lg px-3 mt-4 mx-5 text-white font-bold disabled:bg-red-300"
              disabled={disabled}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
          <div className="text-xs mx-5 mt-4">
            New here?{" "}
            <button
              className="text-blue-500"
              onClick={() => {
                setSignInOpen(false);
                setSignUpOpen(true);
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignIn;
