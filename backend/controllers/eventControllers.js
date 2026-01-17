import express from "express";
import uploadOnCloudinary from "../config/cloudinary.js";
import Event from "../models/eventModel.js";

//To create a new event from admin page
export const Create= async (req, res)=>{
  try {
    const { name, date, prize, description, tags, venue, fees, teamSize, rules } = req.body;
    // console.log(1);
    // const uploadResult = await cloudinary.uploader.upload(req.file.path);
    let imgUrl="http://demo.com";
    // if (req.file && req.file.path) {
    //     const uploadResult = await uploadOnCloudinary(req.file.path);
    //     imgUrl = uploadResult.secure_url;
    // }
    // console.log(2);
    const event = await Event.create({
      name,
      date,
      prize,
      image: imgUrl,
      description,
      tags,
      venue,
      fees,
      teamSize,
      rules
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//To list all events
export const EventList= async(req,res)=>{
  try{
      const events = await Event.find().sort({ date: 1 });
      res.json(events);
  } catch(err){
    res.status(500).json({ message: "Failed to fetch event - backend"});
  }
  
}