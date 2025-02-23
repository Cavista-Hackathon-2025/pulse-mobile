import { ImageSourcePropType } from "react-native";
interface MongoDBDocument {
    _id?: string;
}

interface MongoDBDocumentWithTimestamps extends MongoDBDocument {
    createdAt?: string;
    updatedAt?: string;
}

export interface IAccount extends MongoDBDocumentWithTimestamps {
    firstName?: string;
    lastName?: string;
    email: string;
    hospitalName?: string;
    role: UserRole;
}

export interface HealthRecord {
    date: string;
    hospital: IHospital;
    medicalReport: string;
    treatedFor: string[];
}

export interface IPatient {
    pastHealthSummary?: string;
    knownAilments?: string;
    healthRecord?: HealthRecord[];
    location?: {
        type: {
            formattedAddress: { type: String; required: true };
            coordinates: {
                type: {
                    lat: { type: Number; required: true };
                    lng: { type: Number; required: true };
                };
                required: true;
            };
            placeId: {
                type: String;
                required: true;
            };
        };
        required: true;
    };
}

export interface IHospital {
    availability: {
        beds: number;
        doctors: number;
    };
    location: {
        type: {
            formattedAddress: { type: String; required: true };
            coordinates: {
                type: {
                    lat: { type: Number; required: true };
                    lng: { type: Number; required: true };
                };
                required: true;
            };
            placeId: {
                type: String;
                required: true;
            };
        };
        required: true;
    };
    appointments: string[];
    emergencies: string[];
    queue: string[];
    specialties: string;
    averageResponseTimeInMins: number;
    averageConsultancyPrice: number;
}

export enum MedTransportType {
    PRIVATE_AMBULANCE = "private_ambulance",
    HOSPITAL_AMBULANCE = "hospital_ambulance",
    PRIVATE_VEHICLE = "private_vehicle",
}

export interface IMedTransport {
    emergencies: string[];
    hospital?: IHospital;
    location: {
        type: {
            formattedAddress: { type: String; required: true };
            coordinates: {
                type: {
                    lat: { type: Number; required: true };
                    lng: { type: Number; required: true };
                };
                required: true;
            };
            placeId: {
                type: String;
                required: true;
            };
        };
        required: true;
    };
    type?: MedTransportType;
}

export interface IPatientAdditionalFields {}

export interface IHospitalAdditionalFields {}

export interface IMedTransportAdditionalFields {}

export enum UserRole {
    HOSPITAL = "hospital",
    MED_TRANSPORT = "med_transport",
    PATIENT = "patient",
}

export interface IAdditionalFields {
    [UserRole.MED_TRANSPORT]: IMedTransportAdditionalFields;
    [UserRole.HOSPITAL]: IHospitalAdditionalFields;
    [UserRole.PATIENT]: IPatientAdditionalFields;
}

export type IUserFields = Partial<
    IAccount &
        IMedTransportAdditionalFields &
        IHospitalAdditionalFields &
        IPatientAdditionalFields &
        MongoDBDocument
>;

export type User = {
    baseProfile: IUserFields;
    profileByRole: IUserFields;
    token: string;
};

export enum Position {
    BOTTOM = "bottom",
    LEFT = "left",
    RIGHT = "right",
    TOP = "top",
}

export type UserType = {
    id: number;
    name: UserRole;
    description: string;
    image: ImageSourcePropType;
    verbose: string;
};
