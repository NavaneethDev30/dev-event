'use client';
import { createBooking } from "@/lib/actions/booking.actions";
import posthog from "posthog-js";
import {FormEvent, useState} from "react";

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string; }) => {

const[email,setemail]=useState("");
const[submitted,setsubmitted]=useState(false);

const handleSubmit=async(e:React.FormEvent)=>{
    e.preventDefault(); // This MUST be the first thing to prevent the page from reloading
    const{success,error}=await createBooking({eventId,slug,email});
    if(success){
        setsubmitted(true);
        posthog.capture("event_booked",{
            event_id:eventId,
            event_slug:slug,
            email:email,
        })
    }
    else{
        console.log("booking failed",error)
        posthog.capture("event_book_failed",{
            event_id:eventId,
            event_slug:slug,
            email:email,
            error:error
        })
    }
}
    return(
       <div id="book-event">
        {submitted ?(
            <p className="text-sm">Thank you for Signing up</p>
        ):(
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="">Email address</label>
                    <input type="email" value={email} onChange={(e)=>{setemail(e.target.value)}}
                    id="email" placeholder="enter your email address"
                    />

                </div>
                <button type="submit" className="button-submit">Submit</button>
            </form>
        )}

       </div>
    )
}
export default BookEvent