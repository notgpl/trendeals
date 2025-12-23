import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fileName, fileBase64 } = req.body;

    if (!fileName || !fileBase64) {
      return res.status(400).json({ error: "Missing data" });
    }

    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;
    const path = process.env.GITHUB_IMAGES_PATH;

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}/${fileName}`;

    const githubRes = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json"
      },
      body: JSON.stringify({
        message: `Upload image ${fileName}`,
        content: fileBase64
      })
    });

    const data = await githubRes.json();

    if (!githubRes.ok) {
      return res.status(500).json(data);
    }

    const publicUrl = `https://raw.githubusercontent.com/${repo}/main/${path}/${fileName}`;

    res.status(200).json({ url: publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
