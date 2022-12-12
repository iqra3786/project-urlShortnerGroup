const urlModel=require('../models/urlModel')
const mongoose=require("mongoose")
const shortId=require('shortid')
const validUrl=require("valid-url")




const createUrl=async function(req,res){
    let url=req.body
    const {longUrl}=url

    const baseUrl='http://localhost:3000/xyz'
    const generate=shortId.generate()
    const a=baseUrl+'/+generate'

    const shortUrl=await urlModel.create(a)




    // if(!url){
    //     return res.status(400).send({status:false,message:"fill the data"})
    // }

    // let checkUrl = await urlModel.findOne(url)
    // if(checkUrl){
    //     return res.status(400).send({status:false,message:"URL already exist"})
    // }
//    let createUrl= await urlModel.create(url)
//     return res.status(201).send({status:true,message:"new URL is created",data:createUrl})
    
}


const getUrl=async function(req,res){
    const a=req.params.urlCode
    const b=await urlModel.findone({urlCode:urlCode})
    return res.status(302).redirect(b.longUrl)
}