import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import {getSimilarEventBySlug} from '@/lib/event.action'
import { IEvent } from "@/database";
import { Eventcard } from "@/components/Eventcard";


const Eventdetails=({icon,alt,label}:{icon:string,label:string,alt:string}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} style={{ width: "auto", height: "auto" }}></Image>
    <p>{label}</p>
  </div>
)

const EventAgenda=({agendaItems}:{agendaItems:string[]}) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
)

const EventTags=({tags}:{tags:string[]})=>(
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag)=>(
      <div className="pill" key={tag}>{tag}</div>
    ))}
  </div>
)


const EventDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const response = await fetch(`${BASE_URL}/api/events/${slug}`);
  const data = await response.json();
  const event = data?.event;

  if (!event || !event.description) {
    return notFound();
  }

  const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;

  const bookings=10;

  const similarEvents=await getSimilarEventBySlug(slug)

  return (
    <section id="event">
      <div>
        <h1>Event Details</h1>
        <p>{description}</p>
      </div>
      <div className="details">
      <div className="content">
      <Image src={image} alt="event banner" width={800} height={800} className="banner" priority style={{ width: "100%", height: "auto" }}></Image>

      <section className="flex-col-gap-2">
        <h2>Overview</h2>
        <p>{overview}</p>
      </section>

      <section className="flex-col-gap-2">
        <h2>Event details</h2>
        <Eventdetails icon="/icons/calendar.svg" alt="calendar" label={new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}/>
        <Eventdetails icon="/icons/clock.svg" alt="clock" label={time}/>
        <Eventdetails icon="/icons/pin.svg" alt="location" label={location}/>
        <Eventdetails icon="/icons/mode.svg" alt="mode" label={mode}/>
        <Eventdetails icon="/icons/audience.svg" alt="audience" label={audience}/>
         

      </section>
      <EventAgenda agendaItems={agenda}/>
      <section className="flex-col-gap-2">
        <h2>About the organizer</h2>
        <p>{organizer}</p>
      </section>
      <EventTags tags={tags}/>
      </div>



        <aside className="booking">
        <div className="signup-card">
          <h2>Book your spot</h2>
          {bookings>0 ?(
            <p className="text-sm">join {bookings} people who have already booked their spot</p>
          ):
          (
            <p className="text-sm">Be the first to book your spot!</p>
          )}
          <BookEvent eventId={event._id} slug={event.slug} />
        </div>

        </aside>
      </div>
          <div className="flex w-full flex-col gap-4 pt-20">
            <h2>Similar Events</h2>
            <div className="events">
              {similarEvents.length>0 && similarEvents.map((similarEvent:IEvent)=>(
                <Eventcard {...similarEvent} key={similarEvent.slug}/>
              ))}
            </div>
          </div>
    </section>
  )
}

export default EventDetailPage