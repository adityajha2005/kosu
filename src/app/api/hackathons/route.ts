import axios from 'axios';
import { NextResponse } from 'next/server';

// Define interfaces for better type safety
interface Filter {
  type: string;
  name: string;
}

interface JobDetail {
  locations?: string[];
}

interface Organisation {
  name: string;
}

interface RawHackathonData {
  title: string;
  filters: Filter[];
  start_date: string;
  status: string;
  region: string;
  jobDetail: JobDetail;
  seo_url: string;
  registerCount: number;
  organisation: Organisation;
}

interface Hackathon {
  title: string;
  theme: string[];
  startDate: Date;
  stringDate: string;
  status: string;
  mode: string;
  location: string;
  link: string;
  participants: number;
  organiser: string;
  website: string;
}

// Create axios instance with common configs
const axiosInstance = axios.create({
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  timeout: 5000, // 5 second timeout
});

// Function to fetch hackathons from Unstop
async function fetchUnstopData(page = 1): Promise<Hackathon[]> {
  try {
    const response = await axiosInstance.get('https://unstop.com/api/public/opportunity/search-result', {
      params: {
        opportunity: 'hackathons',
        per_page: 100,
        oppstatus: 'open',
        quickApply: true,
        page: page,
      },
    });
    return formatHackathonData(response.data);
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error);
    return [];
  }
}

// Format function to structure hackathon data
function formatHackathonData(rawData: any): Hackathon[] {
  if (!rawData?.data?.data) return [];

  return rawData.data.data.map((data: RawHackathonData): Hackathon => {
    const { title, filters, start_date, status, region, jobDetail, seo_url, registerCount, organisation } = data;

    const themes = filters?.filter((filter) => filter.type !== 'eligible').map((filter) => filter.name) || [];
    const mode = region?.toLowerCase() === 'online' ? 'Online' : 'Offline';

    return {
      title: title || '',
      theme: themes,
      startDate: new Date(start_date),
      stringDate: new Date(start_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      status: status || '',
      mode,
      location: mode === 'Online' ? 'Online' : jobDetail?.locations?.[0] || 'Not specified',
      link: seo_url || '',
      participants: registerCount || 0,
      organiser: organisation?.name || '',
      website: 'Unstop',
    };
  });
}

// Parallel fetching of hackathons
async function Unstop(): Promise<Hackathon[]> {
  try {
    const firstPage = await fetchUnstopData(1);
    if (!firstPage.length) return [];

    const additionalPages = await Promise.all([
      fetchUnstopData(2),
      fetchUnstopData(3),
      fetchUnstopData(4),
    ]);

    return [...firstPage, ...additionalPages.flat()];
  } catch (error) {
    console.error('Error in parallel fetching:', error);
    return [];
  }
}

// Implement caching
let cachedHackathons: Hackathon[] | null = null;
let lastCacheTime: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Next.js API route handler for POST requests
export async function POST(request: Request) {
  try {
    // Check cache
    if (cachedHackathons && lastCacheTime && Date.now() - lastCacheTime < CACHE_DURATION) {
      return NextResponse.json({
        total: cachedHackathons.length,
        hackathons: cachedHackathons,
        source: 'cache',
      });
    }

    // Fetch new data
    const hackathons = await Unstop();

    // Update cache
    cachedHackathons = hackathons;
    lastCacheTime = Date.now();

    return NextResponse.json({
      total: hackathons.length,
      hackathons,
      source: 'fresh',
    });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    return NextResponse.json({
      error: 'Failed to fetch hackathons',
    }, { status: 500 });
  }
}


