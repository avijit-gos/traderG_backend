require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const checkNumber = require("../helper/checkNumber");
const jwt = require("jsonwebtoken");
const isAuthenticate = require("../middleware/authcheck");
const generateAccessToken = require("../helper/generateAccessToken");
const User = require("../models/user");
const UserRoute = express.Router();
const moment = require("moment-timezone");
const Kyc = require("../models/kyc");
const BankAccount = require("../models/bank_account");
const sendNotification = require("../helper/sendNotification");
const BrokerProfile = require("../models/broker_profile");
const nodemailer = require("nodemailer");


// var transport = nodemailer.createTransport({
//     host: "mail.tradergwealth.com",
//     port: 465,
//     auth: {
//       user: "support@tradergwealth.com",
//       pass: "Traderg@123"
//     }
// });

var transport = nodemailer.createTransport({
    host: "mail.demo91.co.in",
    port: 465,
    auth: {
      user: "developer@demo91.co.in",
      pass: "Developer@2023",
    },
  });

/**
 * This method is to find all User list
 */
 UserRoute.get("/list", async (req, res) => {
    try {
        let UserData = await User.find({}).sort({_id:-1}).populate([
            {
                path:"role",
                select:"name"
            }
        ]);

        let customUserData = JSON.parse(JSON.stringify(UserData))

		customUserData.map(e => {
			e.createdDateTime =  moment(e.createdAt).tz("Asia/Kolkata").format('MMM DD,YYYY-h:mm:ss a');
            e.createdDate =  moment(e.createdAt).tz("Asia/Kolkata").format('MMM DDYYYY');
			return e
		})



        message = {
            error: false,
            message: "All User list",
            data: customUserData,
        };
        res.status(200).send(message);
    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err,
        };
        res.status(200).send(message);
    }
});

/**
 * This method is to find particular User list
 */
UserRoute.get("/detail/:userId",isAuthenticate, async (req, res) => {
    try {
        let UserData = await User.findOne({_id:req.params.userId}).sort({_id:-1});

        let KycData = await Kyc.findOne({user:req.params.userId})

        let BankData = await BankAccount.findOne({user:req.params.userId}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ]);

        let BrokerData = await BrokerProfile.findOne({user:req.params.userId}).populate([
            {
                path:"broker",
                select:"name"
            }
        ])

        message = {
            error: false,
            message: "User list",
            data: UserData,
            KycData,
            BankData,
            BrokerData
        };
        res.status(200).send(message);
    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err,
        };
        res.status(200).send(message);
    }
});

