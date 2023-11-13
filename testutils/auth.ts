import crypto from "crypto";
import * as jose from "jose";

const info = "NextAuth.js Generated Encryption Key";
const getKey = (): Promise<Uint8Array> => {
    return new Promise(res => {
        crypto.hkdf("sha256", process.env.NEXTAUTH_SECRET ?? "", "", info, 32, (_, key) => res(new Uint8Array(key)));
    });
}

export const decryptJWE = async (jwe: string) => {
    const { plaintext } = await jose.compactDecrypt(jwe, await getKey());
    return JSON.parse(plaintext.toString());
}

export const encryptJWE = async (object: any) => {
    const plaintext = Buffer.from(JSON.stringify(object));
    const encrypted = await new jose.CompactEncrypt(plaintext).setProtectedHeader({
        "alg": "dir",
        "enc": "A256GCM"
    }).encrypt(await getKey());
    return encrypted;
}

export const defaultJWEContent = { 
    "name": "Mocked User", 
    "email": "mocked@user.com", 
    "picture": "https://placehold.co/200", 
    "sub": "102956053936680697763", 
    "isAdmin": false, 
    "subscribed": false, 
    "iat": 1699816795, 
    "exp": 1702408795, 
    "jti": "8770d354-3da4-406a-9649-8508df9bf33a" 
}

export const defaultMockedUser = {
    "name": "Mocked User",
    "email": "mocked@user.com"
}