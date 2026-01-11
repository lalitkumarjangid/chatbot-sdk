import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  sessionId: string;
  ownerName: string;
  petName: string;
  phone: string;
  preferredDateTime: Date;
  reason?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    petName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    preferredDateTime: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
AppointmentSchema.index({ preferredDateTime: 1 });
AppointmentSchema.index({ status: 1, preferredDateTime: 1 });
AppointmentSchema.index({ phone: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
