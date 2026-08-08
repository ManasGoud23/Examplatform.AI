import { GoogleGenerativeAI } from '@google/generative-ai';

function getGeminiClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
  if (apiKey && apiKey !== "your_gemini_api_key_here") {
    try {
      return new GoogleGenerativeAI(apiKey);
    } catch (e) {
      console.warn("Failed to initialize Gemini SDK:", e);
    }
  }
  return null;
}

export async function generateAIExam(subject, difficulty, numQuestions) {
  const count = parseInt(numQuestions) || 5;
  const genAI = getGeminiClient();

  if (!genAI) {
    console.info("Gemini API key not detected. Using high-quality fallback exam generator.");
    return generateFallbackExam(subject, difficulty, count);
  }

  try {
    const prompt = `You are an expert educational test generator. 
Generate an interactive multiple-choice test for the following criteria:
- Subject: ${subject}
- Difficulty Level: ${difficulty}
- Number of Questions: ${count}

REQUIREMENTS:
1. Return ONLY valid, raw JSON matching the JSON schema below. Do not wrap in markdown code blocks like \`\`\`json or add introductory/concluding text.
2. Each question MUST have exactly 4 options.
3. 'correctAnswerIndex' MUST be an integer from 0 to 3 corresponding to the correct option in the options array.
4. 'explanation' MUST be a clear, informative explanation of why the correct answer is right.

EXPECTED JSON SCHEMA:
{
  "title": "${subject} (${difficulty} Test)",
  "subject": "${subject}",
  "difficulty": "${difficulty}",
  "durationMinutes": ${Math.max(5, count * 2)},
  "questions": [
    {
      "id": "q1",
      "question": "Clear and detailed question text here...",
      "options": [
        "First option",
        "Second option",
        "Third option",
        "Fourth option"
      ],
      "correctAnswerIndex": 0,
      "explanation": "Detailed step-by-step explanation here..."
    }
  ]
}`;

    let resultText = "";
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: "application/json" }
      });
      const response = await model.generateContent(prompt);
      resultText = response.response.text();
    } catch (modelErr) {
      console.warn("gemini-1.5-flash failed, attempting fallback to gemini-2.0-flash:", modelErr);
      const fallbackModel = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: { responseMimeType: "application/json" }
      });
      const responseFallback = await fallbackModel.generateContent(prompt);
      resultText = responseFallback.response.text();
    }
    // Clean potential markdown quotes if present
    const cleanedJson = (resultText || "")
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '');

    const parsedData = JSON.parse(cleanedJson);
    
    // Ensure all required fields exist
    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
      throw new Error("Invalid structure returned from Gemini API");
    }

    return {
      id: `exam-${Date.now()}`,
      title: parsedData.title || `${subject} Mock Exam`,
      subject: parsedData.subject || subject,
      difficulty: parsedData.difficulty || difficulty,
      durationMinutes: parsedData.durationMinutes || Math.max(5, count * 2),
      totalQuestions: parsedData.questions.length,
      questions: parsedData.questions.map((q, idx) => ({
        id: q.id || `q-${idx + 1}`,
        question: q.question,
        options: Array.isArray(q.options) && q.options.length === 4 
          ? q.options 
          : ["Option A", "Option B", "Option C", "Option D"],
        correctAnswerIndex: typeof q.correctAnswerIndex === 'number' ? q.correctAnswerIndex : 0,
        explanation: q.explanation || "Correct answer based on key principles."
      }))
    };

  } catch (error) {
    console.error("Error generating exam with Gemini API:", error);
    // Graceful fallback if API fails or rate limits
    return generateFallbackExam(subject, difficulty, count);
  }
}

