const express = require("express");
const {getData, getCategories, updateCategories, getpreviousSavingData} = require("./handlers")
// const URL = "https://data.alpaca.markets/v1beta1/news?start=2021-12-28T00:00:00Z&end=2021-12-31T11:59:59Z&symbols=AAPL,TSLA"
express()
.use(express.json())        //handles json 
.use(express.urlencoded({ extended: false }))   //handles form  submission
//test endpoint
.get("/hello", (req , res) => {
    res.status(200).send({status :200 , message: "SUCESS!"})
})


//posting data from the form : if a cat already exist then keep it, if not create it
.post("/", getData)
//get all categories, populate it on fe, .find based on category, map through cat and amount : will return []

.get("/categories", getCategories)

//resetting categories
.patch("/categories", updateCategories)

//GET previous entered data
.post("/savings/list" ,getpreviousSavingData )


//get req for alpaca news obj
// .get(`${URL}`, (req, res) => {
//     res.status(200).json({status:200, message:"data acquired"})
// })



//catch all
.get("*", (req, res) => {
    res.status(404).json({status:404, message:"Sorry there has been an error"})
})

.listen(8000)