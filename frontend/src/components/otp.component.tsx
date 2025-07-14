'use client';

import React, { useRef, useState, useEffect } from 'react';
import { resendOtp } from '@/services/page';
import { toast } from 'react-hot-toast';

interface Props {
  count: number;
  onOTPComplete: (otp: string) => void;
  emailVerfied: string;
}

const OtpComponent: React.FC<Props> = ({ count, onOTPComplete, emailVerfied }) => {
  const [otps, setOtps] = useState<string[]>(Array(count).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState(30);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  useEffect(() => {
    if (!isResendEnabled && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
    if (timer === 0) setIsResendEnabled(true);
  }, [timer, isResendEnabled]);

  const handleClick = (index: number) => (event: React.MouseEvent<HTMLInputElement>) => {
    event.currentTarget.setSelectionRange(1, 1);
  };

  const handlePaste = (index: number) => (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = event.clipboardData.getData('Text').slice(0, count);
    if (!isNaN(Number(pastedData))) {
      const splitData = pastedData.split('');
      setOtps(splitData);
    }
  };

  const handleKeyUp = (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
    const key = event.key;
    const oldOtps = [...otps];

    if (key === 'ArrowRight') return moveFocusToRight(index);
    if (key === 'ArrowLeft') return moveFocusToLeft(index);

    if (key === 'Backspace') {
      oldOtps[index] = '';
      setOtps(oldOtps);
      return moveFocusToLeft(index);
    }

    if (isNaN(Number(key))) return;

    oldOtps[index] = key;
    setOtps(oldOtps);
    moveFocusToRight(index);
  };

  const moveFocusToRight = (index: number) => {
    const nextRef = inputRefs.current[index + 1];
    if (nextRef) nextRef.focus();
  };

  const moveFocusToLeft = (index: number) => {
    const prevRef = inputRefs.current[index - 1];
    if (prevRef) prevRef.focus();
  };

  const ConfirmOTPSubmition = () => {
    const otpToSend = otps.join('');
    if (otpToSend.length === count) {
      onOTPComplete(otpToSend);
    } else {
      toast.error('Please enter complete OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      await toast.promise(resendOtp(emailVerfied), {
        loading: 'Resending OTP...',
        success: 'OTP sent again!',
        error: 'Failed to resend OTP',
      });
      setTimer(30);
      setIsResendEnabled(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Unexpected error');
    }
  };

  return (
    <div className="max-w-xl md:mx-10 mr-5 my-16 flex flex-col justify-center max-md:items-center gap-4 pl-5 lg:pl-0">
      <h1 className="text-xl text-slate-700 font-semibold tracking-wide">Verification Code</h1>
      <p className="w-xs max-md:text-center text-sm font-normal text-slate-600">
        We have sent a verification code to your email address. Please enter the code below.
      </p>
      <div className="px-4 min-w-64 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-500 flex justify-between items-center">
        <span>{emailVerfied || 'example@gmail.com'}</span>
        <i className="fi fi-rr-envelope text-lg text-slate-500"></i>
      </div>

      <div className="flex min-w-64 gap-5 flex-col items-center">
        <div className="w-full flex justify-start items-center gap-1">
          {Array(count)
            .fill('')
            .map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onPaste={handlePaste(index)}
                inputMode="numeric"
                autoComplete="one-time-code"
                onClick={handleClick(index)}
                className="w-8 h-8 text-slate-700 text-center border border-slate-300 focus:border-blue-500 hover:border-blue-500 outline-none rounded-lg text-lg font-semibold mx-1"
                type="text"
                onKeyUp={handleKeyUp(index)}
                value={otps[index] ?? ''}
                onChange={() => { }}
              />
            ))}
        </div>
        <div className="text-sm flex w-full justify-end text-slate-500">
          {isResendEnabled ? (
            <button
              className="text-blue-600 hover:underline"
              onClick={handleResendOtp}
            >
              Resend OTP
            </button>
          ) : (
            <>Resend available in <span className="font-medium ml-1">{timer}s</span></>
          )}
        </div>

        <button
          onClick={ConfirmOTPSubmition}
          className="w-full cursor-pointer py-2 px-6 border bg-slate-50 text-slate-600 font-light uppercase text-sm border-slate-400 hover:border-blue-500 rounded-full"
        >
          Confirm OTP
        </button>

        
      </div>
    </div>
  );
};

export default OtpComponent;
