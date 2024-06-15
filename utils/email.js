
const nodemailer = require('nodemailer');

const sendEmail = async (options) =>{
    //1) phương tiện vận chuyển
        const transporter = nodemailer.createTransport({
            host:process.env.EMAIL_HOST,
            post:process.env.EMAIL_PORT,
            auth:{
                user:process.env.EMAIL_USERNAME ,
                pass:process.env.EMAIL_PASSWORD
            }
            // Kích hoạt tùy chọn "ứng dụng kém an toàn" trong gmail(nếu sử dụng gmail để gửi)
        })
        
    //2) Xác định các tuỳ chọn email options

    const mailOptions = {
        from:'Huy Phan <hellohuy.io>',
        to:options.email,
        subject:options.subject,
        text:options.message,
        // html:

    }

    //3) Gửi mail bằng nodemailer
    await transporter.sendMail(mailOptions) // trả về promise , hàm không đồng bộ

};


const sendEmailWithGoogle = async(options) =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_USERNAMEGG,
          pass: process.env.EMAIL_PASSGOOGLE ,
        },
      });


     return await transporter.sendMail({
        from: '"Huy Phan <hellohuy.io>', // sender address
        to:options.email, // list of receivers
        subject:options.subject,// Subject line
        text:options.message,// plain text body
        html: "<b>forgot Password</b>", // html body
      });
}

module.exports=sendEmail;