/**
 * This method is to create user
 */
 UserRoute.post("/create", async (req, res) => {
	try {
        const UserExist = await User.findOne({
            $or:[{email:req.body.email},{mobile:req.body.mobile}]
        })
        if (UserExist && UserExist.email == req.body.email) {
            message = {
                error: true,
                message: "Email already exist!"
            };
        }else if(UserExist && UserExist.mobile == req.body.mobile) {
            message = {
                error: true,
                message: "Mobile already exist!"
            };
        }else{
            req.body.userId = Math.floor(Math.random() * 90000) + 10000;
            req.body.name = req.body.fname+ " " +req.body.lname;
            const UserData = new User(req.body);
		    const result = await UserData.save();

            const kycExist = await Kyc.findOne({$and:[{user:result?._id},{status:true}]})
            console.log(kycExist);
		    if (kycExist) return res.status(200).send({error: true, message: "This Kyc is already exist. Can not be created."});

            const KycData = new Kyc({user:result?._id});
            const KycResult = await KycData.save();

            const BankAccountExist = await BankAccount.findOne({user:result?._id})
            console.log(BankAccountExist);
            if (BankAccountExist) return res.status(200).send({error: true, message: "This Bank Account is already exist. Can not be created."});

            const BankAccountData = new BankAccount({user:result?._id});
            const BankAccountResult = await BankAccountData.save();

            var mailOptions = {
                from: 'support@tradergwealth.com',
                to: result.email,
                subject: `Welcome to TRADERG!`,
                html:`
        <head>
            <title>Welcome to TraderG - Your Gateway to Strategic Stock Market Investing!</title>
        </head>
        <body>
            <p><strong>Dear ${result.name},</strong></p>
            <h1 style="text-align: center; color: #007bff;">Welcome to TraderG!</h1>
            <p>We are thrilled to have you on board as a registered user and look forward to empowering your journey in the dynamic world of stock trading.</p>
            <h2>What TraderG Offers:</h2>
        <ul>
            <li>Algorithmic Strategies: TraderG provides a cutting-edge platform for creating and implementing algorithmic strategies, whether you're interested in long-term investments or short-term trades.</li>
            <li>Versatile Trading Platforms: Seamlessly connect with various trading platforms, including Arihant, Zerodha, Upstox, and more, providing flexibility and choice.</li>
            <li>Broker Collaborations: Partnered with multiple brokers and sub-broking companies to ensure access to a diverse range of services in the Indian Stock Market.</li>
            <li>Subscription-based Model: Choose or create algorithmic strategies tailored to your unique trading preferences through our subscription-based service model.</li>
        </ul>

        <h2>Key Considerations:</h2>
        <ul>
            <li>SEBI Guidelines: Familiarize yourself with SEBI guidelines before executing any trades or investments for a secure and informed trading experience.</li>
            <li>Subscription Fees: Be aware of the applicable subscription fees contributing to the development and maintenance of the TraderG ecosystem.</li>
            <li>Support and Training: Reach out for assistance or guidance from our team during live market hours.</li>
        </ul>

        <h2>Next Steps:</h2>
        <ul>
            <li>Explore the Platform: Log in to your TraderG account and start exploring the features and possibilities.</li>
            <li>Set Up Your Strategy: Create algorithmic strategies to enhance your trading experience.</li>
            <li>Stay Informed: Keep an eye on our communication channels for updates, tips, and insights.</li>
        </ul>

        <p>Once again, welcome to TraderG! We're excited to have you as part of our community. If you have any questions or need assistance, don't hesitate to reach out.</p>

        <p>Happy Trading!<br>Best Regards,<br>TraderG Team</p>
    </div>

        </body>
`

            };
              
            transport.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });

            let sendNotificationData = await sendNotification({
                user: result?._id,
                title: "User Registar successfully",
                description: "User created successfully."
            });
    
		   message = {
			  error: false,
			  message: "User Added Successfully!",
			  data: result,
              KycResult,
              BankAccountResult
		    };
        }
		return res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "operation Failed!",
			data: err.toString(),
		};
		return res.status(200).send(message);
	}
});

/**
 * This method is to update user status
 *  @param str userId
 */
 UserRoute.patch("/toggle-status/:userId",isAuthenticate, async (req, res) => {
	try {
		const result = await User.findOneAndUpdate({ _id: req.params.userId }, {status:req.body.status}, {new: true});
		if (result) {
			message = {
				error: false,
				message: "user status updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "user not updated",
			};
			res.status(200).send(message);
		}
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: err,
		};
		res.status(200).send(message);
	}
});


/**
 * This method is to update user
 *  @param str userId
 */
//  UserRoute.patch("/update/:userId",isAuthenticate, async (req, res) => {
// 	try {
//         // delete req.body.email;
//         // delete req.body.mobile;
//         // delete req.body.password;
// 		const result = await User.findOneAndUpdate({ _id: req.params.userId }, , {new: true});
// 		if (result) {
// 			message = {
// 				error: false,
// 				message: "user updated successfully!",
// 				result
// 			};
// 			res.status(200).send(message);
// 		} else {
// 			message = {
// 				error: true,
// 				message: "user not updated",
// 			};
// 			res.status(200).send(message);
// 		}
// 	} catch (err) {
// 		message = {
// 			error: true,
// 			message: "Operation Failed!",
// 			data: err.toString(),
// 		};
// 		res.status(200).send(message);
// 	}
// });


