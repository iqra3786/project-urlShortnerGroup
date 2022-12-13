const urlModel = require('../models/urlModel')
const shortId = require('shortid')
const ValidUrl=require("valid-url")
const axios = require('axios')

//-------------------------------------------CreateUrl--------------------------------------------------------------------------------------//

const createUrl = async function(req,res){
    try{
        const {longUrl} = req.body

        // ---------------------------Check Body is empty or not----------------------------------/
        if(Object.keys(req.body).length==0)return res.status(400).send({status:false, message:"Please provide data in request body"})
        
        //---------------------------Check Url is valid or not----------------------------------/
        if(!(ValidUrl.isUri(longUrl)))return res.status(400).send({status:false, message:"Invalid longUrl"})

        //---------------------------Check Url exist or not----------------------------------/
        let checkUrlExistence = await axios.get(longUrl)
        .then(()=>longUrl)
        .catch(()=>null)
        if(!checkUrlExistence)return res.status(404).send({status:false, message:"Url does not exist"})
        
        //---------------------------Check Url is present in DB or not----------------------------------/
        let longUrlFound = await urlModel.findOne({longUrl:longUrl}).select({urlCode:1,longUrl:1,shortUrl:1, _id:0})
        if(longUrlFound)return res.status(200).send({status:true, data:longUrlFound})

        //---------------------------Generate random short alpha-num characters----------------------------------/
        const genShortUrl = shortId.generate().toLowerCase()

        //-------------------------Assigning data to req body------------------------------------/
        req.body.urlCode = genShortUrl
        req.body.shortUrl = `http://localhost:3000/${genShortUrl}`

        //---------------------------Creating data----------------------------------/
        let createData = await urlModel.create(req.body)
        
        //---------------------------Creating a custom object to match response----------------------------------/
        let obj = {
            urlCode : createData.urlCode,
            longUrl : createData.longUrl,
            shortUrl : createData.shortUrl
        }
        return res.status(201).send({status:true, data:obj})
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}

//---------------------------------------------getUrl-------------------------------------------------------------------------------------------//

const getUrl = async function(req, res){
    let urlCode = req.params.urlCode

    //---------------------------Check urlCode is present in DB or not----------------------------------/
    let foundUrl = await urlModel.findOne({urlCode:urlCode})

    if(!foundUrl)return res.status(404).send({status:false, message:"short url does not exit"})

    return res.status(302).redirect(foundUrl.longUrl)
}

module.exports.createUrl = createUrl
module.exports.getUrl = getUrl