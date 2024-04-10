require("dotenv").config();
const express = require("express");
const OfficeData = require("../models/office_data");
const OfficeDataRoute = express.Router();


//list

OfficeDataRoute.get("/list",async(req,res)=>{
    try{
        let officeDataList = await OfficeData.find({}).sort({_id:-1});
        message = {
			error: false,
			message: "All office data list",
			data: officeDataList,
		};
		return res.status(200).send(message);
    }catch(err){
        message = {
			error: true,
			message: "operation Failed!",
			data: err,
		};
		return res.status(200).send(message);
    }
});

//detail

OfficeDataRoute.get("/detail/:Id", async (req, res) => {
    try {
        let OfficeDataList = await OfficeData.findOne({_id:req.params.Id});

        message = {
            error: false,
            message: "Detail of Office Data",
            data: OfficeDataList,
        };
        res.status(200).send(message);
    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err.toString(),
        };
        res.status(200).send(message);
    }
});



//update

OfficeDataRoute.patch("/update/:id", async (req, res) => {
	try {
		const result = await OfficeData.findOneAndUpdate({ _id: req.params.id }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "Office Data updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Office Data not updated",
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



// //bulk-delete

OfficeDataRoute.delete("/bulk-delete",async(req,res)=>{
    try{
		const ids = req.body.ids;

		//console.log("ids",req.body['ids'])

        const data = [];

        for (let index = 0; index < ids.length; index++) {
            const checkOfficeData = await OfficeData.findOne({_id: ids[index]});
            data.push({
                _id: ids[index]
            })

			// console.log({data});
        };

		//console.log({data});

        let officeDataList = await OfficeData.deleteMany({_id:{$in: data}});
        message = {
			error: false,
			message: "Data deleted successfully",
			data: officeDataList,
		};
		return res.status(200).send(message);
    }catch(err){
        message = {
			error: true,
			message: "operation Failed!",
			data: err.toString(),
		};
		return res.status(200).send(message);
    }
});

//current list

// OfficeDataRoute.get("/current-list",async(req,res)=>{
//     try{
// 		let current_date = new Date();
// 		const day = current_date.getDate().toString().padStart(2, '0');
// 		const month = current_date.toLocaleString('default', { month: 'short' });
// 		const year = current_date.getFullYear();

// 		const formattedDate = `${day}/${month}/${year}`;

// 		console.log({formattedDate})
//         let officeCurrentData = await OfficeData.find({search_date:formattedDate}).sort({_id:-1});
// 		console.log("officeCurrentData",officeCurrentData.length)
//         if (officeCurrentData.length != 0 ) {
// 			message = {
// 				error: false,
// 				message: "Current Data",
// 				data:officeCurrentData
// 			};
// 			res.status(200).send(message);
// 		} else {
// 			message = {
// 				error: true,
// 				message: "No Data Found",
// 			};
// 			res.status(200).send(message);
// 		}
//     }catch(err){
//         message = {
// 			error: true,
// 			message: "operation Failed!",
// 			data: err.toString(),
// 		};
// 		return res.status(200).send(message);
//     }
// });


OfficeDataRoute.get("/current-list",async(req,res)=>{
    try{
		let currentDate = new Date();

		// Array of month names
		const monthNames = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];

		// Format the date as "DD-Mon-YY"
		let formattedDate = `${currentDate.getDate()}-${monthNames[currentDate.getMonth()]}-${currentDate.getFullYear().toString().substr(-2)}`;

		//console.log(formattedDate);

		console.log({formattedDate})
        let officeCurrentData = await OfficeData.find({search_date:formattedDate}).sort({_id:-1});
		console.log("officeCurrentData",officeCurrentData.length)
			message = {
				error: false,
				message: "Current Data",
				data:officeCurrentData
			};
			res.status(200).send(message);
    }catch(err){
        message = {
			error: true,
			message: "operation Failed!",
			data: err.toString(),
		};
		return res.status(200).send(message);
    }
});


//date filter

OfficeDataRoute.post("/date-filter-list",async(req,res)=>{
    try{
		let startDate = new Date(req.body.startDate);
		startDate.setHours(0);
		startDate.setMinutes(0);
		startDate.setSeconds(0);
		startDate.setMilliseconds(0);
		let endDate =  new Date(req.body.endDate);
		endDate = endDate.setDate(endDate.getDate()+1);
		console.log("startDate",startDate);
		console.log("endDate",endDate);
		
		let officeCurrentData;
		if(req.body.startDate && req.body.endDate){
			officeCurrentData = await OfficeData.find({doc_date:{ $gte: startDate, $lt: endDate }}).sort({_id:-1});
			console.log("officeCurrentData",officeCurrentData)
		}else{
			officeCurrentData = await OfficeData.find({}).sort({_id:-1});
			console.log("officeCurrentData",officeCurrentData)
		}
        message = {
			error: false,
			message: "All office data list",
			data: officeCurrentData,
		};
		return res.status(200).send(message);
    }catch(err){
        message = {
			error: true,
			message: "operation Failed!",
			data: err,
		};
		return res.status(200).send(message);
    }
});

//delete

OfficeDataRoute.delete("/delete/:Id", async (req, res) => {
    try {
        const result = await OfficeData.deleteOne({
            _id: req.params.Id
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Data deleted successfully!",
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






module.exports = OfficeDataRoute;