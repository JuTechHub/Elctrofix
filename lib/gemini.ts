class GeminiService {
  async chatWithElectrician(
    message: string,
    conversationHistory: Array<{ role: string; content: string }> = []
  ) {
    try {
      const response = await fetch("/api/ai-electrician", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.response;
    } catch (error) {
      console.error("Error calling AI electrician API:", error);
      throw new Error(
        "Failed to get response from AI electrician. Please try again."
      );
    }
  }

  async getSafetyTips() {
    try {
      const response = await fetch("/api/ai-electrician", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message:
            "As an expert electrician, provide 5 essential electrical safety tips for homeowners. Keep each tip concise and actionable.",
          conversationHistory: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.response;
    } catch (error) {
      console.error("Error getting safety tips:", error);
      throw new Error("Failed to get safety tips");
    }
  }
}

export default new GeminiService();
