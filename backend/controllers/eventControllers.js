import express from "express";
import uploadOnCloudinary from "../config/cloudinary.js";
import Event from "../models/eventModel.js";
import mongoose from "mongoose";

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

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate Mongo ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event id",
      });
    }

    // 2️⃣ Find event
    const event = await Event.findById(id);

    // 3️⃣ Event not found
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // 4️⃣ Success
    res.status(200).json({
      success: true,
      event,
    });

  } catch (error) {
    console.error("Get event by id error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching event",
    });
  }
};