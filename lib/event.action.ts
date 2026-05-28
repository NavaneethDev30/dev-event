'use server';
import { connectToDatabase } from "./mongodb";
import Event from "@/database/event.model";

export const getSimilarEventBySlug=async(slug:string)=>{
    try {
       await connectToDatabase()
       const event=await Event.findOne({slug});
       if (!event) return [];
       const similarEvents=await Event.find({_id:{$ne:event._id}, tags:{$in:event.tags}});
       return JSON.parse(JSON.stringify(similarEvents));

    } catch (e) {
        console.error(e)
        
    }
}