UserRoute.patch("/update/:userId", async (req, res) => {
	try {
        let userData = await User.findOne({_id:req.params.userId});
        if(!userData.mobile){
            const result = await User.findOneAndUpdate({ _id: req.params.userId },req.body, {new: true});
            if (result) {
                message = {
                    error: false,
                    message: "user data updated successfully!",
                    data:result
                };
                res.status(200).send(message);
        }
		}else if(userData.mobile) {
            const result = await User.findOneAndUpdate({ _id: req.params.userId },{fname:req.body.fname,lname:req.body.lname,email:req.body.email,date_of_birth:req.body.date_of_birth,gender:req.body.gender,occupation:req.body.occupation,address:req.body.address,city:req.body.city,state:req.body.state,pin_code:req.body.pin_code}, {new: true});
			message = {
				error: false,
				message: "Data updated",
                data:result
			};
			res.status(200).send(message);
		}else{
            message = {
                error: true,
                message: "user not updated",
            };
            res.status(200).send(message);
        }
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: err.toString(),
		};
		res.status(200).send(message);
	}
});




/**
 * This method is to login a Student
 * @param str email
 * @param str password
 */
 UserRoute.post("/login", async (req, res) => {
    try {
        if (req.body.user && req.body.password) {
            UserData = await User.findOne({$or: [ { email: req.body.user }, { mobile: checkNumber(req.body.user) } ]});
            if (UserData === null) {
                
                message = {
                    error: true,
                    message: "User does not exist"
                }
                return res.status(200).send(message);
            } else {
                passwordCheck = await bcrypt.compare(req.body.password, UserData.password);
                if (passwordCheck) {
                    if (UserData.status === true) {
                        if(UserData.login_via_google === true){
                            
                            message = {
                                error:true,
                                message:"Already logged in"
                            }
                        }
                        UserData.password = "";
                        const User = {
                            data: UserData
                        };
                        const accessToken = await generateAccessToken(User);
                        const refreshToken = await jwt.sign(User, process.env.REFRESH_TOKEN_KEY);

                        message = {
                            error: false,
                            message: "User logged in!",
                            data: [UserData, {
                                accessToken: accessToken,
                                refreshToken: refreshToken
                            }]
                        }
                        return res.status(200).send(message);
                    } else {

                        message = {
                            error: true,
                            message: "User is in active!"
                        }
                        return res.status(403).send(message);
                    }
                } else {

                    message = {
                        error: true,
                        message: "wrong password!"
                    }
                    return res.status(200).send(message);
                }
            }
        } else {

            res.status(403).send({
                message: "Email and Password are required.",
            });
        }
    } catch (err) {

        message = {
            error: true,
            message: "Operation Failed!",
            data: err.toString(),
        };
        res.status(200).send(message);
    }
});

/**
 * This method is to forget password
 * @param str email || @param number mobile || @param str username
 */
UserRoute.post("/forget-password", async (req, res) => {
    try {
      if (req.body.user) {
        const UserData = await User.findOne({ email: req.body.user });
        if (UserData == null) {
          message = {
            error: true,
            message: "User not found",
          };
          return res.status(200).send(message);
        } else {
          var newOTP = Math.floor(1000 + Math.random() * 9000);
          var mailOptions = {
            from: "developer@demo91.co.in",
            to: UserData.email,
            subject: `TRADERG - OTP for resetting password`,
            html: `
              
              <body>
                  <p><strong>Dear ${UserData.name},</strong></p>
                  <p> Please use ${newOTP} to generate new password.</p>
              </body>
      `,
          };
         
  
          transport.sendMail(mailOptions, async function (error, info) {
            if (error) {
              message = {
                  error:true,
                  message:error,
                  data:null
                 }
                 return res.status(400).send(message);
            } else {
              await User.updateOne(
                  {
                    email: UserData.email,
                  },
                  {
                    mobileOtp: "1234",
                    emailOtp: newOTP
                  }
                );
              message = {
                error: false,
                message: "Please check your email for the OTP",
                data: {
                  emailOtp: newOTP,
                  mobileOtp: "1234"
                },
              };
              console.log("Email sent: " + info.response);
              return res.status(200).send(message);
            }
          });
        }
      }
    } catch (err) {
      message = {
        error: true,
        message: "Operation Failed!",
        data: String(err),
      };
      res.status(200).send(message);
    }
  });

