const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;
const options = {useNewUrlParser: true, useUnifiedTopology: true,};

//function gets all the data from the form
const getData = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options)
    const newClient = req.body.inputData

//if category already exist update it , if not create it 

try {
    await client.connect();
    const db = client.db("database")
    const findCategory = await db.collection("savinginfo").findOne({category: newClient.category} )


//first value is the filter, the set changes the value
//ANOTHER collection to store previous data ("history")
if(findCategory) {


    await db.collection("savinginfo").updateOne({category: newClient.category}, {"$set": {"amount":parseInt(newClient.amount)  + parseInt(findCategory.amount) }})
    

    await db.collection("history").insertOne({category:newClient.category, amount: parseInt(newClient.amount) , notes:newClient.notes, date: new Date(), email:req.body.email}) //setting amount and cat
    
    return res.status(200).json({status:200, message:"this category has already been choosen"})

} else {

}

    const info = await db.collection("savinginfo").insertOne(newClient)

    res.status(200).json({status: 200, data: newClient , message:"sucess!"})

} catch(err) {

    res.status(400).json({status :400 , data:{} , message:"There has been an error"})
}

client.close()
    
}
//function finds each category
const getCategories = async (req, res) => {
    const client = new MongoClient(MONGO_URI,options)

    try{
        await client.connect()
        const db = client.db("database")
        const category = await db.collection("savinginfo").find().toArray();
        // console.log(category, "these are the categories")
        //if the category has already been selected..add to the category? if not create the category?
        if(category.length > 0){

            res.status(200).json({status:200, data:category})   

        } else {

            res.status(200).json({status:200, data:{}})
        }

    } catch(err) {

        res.status(404).json({status:404, message :"Sorry there has been an error!"})

    }
    client.close()
}

//function update category if it has already been picked previously + reset all data to initial value once reset button is clicked on
const updateCategories = async (req, res) => {
    const client = new MongoClient(MONGO_URI,options)

    try{
        await client.connect()
        const db = client.db("database")
        const category = await db.collection("savinginfo").updateOne({"category":"travels"}, {"$set": {"amount":0 }});
        await db.collection("savinginfo").updateOne({"category":"tuition"}, {"$set": {"amount":0 }});
        await db.collection("savinginfo").updateOne({"category":"transportation"}, {"$set": {"amount":0 }});
        await db.collection("savinginfo").updateOne({"category":"EmergencyFund"}, {"$set": {"amount":0 }});
        await db.collection("savinginfo").updateOne({"category":"Home"}, {"$set": {"amount":0 }});
        await db.collection("history").deleteMany({})
        // await db.collection("savinginfo").deleteMany({})
        // console.log(category, "these are the categories")
        //if the category has already been selected..add to the category? if not create the category?
        res.status(200).json({status:200, data:category})   
        
    } catch(err) {

        res.status(404).json({status:404, message :"Sorry there has been an error!"})

    }
    
    client.close()
}


//getting previous saving info
const getpreviousSavingData = async (req, res) =>{
    const client = new MongoClient(MONGO_URI, options)
    
    try {
        await client.connect()
        const db = client.db("database")
        const getPreviousData = await db.collection("history").find({email:req.body.email}).toArray()
        
        res.status(200).json({satus:200 , data:getPreviousData, message:"success"})



    } catch {

        res.status(404).json({status:404, message :"Sorry there has been an error!"})

    }

    client.close()
}


module.exports = {
    getData,
    getCategories,
    updateCategories,
    getpreviousSavingData,
}