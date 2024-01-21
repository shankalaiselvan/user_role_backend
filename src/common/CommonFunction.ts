require('dotenv').config();
const env = process.env;
const jwt = require("jsonwebtoken");
import * as fs from 'fs';
const request = require('request');

function translate(data: String, language: String) {
    const enMessage = { "validation error": "Validation Error", "failure": "Failure", "data not found": "Data Not Found", "otp message": "Your OTP code is  — **otp** This code can be used only once and dont share this code with anyone", "mobile already registered": "The provided mobile number is already registered.", "profile not complete": "Please complete your profile information.", "otp send successfully": "OTP send successfully.", "otp verified successfully": "OTP verified successfully.", "time out": "OTP verification time out. Please try again", "otp verification failed": "OTP verification failed. Please try again", "wallet created success": "Wallet Created Successfully", "signup successfully": "Success. Thank you for signup with us. Welcome to xPayz!", "login successfully": "Logged in successfully", "mobile not registered": "The mobile number you've entered is not registered with xPayz. Check your number or sign up if you don't have an account", "success": "Success", "logout successfully": "Logout Successfully", "user updated successfully": "User Updated Successfully", "wallet list": "Wallet List", "wallet updated success": "Wallet Updated Successfully", "wallet deleted success": "Wallet Deleted Successfully", "wallet is registered": "Wallet Is Registered.", "wallet reorder success": "Wallet Reorder Successfully", "amount transfer success": "Amount Transfer Successfully", "transaction list": "Transaction List", "raise request success": "Raise Request Created Successfully", "card deleted success": "Card Deleted Successfully", "card saved successfully": "Your card details saved successfully", "person not added": "This favourite person not added", "person already added": "This favourite person is already added", "favourite person deleted success": "Favourite Person Deleted Successfully", "fav user already added": "This favourite user details already added", "fav person created": "Favourite Person Created Successfully", "notification read": "Notification Read Successfully", "schedule deleted success": "Schedule Deleted Successfully", "user created success": "User Created Successfully", "created successfully": "Created Successfully", "email already exist": "Email Already Exist", "mobile number already exist": "Mobile Number Already Exist", "password not matched": "Password Not Matched", "updated successfully": "Updated Successfully", "file uploaded success": "File Uploaded Successfully", "you don't have permission": "You Don't Have Permission", "language": "en" };
    const arMessage = { "validation error": "خطأ في التحقق", "failure": "إخفاق", "data not found": "لم يتم العثور على بيانات", "otp message": "رمز OTP الخاص بك هو - **otp** يمكن استخدام هذا الرمز مرة واحدة فقط ولا تشارك هذا الرمز مع أي شخص", "mobile already registered": "رقم الهاتف المدخل مسجل مسبقا.", "profile not complete": "يرجى استكمال معلومات ملفك الشخصي.", "otp send successfully": "تم ارسال الOTP بنجاح.", "otp verified successfully": "تم التحقق من ال OTP بنجاح.", "time out": "فشل التحقق في المهلة المحددة OTP. حاول مرة اخرى", "otp verification failed": "فشل التحقق من ال OTP. حاول مرة اخرى.", "wallet created success": "تم إنشاء المحفظة بنجاح", "signup successfully": "نجاح ، شكرًا لك على التسجيل معنا ، مرحبًا بك في xPayz!", "login successfully": "تم تسجيل الدخول بنجاح", "mobile not registered": "رقم الهاتف المحمول الذي أدخلته غير مسجل في xPayz. تحقق من رقمك أو قم بالتسجيل إذا لم يكن لديك حساب", "success": "نجاح", "logout successfully": "تم تسجيل الخروج بنجاح", "user updated successfully": "تم تحديث المستخدم بنجاح", "wallet list": "قائمة المحفظة", "wallet updated success": "تم تحديث المحفظة بنجاح", "wallet deleted success": "تم حذف المحفظة بنجاح", "wallet is registered": "المحفظة مسجلة.", "wallet reorder success": "تمت إعادة ترتيب المحفظة بنجاح", "amount transfer success": "تم تحويل المبلغ بنجاح", "transaction list": "قائمة المعاملات", "raise request success": "تم إنشاء طلب الرفع بنجاح", "card deleted success": "تم حذف البطاقة بنجاح", "card saved successfully": "تم حفظ تفاصيل بطاقتك بنجاح", "person not added": "لم تتم إضافة هذا الشخص المفضل", "person already added": "تمت إضافة هذا الشخص المفضل بالفعل", "favourite person deleted success": "تم حذف الشخص المفضل بنجاح", "fav user already added": "تمت إضافة تفاصيل المستخدم المفضلة هذه بالفعل", "fav person created": "تم إنشاء الشخص المفضل بنجاح", "notification read": "تمت قراءة الإخطار بنجاح", "schedule deleted success": "تم حذف الجدول الزمني بنجاح", "user created success": "تم إنشاء المستخدم بنجاح", "created successfully": "تم إنشاؤه بنجاح", "email already exist": "البريد الالكتروني موجود مسبقا", "mobile number already exist": "رقم الهاتف المحمول موجود بالفعل", "password not matched": "كلمة المرور غير متطابقة", "updated successfully": "تم التحديث بنجاح", "file uploaded success": "تم رفع الملف بنجاح", "you don't have permission": "ليس لديك إذن", "language": "ar" };

    let localeObject = {};
    localeObject = language == "ar" ? { ...localeObject, ...arMessage } : { ...localeObject, ...enMessage };

    let startPos = data.indexOf("##");
    while (startPos != -1) {
        const endPos = data.indexOf("##", startPos + 1);
        const replacableWord = data.substring(startPos, endPos + 2);
        const replacableWordKey = data.substring(startPos + 2, endPos);
        data = data.replace(replacableWord, localeObject.hasOwnProperty(replacableWordKey) ? localeObject[replacableWordKey] : replacableWordKey);
        startPos = data.indexOf("##", endPos + 1);
    }
    return data;
};

