import bcrypt from 'bcrypt';

/**
 * Generate random number otp
 * @param length length of the otp(default 6)
 * @returns OTP as string
 */ 


export const generateOTP = (length:number=6): string => {
    const digits='0123456789';
    let otp='';
    for(let i=0;i<length;i++){
        otp+=digits[Math.floor(Math.random()*10)]
    }
    return otp;
}

/**
 * 
 * @param plainOTP user provided otp
 * @param hashedOTP stored hashed otp
 * @returns boolean promise if otp is valid
 */
export const verifyOTP = async (plainOTP:string,hashedOTP:string):Promise<boolean> => {
    return await bcrypt.compare(plainOTP,hashedOTP)
}
