// services/agentservices.ts
interface JobTemplate {
    title: string;
    company: string;
    location: string;
    requiredSkills: string[];
    criticalSkills: string[];
    importantSkills: string[];
  }
  
  export const jobTemplates: JobTemplate[] = [
    {
      title: 'Blockchain Developer',
      company: 'Aptos Labs',
      location: 'Remote',
      requiredSkills: ['Blockchain', 'Smart Contracts', 'Aptos', 'Move'],
      // Categorize skills to ensure critical skills are matched
      criticalSkills: ['Aptos', 'Move'],
      importantSkills: ['Blockchain', 'Smart Contracts']
    },
    {
      title: 'AI Integration Specialist',
      company: 'MOVE AI',
      location: 'San Francisco',
      requiredSkills: ['Machine Learning', 'AI', 'API Integration', 'Python'],
      criticalSkills: ['Machine Learning', 'AI'],
      importantSkills: ['Python', 'API Integration']
    },
    {
      title: 'Full Stack Developer',
      company: 'Decentralized Finance',
      location: 'New York',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'Blockchain'],
      criticalSkills: ['JavaScript'],
      importantSkills: ['React', 'Node.js', 'Blockchain']
    },
    {
      title: 'Web3 Product Manager',
      company: 'Decentralized Systems',
      location: 'Singapore',
      requiredSkills: ['Product Management', 'Web3', 'Blockchain', 'Leadership'],
      criticalSkills: ['Product Management', 'Web3'],
      importantSkills: ['Blockchain', 'Leadership']
    },
    {
      title: 'Frontend Developer',
      company: 'Web3 Startup',
      location: 'Berlin',
      requiredSkills: ['JavaScript', 'React', 'TypeScript', 'CSS'],
      criticalSkills: ['JavaScript', 'React'],
      importantSkills: ['TypeScript', 'CSS']
    }
  ];
  
  export async function getJobTemplateById(id: number): Promise<JobTemplate | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check if the index is valid
    if (id >= 0 && id < jobTemplates.length) {
      return jobTemplates[id];
    }
    return null;
  }
  
  export async function getAllJobTemplates(): Promise<JobTemplate[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return jobTemplates;
  }