/**
 * This method is to verify password
 * @param str email || @param number mobile || @param str username
 */
 UserRoute.post("/verify-otp", async (req, res) => {
	try {
        if(req.body.user && req.body.otp){
            const UserData = await User.findOne({$and:[{email:req.body.user},{emailOtp:req.body.otp}]});
            console.log("UserData",UserData);
            
            if(UserData == null){
               message = {
                error:true,
                message:"otp not verified"
               }
               return res.status(200).send(message);
            }else{
                message = {
                    error:false,
                    message:"otp verified",
                   }
            }
            return res.status(200).send(message);
        }
      
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: String(err),
		};
		res.status(200).send(message);
	}
});

/**
 * reset password
 */

 UserRoute.patch("/reset-password",  async (req, res) => {
    try {
        if (req.body.new_password && req.body.confirm_password) {
            if (req.body.new_password !== req.body.confirm_password) {
                message = {
                    error: true,
                    message: "new and confirm password are not equal"
                }
                return res.status(200).send(message);
            }
            const UserData = await User.findOne({
                email: req.body.email
            });
           
            if (UserData === null) {
                message = {
                    error: true,
                    message: "User not found!"
                }
            } else {
                    const result = await User.findOneAndUpdate({
                        email: req.body.email
                    }, {
                        password: req.body.new_password
                    });

                   console.log("result",result);
                    
                    message = {
                        error: false,
                        message: "User password reset successfully!"
                    }
            }
        } else {
            message = {
                error: true,
                message: "new password, confirm password are required!"
            }
        }
        return res.status(200).send(message);
    } catch (err) {
        message = {
            error: true,
            message: "Operation Failed!",
            data: String(err),
        };
        res.status(500).send(message);
    }
});



/**
 * This method is to change password
 * @param str email
 * @param str password
 */


 UserRoute.patch("/change-password/:userId",isAuthenticate, async (req, res) => {
    try {
        if (req.body.old_password && req.body.new_password) {
            if (req.body.old_password === req.body.new_password) {
                message = {
                    error: true,
                    message: "Old and new password can not be same"
                }
                return res.status(200).send(message);
            }
            const UserData = await User.findOne({
                _id: req.params.userId
            });
            if (UserData === null) {
                message = {
                    error: true,
                    message: "User not found!"
                }
            } else {
                passwordCheck = await bcrypt.compare(req.body.old_password, UserData.password);
                if (passwordCheck) {
                    const result = await User.updateOne({
                        _id: req.params.userId
                    }, {
                        password: req.body.new_password
                    });
                    message = {
                        error: false,
                        message: "User password updated!"
                    }
                } else {
                    message = {
                        error: true,
                        message: "Old password is not correct!"
                    }
                }
            }
        } else {
            message = {
                error: true,
                message: "Old password, new password are required!"
            }
        }
        return res.status(200).send(message);
    } catch (err) {
        message = {
            error: true,
            message: "Operation Failed!",
            data: err,
        };
        res.status(500).send(message);
    }
});

//Google login 


