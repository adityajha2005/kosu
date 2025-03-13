import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  walletAddress: string;
  name: string;
  skills: string[];
  bio: string;
  interests: string[];
  experienceLevel: "Beginner" | "Intermediate" | "Expert";
  lookingForTeam: boolean;
}

const UserSchema = new Schema<IUser>({
  walletAddress: { type: String, required: true, unique: true },
  name: String,
  skills: [String],
  bio: String,
  interests: [String],
  experienceLevel: { type: String, enum: ["Beginner", "Intermediate", "Expert"] },
  lookingForTeam: { type: Boolean, default: false },
});

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
