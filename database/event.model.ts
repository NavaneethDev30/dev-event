import mongoose, { HydratedDocument, Model, Schema } from "mongoose";

export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

type EventDocument = HydratedDocument<IEvent>;

const REQUIRED_STRING_FIELDS: Array<keyof Pick<
  IEvent,
  | "title"
  | "description"
  | "overview"
  | "image"
  | "venue"
  | "location"
  | "date"
  | "time"
  | "mode"
  | "audience"
  | "organizer"
>> = [
  "title",
  "description",
  "overview",
  "image",
  "venue",
  "location",
  "date",
  "time",
  "mode",
  "audience",
  "organizer",
];

function createSlug(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDate(value: string): string {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Event date must be a valid date.");
  }

  // Store dates as ISO strings so reads are consistent across environments.
  return parsedDate.toISOString();
}

function normalizeTime(value: string): string {
  const trimmed = value.trim().toUpperCase();
  const timeMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/);

  if (!timeMatch) {
    throw new Error("Event time must use HH:mm or h:mm AM/PM format.");
  }

  const [, hourValue, minuteValue, meridiem] = timeMatch;
  let hour = Number(hourValue);
  const minute = Number(minuteValue);

  if (minute > 59 || hour > 23 || (meridiem && (hour < 1 || hour > 12))) {
    throw new Error("Event time must be a valid time.");
  }

  if (meridiem === "PM" && hour < 12) {
    hour += 12;
  }

  if (meridiem === "AM" && hour === 12) {
    hour = 0;
  }

  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
}

function validateRequiredFields(event: EventDocument): void {
  for (const field of REQUIRED_STRING_FIELDS) {
    if (!event[field]?.trim()) {
      throw new Error(`Event ${field} is required.`);
    }
  }

  if (!event.agenda.length || event.agenda.some((item) => !item.trim())) {
    throw new Error("Event agenda must include non-empty items.");
  }

  if (!event.tags.length || event.tags.some((tag) => !tag.trim())) {
    throw new Error("Event tags must include non-empty items.");
  }
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (items: string[]) =>
          items.length > 0 && items.every((item) => item.trim().length > 0),
        message: "Agenda must include at least one non-empty item.",
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (tags: string[]) =>
          tags.length > 0 && tags.every((tag) => tag.trim().length > 0),
        message: "Tags must include at least one non-empty item.",
      },
    },
  },
  { timestamps: true }
);


eventSchema.pre("save", function validateAndNormalizeEvent(this: EventDocument) {
  validateRequiredFields(this);

  // Regenerate the URL slug only when the title changes.
  if (this.isModified("title")) {
    this.slug = createSlug(this.title);
  }

  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
  this.agenda = this.agenda.map((item) => item.trim());
  this.tags = this.tags.map((tag) => tag.trim());
});

const Event: Model<IEvent> =
  mongoose.models.Event ?? mongoose.model<IEvent>("Event", eventSchema);

export default Event;
