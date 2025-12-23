export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fileName, fileBase64 } = req.body;

    if (!fileName || !fileBase64) {
      return res.status(400).json({ error: "Missing data" });
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const OWNER = "notgpl";
    const REPO = "trendeals";
    const PATH = `uploads/${fileName}`;

    const githubRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json"
        },
        body: JSON.stringify({
          message: "upload image",
          content: fileBase64
        })
      }
    );

    const data = await githubRes.json();

    if (!githubRes.ok) {
      return res.status(500).json({ error: data.message });
    }

    return res.status(200).json({
      url: data.content.download_url
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