function accessToken() {
    return jwt.sign({ userId: "62b1c399be4ae756ddf161db", role: "Guest" }, env.ACCESSSECRETKEY);
}

function verifyAccessToken(accessToken: String) {
    return jwt.verify(accessToken, env.ACCESSSECRETKEY);
};

function retrieveAccessToken(authUserId: String) {
    return jwt.sign({ userId: authUserId }, env.ACCESSSECRETKEY, { expiresIn: env.ACCESSEXPIREDTIME });
};

const GET_METHOD = 0;
const POST_METHOD = 1;
const PUT_METHOD = 2;
const DELETE_METHOD = 3;

function checkApiKey(req) {
    const reqQuery = req.query;
    const reqUrl = req.url;
    var splitUrl = reqUrl.split('/');
    const controllerName = splitUrl[1];
    try {
        var filePath = 'src/user_role/' + reqQuery.apiKey + '.json';
        if (fs.existsSync(filePath)) {
            let roleVals = fs.readFileSync('src/user_role/' + reqQuery.apiKey + '.json');
            var data = JSON.parse(roleVals.toString());
            const userPermission = data.userPermission;
            const permission = userPermission[controllerName][0].permission;
            var digits = permission.toString().split('');
            if (req.method == "GET" && digits[GET_METHOD] == 1) {
                return true;
            } else if (req.method == "POST" && digits[POST_METHOD] == 1) {
                return true;
            } else if (req.method == "PUT" && digits[PUT_METHOD] == 1) {
                return true;
            } else if (req.method == "DELETE" && digits[DELETE_METHOD] == 1) {
                return true;
            } else {
                return "Cannot Access the file";
            }
        } else {
            return "Invalid User";
        }
    } catch (err) {
        console.log(err);
    }
}

async function checkPermission(req, role) {
    const reqUrl = req.url;
    var splitUrl = reqUrl.split('?');
    const controllerName = splitUrl[0];
    try {
        var filePath = 'src/user_role/checkAPIPermission.json';
        if (fs.existsSync(filePath)) {
            let roleVals = fs.readFileSync('src/user_role/checkAPIPermission.json');
            var data = JSON.parse(roleVals.toString());
            const userPermission = data;
            const permission = userPermission[controllerName];
            if (permission.includes(role)) {
                return true;
            } else {
                return "you don't have permission";
            }
        } else {
            return "you don't have permission";
        }
    } catch (err) {
        console.log(err);
    }
}

