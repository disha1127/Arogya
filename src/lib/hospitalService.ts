import Papa from 'papaparse';

// Define interface for the new Indian Hospitals dataset
export interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
  district: string;
  density: number;
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  // These fields are added for UI compatibility with previous implementation
  address?: string;
  phone?: string;
  email?: string;
  url?: string;
  country?: string;
  zip?: string;
  primary_category_name?: string;
  category_name?: string;
  star_count?: number;
  rating_count?: number;
}

// Interface for raw CSV data
interface RawHospitalData {
  id: string;
  City: string;
  State: string;
  District: string;
  Density: number;
  Latitude: number;
  Longitude: number;
  Rating: number;
  'Number of Reviews': number;
}

const csvFilePath = '/data/Hospitals In India (Anonymized).csv';

export async function fetchHospitals(): Promise<Hospital[]> {
  try {
    const response = await fetch(csvFilePath);
    const csvData = await response.text();
    
    const results = Papa.parse<RawHospitalData>(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });
    
    // Transform the data to match our Hospital interface
    return results.data
      .filter(hospital => 
        typeof hospital.Latitude === 'number' && 
        typeof hospital.Longitude === 'number' &&
        hospital.Latitude !== 0 && // Filter out invalid coordinates
        hospital.Longitude !== 0
      )
      .map(hospital => ({
        id: hospital.id,
        name: hospital.id, // Use the hospital ID as the name
        city: hospital.City,
        state: hospital.State,
        district: hospital.District,
        density: hospital.Density,
        lat: hospital.Latitude,
        lng: hospital.Longitude,
        rating: hospital.Rating,
        reviews: hospital['Number of Reviews'],
        // Map to fields expected by UI components
        address: `${hospital.City}, ${hospital.District}, ${hospital.State}`,
        star_count: hospital.Rating, 
        rating_count: hospital['Number of Reviews'],
        category_name: 'Hospital',
        country: 'India',
      }));
  } catch (error) {
    console.error('Error loading hospital data:', error);
    return [];
  }
}

export function getIndiaCenter(): [number, number] {
  // Approximate center coordinates for India
  return [20.5937, 78.9629];
}

export function getAndhraCenter(): [number, number] {
  // Approximate center coordinates for Andhra Pradesh
  return [15.9129, 79.7400];
}