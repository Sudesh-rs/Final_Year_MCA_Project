import  { useEffect, useState } from 'react'
import LoginForm from './LoginForm'
import { Alert, Button, Snackbar } from '@mui/material';
import SignupForm from './SignupForm';
import { useAppSelector } from '../../../Redux Toolkit/Store';

const Auth = () => {
    const [isLoginPage, setIsLoginPage] = useState(true);
    const handleCloseSnackbar = () => setSnackbarOpen(false)
    const { auth } = useAppSelector(store => store)
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {

        if (auth.otpSent || auth.error) {
            setSnackbarOpen(true);
            console.log("store ", auth.error)
        }

    }, [auth.otpSent,auth.error])

    return (
        <div className='flex justify-center items-center min-h-screen py-12'>
            <div className='w-full max-w-md rounded-md border shadow-lg overflow-hidden'>
                <img className='w-full block' src="/login_banner.png" alt="" />
                <div className='mt-6 px-6 pb-8'>
                    {isLoginPage ? <LoginForm /> : <SignupForm />}

                    <div className='flex items-center gap-1 justify-center mt-5'>
                        <p className='text-sm'>{isLoginPage ? "Don't have an account?" : "Have an account?"}</p>
                        <Button onClick={() => setIsLoginPage(!isLoginPage)} size='small'>{isLoginPage ? "Create account" : "Login"}</Button>
                    </div>
                </div>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={snackbarOpen} autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={auth.error?"error":"success"}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {auth.error?auth.error : " otp sent to your email!"}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default Auth