export const astroKnowledge = {
  systemPrompt: `You are an expert astrologer specializing in personalized readings and compatibility analysis. 
  You provide insightful, accurate, and personalized astrological guidance based on birth chart data.
  
  Key principles:
  - Always consider the person's birth chart data when available
  - Provide specific, actionable insights rather than vague generalizations
  - Explain astrological concepts in an accessible way
  - Be supportive and encouraging while being honest about challenges
  - Focus on personal growth and understanding`,

  compatibility: {
    sameSign:
      "When two people share the same sign, they often have an intuitive understanding of each other's motivations and reactions. This creates a strong foundation of empathy, but can also amplify both positive and negative traits.",

    sameElement: {
      fire: "Fire signs (Aries, Leo, Sagittarius) together create dynamic, passionate relationships with lots of energy and enthusiasm, but may sometimes clash due to competing egos.",
      earth:
        "Earth signs (Taurus, Virgo, Capricorn) together build stable, practical relationships focused on security and long-term goals, though they may sometimes lack spontaneity.",
      air: "Air signs (Gemini, Libra, Aquarius) together enjoy intellectual connection, communication, and social activities, but may struggle with emotional depth.",
      water:
        "Water signs (Cancer, Scorpio, Pisces) together share deep emotional understanding and intuition, but may become overwhelmed by intensity.",
    },

    complementaryElements: {
      fireAir:
        "Fire and Air signs energize each other - Air feeds Fire's passion while Fire inspires Air's ideas into action.",
      earthWater:
        "Earth and Water signs nurture each other - Earth provides stability for Water's emotions while Water softens Earth's rigidity.",
    },
  },

  positions: {
    sun: "The Sun sign represents your core identity, ego, and life purpose. It's how you express your essential self and what drives you at the deepest level.",
    moon: "The Moon sign governs your emotional nature, subconscious reactions, and emotional needs. It's how you process feelings and what makes you feel secure.",
    ascendant:
      "The Ascendant (Rising sign) is your outward personality, how others first perceive you, and your approach to new situations.",
  },

  signs: {
    aries:
      "Independent, pioneering, energetic, and direct. Natural leaders who initiate action.",
    taurus:
      "Steady, practical, sensual, and determined. Values security and consistency.",
    gemini:
      "Curious, adaptable, communicative, and versatile. Thrives on variety and connection.",
    cancer:
      "Intuitive, nurturing, protective, and emotional. Values home and family.",
    leo: "Confident, creative, generous, and dramatic. Natural performers who seek recognition.",
    virgo:
      "Analytical, helpful, perfectionist, and practical. Focused on improvement and service.",
    libra:
      "Diplomatic, harmonious, artistic, and social. Seeks balance and partnership.",
    scorpio:
      "Intense, transformative, mysterious, and powerful. Seeks depth and authenticity.",
    sagittarius:
      "Adventurous, philosophical, optimistic, and freedom-loving. Seeks truth and expansion.",
    capricorn:
      "Ambitious, disciplined, responsible, and traditional. Focused on achievement and status.",
    aquarius:
      "Independent, innovative, humanitarian, and unconventional. Values uniqueness and progress.",
    pisces:
      "Compassionate, intuitive, artistic, and spiritual. Deeply empathetic and imaginative.",
  },
};
