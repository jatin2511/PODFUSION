import React, { useEffect, useState, useRef } from 'react';
import OtpInput from 'react-otp-input';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/snackbarSlice';
import { generateOtp, verifyOtp } from '../api';

const Title = () => (
  <div className="font-semibold text-2xl text-primary mt-8 mb-4">VERIFY OTP</div>
);

const LoginText = ({ email }) => (
  <div className="text-secondary font-medium mb-1">
    A verification <b className="text-primary">&nbsp;OTP&nbsp;</b> has been sent to:
    <br />
    <span className="text-primary">{email}</span>
  </div>
);

const Error = ({ error }) => (
  <div className={`text-red-500 font-semibold text-sm ${error ? 'block' : 'hidden'}`}>
    <b>{error}</b>
  </div> 
);

const Timer = ({ timer }) => (
  <div className="text-secondary text-sm mb-2">
    Resend in <b>{timer}</b>
  </div>
);

const Resend = ({ onClick }) => (
  <div className="text-primary text-sm cursor-pointer mb-2" onClick={onClick}>
    <b>Resend</b>
  </div>
);

const OutlinedBox = ({ button, activeButton, className, onClick, children }) => (
  <button
    className={`h-11 border border-gray-300 rounded-lg flex items-center justify-center ${activeButton ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} ${className}`}
    onClick={activeButton ? onClick : null}
    disabled={!activeButton}
  >
    {children}
  </button>
);

const OTP = ({ email, name, otpVerified, setOtpVerified, reason }) => {
  const dispatch = useDispatch();

  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState('01:00');
  const ref = useRef(null);

  const getTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const startTimer = (endTime) => {
    const id = setInterval(() => {
      const timeLeft = getTimeRemaining(endTime);
      setTimer(timeLeft);

      if (timeLeft === '00:00') {
        setShowTimer(false);
        clearInterval(id);
      }
    }, 1000);

    ref.current = id;
  };

  const clearTimer = (endTime) => {
    clearInterval(ref.current);
    startTimer(endTime);
  };

  const getDeadTime = () => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 60);
    return deadline;
  };

  const resendOtp = () => {
    setShowTimer(true);
    clearTimer(getDeadTime());
    sendOtp();
  };

  const sendOtp = async () => {
    try {
      const res = await generateOtp(email, name, reason);
      if (res.status === 200) {
        dispatch(openSnackbar({ message: 'OTP sent Successfully', severity: 'success' }));
        setOtp('');
        setOtpError('');
        setOtpLoading(false);
        setOtpSent(true);
      } else {
        dispatch(openSnackbar({ message: res.status, severity: 'error' }));
        setOtp('');
        setOtpError('');
        setOtpLoading(false);
      }
    } catch (err) {
      dispatch(openSnackbar({ message: err.message, severity: 'error' }));
    }
  };

  const validateOtp = async () => {
    setOtpLoading(true);
    setDisabled(true);
    try {
      const res = await verifyOtp(otp);
      if (res.status === 200) {
        setOtpVerified(true);
        setOtp('');
        setOtpError('');
        setDisabled(false);
        setOtpLoading(false);
      } else {
        setOtpError(res.data.message);
        setDisabled(false);
        setOtpLoading(false);
      }
    } catch (err) {
      dispatch(openSnackbar({ message: err.message, severity: 'error' }));
      setOtpError(err.message);
      setDisabled(false);
      setOtpLoading(false);
    }
  };

  useEffect(() => {
    sendOtp();
    startTimer(getDeadTime());
  }, []);

  useEffect(() => {
    setDisabled(otp.length !== 6);
  }, [otp]);

  return (
    <div>
      <Title />
      <LoginText email={email} />
      {!otpSent ? (
        <div className="flex flex-col items-center mt-4">
          <div className="text-center mb-4">
            Sending OTP <CircularProgress color="inherit" size={20} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-4">
          <OtpInput
  value={otp}
  onChange={setOtp}
  numInputs={6}
  shouldAutoFocus={true}
  inputStyle="m-1 w-12 h-12 text-black border border-gray-300 rounded "
  containerStyle="otp-container"
  renderInput={(props) => <input {...props} />}
/>

          <Error error={otpError} />
          <OutlinedBox
            button={true}
            activeButton={!disabled}
            className="mt-4 px-3"
            onClick={validateOtp}
            
          >
            {otpLoading ? <CircularProgress color="inherit" size={20} /> : 'Submit'}
          </OutlinedBox>
          {showTimer ? <Timer timer={timer} /> : <Resend onClick={resendOtp} />}
        </div>
      )}
    </div>
  );
};

export default OTP;