var encoding = 'utf-8'
var encoder = new TextEncoder(encoding)
var decoder = new TextDecoder(encoding)



generateKeys().then(async keys => {
    let stringData = "Test data";
    let data = new TextEncoder(encoding).encode(stringData);

    let encrypted = await encryptBody(data, keys.aesKey);

    let signature = await signHMAC(encrypted.body, keys.hmacKey);
    encrypted.signature = signature;

    if (!validateHMAC(encrypted.signature, encrypted.body, keys.hmacKey)) {
        throw "failed validation"
    }
    let decrypted = await decryptBody((encrypted.body), keys.aesKey, (encrypted.iv));

    let dataLooped = new TextDecoder(encoding).decode(decrypted);

    console.log(stringData);
    console.log(dataLooped);
}).catch(e => {
    console.log(e);
});

// Simple function to encrypt a message body
async function encryptBody(data, key) {
    var iv = new Uint8Array(16);
    window.crypto.getRandomValues(iv);

    console.log(iv)

    let encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-CTR",
            //Don't re-use counters!
            //Always use a new counter every time your encrypt!
            counter: iv,
            length: 128, //can be 1-128
        },
        key, //from generateKey or importKey above
        data //ArrayBuffer of data you want to encrypt
    )

    console.log(encrypted)

    return {
        body: encode8to64(encrypted),
        iv: encode8to64(iv),
    }
}

async function decryptBody(data, key, iv) {

    return await window.crypto.subtle.decrypt(
        {
            name: "AES-CTR",
            counter: Array8FromBase64(iv),
            length: 128,
        },
        key, //from generateKey or importKey above
        Array8FromBase64(data) //ArrayBuffer of the data
    )
}

async function signHMAC(data, key) {
    return encode8to64(await window.crypto.subtle.sign(
        {
            name: "HMAC",
        },
        key, //from generateKey or importKey above
        Array8FromBase64(data) //ArrayBuffer of data you want to sign
    ))
}

async function validateHMAC(signature, data, key) {
    return await window.crypto.subtle.verify(
        {
            name: "HMAC",
        },
        key, //from generateKey or importKey above
        Array8FromBase64(signature), //ArrayBuffer of the signature
        Array8FromBase64(data) //ArrayBuffer of the data
    )
}

async function generateKeys() {
    var hmacKey = await window.crypto.subtle.generateKey(
        {
            name: "HMAC",
            hash: { name: "SHA-256" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            //length: 256, //optional, if you want your key length to differ from the hash function's block length
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["sign", "verify"] //can be any combination of "sign" and "verify"
    );

    var hmacKeyExport = await window.crypto.subtle.exportKey(
        "raw", //can be "jwk" or "raw"
        hmacKey //extractable must be true
    )

    var aesKey = await window.crypto.subtle.generateKey(
        {
            name: "AES-CTR",
            length: 256, //can be  128, 192, or 256
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
    );

    var aesKeyExport = await window.crypto.subtle.exportKey(
        "raw", //can be "jwk" or "raw"
        aesKey //extractable must be true
    )

    return {
        hmacKey: hmacKey,
        hmacKeyExport: encode8to64(hmacKeyExport),
        aesKey: aesKey,
        aesKeyExport: encode8to64(aesKeyExport),
    }
}

// Base64 encode
function encode8to64(buff) {
    return btoa(new Uint8Array(buff).reduce((s, b) => s + String.fromCharCode(b), ''));
}

function Array8FromBase64(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}