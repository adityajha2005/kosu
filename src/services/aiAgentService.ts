import { AIAgent, AgentRunResult, JobMatch } from '../types/aiAgent';

// Real Hugging Face API endpoints for production use
const getHuggingFaceEndpoints = () => {
  return {
    // Zero-shot classification model for job matching
    TALENT_SCOUT: `https://api-inference.huggingface.co/models/${process.env.NEXT_PUBLIC_HF_TALENT_SCOUT_MODEL || 'facebook/bart-large-mnli'}`,
    
    // Question answering model for skill verification
    SKILL_VERIFIER: `https://api-inference.huggingface.co/models/${process.env.NEXT_PUBLIC_HF_SKILL_VERIFIER_MODEL || 'deepset/roberta-base-squad2'}`,
    
    // Text generation model for interview preparation
    INTERVIEW_PREP: `https://api-inference.huggingface.co/models/${process.env.NEXT_PUBLIC_HF_INTERVIEW_PREP_MODEL || 'gpt2'}`,
    
    // Sentiment analysis model for resume analysis
    RESUME_ANALYZER: `https://api-inference.huggingface.co/models/${process.env.NEXT_PUBLIC_HF_RESUME_ANALYZER_MODEL || 'distilbert-base-uncased-finetuned-sst-2-english'}`,
    
    // General purpose text embedding model
    CUSTOM_AGENT: 'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2'
  };
};

// Get the endpoints with environment variable configuration
const HF_ENDPOINTS = getHuggingFaceEndpoints();

// Get API key from environment variables
// For production, this should be set in your deployment environment
// For local development, use a .env.local file (not committed to git)
const getHuggingFaceApiKey = (): string => {
  // In Next.js, environment variables prefixed with NEXT_PUBLIC_ are exposed to the browser
  const apiKey = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
  
  if (!apiKey) {
    console.warn('Hugging Face API key not found in environment variables. Using fallback method.');
    // Fallback for development only - NEVER use hardcoded API keys in production
    return 'YOUR_API_KEY_HERE'; // Replace with your actual API key for development
  }
  
  // Check if the API key is the placeholder value
  if (apiKey === 'YOUR_API_KEY_HERE') {
    console.error('Please replace the placeholder API key with your actual Hugging Face API key in .env.local');
  }
  
  // Validate that the API key has the expected format (starts with "hf_")
  if (!apiKey.startsWith('hf_')) {
    console.warn('The Hugging Face API key does not have the expected format. It should start with "hf_".');
  }
  
  return apiKey;
};

// Define model types
export enum ModelType {
  TALENT_SCOUT = 'talent_scout',
  RESUME_ANALYZER = 'resume_analyzer',
  SKILL_VERIFIER = 'skill_verifier',
  INTERVIEW_PREP = 'interview_prep'
}

// Define the AI agent interface
export interface Agent {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  status: 'active' | 'inactive' | 'learning' | 'maintenance';
  type: ModelType;
  lastActive: Date | string;
}

// Initial AI agents
export const initialAgents: AIAgent[] = [
  {
    id: '1',
    name: 'TalentScout',
    role: 'Recruitment Assistant',
    status: 'active',
    description: 'Analyzes job requirements and candidate profiles to find optimal matches using BART-large-mnli model.',
    completionPercentage: 100,
    lastActive: 'Just now',
    model: 'facebook/bart-large-mnli',
    endpoint: HF_ENDPOINTS.TALENT_SCOUT,
    capabilities: ['Job matching', 'Skill analysis', 'Culture fit assessment'],
    type: ModelType.TALENT_SCOUT
  },
  {
    id: '2',
    name: 'SkillVerifier',
    role: 'Credential Validator',
    status: 'active',
    description: 'Verifies skills and credentials using on-chain data and RoBERTa model for document analysis.',
    completionPercentage: 100,
    lastActive: '2 hours ago',
    model: 'deepset/roberta-base-squad2',
    endpoint: HF_ENDPOINTS.SKILL_VERIFIER,
    capabilities: ['Document verification', 'Credential validation', 'Blockchain integration'],
    type: ModelType.SKILL_VERIFIER
  },
  {
    id: '3',
    name: 'InterviewPrep',
    role: 'Interview Coach',
    status: 'learning',
    description: 'Helps candidates prepare for interviews based on job requirements using GPT-2 for response generation.',
    completionPercentage: 45,
    lastActive: '1 day ago',
    model: 'gpt2',
    endpoint: HF_ENDPOINTS.INTERVIEW_PREP,
    capabilities: ['Mock interviews', 'Feedback generation', 'Question preparation'],
    type: ModelType.INTERVIEW_PREP
  },
  {
    id: '4',
    name: 'ResumeAnalyzer',
    role: 'Resume Parser',
    status: 'active',
    description: 'Extracts key information from resumes and identifies relevant skills and experience.',
    completionPercentage: 100,
    lastActive: '3 hours ago',
    model: 'distilbert-base-uncased-finetuned-sst-2-english',
    endpoint: HF_ENDPOINTS.RESUME_ANALYZER,
    capabilities: ['Resume parsing', 'Skill extraction', 'Experience analysis'],
    type: ModelType.RESUME_ANALYZER
  }
];

