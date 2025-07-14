// app/signup/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import InputBox from '@/components/inputbox.component';
import OtpComponent from '@/components/otp.component';
import AnimationWrapper from '@/components/page.animation';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';
import { signup, verifyOtp } from '@/services/page';
import { useProfile } from '@/context/page';

const SignupPage = () => {
    const { user, loading } = useProfile();
    const router = useRouter();

    const [termsCondition, setTermsCondition] = useState(false);
    const [otpVerification, setOtpVerification] = useState(false);
    const [emailVerfied, setEmailVerfied] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });
    const [error, setError] = useState<string[] | null>(null);

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [loading, user, router]);

    if (loading) return <div>Loading...</div>;

    const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (error) {
            setError(error.filter((err) => !err.toLowerCase().includes(name.toLowerCase())));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.name || !formData.email) {
            toast.error('Please fill all the fields');
            return;
        }

        if (!termsCondition) {
            toast.error('Please accept terms and condition');
            return;
        }

        try {
            const res = await toast.promise(signup(formData), {
                loading: 'Sending OTP...',
                success: 'OTP sent to your email',
                error: 'Signup failed',
            });

            if (res.success) {
                setEmailVerfied(formData.email);
                setOtpVerification(true);
            } else {
                toast.error(res.message || 'Signup failed');
            }
        } catch (err: unknown) {
            interface ErrorWithResponse extends Error {
                response?: {
                    data?: {
                        message?: string[] | string;
                    };
                };
            }
            
            if (err instanceof Error) {
                const errorObj = err as ErrorWithResponse;
                if (Array.isArray(errorObj.response?.data?.message)) {
                    setError(errorObj.response.data.message);
                } else {
                    toast.error(errorObj.message || 'An unexpected error occurred.');
                }
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    const handleCompletedOTP = async (otp: string) => {
        try {
            const response = await toast.promise(verifyOtp({ otp, email: emailVerfied }), {
                loading: 'Verifying OTP...',
                success: 'Email verified successfully',
                error: 'Invalid OTP. Please try again',
            });

            if (response.success && response.token) {
                localStorage.setItem('token', response.token);
                router.push('/dashboard');
            }
        } catch (err: unknown) {
            interface ErrorWithResponse extends Error {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            }
            
            const errorObj = err as ErrorWithResponse;
            const errorMessage = errorObj?.response?.data?.message || 
                               (errorObj instanceof Error ? errorObj.message : 'Unexpected error');
            toast.error(errorMessage);
        }
    };

    return (
        <AnimationWrapper>
            <div className="flex relative px-1 md:px-0 justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
                <div className="bg-white relative rounded-3xl shadow-2xl flex items-center justify-between px-2 max-w-4xl overflow-hidden border border-slate-100">
                    <div className="absolute w-32 h-32 rounded-full bg-blue-100 -top-10 -left-10 z-0 opacity-60" />
                    <div className="absolute w-24 h-24 rounded-full bg-indigo-100 top-3/4 -right-10 z-0 opacity-60" />

                    <div className="w-1/2 items-center justify-center relative bg-transparent ml-6 hidden lg:flex">
                        <div className="absolute inset-0 rounded-3xl z-0" style={{
                            background: 'linear-gradient(135deg, #6EE7B7 0%, #3B82F6 50%, #9333EA 100%)',
                            filter: 'blur(0px)',
                            opacity: 0.95
                        }} />
                        <div className="absolute inset-0 rounded-3xl z-10 border border-white/20 shadow-2xl backdrop-blur-xl" style={{
                            background: 'rgba(255,255,255,0.08)',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
                        }} />
                        {/* Animated decorative circles */}
                        <div className="absolute top-8 left-8 w-16 h-16 rounded-full bg-white/20 animate-pulse z-20" />
                        <div className="absolute bottom-10 right-10 w-12 h-12 rounded-full bg-white/10 animate-bounce z-20" />
                        <div className="absolute top-1/3 right-5 w-8 h-8 rounded-full bg-white/10 animate-ping z-20" />
                        <Image
                            alt="Signup Visual"
                            width={340}
                            height={340}
                            className="w-full h-full object-cover p-6 rounded-2xl z-30 shadow-xl border-4 border-white/20 transition-transform duration-500 hover:scale-105"
                            src={"https://res.cloudinary.com/dglwzejwk/image/upload/v1752307118/signup-image_ebpvhf.png"}
                            priority
                        />
                    </div>

                    {otpVerification ? (
                        <AnimationWrapper>
                            <OtpComponent emailVerfied={emailVerfied} count={6} onOTPComplete={handleCompletedOTP} />
                        </AnimationWrapper>
                    ) : (
                        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 md:px-8 py-10 z-10 relative">
                            <div className="absolute -z-10 inset-0 rounded-3xl  backdrop-blur-xl  " />
                            <div className="headers flex flex-col items-center justify-center mb-8">
                                <h1 className="text-slate-800 font-bold tracking-normal text-3xl mb-2">Join the</h1>
                                <p className="text-slate-600 font-medium tracking-wide text-lg">
                                    Fastest Growing <span className="text-blue-600 font-semibold">Community</span>
                                </p>
                            </div>

                            <div className="social-buttons flex justify-center w-full gap-4 mb-6">
                                <button className="group cursor-pointer flex items-center justify-center py-2.5 px-4 border border-slate-200 rounded-xl text-white hover:shadow-md transition-all duration-200 bg-white hover:border-blue-300 w-full">
                                    <Image width={20} height={20} className="mr-2" src="https://www.pngmart.com/files/22/Google-PNG-File.png" alt="Google" />
                                    <span className="text-slate-600 text-sm font-medium group-hover:text-blue-600">Sign up with Google</span>
                                </button>
                            </div>

                            <div className="relative my-6 w-full">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white/80 px-4 text-sm text-slate-500">OR CONTINUE WITH EMAIL</span>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 w-full py-3 px-4 rounded-lg border-l-4 border-red-500 bg-red-50 text-red-600 text-sm">
                                    {Array.isArray(error) ? error.join(', ') : error}
                                </div>
                            )}

                            {!error && (
                                <p className="mb-6 text-slate-500 text-sm">Enter your details to create an account</p>
                            )}

                            <div className="classical-login min-w-80 w-full">
                                <form className='flex flex-col max-w-full items-center justify-center gap-6' onSubmit={handleFormSubmit}>
                                    <InputBox 
                                        value={formData.name} 
                                        onChange={handleFormDataChange} 
                                        name={"name"} 
                                        type="text" 
                                        label="Full name" 
                                        required={true} 
                                    />
                                    <InputBox 
                                        value={formData.email} 
                                        onChange={handleFormDataChange} 
                                        name={"email"} 
                                        type='email' 
                                        label="Email address" 
                                        required={true} 
                                    />

                                    <div className="flex items-center w-full justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                onClick={() => setTermsCondition((prev) => !prev)}
                                                className={`w-5 h-5 cursor-pointer border ${termsCondition ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'} rounded flex items-center justify-center transition-colors duration-200`}
                                            >
                                                {termsCondition && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <label className="text-sm text-slate-600 cursor-pointer" onClick={() => setTermsCondition((prev) => !prev)}>
                                                Accept Terms and Conditions
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                                    >
                                        Create Account
                                    </button>
                                </form>
                            </div>

                            <div className="text-center font-medium text-slate-600 text-sm mt-8">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-3 w-full text-center font-normal text-slate-500 text-sm">
                    &copy; 2025 Dashboard. All rights reserved.
                </div>
            </div>
        </AnimationWrapper>
    );
};

export default SignupPage;