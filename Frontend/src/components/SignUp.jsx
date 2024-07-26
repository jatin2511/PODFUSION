import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import PersonIcon from '@mui/icons-material/Person';
import EyeIcon from '@mui/icons-material/Visibility';
import EyeOffIcon from '@mui/icons-material/VisibilityOff';
import React, { useState, useEffect } from "react";
import GoogleIcon from "../assets/google.png";
import { Modal } from "@mui/material";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { openSnackbar } from "../redux/snackbarSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import validator from "validator";
import { googleSignIn, signUp } from "../api/index";
import OTP from "./OTP";
import { useGoogleLogin } from "@react-oauth/google";
import { closeSignin, openSignin } from "../redux/setsigninSlice";

const SignUp = ({ setSignUpOpen, setSignInOpen }) => {
  const currentTheme = useSelector((state) => state.theme.currentTheme);
  const [nameValidated, setNameValidated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [credentialError, setcredentialError] = useState("");
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [nameCorrect, setNameCorrect] = useState(false);
  const [values, setValues] = useState({
    password: "",
    showPassword: false,
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const dispatch = useDispatch();

 
  const createAccount = async () => {
    if (!otpVerified) return;
  
    dispatch(loginStart());
    setDisabled(true);
    setLoading(true);
  
    try {
      const res = await signUp({ name, email, password });
  
      if (res.status === 200) {
        dispatch(loginSuccess(res.data));
        dispatch(openSnackbar({ message: `OTP verified & Account created successfully`, severity: "success" }));
        setSignUpOpen(false);
        dispatch(closeSignin());
      } else {
      
        const errorMessage = res.data.message || "An unexpected error occurred.";
        setcredentialError(errorMessage);
        dispatch(openSnackbar({ message: errorMessage, severity: "error" }));
      }
    } catch (err) {
      dispatch(loginFailure());
      
      const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred.";
      dispatch(openSnackbar({ message: errorMessage, severity: "error" }));
      setcredentialError(errorMessage);
    } finally {
      setLoading(false);
      setDisabled(false);
    }
  };
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!disabled) {
      setOtpSent(true);
    }

    if (name === "" || email === "" || password === "") {
      dispatch(
        openSnackbar({
          message: "Please fill all the fields",
          severity: "error",
        })
      );
    }
  };

  useEffect(() => {
    if (email !== "") validateEmail();
    if (password !== "") validatePassword();
    if (name !== "") validateName();
    if (
      name !== "" &&
      validator.isEmail(email) &&
      passwordCorrect &&
      nameCorrect
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, email, passwordCorrect, password, nameCorrect]);

  useEffect(() => {
    createAccount();
  }, [otpVerified]);

  //validate email
  const validateEmail = () => {
    if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Enter a valid Email Id!");
    }
  };

  //validate password
  const validatePassword = () => {
    if (password.length < 8) {
      setcredentialError("Password must be at least 8 characters long!");
      setPasswordCorrect(false);
    } else if (password.length > 16) {
      setcredentialError("Password must be less than 16 characters long!");
      setPasswordCorrect(false);
    } else if (
      !password.match(/[a-z]/g) ||
      !password.match(/[A-Z]/g) ||
      !password.match(/[0-9]/g) ||
      !password.match(/[^a-zA-Z\d]/g)
    ) {
      setPasswordCorrect(false);
      setcredentialError(
        "Password must contain at least one lowercase, uppercase, number and special character!"
      );
    } else {
      setcredentialError("");
      setPasswordCorrect(true);
    }
  };

//validatename
  const validateName = () => {
    if (name.length < 4) {
      setNameValidated(false);
      setNameCorrect(false);
      setcredentialError("Name must be at least 4 characters long!");
    } else {
      setNameCorrect(true);
      if (!nameValidated) {
        setcredentialError("");
        setNameValidated(true);
      }
    }
  };

  //Google SignIn
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('I am in google signup')
      setLoading(true);
      const user = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
      ).catch((err) => {
        dispatch(loginFailure());
        dispatch(
          openSnackbar({
            message: err.message,
            severity: "error",
          })
        );
      });

      googleSignIn({
        name: user.data.name,
        email: user.data.email,
        img: user.data.picture,
      }).then((res) => {
        if (res.status === 200) {
          dispatch(loginSuccess(res.data));
          dispatch(closeSignin());
          setSignUpOpen(false);
          dispatch(
            openSnackbar({
              message: "Logged In Successfully",
              severity: "success",
            })
          );

          setLoading(false);
        } else {
          dispatch(loginFailure(res.data));
          dispatch(
            openSnackbar({
              message: res.data.message,
              severity: "error",
            })
          );
          setLoading(false);
        }
      });
    },
    onError: (errorResponse) => {
      dispatch(loginFailure());
      dispatch(
        openSnackbar({
          message: errorResponse.error,
          severity: "error",
        })
      );
      setLoading(false);
    },
  });

  return (
    <Modal open={true} onClose={() => dispatch(closeSignin())}>
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center">
        <div
        style={{backgroundColor:currentTheme.backgroundColor,color:currentTheme.color}}
        className=" w-96 bg-card rounded-lg text-text_secondary p-4 flex flex-col relative m-3">
          <CloseIcon
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              cursor: "pointer",
              color: "inherit",
            }}
            onClick={() => setSignUpOpen(false)}
          />
          {!otpSent ? (
            <>
              <div className="text-text_primary text-lg font-semibold my-4 mx-7">Sign Up</div>
              <div
                className={`h-11 border border-text_secondary rounded-lg flex items-center justify-center mt-2 mx-5 gap-4`}
                onClick={() => googleLogin()}
              >
                {Loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <>
                    <img src={GoogleIcon} alt="GoogleIcon" className="w-10" />
                    <div>Sign In with Google</div>
                  </>
                )}
              </div>
              <div className="flex items-center justify-center text-text_secondary text-sm font-semibold my-3">
                <div className="w-20 h-px bg-text_secondary mr-2"></div>
                or
                <div className="w-20 h-px bg-text_secondary ml-2"></div>
              </div>
              <div className="h-11 border border-text_secondary rounded-lg flex items-center justify-center mt-2 mx-5 pl-1">

                
                 
                  <PersonIcon />
                
                
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  className="ml-3 text-black outline-none w-full h-full rounded-r-lg px-2"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="h-11 border border-text_secondary rounded-lg flex items-center justify-center mt-2 mx-5 pl-1">
                <EmailIcon />
                <input
                  type="email"
                  placeholder="Email Id"
                  value={email}
                  className="ml-3 outline-none w-full h-full text-black px-2 rounded-r-lg"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={`text-red-500 text-xs mx-5 ${emailError ? 'block' : 'hidden'}`}>{emailError}</div>
              <div className="h-11 border border-text_secondary rounded-lg flex items-center justify-center mt-2 mx-5 pl-1">
                <PasswordIcon />
                <input
                  placeholder="Password"
                  type={values.showPassword ? "text" : "password"}
                  value={password}
                  className="ml-3 outline-none w-full h-full px-2 text-black "
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className='px-1.5' onClick={() => setValues({ ...values, showPassword: !values.showPassword })} style={{ cursor: "pointer" }}>
                  {values.showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </div>
              </div>
              <div className={`text-red-500 text-xs mx-5 ${credentialError ? 'block' : 'hidden'}`}>{credentialError}</div>
              <div
                className={`h-11 border border-text_secondary rounded-lg flex items-center justify-center mt-2 mx-5 ${!disabled ? 'bg-primary text-white' : ''}`}
                onClick={handleSignUp}
              >
                {Loading ? (
                  <CircularProgress size={20} />
                ) : (
                  "Create Account"
                )}
              </div>
            </>
          ) : (
            <OTP
              email={email}
              name={name}
              reason={"newuser"}
              otpVerified={otpVerified}
              setOtpVerified={setOtpVerified}
            />
          )}
          <div className="text-text_secondary text-sm font-medium my-4 mx-7 flex justify-center items-center">
            Already have an account?{" "}
            <span className="text-primary cursor-pointer px-3 text-blue-600"
              onClick={() => {
                setSignUpOpen(false);
                dispatch(openSignin());
              }}
            >
              Sign In
            </span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SignUp;
