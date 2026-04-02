<<<<<<< HEAD

function generateOtp(len = 6, chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"){
    let result = "";
    for (let i = 0; i < len; i++)
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    
    return result;
}


=======


function generateOtp(len = 6, chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"){
    let result = "";
    for (let i = 0; i < len; i++)
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    
    return result;
}


>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
export default generateOtp;