// Query Hugging Face model with retry logic
export const queryHuggingFaceModel = async (
  modelEndpoint: string,
  inputs: string,
  modelType: ModelType
): Promise<any> => {
  const maxRetries = 3;
  let retryCount = 0;
  
  // Function to handle retries with exponential backoff
  const executeWithRetry = async (): Promise<any> => {
    try {
      // Prepare the request body based on the model type
      let requestBody;
      
      switch (modelType) {
        case ModelType.TALENT_SCOUT:
          // Zero-shot classification model
          requestBody = {
            inputs: inputs,
            parameters: {
              candidate_labels: [
                "Blockchain", "Smart Contracts", "Web3", 
                "Frontend Development", "Backend Development", "Full Stack",
                "Machine Learning", "AI", "Data Science",
                "Product Management", "Leadership", "Project Management"
              ],
              multi_label: false
            }
          };
          break;
          
        case ModelType.RESUME_ANALYZER:
          // Sentiment analysis model
          requestBody = {
            inputs: inputs
          };
          break;
          
        case ModelType.SKILL_VERIFIER:
          // Question answering model
          requestBody = {
            inputs: {
              question: "What skills does this person have?",
              context: inputs
            }
          };
          break;
          
        case ModelType.INTERVIEW_PREP:
          // Text generation model
          requestBody = {
            inputs: inputs,
            parameters: {
              max_length: 150,
              temperature: 0.7,
              top_p: 0.9,
              do_sample: true,
              // Add return_full_text parameter to ensure we get complete responses
              return_full_text: false
            }
          };
          break;
          
        default:
          // Default format for custom models
          requestBody = {
            inputs: inputs
          };
      }
      
      console.log(`Querying ${modelEndpoint} (${modelType})...`);
      
      // Make the API call to Hugging Face
      const response = await fetch(modelEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getHuggingFaceApiKey()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      // Check for model loading status (Hugging Face specific)
      if (response.status === 503) {
        const responseText = await response.text();
        
        // Check if the model is still loading
        if (responseText.includes('Loading model')) {
          console.log('Model is still loading. Waiting before retry...');
          
          // Wait for the model to load (with increasing wait times)
          await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, retryCount)));
          
          // Increment retry count and try again
          retryCount++;
          if (retryCount <= maxRetries) {
            return executeWithRetry();
          } else {
            throw new Error('Model loading timeout. Please try again later.');
          }
        }
      }
      
      // Handle other error responses
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details available');
        console.error(`API Error (${response.status}):`, errorText);
        
        // Handle specific error cases
        switch (response.status) {
          case 400:
            throw new Error(`Bad request: ${errorText}`);
          case 401:
            throw new Error('Authentication failed. Please check your API key.');
          case 403:
            throw new Error('You do not have permission to access this model.');
          case 404:
            throw new Error('The requested model was not found. Please check the endpoint URL.');
          case 429:
            // Rate limiting - wait longer before retry
            if (retryCount < maxRetries) {
              const waitTime = 5000 * Math.pow(2, retryCount);
              console.log(`Rate limit exceeded. Waiting ${waitTime/1000}s before retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              retryCount++;
              return executeWithRetry();
            }
            throw new Error('Rate limit exceeded. Please try again later.');
          case 500:
          case 502:
          case 504:
            // Server errors - retry with backoff
            if (retryCount < maxRetries) {
              const waitTime = 1000 * Math.pow(2, retryCount);
              console.log(`Server error (${response.status}). Waiting ${waitTime/1000}s before retry...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              retryCount++;
              return executeWithRetry();
            }
            throw new Error(`Server error (${response.status}). The service might be temporarily unavailable.`);
          default:
            throw new Error(`API call failed with status: ${response.status}. ${errorText}`);
        }
      }
      
      // Parse the successful response
      const data = await response.json();
      
      // Log the response for debugging
      console.log(`Response from ${modelType} model:`, JSON.stringify(data).substring(0, 200) + '...');
      
      // Special handling for INTERVIEW_PREP model which can return different formats
      if (modelType === ModelType.INTERVIEW_PREP) {
        // Check if the response is in the expected format
        if (!data || !Array.isArray(data) || data.length === 0) {
          console.error('Invalid response format from interview prep model:', data);
          
          // If the response is an object with 'generated_text', convert it to the expected array format
          if (data && typeof data === 'object' && 'generated_text' in data) {
            return [{ generated_text: data.generated_text }];
          }
          
          // If the response is a string, wrap it in the expected format
          if (typeof data === 'string') {
            return [{ generated_text: data }];
          }
          
          // Return a fallback empty response that will trigger the fallback questions
          return [];
        }
      }
      
      // Process the response based on the model type
      switch (modelType) {
        case ModelType.TALENT_SCOUT:
          return processClassificationResponse(data, inputs);
        case ModelType.RESUME_ANALYZER:
          return processResumeAnalyzerResponse(data, inputs);
        case ModelType.SKILL_VERIFIER:
          return processSkillVerifierResponse(data, inputs);
        case ModelType.INTERVIEW_PREP:
          return processInterviewPrepResponse(data, inputs);
        default:
          return {
            success: true,
            result: {
              output: data,
              confidence: 0.95
            }
          };
      }
    } catch (error) {
      // If we've used all our retries, or it's not a retryable error, throw it
      if (retryCount >= maxRetries || 
          !(error instanceof Error && 
            (error.message.includes('timeout') || 
             error.message.includes('network') || 
             error.message.includes('server error')))) {
        throw error;
      }
      
      // Otherwise, retry
      console.log(`Error: ${error instanceof Error ? error.message : 'Unknown error'}. Retrying (${retryCount + 1}/${maxRetries})...`);
      retryCount++;
      const waitTime = 1000 * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return executeWithRetry();
    }
  };
  
  try {
    // Start the retry process
    return await executeWithRetry();
  } catch (error) {
    console.error('Error querying Hugging Face model:', error);
    
    // Provide a more specific error message based on the error type
    let errorMessage = 'Failed to query the model. Please try again later.';
    
    if (error instanceof Error) {
      if (error.message.includes('fetch') || error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// Process BART-large-mnli classification response for TalentScout
const processClassificationResponse = (data: any, resumeText: string): AgentRunResult => {
  try {
    // Check if the data has the expected format
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('Unexpected response format from classification model:', data);
      // Fall back to text-based extraction
      const extractedSkills = extractSkillsFromResume(resumeText);
      const jobMatches = generateJobMatches(extractedSkills, {});
      
      return {
        success: true,
        result: {
          extractedSkills,
          jobMatches,
          analysis: generateAnalysisSummary(extractedSkills, jobMatches) + ' (Generated using fallback method)'
        }
      };
    }
    
    // Extract skills from resume using NLP techniques
    const extractedSkills = extractSkillsFromResume(resumeText);
    
    // Generate job matches based on skills and classification results
    const jobMatches = generateJobMatches(extractedSkills, data);
    
    return {
      success: true,
      result: {
        extractedSkills,
        jobMatches,
        analysis: generateAnalysisSummary(extractedSkills, jobMatches)
      }
    };
  } catch (error) {
    console.error('Error processing classification response:', error);
    
    // Fall back to text-based extraction
    const extractedSkills = extractSkillsFromResume(resumeText);
    const jobMatches = generateJobMatches(extractedSkills, {});
    
    return {
      success: true,
      result: {
        extractedSkills,
        jobMatches,
        analysis: generateAnalysisSummary(extractedSkills, jobMatches) + ' (Generated using fallback method)'
      }
    };
  }
};

// Process DistilBERT response for ResumeAnalyzer
const processResumeAnalyzerResponse = (data: any, resumeText: string): AgentRunResult => {
  try {
    // Extract skills, experience, education from resume using NLP
    const skills = extractSkillsFromResume(resumeText);
    const experience = extractExperienceFromResume(resumeText);
    const education = extractEducationFromResume(resumeText);
    const summary = generateResumeSummary(skills, experience, education);
    
    return {
      success: true,
      result: {
        skills,
        experience,
        education,
        summary
      }
    };
  } catch (error) {
    console.error('Error processing resume analyzer response:', error);
    return {
      success: false,
      error: 'Failed to analyze the resume'
    };
  }
};

// Process RoBERTa response for SkillVerifier
const processSkillVerifierResponse = (data: any, input: string): AgentRunResult => {
  try {
    // Process verification results
    return {
      success: true,
      result: {
        verified: data.score > 0.7,
        confidence: data.score,
        blockchain_record: {
          hash: generateHash(input),
          timestamp: new Date().toISOString()
        }
      }
    };
  } catch (error) {
    console.error('Error processing skill verifier response:', error);
    return {
      success: false,
      error: 'Failed to verify skills'
    };
  }
};

// Process GPT-2 response for InterviewPrep
const processInterviewPrepResponse = (data: any, input: string): AgentRunResult => {
  try {
    // Check if data is valid and has the expected structure
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error('Invalid data format received from interview prep model:', data);
      
      // Use fallback questions based on input only
      const fallbackQuestions = generateInterviewQuestions('', input);
      
      return {
        success: true,
        result: {
          questions: fallbackQuestions,
          feedback: generateInterviewFeedback(input),
          note: 'Using fallback questions due to API response format issue'
        }
      };
    }

    // Check if generated_text exists in the response
    if (!data[0].hasOwnProperty('generated_text')) {
      console.error('Missing generated_text in model response:', data);
      
      // Try to extract text from the response in a different format
      let generatedText = '';
      
      // If the first item is a string, use it directly
      if (typeof data[0] === 'string') {
        generatedText = data[0];
      } 
      // If the first item has a 'text' property, use that
      else if (data[0] && typeof data[0] === 'object' && 'text' in data[0]) {
        generatedText = data[0].text;
      }
      // If the data itself is a string, use it
      else if (typeof data === 'string') {
        generatedText = data;
      }
      
      // Generate questions using whatever text we could extract
      const questions = generateInterviewQuestions(generatedText, input);
      
      return {
        success: true,
        result: {
          questions,
          feedback: generateInterviewFeedback(input),
          note: 'Adapted response format to generate questions'
        }
      };
    }
    
    // Generate interview questions from the model output
    const questions = generateInterviewQuestions(data[0].generated_text, input);
    
    return {
      success: true,
      result: {
        questions,
        feedback: generateInterviewFeedback(input)
      }
    };
  } catch (error) {
    console.error('Error processing interview prep response:', error);
    
    // Always provide fallback questions even when there's an error
    const fallbackQuestions = generateInterviewQuestions('', input);
    
    return {
      success: true,
      result: {
        questions: fallbackQuestions,
        feedback: generateInterviewFeedback(input),
        note: `Error occurred but using fallback questions: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    };
  }
};

// Mock response for when the Hugging Face API is unavailable
const mockInterviewPrepResponse = (input: string): AgentRunResult => {
  console.log('Using mock interview prep response due to API unavailability');
  
  // Generate questions based on the input text
  const questions = [
    'Tell me about your experience with blockchain technology.',
    'How have you applied your skills in a challenging project?',
    'What interests you about this position?',
    'Describe a situation where you had to learn a new technology quickly.',
    'How do you stay updated with the latest developments in your field?'
  ];
  
  // Add skill-specific questions based on the input
  const inputLower = input.toLowerCase();
  const skillSpecificQuestions: string[] = [];
  
  if (inputLower.includes('blockchain') || inputLower.includes('web3') || inputLower.includes('crypto')) {
    skillSpecificQuestions.push('How do you evaluate the security of a smart contract?');
    skillSpecificQuestions.push('What blockchain platforms have you worked with?');
  }
  
  if (inputLower.includes('react') || inputLower.includes('frontend') || inputLower.includes('ui')) {
    skillSpecificQuestions.push('How do you approach state management in React applications?');
    skillSpecificQuestions.push('What strategies do you use to optimize frontend performance?');
  }
  
  if (inputLower.includes('python') || inputLower.includes('data') || inputLower.includes('machine learning')) {
    skillSpecificQuestions.push('How have you used Python for data analysis?');
    skillSpecificQuestions.push('Explain a machine learning model you\'ve implemented.');
  }
  
  if (inputLower.includes('leadership') || inputLower.includes('management') || inputLower.includes('team')) {
    skillSpecificQuestions.push('How do you motivate team members during challenging projects?');
    skillSpecificQuestions.push('Describe your approach to resolving conflicts within a team.');
  }
  
  // Combine the default and skill-specific questions
  const allQuestions = [...questions, ...skillSpecificQuestions];
  
  // Return a successful response with the generated questions
  return {
    success: true,
    result: {
      questions: allQuestions.slice(0, 5),
      feedback: 'Focus on concrete examples and quantifiable results in your answers.',
      note: 'Generated using offline mode due to API unavailability'
    }
  };
};

// Helper functions for NLP processing
const extractSkillsFromResume = (resumeText: string): string[] => {
  // In a production environment, this would use a proper NLP library
  // For now, we'll use a simple keyword extraction approach with improved matching
  
  // Define skill keywords with variations
  const skillKeywords = [
    // Programming Languages
    'JavaScript', 'JS', 'TypeScript', 'TS', 'Python', 'Java', 'C#', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Golang', 'Rust',
    
    // Frontend
    'React', 'React.js', 'Angular', 'Vue', 'Vue.js', 'Next.js', 'Svelte', 'HTML', 'CSS', 'SCSS', 'Sass', 'TailwindCSS', 'Bootstrap',
    
    // Backend
    'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'ASP.NET', 'Laravel', 'Ruby on Rails', 'FastAPI',
    
    // Cloud & DevOps
    'AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'K8s', 'CI/CD', 'Jenkins', 'GitHub Actions',
    
    // Databases
    'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'DynamoDB', 'Cassandra', 'Elasticsearch',
    
    // AI & Data Science
    'Machine Learning', 'ML', 'AI', 'Artificial Intelligence', 'Data Science', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision',
    
    // Blockchain
    'Blockchain', 'Smart Contracts', 'Solidity', 'Web3', 'Ethereum', 'Aptos', 'Move', 'DeFi', 'NFT', 'Cryptocurrency',
    
    // Soft Skills & Management
    'Product Management', 'Agile', 'Scrum', 'Leadership', 'Project Management', 'Team Management',
    
    // Other Technical Skills
    'API Integration', 'REST API', 'GraphQL', 'Microservices', 'Testing', 'Unit Testing', 'QA', 'UI/UX', 'Mobile Development'
  ];
  
  // Normalize the resume text (lowercase and remove punctuation)
  const normalizedText = resumeText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
  
  // Extract skills that appear in the resume text with more flexible matching
  const foundSkills = new Set<string>();
  
  skillKeywords.forEach(skill => {
    const normalizedSkill = skill.toLowerCase();
    
    // Check if the skill appears as a whole word in the text
    // Escape special regex characters in the skill name
    const escapedSkill = normalizedSkill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // For short skills (<=4 chars), use stricter matching to avoid false positives
    // For example, "Move" should not match "movement" or "remove"
    if (normalizedSkill.length <= 4) {
      // For short skills, require word boundaries on both sides to ensure it's a standalone word
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
      
      // For technical skills like "AI", also check for common contexts
      if (skill === "AI") {
        const aiContextRegex = new RegExp(`\\b(${escapedSkill}|artificial intelligence|machine learning|neural network|deep learning)\\b`, 'i');
        if (aiContextRegex.test(normalizedText)) {
          foundSkills.add(skill);
        }
      } 
      // For blockchain skills like "Move", check for blockchain context
      else if (skill === "Move" || skill === "Aptos") {
        const blockchainContextRegex = new RegExp(`\\b(${escapedSkill}.*?(blockchain|crypto|web3|smart contract|programming language))\\b|\\b((blockchain|crypto|web3|smart contract|programming language).*?${escapedSkill})\\b`, 'i');
        if (blockchainContextRegex.test(normalizedText)) {
          foundSkills.add(skill);
        }
      }
      else if (regex.test(normalizedText)) {
        foundSkills.add(skill);
      }
    } else {
      // For longer skills, use the original regex
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
      if (regex.test(normalizedText)) {
        foundSkills.add(skill);
      }
    }
  });
  
  return Array.from(foundSkills);
};

const extractExperienceFromResume = (resumeText: string): string[] => {
  // In a production environment, this would use a proper NLP library
  // For now, we'll extract lines that might contain job experience
  const lines = resumeText.split('\n');
  const experienceLines = lines.filter(line => 
    /\b(20\d{2}|19\d{2})\b.*\b(present|current|now)\b/i.test(line) || 
    /\b(20\d{2}|19\d{2})\b.*\b(20\d{2}|19\d{2})\b/i.test(line)
  );
  
  return experienceLines.length > 0 ? experienceLines : ['Experience information not found'];
};

const extractEducationFromResume = (resumeText: string): string[] => {
  // In a production environment, this would use a proper NLP library
  // For now, we'll extract lines that might contain education information
  const lines = resumeText.split('\n');
  const educationKeywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'school'];
  const educationLines = lines.filter(line => 
    educationKeywords.some(keyword => line.toLowerCase().includes(keyword))
  );
  
  return educationLines.length > 0 ? educationLines : ['Education information not found'];
};

const generateResumeSummary = (skills: string[], experience: string[], education: string[]): string => {
  // Generate a summary based on extracted information
  const skillsText = skills.length > 0 
    ? `Skills include ${skills.slice(0, 3).join(', ')}${skills.length > 3 ? ' and more' : ''}.` 
    : '';
  
  const experienceText = experience.length > 0 && experience[0] !== 'Experience information not found'
    ? `Has professional experience.` 
    : '';
  
  const educationText = education.length > 0 && education[0] !== 'Education information not found'
    ? `Has formal education background.` 
    : '';
  
  return `${skillsText} ${experienceText} ${educationText}`.trim();
};

export const generateJobMatches = (skills: string[], modelData: any): JobMatch[] => {
  // In a production environment, this would use the model output to find matches
  // For now, we'll generate matches based on the extracted skills
  
  // Define some job templates
  const jobTemplates = [
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
  
  // Calculate match percentage for each job
  return jobTemplates.map((job, index) => {
    // Find exact matching skills (case insensitive)
    const exactMatchingSkills = job.requiredSkills.filter(requiredSkill => 
      skills.some(candidateSkill => 
        candidateSkill.toLowerCase() === requiredSkill.toLowerCase()
      )
    );
    
    // Calculate weighted match percentage
    let matchScore = 0;
    let totalPossibleScore = 0;
    
    // Check critical skills - these are weighted more heavily
    const criticalSkillsMatched = job.criticalSkills.filter(criticalSkill => 
      exactMatchingSkills.some(match => match.toLowerCase() === criticalSkill.toLowerCase())
    );
    
    // Critical skills are worth 60% of the total score (30% each for a job with 2 critical skills)
    const criticalSkillWeight = 60 / job.criticalSkills.length;
    matchScore += criticalSkillsMatched.length * criticalSkillWeight;
    totalPossibleScore += 60;
    
    // Check important skills - these are weighted less
    const importantSkillsMatched = job.importantSkills.filter(importantSkill => 
      exactMatchingSkills.some(match => match.toLowerCase() === importantSkill.toLowerCase())
    );
    
    // Important skills are worth 40% of the total score (10% each for a job with 4 important skills)
    const importantSkillWeight = 40 / job.importantSkills.length;
    matchScore += importantSkillsMatched.length * importantSkillWeight;
    totalPossibleScore += 40;
    
    // Calculate final percentage
    const matchPercentage = Math.round((matchScore / totalPossibleScore) * 100);
    
    // Special case for Aptos and Move - if these are critical skills and not matched, cap the percentage
    if (job.criticalSkills.includes('Aptos') || job.criticalSkills.includes('Move')) {
      const hasAptosOrMove = exactMatchingSkills.some(skill => 
        skill === 'Aptos' || skill === 'Move'
      );
      
      // If Aptos or Move are critical but not found, cap the match at 60%
      if (!hasAptosOrMove) {
        const cappedPercentage = Math.min(matchPercentage, 60);
        
        return {
          id: (index + 1).toString(),
          title: job.title,
          company: job.company,
          location: job.location,
          matchPercentage: cappedPercentage,
          description: `This position requires specific blockchain skills (Aptos, Move) that weren't found in your resume.`,
          skills: job.requiredSkills,
          datePosted: `${Math.floor(Math.random() * 14) + 1} days ago`
        };
      }
    }
    
    // Create description based on matching skills
    let description = '';
    if (exactMatchingSkills.length > 0) {
      description = `Your skills in ${exactMatchingSkills.join(', ')} align with this position.`;
    } else {
      description = 'This position requires skills that weren\'t found in your resume.';
    }
    
    return {
      id: (index + 1).toString(),
      title: job.title,
      company: job.company,
      location: job.location,
      matchPercentage: matchPercentage,
      description: description,
      skills: job.requiredSkills,
      datePosted: `${Math.floor(Math.random() * 14) + 1} days ago`
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
};

const generateAnalysisSummary = (skills: string[], jobMatches: JobMatch[]): string => {
  // Generate an analysis summary based on skills and job matches
  const topMatch = jobMatches[0];
  const skillsText = skills.length > 0 
    ? `You have skills in ${skills.slice(0, 3).join(', ')}${skills.length > 3 ? ' and more' : ''}.` 
    : '';
  
  const matchText = topMatch 
    ? `Your strongest match is for ${topMatch.title} at ${topMatch.company} with a ${topMatch.matchPercentage}% match.` 
    : '';
  
  return `${skillsText} ${matchText}`.trim();
};

const generateInterviewQuestions = (generatedText: string, input: string): string[] => {
  try {
    // Default questions that will always be available
    const defaultQuestions = [
      'Describe your experience with blockchain technology.',
      'How have you integrated AI into previous projects?',
      'What challenges did you face in your last role?',
      'Tell me about a project you\'re particularly proud of.',
      'How do you approach learning new technologies?'
    ];
    
    // Add more questions based on skills in the input
    const additionalQuestions: string[] = [];
    
    // Convert input to lowercase for case-insensitive matching
    const inputLower = input.toLowerCase();
    
    // Check for various skills and add relevant questions
    if (inputLower.includes('blockchain')) {
      additionalQuestions.push('How do you stay updated with the latest blockchain developments?');
      additionalQuestions.push('Explain a complex blockchain concept in simple terms.');
    }
    
    if (inputLower.includes('leadership') || inputLower.includes('manager') || inputLower.includes('management')) {
      additionalQuestions.push('Describe a situation where you had to lead a team through a difficult project.');
      additionalQuestions.push('How do you handle conflicts within your team?');
    }
    
    if (inputLower.includes('react') || inputLower.includes('frontend') || inputLower.includes('front-end')) {
      additionalQuestions.push('What React design patterns do you commonly use in your projects?');
      additionalQuestions.push('How do you optimize performance in a React application?');
    }
    
    if (inputLower.includes('python') || inputLower.includes('data science') || inputLower.includes('machine learning')) {
      additionalQuestions.push('How have you used Python for data analysis or machine learning?');
      additionalQuestions.push('Explain a complex algorithm you\'ve implemented.');
    }
    
    // Try to extract questions from the generated text if available
    const extractedQuestions: string[] = [];
    if (generatedText && typeof generatedText === 'string') {
      // Look for question patterns in the generated text
      const questionMatches = generatedText.match(/(?:\?|^|\.|\n)([^.?!]*\?)/g);
      if (questionMatches) {
        extractedQuestions.push(
          ...questionMatches
            .map(q => q.trim().replace(/^[.!?]\s*/, ''))
            .filter(q => q.length > 10 && q.length < 200)
        );
      }
    }
    
    // Combine all questions and remove duplicates
    const allQuestions = [...new Set([...extractedQuestions, ...additionalQuestions, ...defaultQuestions])];
    
    // Return up to 5 questions, prioritizing extracted and additional questions
    return allQuestions.slice(0, 5);
  } catch (error) {
    console.error('Error generating interview questions:', error);
    // Return default questions if there's an error
    return [
      'Tell me about your background and experience.',
      'What are your key technical skills?',
      'Describe a challenging project you worked on.',
      'How do you approach problem-solving?',
      'What are your career goals?'
    ];
  }
};

const generateInterviewFeedback = (input: string): string => {
  // Generate feedback based on input
  return 'Focus on concrete examples and quantifiable results. Highlight your specific contributions to projects.';
};

const generateHash = (input: string): string => {
  // In a production environment, this would use a proper hashing algorithm
  // For now, we'll generate a simple hash
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return '0x' + Math.abs(hash).toString(16).padStart(8, '0');
};

// Function to create a new AI agent
export const createAgent = (
  name: string,
  role: string,
  modelType: 'talent-scout' | 'skill-verifier' | 'interview-prep' | 'resume-analyzer' | 'custom'
): AIAgent => {
  let endpoint = HF_ENDPOINTS.CUSTOM_AGENT;
  let model = 'bert-base-uncased';
  let capabilities: string[] = [];
  let agentType: ModelType;
  
  // Map string model type to ModelType enum
  switch (modelType) {
    case 'talent-scout':
      endpoint = HF_ENDPOINTS.TALENT_SCOUT;
      model = 'facebook/bart-large-mnli';
      capabilities = ['Job matching', 'Skill analysis', 'Culture fit assessment'];
      agentType = ModelType.TALENT_SCOUT;
      break;
    case 'skill-verifier':
      endpoint = HF_ENDPOINTS.SKILL_VERIFIER;
      model = 'deepset/roberta-base-squad2';
      capabilities = ['Document verification', 'Credential validation', 'Blockchain integration'];
      agentType = ModelType.SKILL_VERIFIER;
      break;
    case 'interview-prep':
      endpoint = HF_ENDPOINTS.INTERVIEW_PREP;
      model = 'gpt2';
      capabilities = ['Mock interviews', 'Feedback generation', 'Question preparation'];
      agentType = ModelType.INTERVIEW_PREP;
      break;
    case 'resume-analyzer':
      endpoint = HF_ENDPOINTS.RESUME_ANALYZER;
      model = 'distilbert-base-uncased-finetuned-sst-2-english';
      capabilities = ['Resume parsing', 'Skill extraction', 'Experience analysis'];
      agentType = ModelType.RESUME_ANALYZER;
      break;
    default:
      capabilities = ['Custom analysis', 'Specialized tasks'];
      // Default to TALENT_SCOUT for custom agents
      agentType = ModelType.TALENT_SCOUT;
      break;
  }
  
  return {
    id: Date.now().toString(),
    name,
    role,
    status: 'learning',
    description: `A ${role} powered by ${model} for specialized tasks.`,
    completionPercentage: 15,
    lastActive: 'Just now',
    model,
    endpoint,
    capabilities,
    type: agentType
  };
};

// Pause an AI agent
export const pauseAgent = (agent: Agent): Agent => {
  console.log(`Pausing agent: ${agent.name}`);
  return {
    ...agent,
    status: 'inactive'
  };
};

// Activate an AI agent
export const activateAgent = (agent: Agent): Agent => {
  console.log(`Activating agent: ${agent.name}`);
  return {
    ...agent,
    status: 'active'
  };
};

// Train an AI agent with new data
export const trainAgent = async (agent: Agent, trainingData: string): Promise<Agent> => {
  console.log(`Training agent ${agent.name} with data: ${trainingData.substring(0, 50)}...`);
  
  // Simulate training process
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    ...agent,
    lastActive: new Date()
  };
};

// Run an AI agent with the given input
export const runAgent = async (agent: Agent, input: string): Promise<AgentRunResult> => {
  try {
    console.log(`Running agent: ${agent.name} with input length: ${input.length}`);
    
    // Check if we should use mock responses (for development/testing or when API is down)
    const useMockResponses = process.env.NEXT_PUBLIC_USE_MOCK_RESPONSES === 'true';
    
    if (useMockResponses) {
      console.log('Using mock responses as configured in environment variables');
      
      // Return mock responses based on agent type
      switch (agent.type) {
        case ModelType.INTERVIEW_PREP:
          return mockInterviewPrepResponse(input);
        // Add other mock responses as needed
        default:
          // For other agent types, continue with the normal API call
          break;
      }
    }
    
    // Query the Hugging Face model
    const result = await queryHuggingFaceModel(agent.endpoint, input, agent.type);
    
    // Update the agent's last active time
    agent.lastActive = new Date();
    
    // Process the result based on the agent type
    switch (agent.type) {
      case ModelType.TALENT_SCOUT:
        return processClassificationResponse(result, input);
      case ModelType.RESUME_ANALYZER:
        return processResumeAnalyzerResponse(result, input);
      case ModelType.SKILL_VERIFIER:
        return processSkillVerifierResponse(result, input);
      case ModelType.INTERVIEW_PREP:
        return processInterviewPrepResponse(result, input);
      default:
        return {
          success: true,
          result: result
        };
    }
  } catch (error: any) {
    console.error(`Error running agent ${agent.name}:`, error);
    
    // Provide fallback responses for specific agent types when there's an error
    if (agent.type === ModelType.INTERVIEW_PREP) {
      return mockInterviewPrepResponse(input);
    }
    
    return {
      success: false,
      error: error.message || 'Failed to run the agent'
    };
  }
};

// Function to analyze a resume using the ResumeAnalyzer agent
export const analyzeResume = async (resume: string): Promise<{
  skills: string[];
  experience: string[];
  education: string[];
  summary: string;
}> => {
  // Find the ResumeAnalyzer agent
  const resumeAnalyzer = initialAgents.find(agent => agent.name === 'ResumeAnalyzer');
  
  if (!resumeAnalyzer || resumeAnalyzer.status !== 'active') {
    throw new Error('Resume Analyzer agent is not available or not active');
  }
  
  // Ensure the agent has the required type property
  if (!resumeAnalyzer.type) {
    resumeAnalyzer.type = ModelType.RESUME_ANALYZER;
  }
  
  // Cast the AIAgent to Agent type
  const agentForRunning: Agent = {
    id: resumeAnalyzer.id,
    name: resumeAnalyzer.name,
    description: resumeAnalyzer.description,
    endpoint: resumeAnalyzer.endpoint,
    status: resumeAnalyzer.status as 'active' | 'inactive' | 'learning' | 'maintenance',
    type: resumeAnalyzer.type,
    lastActive: resumeAnalyzer.lastActive
  };
  
  try {
    // Call the AI model to analyze the resume
    const result = await runAgent(agentForRunning, resume);
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to analyze resume');
    }
    
    return result.result;
  } catch (error) {
    console.error('Error in analyzeResume:', error);
    
    // If the AI service fails, use a fallback method to extract basic information
    // This ensures the user can still get some results even if the AI service is down
    const fallbackSkills = extractSkillsFromResume(resume);
    const fallbackExperience = extractExperienceFromResume(resume);
    const fallbackEducation = extractEducationFromResume(resume);
    const fallbackSummary = generateResumeSummary(fallbackSkills, fallbackExperience, fallbackEducation);
    
    // Log that we're using fallback
    console.log('Using fallback resume analysis method');
    
    // Return the fallback results
    return {
      skills: fallbackSkills,
      experience: fallbackExperience,
      education: fallbackEducation,
      summary: fallbackSummary + ' (Generated using fallback method)'
    };
  }
};

