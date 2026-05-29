'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createEvent } from '@/lib/event.action';

export default function CreateEventPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const res = await createEvent(formData);

        if (res.success && res.slug) {
            router.push(`/events/${res.slug}`);
        } else {
            setError(res.error || 'Failed to create event. Please check the fields and try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <section id="event" className="pt-20">
            <div className="flex w-full flex-col gap-4">
                <h1 className="text-3xl font-bold">Create New Event</h1>
                <p className="text-gray-500">Fill in the details below to publish a new event.</p>
                
                {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 max-w-2xl">
                    <div className="flex flex-col gap-1">
                        <label className="font-semibold" htmlFor="title">Event Title</label>
                        <input required type="text" id="title" name="title" placeholder="e.g. Next.js Conf 2028"  className="p-2 border rounded " />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold" htmlFor="description">Short Description</label>
                        <textarea required id="description" name="description" placeholder="A brief summary of the event" className="p-2 border rounded" rows={2} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold" htmlFor="overview">Full Overview</label>
                        <textarea required id="overview" name="overview" placeholder="Detailed information about what to expect" className="p-2 border rounded" rows={5} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold" htmlFor="image">Event Image</label>
                        <input required type="file" accept="image/*" id="image" name="image" className="p-2 border rounded" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold" htmlFor="venue">Venue Name</label>
                            <input required type="text" id="venue" name="venue" placeholder="e.g. Moscone Center" className="p-2 border rounded" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold" htmlFor="location">Location (City, Country)</label>
                            <input required type="text" id="location" name="location" placeholder="e.g. San Francisco, CA" className="p-2 border rounded" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold" htmlFor="date">Date</label>
                            <input required type="date" id="date" name="date" className="p-2 border rounded" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold" htmlFor="time">Time</label>
                            <input required type="text" id="time" name="time" placeholder="e.g. 09:00 AM" className="p-2 border rounded" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold" htmlFor="mode">Mode</label>
                            <select required id="mode" name="mode" className="p-2 border rounded">
                                <option value="In-person">In-person</option>
                                <option value="Online">Online</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="font-semibold" htmlFor="audience">Audience Size</label>
                            <input required type="text" id="audience" name="audience" placeholder="e.g. 500+ attendees" className="p-2 border rounded" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold" htmlFor="organizer">Organizer</label>
                        <input required type="text" id="organizer" name="organizer" placeholder="e.g. Vercel" className="p-2 border rounded" />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold" htmlFor="agenda">Agenda (Comma-separated)</label>
                        <input required type="text" id="agenda" name="agenda" placeholder="e.g. Keynote, Breakout Session 1, Lunch" className="p-2 border rounded" />
                        <span className="text-xs text-gray-500">Separate items with commas</span>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="font-semibold" htmlFor="tags">Tags (Comma-separated)</label>
                        <input required type="text" id="tags" name="tags" placeholder="e.g. Next.js, React, Web" className="p-2 border rounded" />
                        <span className="text-xs text-gray-500">Separate tags with commas</span>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="mt-6 bg-[#6348E2] text-white py-3 px-6 rounded font-semibold hover:bg-[#5238cc] disabled:opacity-50 transition-colors"
                    >
                        {isSubmitting ? 'Creating Event...' : 'Publish Event'}
                    </button>
                </form>
            </div>
        </section>
    );
}
