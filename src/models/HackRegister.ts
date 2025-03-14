import mongoose, { Schema, Document } from "mongoose";

export interface IHackathon extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  location: string;
  minTeamSize: number;
  maxTeamSize: number;
  organizerName: string;
  organizerEmail: string;
  contactNumber: string;
}

const HackathonSchema = new Schema<IHackathon>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  registrationDeadline: { type: Date, required: true },
  location: { type: String, required: true },
  minTeamSize: { type: Number, default: 1, min: 1 },
  maxTeamSize: { type: Number, default: 5, min: 1 },
  organizerName: { type: String, required: true },
  organizerEmail: { type: String, required: true },
  contactNumber: { type: String },
});

export default mongoose.models.Hackathon || mongoose.model<IHackathon>("Hackathon", HackathonSchema);