// Define the talent scout agent
export const talentScoutAgent: Agent = {
  id: 'talent-scout-1',
  name: 'Talent Scout',
  description: 'Analyzes resumes to extract skills and suggest job matches',
  endpoint: 'facebook/bart-large-mnli',
  status: 'active',
  type: ModelType.TALENT_SCOUT,
  lastActive: 'Never'
};

// Define the resume analyzer agent
export const resumeAnalyzerAgent: Agent = {
  id: 'resume-analyzer-1',
  name: 'Resume Analyzer',
  description: 'Provides detailed analysis and feedback on resumes',
  endpoint: 'distilbert-base-uncased-finetuned-sst-2-english',
  status: 'active',
  type: ModelType.RESUME_ANALYZER,
  lastActive: 'Never'
};

// Define the skill verifier agent
export const skillVerifierAgent: Agent = {
  id: 'skill-verifier-1',
  name: 'Skill Verifier',
  description: 'Verifies claimed skills against resume content',
  endpoint: 'deepset/roberta-base-squad2',
  status: 'active',
  type: ModelType.SKILL_VERIFIER,
  lastActive: 'Never'
};

// Define the interview prep agent
export const interviewPrepAgent: Agent = {
  id: 'interview-prep-1',
  name: 'Interview Prep',
  description: 'Generates interview questions based on resume',
  endpoint: 'gpt2',
  status: 'active',
  type: ModelType.INTERVIEW_PREP,
  lastActive: 'Never'
};

// Get all available AI agents
export const getAgents = (): Agent[] => {
  return [talentScoutAgent, resumeAnalyzerAgent, skillVerifierAgent, interviewPrepAgent];
};

// Get an AI agent by ID
export const getAgentById = (id: string): Agent | undefined => {
  return getAgents().find(agent => agent.id === id);
}; 