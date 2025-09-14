import openai from './openaiClient';

/**
 * Generates an AI response for mental health conversations.
 * @param {string} userMessage - The user's input message.
 * @param {Object} emotionData - Current emotion detection data.
 * @param {Array} conversationHistory - Previous messages for context.
 * @returns {Promise<string>} The AI's response.
 */
export async function generateMentalHealthResponse(userMessage, emotionData = null, conversationHistory = []) {
  try {
    // Build conversation context
    const messages = [
      {
        role: 'system',
        content: `You are MindCare AI, a compassionate and professional mental health companion. You provide therapeutic support, emotional guidance, and practical coping strategies. Always be empathetic, non-judgmental, and encouraging.

Key Guidelines:
- Be warm, understanding, and supportive
- Validate emotions and experiences
- Provide practical coping strategies when appropriate
- If someone expresses suicidal thoughts or immediate danger, direct them to emergency services
- Use person-first language and avoid clinical diagnoses
- Keep responses conversational but professional
- Encourage healthy behaviors and self-care

Current emotion detected: ${emotionData?.type || 'unknown'} (confidence: ${Math.round((emotionData?.confidence || 0) * 100)}%)`
      }
    ];

    // Add conversation history (last 6 messages for context)
    const recentHistory = conversationHistory?.slice(-6) || [];
    recentHistory?.forEach(msg => {
      messages?.push({
        role: msg?.isUser ? 'user' : 'assistant',
        content: msg?.content
      });
    });

    // Add current user message
    messages?.push({
      role: 'user',
      content: userMessage
    });

    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    return response?.choices?.[0]?.message?.content || 'I apologize, but I\'m having trouble processing your message right now. Please try again.';
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback responses based on emotion
    const fallbackResponses = {
      anxious: "I can sense you're feeling anxious right now. That's completely understandable. Try taking slow, deep breaths - in for 4 counts, hold for 4, out for 4. Would you like to talk about what's making you feel this way?",
      sad: "I can hear the sadness in your words, and I want you to know that it's okay to feel this way. Your feelings are valid. Sometimes it helps to express these feelings rather than keeping them bottled up. I'm here to listen.",
      stressed: "I can sense the stress you're experiencing. Stress is your body's natural response to challenging situations. Let's break this down - what are the main sources of stress in your life right now?",
      happy: "It\'s wonderful to hear the positivity in your message! These moments of joy are so important for our overall well-being. What\'s been bringing you happiness lately?",
      default: "Thank you for sharing that with me. I'm here to listen and support you through whatever you're experiencing. Your feelings and thoughts are valid, and this is a safe space for you to express them."
    };

    const emotionType = emotionData?.type || 'default';
    return fallbackResponses?.[emotionType] || fallbackResponses?.default;
  }
}

/**
 * Analyzes emotional content in text.
 * @param {string} text - The text to analyze.
 * @returns {Promise<Object>} Emotion analysis results.
 */
export async function analyzeEmotionalContent(text) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an emotion analysis expert. Analyze the emotional content of the text and respond with a JSON object containing: emotion (primary emotion), confidence (0-1), intensity (low/medium/high), and supportive_keywords (array of emotional keywords found).'
        },
        {
          role: 'user',
          content: `Analyze the emotional content of this text: "${text}"`
        }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'emotion_analysis',
          schema: {
            type: 'object',
            properties: {
              emotion: { type: 'string' },
              confidence: { type: 'number', minimum: 0, maximum: 1 },
              intensity: { type: 'string', enum: ['low', 'medium', 'high'] },
              supportive_keywords: { type: 'array', items: { type: 'string' } }
            },
            required: ['emotion', 'confidence', 'intensity', 'supportive_keywords'],
            additionalProperties: false
          }
        }
      }
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error analyzing emotional content:', error);
    return {
      emotion: 'neutral',
      confidence: 0.5,
      intensity: 'medium',
      supportive_keywords: []
    };
  }
}