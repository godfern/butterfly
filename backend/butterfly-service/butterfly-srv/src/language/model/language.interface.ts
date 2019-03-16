import { Document } from 'mongoose';

export interface Language extends Document {
    _id: string;
    locale: string;
    name: string;
    country: string;
    region: string;
    countryCode: string;
    actorId: any;
}