import mongoose, { HydratedDocument, Model, Schema, Types } from "mongoose";

import Event from "./event.model";

export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

type BookingDocument = HydratedDocument<IBooking>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (email: string) => EMAIL_PATTERN.test(email),
        message: "Booking email must be valid.",
      },
    },
  },
  { timestamps: true }
);

bookingSchema.index({ eventId: 1 });

bookingSchema.pre("save", async function validateBooking(this: BookingDocument) {
  if (!EMAIL_PATTERN.test(this.email)) {
    throw new Error("Booking email must be valid.");
  }

  // Confirm the referenced event exists before accepting the booking.
  const eventExists = await Event.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error("Booking eventId must reference an existing event.");
  }
});

const Booking: Model<IBooking> =
  mongoose.models.Booking ?? mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
