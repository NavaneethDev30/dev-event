'use client';
import {FormEvent, useState} from "react";

const BookEvent=()=>{

const[email,setemail]=useState("");
const[submitted,setsubmitted]=useState(false);

const handleSubmit=(e:React.FormEvent)=>{
e.preventDefault();

setTimeout(()=>{
setsubmitted(true)
},1000)

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