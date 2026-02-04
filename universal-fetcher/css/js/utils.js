function extractGoogleDocId(url) {
  const m = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : null;
}

function isGoogleDocs(url) {
  return url.includes("docs.google.com/document");
}

function isGitHub(url) {
  return url.includes("github.com");
}

function makeGitHubRaw(url) {
  return url
    .replace("github.com", "raw.githubusercontent.com")
    .replace("/blob/", "/");
}

function downloadBlob(content, filename) {
  const blob = new Blob([content], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
