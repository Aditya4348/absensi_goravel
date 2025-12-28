
import { GoogleGenAI, Type } from "@google/genai";
import { AttendanceRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAttendanceInsights = async (records: AttendanceRecord[], userName: string) => {
  try {
    const recordsString = JSON.stringify(records.map(r => ({
      date: r.date,
      checkIn: r.checkIn,
      checkOut: r.checkOut
    })));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this attendance data for ${userName} and provide a summary, a productivity score (0-100), and 3 actionable recommendations. Data: ${recordsString}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            productivityScore: { type: Type.NUMBER },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "productivityScore", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
};
