'use server'
import Booking from "@/database/booking.model";
import { connectToDatabase } from "../mongodb";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const createBooking = async ({ eventId, slug, email }: { eventId: string; slug: string; email: string; }) => {
    try {
        await connectToDatabase();
        const booking = await Booking.create({ eventId, slug, email });

        // Send confirmation email
        try {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Event Booking Confirmed!',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h1 style="color: #333;">You're In! 🎉</h1>
                        <p style="font-size: 16px; color: #555;">
                            Thank you for booking your spot for <strong>${slug}</strong>.
                        </p>
                        <p style="font-size: 16px; color: #555;">
                            We can't wait to see you there. If you have any questions, feel free to reply to this email.
                        </p>
                        <br/>
                        <p style="font-size: 14px; color: #999;">
                            - The EventBook Team
                        </p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Failed to send confirmation email', emailError);
            // We don't return an error here because the booking was still successfully saved to the database!
        }

        return { success: true, booking: JSON.parse(JSON.stringify(booking)) }
    } catch (error) {
        console.error('create booking failed',error);
        return{success:false,error:error}
    }
}