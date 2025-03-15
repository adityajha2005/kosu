import { JobApplicationData } from '../components/JobApplicationModal';

// In a real application, this would connect to a backend API
// For now, we'll simulate the API call with a Promise
export const submitJobApplication = async (applicationData: JobApplicationData): Promise<{ success: boolean; message: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log('Application submitted:', applicationData);
  
  // Simulate successful submission
  return {
    success: true,
    message: 'Your application has been submitted successfully!'
  };
};

// This would be used to fetch application status in a real application
export const getApplicationStatus = async (applicationId: string): Promise<{ status: 'pending' | 'reviewed' | 'rejected' | 'accepted'; message?: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, return a random status
  const statuses: Array<'pending' | 'reviewed' | 'rejected' | 'accepted'> = ['pending', 'reviewed', 'rejected', 'accepted'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    status: randomStatus,
    message: randomStatus === 'accepted' 
      ? 'Congratulations! Your application has been accepted. The hiring team will contact you soon.'
      : randomStatus === 'rejected'
      ? 'Thank you for your interest. Unfortunately, we have decided to move forward with other candidates.'
      : randomStatus === 'reviewed'
      ? 'Your application has been reviewed and is being considered by the hiring team.'
      : 'Your application is currently being processed.'
  };
};

// This would be used to get all applications for a user in a real application
export const getUserApplications = async (): Promise<{ jobId: string; company: string; title: string; status: string; appliedAt: string }[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, return mock data
  return [
    {
      jobId: '1',
      company: 'Aptos Labs',
      title: 'Senior Blockchain Developer',
      status: 'pending',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
    },
    {
      jobId: '3',
      company: 'Decentralized Systems',
      title: 'Web3 Product Manager',
      status: 'reviewed',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    }
  ];
}; 