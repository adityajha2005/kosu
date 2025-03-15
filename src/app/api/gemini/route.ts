// src/app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface JobTemplate {
  title: string;
  company: string;
  location: string;
  requiredSkills: string[];
  criticalSkills: string[];
  importantSkills: string[];
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface ResponseData {
  title: string;
  questions: Question[];
}

export async function POST(request: NextRequest) {
  try {
    const { jobDetails } = await request.json() as { jobDetails: JobTemplate };

    if (!jobDetails || !jobDetails.title) {
      return NextResponse.json({ error: 'Missing job details' }, { status: 400 });
    }

    // Format job details for Gemini prompt
    const jobPrompt = `
Job Title: ${jobDetails.title}
Company: ${jobDetails.company}
Location: ${jobDetails.location}

Required Skills: ${jobDetails.requiredSkills.join(', ')}
Critical Skills: ${jobDetails.criticalSkills.join(', ')}
Important Skills: ${jobDetails.importantSkills.join(', ')}
`;

    const promptInstructions = `
Based on the job details above, generate 5 multiple-choice quiz questions that would test a candidate's knowledge of the critical and important skills required for this position.

Each question should:
1. Focus primarily on the critical skills (${jobDetails.criticalSkills.join(', ')}) and secondarily on the important skills (${jobDetails.importantSkills.join(', ')})
2. Have 4 options with only one correct answer
3. Test practical knowledge rather than theoretical definitions
4. Be challenging but fair for a qualified candidate

Return the response as a JSON object with the following structure:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "The correct option from the options array"
    },
    // additional questions...
  ]
}
`;

    const fullPrompt = jobPrompt + promptInstructions;

    // Call Google's Gemini API
    const GEMINI_API_KEY = process.env.GOOGLE_API_KEY || 'AIzaSyA3moSS4_ALdgy63FNp0pE0lLXgyUU2Kk8'
    if (!GEMINI_API_KEY) {
      throw new Error("Missing Gemini API key");
    }

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: fullPrompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const geminiData = await geminiResponse.json();
    
    // Extract and parse the JSON response from Gemini
    let questions: Question[];
    try {
      // Get the text content from Gemini's response
      const responseText = geminiData.candidates[0].content.parts[0].text;
      
      // Find and extract the JSON part of the response
      const jsonMatch = responseText.match(/(\{[\s\S]*\})/);
      if (jsonMatch && jsonMatch[1]) {
        const parsedData = JSON.parse(jsonMatch[1]);
        questions = parsedData.questions;
      } else {
        throw new Error("Could not parse JSON from Gemini response");
      }
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      // Fallback to mock questions if parsing fails
      questions = getMockQuestions(jobDetails);
    }

    // Create response data
    const responseData: ResponseData = {
      title: `${jobDetails.title} Quiz`,
      questions: questions,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate quiz questions' }, { status: 500 });
  }
}

// Fallback function to provide mock questions if Gemini API fails
function getMockQuestions(jobDetails: JobTemplate): Question[] {
  // Generate questions based on job title and skills
  const criticalSkill = jobDetails.criticalSkills[0] || 'Technology';
  
  return [
    {
      question: `What is a key benefit of using ${criticalSkill} in modern development?`,
      options: [
        `Improved security`,
        `Better performance`,
        `Enhanced developer experience`,
        `All of the above`
      ],
      correctAnswer: `All of the above`
    },
    {
      question: `Which of the following best describes the role of ${criticalSkill} in ${jobDetails.title}?`,
      options: [
        `Supporting technology only used occasionally`,
        `Core competency required for daily tasks`,
        `Administrative function`,
        `Legacy system maintenance`
      ],
      correctAnswer: `Core competency required for daily tasks`
    },
    // Add more generic questions that can be adapted to any job
    {
      question: `What is considered best practice when implementing ${jobDetails.requiredSkills[0]}?`,
      options: [
        `Minimal documentation`,
        `Comprehensive testing`,
        `Avoiding version control`,
        `Manual deployment`
      ],
      correctAnswer: `Comprehensive testing`
    }
  ];
}