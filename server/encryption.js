const utils = require("util")

// If running in nodejs we need to bootstrap some stuff. 
// This checks for node and does the bootstrapping...
// extracting the keys required from the environment variables.
if (isNodeJs()) {
    console.log("Using Nodejs WebCryto api");
    keysAvailable = false;
    
    const crypto = require('@trust/webcrypto')
    window = {}
    window.crypto = crypto;

    function btoa(str) {
        var buffer;

        if (str instanceof Buffer) {
            buffer = str;
        } else {
            buffer = Buffer.from(str.toString(), 'binary');
        }

        return buffer.toString('base64');
    }

    function atob(str) {
        return Buffer.from(str, 'base64').toString('binary');
    }

    console.log("Importing keys from environment vars");

    if (process.env.AES_KEY === undefined || process.env.AES_KEY === "") {
        console.log("AES_KEY env var not set. Exiting");
        process.exit(1);
    }


    if (process.env.HMAC_KEY === undefined || process.env.HMAC_KEY === "") {
        console.log("HMAC_KEY env var not set. Exiting");
        process.exit(1);
    }

    // Import the keys from OS vars
    keys = {}
    window.crypto.subtle.importKey(
        "raw", //can be "jwk" or "raw"
        arrayFromBase64(process.env.AES_KEY),
        {   //this is the algorithm options
            name: "AES-CTR",
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
    ).then((k) => {
        keys.aesKey = k;
    }).catch(function(err){
        console.error(err);
    });

    window.crypto.subtle.importKey(
        "raw", //can be "jwk" or "raw"
        arrayFromBase64(process.env.HMAC_KEY),
        {   //this is the algorithm options
            name: "HMAC",
            hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
            //length: 256, //optional, if you want your key length to differ from the hash function's block length
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ["sign", "verify"] //can be any combination of "sign" and "verify"
    )
    .then((k) => {
        keys.hmacKey = k
    }).catch(function(err){
        console.error(err);
    });

    keysAvailable = true;

} else {
    console.log("Encryption library not running under node - NOT EXPECTED");
    throw "wrong execution environment"
}

const encoding = 'utf-8'

module.exports = {
    encryptAndSign: async function (message, keys) {
        let data = new (require('util').TextEncoder)(encoding).encode(message);
    
        let encrypted = await encryptBody(data, keys.aesKey);
        let signature = await signHMAC(encrypted.ivAndBody, keys.hmacKey);
        
        return {
            body: encrypted.body,
            iv: encrypted.iv,
            sig: signature
        }
    },
    validateAndDecrypt: async function(message, keys) {
        const ivAndBody = appendBuffer(arrayFromBase64(message.body), arrayFromBase64(message.iv));
        if (!await validateHMAC(message.sig, ivAndBody, keys.hmacKey)) {
            return {
                isValid: false
            }
        }
        let decrypted = await decryptBody(message.body, keys.aesKey, message.iv);
    
        return {
            isValid: true, 
            message: new (require('util').TextDecoder)(encoding).decode(decrypted)
        }
    },
    generateKeys: async function () {
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
            hmacKeyExport: base64FromArray(hmacKeyExport),
            aesKey: aesKey,
            aesKeyExport: base64FromArray(aesKeyExport),
        }
    }
}

// Simple function to encrypt a message body
async function encryptBody(data, key) {
    var iv = new Uint8Array(16);
    window.crypto.getRandomValues(iv);

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
        body: base64FromArray(encrypted),
        iv: base64FromArray(iv),
        ivAndBody: base64FromArray(appendBuffer(encrypted, iv))
    }
}

async function decryptBody(data, key, iv) {

    return await window.crypto.subtle.decrypt(
        {
            name: "AES-CTR",
            counter: arrayFromBase64(iv),
            length: 128,
        },
        key, //from generateKey or importKey above
        arrayFromBase64(data) //ArrayBuffer of the data
    )
}

async function signHMAC(data, key) {
    return base64FromArray(await window.crypto.subtle.sign(
        {
            name: "HMAC",
        },
        key, //from generateKey or importKey above
        arrayFromBase64(data) //ArrayBuffer of data you want to sign
    ))
}

async function validateHMAC(signature, data, key) {
    return await window.crypto.subtle.verify(
        {
            name: "HMAC",
        },
        key, //from generateKey or importKey above
        arrayFromBase64(signature), //ArrayBuffer of the signature
        arrayFromBase64(data) //ArrayBuffer of the data
    )
}




// Base64 encode
function base64FromArray(buff) {
    return btoa(new Uint8Array(buff).reduce((s, b) => s + String.fromCharCode(b), ''));
}

function arrayFromBase64(base64) {
    var binary_string = atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

function appendBuffer( buffer1, buffer2 ) {
    var tmp = new Uint8Array( buffer1.byteLength + buffer2.byteLength );
    tmp.set( new Uint8Array( buffer1 ), 0 );
    tmp.set( new Uint8Array( buffer2 ), buffer1.byteLength );
    return tmp.buffer;
}

function isNodeJs() {
    return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
}