import { Eventcard } from "@/components/Eventcard"
import ExploreBtn from "@/components/ExploreBtn"
import { events } from "@/lib/constants"

const page = () => {
  return (
    <section>
        <h1 className="text-center">The Hub for every Dev <br />Event You can&apos;t miss</h1>
        <p className="text-center mt-5">Hackathons,conferences and Meetups. All in one</p>
        <ExploreBtn/>
        <ul className="events">
          {events.map((event)=>(
            <li key={event.title}>
            <Eventcard {...event}/>
            </li>
          ))}
        </ul>
    </section>
    
  )
}

export default page
