let nodemailer = require("nodemailer");
let currentYear = new Date().getFullYear();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendFliteRevUserCreationEmail = async (
    userName,
    email,
    password,
    domain
) => {
    await transporter
        .sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "FliteRev Account Information",
            html: `<!DOCTYPE html>
            <html>
            
            <head>
                <style type="text/css">
                    body {
                        margin: 0;
                        padding: 0;
                        background: #f0f0f0;
                        font-family: Montserrat, sans-serif;
                    }
            
                    table {
                        border-collapse: collapse
                    }
            
                    table td {
                        border-collapse: collapse
                    }
            
                    img {
                        border: none;
                    }
                </style>
            </head>
            
            <body style="background:#f0f0f0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td height="15" align="center" valign="top">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center" valign="top">
                            <table width="600" border="0" align="center" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="left" valign="middle" style="padding:10px 0; background:tranparent;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="38%" align="center" valign="middle" style="padding:15px;">
                                                    <a href="@SITE_URL" target="_blank" title="Flitex"><img src="${process.env.BACKEND_URL}/api/public/flitex.png"
                                                            width="210" alt="flitex" style="display:inline-block;" /></a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="0" align="left" valign="middle" bgcolor="#013357" style="height:5px;"></td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="middle">
                                        <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" valign="middle"
                                                    style="font-family:Montserrat,sans-serif; font-size:24px; line-height:24px; font-weight:600; color:#121d4c;">
                                                    &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle"
                                                    style="font-family:Montserrat,sans-serif; font-size:24px; line-height:24px; font-weight:600; color:#121d4c;">
                                                    &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="left" valign="middle"
                                                    style="font-family:Montserrat,sans-serif; font-size:30px; line-height:24px; font-weight:600; color:#121d4c; text-align: center;">
                                                    Account successfully created</td>
                                            </tr>
                                            <tr>
                                                <td align="left" valign="middle">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="left" valign="middle">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle">
                                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                        <tr>
                                                            <td
                                                                style="font-family:Montserrat,sans-serif; font-size:16px; line-height:24px; font-weight:600; color:#000; padding:10px 10px 10px 10px;">
                                                                User Name</td>
                                                            <td
                                                                style="font-family:Montserrat,sans-serif; font-size:16px; line-height:24px; font-weight:400; color:#000; padding:10px 10px 10px 10px;">
                                                                ${userName}</td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="font-family:Montserrat,sans-serif; font-size:16px; line-height:24px; font-weight:600; color:#000; padding:10px 10px 10px 10px;">
                                                                Email Id</td>
                                                            <td><a href="mailto:harsh@netclues.in"
                                                                    style="font-family:Montserrat,sans-serif; font-size:16px; line-height:24px; font-weight:400; color:#000; padding:10px 10px 10px 10px; text-decoration: none;">${email}</a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td
                                                                style="font-family:Montserrat,sans-serif; font-size:16px; line-height:24px; font-weight:600; color:#000; padding:10px 10px 10px 10px;">
                                                                Domain Name</td>
                                                            <td><a href="@SITE_URL" target="_blank" title="Flitex"
                                                                    style="font-family:Montserrat,sans-serif; font-size:16px; line-height:24px; font-weight:400; color:#000; padding:10px 10px 10px 10px; text-decoration: none;">${domain}</a>
                                                            </td>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="left" valign="middle"
                                                    style="font-family:Montserrat,sans-serif; font-size:16px; line-height:20px; color:#707070; padding: 0 0 4px;">
                                                    Thanks For Using Flitex</td>
                                            </tr>
                                            <tr>
                                                <td align="left" valign="middle"
                                                    style="font-family:Montserrat,sans-serif; font-size:14px; line-height:16px; font-weight:400; color:#707070; text-decoration:none;">
                                                    Please don't share the details with anyone.</td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                <td height="0" align="left" valign="middle" bgcolor="#dcdcdc" style="height:2px;"></td>
                            </tr>
                            <tr>
                                <td align="center" valign="middle" bgcolor="#FFFFFF">
                                    <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
                    
                    
                                        <tr>
                                            <td align="center" valign="middle">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td align="center" valign="middle"
                                                style="font-family:Montserrat,sans-serif; font-size:14px; line-height:16px; font-weight:400; color:#707070; padding:0 10px;">
                                                Copyright © ${currentYear} Flitex. All Rights Reserved.</td>
                                        </tr>
                                        <tr>
                                            <td align="center" valign="middle">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td align="center" valign="middle"
                                                style="font-family:Montserrat,sans-serif; font-size:14px; line-height:16px; font-weight:400; color:#707070; padding:0 10px;">
                                                Powerd by <a href="https://www.netclues.ky/" target="_blank"
                                                    style="text-decoration: none; color:#707070;"
                                                    title="Netclues Technologies pvt. ltd.">Netclues</a></td>
                                        </tr>
                                        <tr>
                                            <td align="center" valign="middle">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td height="0" align="left" valign="middle" bgcolor="#013357" style="height:5px;"></td>
                            </tr>
        
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            
            </html>`,
        })
        .then((res) => {
            console.log(res);
            return res;
        })
        .catch((err) => {
            console.log(err);
            return err;
        });
};