// async function moveSingleImage(image) {
//     const IMAGE_PATH = "./public/images/temp/"
//     var myArray = image.split("/");
//     var pathType = myArray[0];
//     var imageName = myArray[1];
//     if (fs.existsSync(IMAGE_PATH + imageName)) {
//         var result = true;
//     } else {
//         var result = false;
//     }
//     if (result == true) {
//         /* const tempImageUrl = 'http://192.168.1.5:4000/images/temp/' + imageName; */
//         const tempImageUrl = env.BASEURL + 'images/temp/' + imageName;
//         const originalImgUrl = await movetoOriginalImage(tempImageUrl, pathType);
//         const ImageUrl = 'images/' + image;
//         return ImageUrl;
//     } else {
//         return false;
//     }
// }

async function moveSingleImage(image) {
    const IMAGE_PATH = "./public/images/temp/"
    var myArray = image.split("/");
    var pathType = myArray[0];
    var imageName = myArray[1];
    if (fs.existsSync(IMAGE_PATH + imageName)) {
        var result = true;
    } else {
        var result = false;
    }
    if (result == true) {
        const currentPath = './public/images/temp/' + imageName;
        const destinationPath = './public/images/' + pathType + '/' + imageName;
        fs.rename(currentPath, destinationPath, function (err) {
            if (err) {
                throw err
            } else {
                console.log("Successfully moved the file!");
            }
        });
    } else {
        return false;
    }
}

async function moveSingleFile(file) {
    const FILE_PATH = "./public/files/temp/"
    var myArray = file.split("/");
    var pathType = myArray[0];
    var fileName = myArray[1];
    if (fs.existsSync(FILE_PATH + fileName)) {
        var result = true;
    } else {
        var result = false;
    }
    if (result == true) {
        /*  const tempImageUrl = env.BASEURL + 'files/temp/' + fileName;
         const originalImgUrl = await movetoOriginalFile(tempImageUrl, pathType);
         const fileUrl = 'files/' + file;
         return fileUrl; */
        const currentPath = './public/files/temp/' + fileName;
        const destinationPath = './public/files/' + pathType + '/' + fileName;
        fs.rename(currentPath, destinationPath, function (err) {
            if (err) {
                throw err
            } else {
                console.log("Successfully moved the file!");
            }
        });
    } else {
        return false;
    }
}

async function moveMultipleFile(file) {
    const arr = [];
    await Promise.all(file.map(async (element) => {
        const result = await moveSingleFile(element);
        arr.push(result);
    }));
    return arr;
}

async function moveMultipleImage(file) {
    const arr = [];
    await Promise.all(file.map(async (element) => {
        const result = await moveSingleImage(element);
        arr.push(result);
    }));
    return arr;
}

async function movetoOriginalFile(url: string, pathType: string) {
    const download = (url, path, callback) => {
        request.head(url, (err, res, body) => {
            request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', callback)
        });
    }
    var fields = url.split('/');
    const path = './public/files/' + pathType + '/' + fields[5];
    download(url, path, () => { });
    var originalFileUrl = 'files/' + pathType + '/' + fields[5];
    return originalFileUrl;
}

async function movetoOriginalImage(url: string, pathType: string) {
    const download = (url, path, callback) => {
        request.head(url, (err, res, body) => {
            request(url)
                .pipe(fs.createWriteStream(path))
                .on('close', callback)
        });
    }
    var fields = url.split('/');
    const path = './public/images/' + pathType + '/' + fields[5];
    download(url, path, () => { });
    // var originalImageUrl = 'http://localhost:4000/images/images/' + fields[5];
    var originalImageUrl = 'images/' + pathType + '/' + fields[5];
    return originalImageUrl;
}

module.exports = {
    moveMultipleImage,
    moveSingleFile,
    movetoOriginalFile,
    moveMultipleFile,
    movetoOriginalImage,
    moveSingleImage,
    translate,
    verifyAccessToken,
    retrieveAccessToken,
    checkApiKey,
    checkPermission,
    accessToken
};