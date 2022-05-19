import crypto from 'crypto';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv/config';



export const generateToken = (size, encoding = 'hex') => crypto.randomBytes(size).toString(encoding);


export const encrypt = data => {

   return CryptoJS.AES.encrypt(data, process.env['SECRET_KEY_FOR_ENCRYPTION']).toString().replaceAll('/', '_');

};


export const decrypt = cipher => {

   const bytes  = CryptoJS.AES.decrypt(cipher.replaceAll('_', '/'), process.env['SECRET_KEY_FOR_ENCRYPTION']);
   return bytes.toString(CryptoJS.enc.Utf8);

}