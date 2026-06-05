// backend/controllers/aiController.js
const { exec } = require('child_process');

// Abstract helper function to communicate with LLM API (e.g., OpenAI, Anthropic, or Gemini)
// Using standard fetch approach to maintain clean, library-agnostic code
const callLlm = async (systemPrompt, userPrompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Elegant fallback simulation if developer has not yet loaded keys
    return `[System Simulation Mode - API Key not found in env]: Here is a mock response analyzing: "${userPrompt.slice(0, 50)}...". Set process.env.OPENAI_API_KEY to access direct AI operations.`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cost-efficient, high-speed model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.2
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No completion received from the AI engine.';
  } catch (err) {
    console.error('LLM invocation error:', err);
    throw new Error('AI processing failed. Check communication setups.');
  }
};

// @desc    Handle interactive AI tutor request
exports.handleTutorChat = async (req, res) => {
  const { prompt, complexityMode, language } = req.body;

  let styleGuide = '';
  if (complexityMode === 'beginner') {
    styleGuide = 'Explain like I am 10 years old. Use highly relatable real-world analogies. Avoid complex tech jargon.';
  } else if (complexityMode === 'advanced') {
    styleGuide = 'Use highly technical language. Discuss computational complexity (Big O), system engineering architectures, memory allocation parameters, and optimization pathways.';
  } else {
    styleGuide = 'Explain code concepts using standard technical documentation approaches, balanced with structured code snippets.';
  }

  const systemPrompt = `You are a professional computer science professor and AI tutor. 
Format your responses using clean Markdown.
Output target language: ${language || 'English'}.
Explanation mode context: ${styleGuide}`;

  try {
    const reply = await callLlm(systemPrompt, prompt);
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Review and analyze source code submitted by students
exports.handleCodeReview = async (req, res) => {
  const { code, language } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Code content must be provided for evaluation.' });
  }

  const systemPrompt = `You are a senior software developer and QA engineer reviewing student code submissions.
Analyze the code for:
1. Syntax and logic bugs.
2. Space/Time complexity inefficiencies.
3. Code cleanliness and formatting adherence.
Grade the submission quality from 1 to 10. Format your review clearly using Markdown headings.`;

  try {
    const evaluation = await callLlm(systemPrompt, `Language: ${language}\n\nCode to review:\n\`\`\`\n${code}\n\`\`\``);
    res.status(200).json({ review: evaluation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Generate structured assignments based on course topic
exports.handleAssignmentGenerator = async (req, res) => {
  const { topic, difficulty } = req.body;

  const systemPrompt = `You are an educational designer. Generate a structured programming assignment on the topic: "${topic}".
Include:
1. A clear problem statement.
2. Concrete requirements/constraints.
3. Two input/output test cases.
4. Skeleton starter code setup.
Format the output using clear Markdown. Difficulty level: ${difficulty || 'Beginner'}.`;

  try {
    const assignment = await callLlm(systemPrompt, `Generate an assignment about: ${topic}`);
    res.status(200).json({ assignment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Generate exam-prep materials (Revision notes, quick summary sheets, flashcard pairs)
exports.handleRevisionNotes = async (req, res) => {
  const { subject } = req.body;

  const systemPrompt = `You are a dynamic exam-preparation helper. For the provided subject matter, output:
1. A one-page concise overview summary.
2. Five flashcard pairings formatted as "Q: ... | A: ...".
3. Three standard practice exam questions.
Maintain strict clarity and use Markdown formatting rules.`;

  try {
    const materials = await callLlm(systemPrompt, `Generate revision material for: ${subject}`);
    res.status(200).json({ revisionMaterials: materials });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};