// Fallback Exam Generator for instant testing without API key setup
function generateFallbackExam(subject, difficulty, numQuestions) {
  const templates = {
    'JavaScript': [
      {
        question: "Which of the following is true about JavaScript promises?",
        options: [
          "They represent eventual completion or failure of an asynchronous operation.",
          "They block the main execution thread until resolved.",
          "They can only be created using async/await keywords.",
          "They cannot handle rejected states."
        ],
        correctAnswerIndex: 0,
        explanation: "A Promise is an object representing the ultimate outcome (success or failure) of an asynchronous action without blocking the main event loop."
      },
      {
        question: "What is the result of typeof NaN in JavaScript?",
        options: ["'number'", "'NaN'", "'undefined'", "'object'"],
        correctAnswerIndex: 0,
        explanation: "In JavaScript, NaN (Not-a-Number) is technically a numeric data type specified by IEEE 754 floating-point standards."
      },
      {
        question: "What does the array method `.reduce()` do?",
        options: [
          "Executes a reducer function on each element resulting in a single output value.",
          "Filters out elements based on a condition.",
          "Transforms each element into a new array.",
          "Sorts the array elements in place."
        ],
        correctAnswerIndex: 0,
        explanation: "`.reduce()` iterates over array elements and accumulates a single final result based on a callback function."
      },
      {
        question: "What is a closure in JavaScript?",
        options: [
          "A function bundled together with references to its surrounding state (lexical environment).",
          "A method to close browser tabs programmatically.",
          "A block statement that prevents variable leaks.",
          "An object method that cannot be overridden."
        ],
        correctAnswerIndex: 0,
        explanation: "Closures give access to an outer function's scope from an inner function even after the outer function has executed."
      },
      {
        question: "Which keyword creates a block-scoped variable that cannot be reassigned?",
        options: ["const", "let", "var", "static"],
        correctAnswerIndex: 0,
        explanation: "The `const` keyword declares block-scoped variables whose references cannot be reassigned after declaration."
      }
    ],
    'React': [
      {
        question: "What is the primary purpose of React's `useEffect` hook?",
        options: [
          "To perform side effects in functional components like data fetching and subscriptions.",
          "To manage global application state.",
          "To speed up CSS rendering times.",
          "To replace all React component props."
        ],
        correctAnswerIndex: 0,
        explanation: "`useEffect` serves as a unified API for managing side effects, lifecycle events, and cleanups in functional React components."
      },
      {
        question: "Why should keys be provided for lists in React?",
        options: [
          "Keys help React identify which items have changed, been added, or removed for efficient DOM diffing.",
          "Keys are required for CSS styling of list items.",
          "Keys convert array items into JSON strings.",
          "Keys automatically sort list items in alphabetical order."
        ],
        correctAnswerIndex: 0,
        explanation: "Unique keys allow React's Virtual DOM reconciliation engine to track item identity and minimize costly DOM mutations."
      },
      {
        question: "What does `useMemo` optimize in React?",
        options: [
          "Memoizes expensive computed values across re-renders.",
          "Memoizes component DOM trees.",
          "Prevents initial component mounting.",
          "Caches browser localStorage requests."
        ],
        correctAnswerIndex: 0,
        explanation: "`useMemo` caches the result of a calculation between renders unless its specified dependencies change."
      }
    ]
  };

  const selectedList = templates[subject] || [
    {
      question: `What is a fundamental concept in ${subject}?`,
      options: [
        `Core principle governing ${subject} methodologies.`,
        `Outdated legacy standard.`,
        `Syntax error placeholder.`,
        `Unrelated peripheral utility.`
      ],
      correctAnswerIndex: 0,
      explanation: `Understanding core principles is essential when studying ${subject} at a ${difficulty} level.`
    },
    {
      question: `How is optimization achieved in ${subject}?`,
      options: [
        `By minimizing unnecessary overhead and applying best practices.`,
        `By ignoring structure and guidelines.`,
        `By removing all verification checks.`,
        `By hardcoding static values.`
      ],
      correctAnswerIndex: 0,
      explanation: `Optimization in ${subject} relies on structured architecture, efficient algorithms, and best practice implementations.`
    },
    {
      question: `Which approach is recommended for ${difficulty} problems in ${subject}?`,
      options: [
        `Modular design, thorough testing, and systematic problem decomposition.`,
        `Guesswork without validation.`,
        `Relying on deprecated methods.`,
        `Overcomplicating simple routines.`
      ],
      correctAnswerIndex: 0,
      explanation: `Solving ${difficulty} problems in ${subject} requires systematic analysis and clear modular decomposition.`
    }
  ];

  // Repeat or trim to match exact requested count
  const generatedQuestions = [];
  for (let i = 0; i < numQuestions; i++) {
    const base = selectedList[i % selectedList.length];
    generatedQuestions.push({
      id: `q-${i + 1}`,
      question: `${i + 1}. [${subject} - ${difficulty}] ${base.question}`,
      options: base.options,
      correctAnswerIndex: base.correctAnswerIndex,
      explanation: base.explanation
    });
  }

  return {
    id: `exam-${Date.now()}`,
    title: `${subject} ${difficulty} Assessment`,
    subject,
    difficulty,
    durationMinutes: Math.max(5, numQuestions * 2),
    totalQuestions: generatedQuestions.length,
    questions: generatedQuestions
  };
}
