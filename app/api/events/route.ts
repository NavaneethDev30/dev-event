
import { connectToDatabase } from "@/lib/mongodb"
import { NextRequest, NextResponse } from "next/server"
import Event from "@/database/event.model"
import { v2 as cloudinary } from "cloudinary"

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    console.log("RECEIVED CONTENT TYPE:", request.headers.get("content-type"));
    const formData = await request.formData();
    console.log("FORM DATA KEYS:", Array.from(formData.keys()));
    
    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      console.error(e);
      return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }

    const file = formData.get('image') as File | null;
    if (!file || typeof file === 'string' || file.size === 0) {
      return NextResponse.json({ 
        message: "Image is required or was not formatted correctly", 
        receivedKeys: Array.from(formData.keys()),
        typeofFile: typeof file,
        isString: typeof file === 'string'
      }, { status: 400 });
    }

    let tags=JSON.parse(formData.get('tags') as string);
    let agenda=JSON.parse(formData.get('agenda') as string)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult = await new Promise((resolve, reject)=> {
        (cloudinary.uploader.upload_stream({
          resource_type:'image',
          folder:'devevent-book/events', 
        },
        (error: any, result: any) => {
          if(error) reject(error);
          else resolve(result);
        }) as any).end(buffer);
    });

    event.image=(uploadResult as {secure_url:string}).secure_url;
    const createdEvent = await Event.create({
      ...event,
      tags:tags,
      agenda:agenda,
    });
    return NextResponse.json({ message: 'event created successfully', event: createdEvent }, { status: 201 })
  } catch (e) {
    console.error(e)

    return NextResponse.json(
      {
        message: "event creation failed",
        error: e instanceof Error ? e.message : "unknown",
      },
      { status: 500 }
    )
  }
}


export async function GET(request:NextRequest){

  try {
     await connectToDatabase();
     const events=await Event.find().sort({createdAt:-1})
     return NextResponse.json({message:"events fetched successfully",events},{status:200})   
  } catch (e) {
    return NextResponse.json({message:"event fetching failed",error:e},{status:500})
  }
}