const express = require("express");
const {getData, getCategories, updateCategories, getpreviousSavingData} = require("./handlers")

express()
.use(express.json())        //handles json 
.use(express.urlencoded({ extended: false }))   //handles form  submission

//posting data from the form : if a category already exist then keep it, if not create it
.post("/", getData)

//get all categories, populate it on FE, find based on category, map through cat and amount : will return []
.get("/categories", getCategories)

//resetting and updating categories
.patch("/categories", updateCategories)

//GET previous entered data
.post("/savings/list" ,getpreviousSavingData )

//catch all errors
.get("*", (req, res) => {
    res.status(404).json({status:404, message:"Sorry there has been an error"})
})

.listen(8000)