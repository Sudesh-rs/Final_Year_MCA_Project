import { Button, CircularProgress, TextField } from '@mui/material'
import  { useEffect, useState, useRef } from 'react'
import OTPInput from '../../components/OtpFild/OTPInput'

import { useAppDispatch, useAppSelector } from '../../../Redux Toolkit/Store';
import { useNavigate } from 'react-router-dom';
import { sendLoginSignupOtp, signup } from '../../../Redux Toolkit/Customer/AuthSlice';
import { useFormik } from 'formik';

const SignupForm = () => {

    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState<number>(30); // Timer state
    const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const { auth } = useAppSelector(store => store)

    const formik = useFormik({
        initialValues: {
            email: '',
            otp: '',
            name: "",
            mobile: ""
        },

        onSubmit: (values: any) => {
            // Handle form submission
            dispatch(signup({ fullName: values.name, email: values.email, mobile: values.mobile, otp, profileImage: profileFile, navigate }))
            console.log('Form data:', values);
        }
    });

    const [profileFile, setProfileFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setProfileFile(e.target.files[0]);
        }
    };

    const handleOtpChange = (otp: any) => {

        setOtp(otp);

    };

    const handleResendOTP = async () => {
        try {
            await dispatch(sendLoginSignupOtp({ email: formik.values.email }));
            setTimer(30);
            setIsTimerActive(true);
            setEmailSent(true);
        } catch (e) {
            console.error('Resend OTP error', e);
        }
    };

    const handleSentOtp = async () => {
        if (!formik.values.email) return;
        try {
            await dispatch(sendLoginSignupOtp({ email: formik.values.email }));
            setEmailSent(true);
            setTimer(30);
            setIsTimerActive(true);
        } catch (e) {
            console.error('Send OTP error', e);
        }
    }

    const handleLogin = () => {
        formik.handleSubmit()
    }

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (isTimerActive) {
            interval = setInterval(() => {
                setTimer(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setIsTimerActive(false);
                        return 30; // Reset timer for next OTP request
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerActive]);

    return (
        <>
            <h1 className='text-center font-bold text-xl text-primary-color pb-5'>Signup</h1>
            <form className="space-y-5">



                <TextField
                    fullWidth
                    name="email"
                    label="Enter Your Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email ? formik.errors.email as string : undefined}
                />

                {emailSent && <div className="space-y-2">
                    <p className="font-medium text-sm">
                        * Enter OTP sent to your email
                    </p>
                    <OTPInput
                        length={6}
                        onChange={handleOtpChange}
                        error={false}
                    />
                    <p className="text-xs space-x-2">
                        {isTimerActive ? (
                            <span>Resend OTP in {timer} seconds</span>
                        ) : (
                            <>
                                Didn’t receive OTP?{" "}
                                <span
                                    onClick={handleResendOTP}
                                    className="text-teal-600 cursor-pointer hover:text-teal-800 font-semibold"
                                >
                                    Resend OTP
                                </span>
                            </>
                        )}
                    </p>
                    {formik.touched.otp && formik.errors.otp && <p>{formik.errors.otp as string}</p>}
                </div>}

                {emailSent && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField
                        fullWidth
                        name="name"
                        label="Enter Your Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name ? formik.errors.name as string : undefined}
                    />

                    <TextField
                        fullWidth
                        name="mobile"
                        label="Contact Number"
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                        helperText={formik.touched.mobile ? formik.errors.mobile as string : undefined}
                    />
                </div>}

                {auth.otpSent && <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                    <div className="flex-1">
                        <p className='text-sm mb-2'>Optional: Upload profile photo</p>
                        <input ref={fileInputRef} onChange={handleFileChange} accept='image/*' type='file' />
                    </div>
                    <div className="mt-3 sm:mt-0">
                        {profileFile ? (
                            <img src={URL.createObjectURL(profileFile)} alt="preview" className="w-20 h-20 rounded-full object-cover" />
                        ) : (
                            <img src="/default-avatar.svg" alt="default" className="w-20 h-20 rounded-full object-cover" />
                        )}
                    </div>
                </div>}

                {emailSent && <div>
                    <Button
                        disabled={auth.loading}
                        onClick={handleLogin}
                        fullWidth variant='contained' sx={{ py: "11px" }}> {auth.loading ? <CircularProgress size="small"
                            sx={{ width: "27px", height: "27px" }} /> : " Signup "}  </Button>
                </div>}

                {!emailSent && <Button
                    fullWidth
                    variant='contained'
                    onClick={handleSentOtp}
                    disabled={auth.loading}
                    sx={{ py: "11px" }}>
                    {auth.loading ? <CircularProgress size="small"
                        sx={{ width: "27px", height: "27px" }} /> : "Send OTP"}

                </Button>
                }



                </form>
        </>
    )
}

export default SignupForm