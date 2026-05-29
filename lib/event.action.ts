'use server';
import { connectToDatabase } from "./mongodb";
import Event from "@/database/event.model";
import { v2 as cloudinary } from 'cloudinary';

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

export const getEventBySlug = async (slug: string) => {
    try {
        await connectToDatabase();
        const event = await Event.findOne({ slug });
        if (!event) return null;
        return JSON.parse(JSON.stringify(event));
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getAllEvents = async () => {
    try {
        await connectToDatabase();
        const events = await Event.find().sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(events));
    } catch (error) {
        console.error(error);
        return [];
    }
}

export const createEvent = async (formData: FormData) => {
    try {
        await connectToDatabase();
        
        const file = formData.get('image') as File;
        if (!file || file.size === 0) {
            throw new Error("No image file provided.");
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const uploadResult: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: 'devevent-book/events' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        const eventData = {
            title: formData.get('title'),
            description: formData.get('description'),
            overview: formData.get('overview'),
            image: uploadResult.secure_url,
            venue: formData.get('venue'),
            location: formData.get('location'),
            date: formData.get('date'),
            time: formData.get('time'),
            mode: formData.get('mode'),
            audience: formData.get('audience'),
            organizer: formData.get('organizer'),
            agenda: (formData.get('agenda') as string)?.split(',').map((item) => item.trim()).filter(Boolean) || [],
            tags: (formData.get('tags') as string)?.split(',').map((tag) => tag.trim()).filter(Boolean) || [],
        };

        const newEvent = await Event.create(eventData);
        return { success: true, slug: newEvent.slug };
    } catch (error) {
        console.error('Failed to create event:', error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error occurred" };
    }
}