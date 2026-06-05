export interface ShowcaseStep {
  id: number;
  timeStop: number; // in seconds
  title: string;
  subtitle: string;
  description: string;
}

export interface Specification {
  label: string;
  value: string;
  icon: string;
}

export interface BookingForm {
  name: string;
  email: string;
  phone: string;
  serviceType: 'e-hailing' | 'daily';
  startDate: string;
  endDate: string;
  acceptedTerms: boolean;
}