const forgotPasswordMail = async (email, OTP) => {
    await transporter
        .sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Reset Password OTP",
            html: `<!DOCTYPE html>
            <html>
            
            <head>
                <style type="text/css">
                    body {
                        margin: 0;
                        padding: 0;
                        background: #f0f0f0;
                        font-family: Montserrat, sans-serif;
                    }
                    
                    table {
                        border-collapse: collapse
                    }
                    
                    table td {
                        border-collapse: collapse
                    }
                    
                    img {
                        border: none;
                    }
                </style>
            </head>
            
            <body style="background:#f0f0f0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td height="15" align="center" valign="top">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center" valign="top">
                            <table width="600" border="0" align="center" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="left" valign="middle" style="padding:10px 0; background:tranparent;">
                                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="38%" align="center" valign="middle" style="padding:15px;">
                                                    <a href="@SITE_URL" target="_blank" title="Flitex"><img src="${process.env.BACKEND_URL}/api/public/flitex.png" width="210" alt="flitex" style="display:inline-block;" /></a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="0" align="left" valign="middle" bgcolor="#013357" style="height:5px;"></td>
                                </tr>
                                <tr>
                                    <td bgcolor="#ffffff" align="center" valign="middle">
                                        <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" valign="middle" style="font-family:Montserrat,sans-serif; font-size:24px; line-height:24px; font-weight:600; color:#121d4c;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle" style="font-family:Montserrat,sans-serif; font-size:24px; line-height:24px; font-weight:600; color:#121d4c;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="left" valign="middle" style="font-family:Montserrat,sans-serif; font-size:30px; line-height:24px; font-weight:600; color:#121d4c; text-align: center;">Two Step Verification</td>
                                            </tr>
                                            <tr>
                                                <td align="left" valign="middle" style="font-family:Montserrat,sans-serif; font-size:16px; line-height:20px; color:#707070; padding: 0 0 4px; text-align: center; padding-top: 10px; padding-bottom: 40px;">Please use the following One Time Password(${OTP})</td>
                                            </tr>                    
                                            <tr>
                                                <td align="left" valign="middle" style="font-family:Montserrat,sans-serif; font-size:40px; line-height:24px; font-weight:600; color:#121d4c; text-align: center; letter-spacing: 10px;">${OTP}</td>
                                            </tr>
                                            <tr>
                                                <td align="left" valign="middle" style="font-family:Montserrat,sans-serif; font-size:14px; line-height:20px; color:#707070; padding: 0 0 4px; text-align: center; padding-top: 15px; padding-bottom: 20px;"></td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="left" valign="middle" style="font-family:Montserrat,sans-serif; font-size:16px; line-height:20px; color:#707070; padding: 0 0 4px;">Thanks For Using Flitex</td>
                                            </tr>
                                            <tr>
                                                <td align="left" valign="middle" style="font-family:Montserrat,sans-serif; font-size:14px; line-height:16px; font-weight:400; color:#707070; text-decoration:none;">Please don't share the details with anyone.</td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="0" align="left" valign="middle" bgcolor="#dcdcdc" style="height:2px;"></td>
                                </tr>
                                <tr>
                                    <td align="center" valign="middle" bgcolor="#FFFFFF">
                                        <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
            
            
                                            <tr>
                                                <td align="center" valign="middle">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle" style="font-family:Montserrat,sans-serif; font-size:14px; line-height:16px; font-weight:400; color:#707070; padding:0 10px;">Copyright © ${currentYear} Flitex. All Rights Reserved.</td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle" style="font-family:Montserrat,sans-serif; font-size:14px; line-height:16px; font-weight:400; color:#707070; padding:0 10px;">Powerd by <a href="https://www.netclues.ky/" target="_blank" style="text-decoration: none; color:#707070;" title="Netclues Technologies pvt. ltd.">Netclues</a></td>
                                            </tr>
                                            <tr>
                                                <td align="center" valign="middle">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="0" align="left" valign="middle" bgcolor="#013357" style="height:5px;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td height="15" align="center" valign="top">&nbsp;</td>
                    </tr>
                </table>
            </body>
            </html>`,
        })
        .then((res) => {
            console.log(res);
            return res;
        })
        .catch((err) => {
            console.log(err);
            return err;
        });
};

module.exports = {
    sendFliteRevUserCreationEmail,
    forgotPasswordMail,
};
