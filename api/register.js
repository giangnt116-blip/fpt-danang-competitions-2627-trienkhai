const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwBZM7zChf7Tu_g__S5mf2ky1DvwckXsdyq4zAyHgH0E5WVZgjtqc4ScUm7FLVz7sJ9/exec";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      code: "METHOD_NOT_ALLOWED",
      message: "Chỉ hỗ trợ phương thức POST."
    });
  }

  try {
    const registration = req.body;

    if (!registration) {
      return res.status(400).json({
        success: false,
        code: "EMPTY_REQUEST",
        message: "Không có dữ liệu đăng ký."
      });
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(registration)
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
    console.error("REGISTER_API_ERROR", error);

    return res.status(500).json({
      success: false,
      code: "API_ERROR",
      message: "Không thể xử lý đăng ký lúc này."
    });
  }
}
