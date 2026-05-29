import { Eventcard } from "@/components/Eventcard"
import ExploreBtn from "@/components/ExploreBtn"
import { IEvent } from "@/database";
import { events } from "@/lib/constants"
import { cacheLife } from "next/cache";


const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL;


const page = async() => {
  // 'use cache';
  // cacheLife('hours')
  const response=await fetch(`${BASE_URL}/api/events`);
  const {events}=await response.json();
  return (
    <section>
        <h1 className="text-center">The Hub for every Dev <br />Event You can&apos;t miss</h1>
        <p className="text-center mt-5">Hackathons,conferences and Meetups. All in one</p>
        <ExploreBtn />
        <ul className="events">
          {events && events.length > 0 && events.map((event:IEvent)=>(
            <li className="list-none"  key={event.title}>
            <Eventcard {...event}/>
            </li>
          ))}
        </ul>
    </section>
    
  )
}

export default page
