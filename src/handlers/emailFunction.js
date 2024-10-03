require("dotenv").config();
const nodemailer = require("nodemailer");

function sendEmail(recipientEmail, OTP, id) {
	return new Promise((resolve, reject) => {
		const transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			service: "gmail",
			secure: true,
			auth: {
				user: process.env.MY_EMAIL,
				pass: process.env.MY_PASSWORD,
			},
		});
		const mailConfigs = {
			from: process.env.MY_EMAIL,
			to: recipientEmail,
			subject: "PASSWORD RECOVERY",
			html: `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<title>OTP Email Template</title>
			</head>
			<body>
				<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
					<div style="margin:50px auto;width:70%;padding:20px 0">
						<div style="border-bottom 1px solid #eee">
						<a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">A few more steps to change your password</a>
						<p>Use the following code to complete your password recovery process</p>
						<p>Click here :</p>
						<a href="http://localhost:3000/recoveryrequest/${id}">Your recovery link</a>
						<h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
						<hr style="border:none;border-top:1px solid #eee" />
						<div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
							<p>Spherus</p>
							<p>Wild Code School</p>
							<p>Nantes</p>
						</div>
					</div>
				</div>
			</body>
			</html>
			`,
		};
		transporter.sendMail(mailConfigs, (error) => {
			if (error) {
				return reject(new Error({ message: "An error as occured" }));
			}
			return resolve({ message: "Email sent successfuly" });
		});
	});
}

module.exports = {
	sendEmail,
};
