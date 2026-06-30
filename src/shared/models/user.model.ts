import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId?: string;
  email: string;
  name: string;
  picture?: string;
  role: "citizen" | "volunteer" | "ngo" | "officer" | "manager" | "admin";
  department?: string;
  organization?: string;
  trustScore: number;
  xp: number;
  createdAt: string;
  updatedAt: string;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: { type: String, sparse: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    picture: { type: String },
    role: {
      type: String,
      enum: ["citizen", "volunteer", "ngo", "officer", "manager", "admin"],
      default: "citizen",
    },
    department: { type: String },
    organization: { type: String },
    trustScore: { type: Number, default: 75 },
    xp: { type: Number, default: 0 },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Derive role from email prefix for existing mock users
UserSchema.pre("save", function (next) {
  if (!this.role || this.role === "citizen") {
    const prefix = this.email.split("@")[0].toLowerCase();
    if (prefix.startsWith("officer")) this.role = "officer";
    else if (prefix.startsWith("manager")) this.role = "manager";
    else if (prefix.startsWith("admin")) this.role = "admin";
    else if (prefix.startsWith("volunteer")) this.role = "volunteer";
    else if (prefix.startsWith("ngo")) this.role = "ngo";
  }
  next();
});

export const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