UserRoute.post("/google-login", async (req, res) => {
    try {
        if (req.body.email) {
            UserData = await User.findOne({ email: req.body.email });
            let userResult;
            if (UserData === null) {

                req.body.userId = Math.floor(Math.random() * 90000) + 10000;
                req.body.name = req.body.fname+ " " +req.body.lname;
                const userResult = new User(req.body);
                const result = await userResult.save();

            const kycExist = await Kyc.findOne({user:result?._id})
            //console.log(kycExist);
		    if (kycExist) return res.status(200).send({error: true, message: "This Kyc is already exist. Can not be created."});

            const KycData = new Kyc({user:result?._id});
            const KycResult = await KycData.save();


            const BankAccountExist = await BankAccount.findOne({user:result?._id})
            console.log(BankAccountExist);
            if (BankAccountExist) return res.status(200).send({error: true, message: "This Bank Account is already exist. Can not be created."});

            const BankAccountData = new BankAccount({user:result?._id});
            const BankAccountResult = await BankAccountData.save();

           // console.log({BankAccountResult});


                const LogData = {
                    data: result
                };
                const accessToken = await generateAccessToken(LogData);
                const refreshToken = await jwt.sign(LogData, process.env.REFRESH_TOKEN_KEY);

                message = {
                    error: false,
                    message: "User logged in!",
                    data: [result,{
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }]
                }
                return res.status(200).send(message);
            }else{

                const User = {
                    data: UserData
                };
                const accessToken = await generateAccessToken(User);
                const refreshToken = await jwt.sign(User, process.env.REFRESH_TOKEN_KEY);

                message = {
                    error: false,
                    message: "User logged in!",
                    data: [UserData, {
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }]
                }
                return res.status(200).send(message);
            }
        }else{
            message = {
                error:true,
                message:"user not logged in!"
            }
            return res.status(200).send(message);
        }
    } catch (err) {

        message = {
            error: true,
            message: "Operation Failed!",
            data: err.toString(),
        };
        res.status(200).send(message);
    }
});



//for mobile login

UserRoute.post("/get-otp", async (req, res) => {
	try {
        if(req.body.user){
            const UserData = await User.findOne({ mobile: checkNumber(req.body.user) });
            if(UserData == null){
               message = {
                error:true,
                message:"User not found"
               }
               return res.status(200).send(message);
            }else{
                const otpData = {
                    mobileOtp: 1234
                }
                message = {
                    error:false,
                    message:"Otp received!",
                    data:otpData
                   }
            }
            return res.status(200).send(message);
        }
      
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: String(err),
		};
		res.status(200).send(message);
	}
});


/**
 * /**
 * This method is to change password
 * @param str email
 * @param str password
 */
 
 UserRoute.post("/login-with-otp", async (req, res) => {
    try {
        if (req.body.user && req.body.otp) {
            UserData = await User.findOne({$or: [ { email: req.body.user }, { mobile: checkNumber(req.body.user) }]});
            if (UserData === null) {
                message = {
                    error: true,
                    message: "User does not exist"
                }
                return res.status(200).send(message);
            } else {
                if (req.body.otp === UserData.mobileOtp) {
                    if (UserData.status === true) {
                        const user = {
                            data: UserData
                        };
                        const accessToken = await generateAccessToken(user);
                        const refreshToken = await jwt.sign(user, process.env.REFRESH_TOKEN_KEY);

                        message = {
                            error: false,
                            message: "User logged in!",
                            data: [UserData, {
                                accessToken: accessToken,
                                refreshToken: refreshToken
                            }]
                        }
                        return res.status(200).send(message);
                    } else {
                        message = {
                            error: true,
                            message: "User is in active!"
                        }
                        return res.status(403).send(message);
                    }
                } else {
                    message = {
                        error: true,
                        message: "wrong otp!"
                    }
                    return res.status(200).send(message);
                }
            }
        } else {
            res.status(403).send({
                message: "Email and OTP are required.",
            });
        }
    } catch (err) {
        message = {
            error: true,
            message: "Operation Failed!",
            data: err,
        };
        res.status(200).send(message);
    }
});

