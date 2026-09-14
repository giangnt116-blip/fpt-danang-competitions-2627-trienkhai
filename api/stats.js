const APPS_SCRIPT_STATS_URL =
  "https://script.google.com/macros/s/AKfycbwBZM7zChf7Tu_g__S5mf2ky1DvwckXsdyq4zAyHgH0E5WVZgjtqc4ScUm7FLVz7sJ9/exec?action=public-stats";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      code: "METHOD_NOT_ALLOWED",
      message: "Chỉ hỗ trợ phương thức GET."
    });
  }

  try {
    const response = await fetch(APPS_SCRIPT_STATS_URL, {
      method: "GET"
    });

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Apps Script không trả về JSON hợp lệ.");
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("STATS_API_ERROR", error);

    return res.status(500).json({
      success: false,
      code: "STATS_API_ERROR",
      message: "Không thể tải thống kê lúc này."
    });
  }
}
