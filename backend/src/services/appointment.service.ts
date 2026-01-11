import { Appointment, IAppointment } from '../models/Appointment.js';

export interface CreateAppointmentInput {
  sessionId: string;
  ownerName: string;
  petName: string;
  phone: string;
  preferredDateTime: Date | string;
  reason?: string;
}

export interface UpdateAppointmentInput {
  ownerName?: string;
  petName?: string;
  phone?: string;
  preferredDateTime?: Date | string;
  reason?: string;
  status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
}

class AppointmentService {
  async createAppointment(input: CreateAppointmentInput): Promise<IAppointment> {
    const appointment = new Appointment({
      sessionId: input.sessionId,
      ownerName: input.ownerName,
      petName: input.petName,
      phone: input.phone,
      preferredDateTime: new Date(input.preferredDateTime),
      reason: input.reason,
      status: 'pending',
    });

    await appointment.save();
    return appointment;
  }

  async getAppointmentById(id: string): Promise<IAppointment | null> {
    return Appointment.findById(id);
  }

  async getAppointmentsBySession(sessionId: string): Promise<IAppointment[]> {
    return Appointment.find({ sessionId }).sort({ createdAt: -1 });
  }

  async getAppointmentsByPhone(phone: string): Promise<IAppointment[]> {
    return Appointment.find({ phone }).sort({ preferredDateTime: -1 });
  }

  async getAllAppointments(
    options: {
      status?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ appointments: IAppointment[]; total: number }> {
    const query: Record<string, unknown> = {};

    if (options.status) {
      query.status = options.status;
    }

    if (options.startDate || options.endDate) {
      query.preferredDateTime = {};
      if (options.startDate) {
        (query.preferredDateTime as Record<string, Date>).$gte = options.startDate;
      }
      if (options.endDate) {
        (query.preferredDateTime as Record<string, Date>).$lte = options.endDate;
      }
    }

    const total = await Appointment.countDocuments(query);
    const appointments = await Appointment.find(query)
      .sort({ preferredDateTime: 1 })
      .skip(options.offset || 0)
      .limit(options.limit || 50);

    return { appointments, total };
  }

  async updateAppointment(
    id: string,
    input: UpdateAppointmentInput
  ): Promise<IAppointment | null> {
    const updateData: Record<string, unknown> = {};

    if (input.ownerName) updateData.ownerName = input.ownerName;
    if (input.petName) updateData.petName = input.petName;
    if (input.phone) updateData.phone = input.phone;
    if (input.preferredDateTime) updateData.preferredDateTime = new Date(input.preferredDateTime);
    if (input.reason !== undefined) updateData.reason = input.reason;
    if (input.status) updateData.status = input.status;
    if (input.notes !== undefined) updateData.notes = input.notes;

    return Appointment.findByIdAndUpdate(id, updateData, { new: true });
  }

  async cancelAppointment(id: string): Promise<IAppointment | null> {
    return Appointment.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );
  }

  async deleteAppointment(id: string): Promise<boolean> {
    const result = await Appointment.findByIdAndDelete(id);
    return result !== null;
  }

  async getUpcomingAppointments(limit = 10): Promise<IAppointment[]> {
    return Appointment.find({
      preferredDateTime: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] },
    })
      .sort({ preferredDateTime: 1 })
      .limit(limit);
  }
}

export const appointmentService = new AppointmentService();
