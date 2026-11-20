export interface SiteConfig {
  brandTitle: string;
  heroSubtitle: string;
  heroDesc: string;
  displayPhone: string;
  waPhone: string;
  adminPassword: string;
  fontFamily: string;
  logoImg: string;
  serenaImg: string;
  alzaImg: string;
}

export interface TourSpot {
  id: string;
  tag: string;
  name: string;
  desc: string;
  img: string;
  selected: boolean;
}

export interface TourPackage {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  priceText: string;
  priceLabel: string;
  durationText: string;
  bannerImg: string;
  spots: TourSpot[];
}

export type TourDataMap = Record<string, TourPackage>;

export interface BookingState {
  currentStep: 1 | 2 | 3 | 4;
  destination: string;
  carModel: string;
  adults: number;
  children: number;
  date: string;
  pickupLocation: string;
  customSpots: string;
  customerName: string;
  tripVibe: string;
  addPhotography: boolean;
  airportDirection: string;
  airportTerminal: string;
  airportLuggage: string;
  airportDestAddress: string;
  airportExtraNote: string;
}