/**
 * This method is to delete User
 * @param str userId
 */
 UserRoute.delete("/delete/:userId", async (req, res) => {
	try {
		const result = await User.deleteOne({ _id: req.params.userId });
		if (result.deletedCount == 1) {
			message = {
				error: false,
				message: "User deleted successfully!",
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Operation failed!",
			};
			res.status(200).send(message);
		}
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: err,
		};
		res.status(200).send(message);
	}
});


/**
 * This method is to search user
 */

 UserRoute.get("/search", isAuthenticate, async (req, res) => {
	try {
		const searchText = req.body.searchText;
		const result = await User.find({
			"$or":[{"fname":{"$regex":searchText,$options: 'i' }},{"lname":{"$regex":searchText,$options: 'i' }},{"mobile":{"$regex":searchText,$options: 'i' }},{"email":{"$regex":searchText,$options: 'i'}}]})
		
		if (result) {
			message = {
				error: false,
				message: "User search successfully!",
				data:result
			};
			
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "User search failed",
			};
			
			res.status(200).send(message);
		}
	} catch (err) {
		
		message = {
			error: true,
			message: "Operation Failed!",
			data: err,
		};
		res.status(200).send(message);
	}
});


UserRoute.patch("/search-list", isAuthenticate, async (req, res) => {
	try {

        let fname = req.query.fname;
        let lname = req.query.lname;
        let mobile =req.query.mobile;
        let email = req.query.email;
        let name = req.query.name


        let searchBy = {
            $and:[
                 //{status:true} 
                {}
            ]
        }
                
        if(fname){            
            searchBy.$and.push({fname: {$regex: fname, $options: 'i'}}) 
        }
        if(lname){
            searchBy.$and.push({lname: {$regex: lname, $options: 'i'}}) 
        }
        if(mobile){           
            searchBy.$and.push({mobile: {$regex: mobile, $options: 'i'}}) 
        }
        if(email){            
            searchBy.$and.push({email: {$regex: email, $options: 'i'}})            
        }
        if(name){            
            searchBy.$and.push({name: {$regex: name, $options: 'i'}})            
        }


		const result = await User.find(searchBy);

		
		if (result) {
			message = {
				error: false,
				message: "User search successfully!",
				data:result
			};
			
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "User search failed",
			};
			
			res.status(200).send(message);
		}
	} catch (err) {
		
		message = {
			error: true,
			message: "Operation Failed!",
			data: err.toString(),
		};
		res.status(200).send(message);
	}
});

///////////////////////// user detail for admin ////////////////////////

 UserRoute.get("/detail-user/:userId", async (req, res) => {
    try {
        let UserData = await User.findOne({_id:req.params.userId}).sort({_id:-1});

        let KycData = await Kyc.findOne({user:req.params.userId});

        let BankData = await BankAccount.findOne({user:req.params.userId});

        let BrokerData = await BrokerProfile.findOne({user:req.params.userId}).populate([
            {
                path:"broker",
                select:"name"
            }
        ])




        message = {
            error: false,
            message: "User list",
            data: UserData,
            KycData,
            BankData,
            BrokerData
        
        };
        res.status(200).send(message);
    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err,
        };
        res.status(200).send(message);
    }
});

// user soft delete


UserRoute.patch("/status-update/:userId",isAuthenticate,async(req,res)=>{
    try{
       
        let result = await User.findOneAndUpdate({_id:req.params.userId},{status:req.body.status},{new: true});
        let kycData;
        if(result?.status == false){
            kycData = await Kyc.findOneAndUpdate({user:req.params.userId},{status:false},{new:true})
        }
        if(result){
            message = {
                error: false,
                message:"Seller status updated successfully",
                data: result,
                kycData
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Seller status not upadated"
            };
            return res.status(500).send(message);
        }
    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err
        }
        return res.status(500).send(message);
    }
});



module.exports = UserRoute;
