const proxies = [
  url => url,
  url => "https://api.allorigins.win/raw?url=" + encodeURIComponent(url),
  url => "https://corsproxy.io/?" + encodeURIComponent(url),
];

async function tryFetch(url) {
  for (let make of proxies) {
    try {
      const res = await fetch(make(url));
      if (res.ok) return await res.text();
    } catch {}
  }
  throw new Error("All fetch methods failed");
}

async function fetchContent() {
  const input = document.getElementById("urlInput").value.trim();
  const output = document.getElementById("output");
  const format = document.getElementById("format").value;

  if (!input) return alert("Paste a URL");

  output.value = "Fetching...";

  try {
    let finalUrl = input;

    // Google Docs handling
    if (isGoogleDocs(input)) {
      const id = extractGoogleDocId(input);
      if (!id) throw new Error("Invalid Google Docs URL");

      if (format === "pdf") {
        window.open(
          `https://docs.google.com/document/d/${id}/export?format=pdf`
        );
        output.value = "PDF opened in new tab.";
        return;
      }

      const f = format === "html" ? "html" : "txt";
      finalUrl = `https://docs.google.com/document/d/${id}/export?format=${f}`;
    }

    // GitHub handling
    if (isGitHub(input) && input.includes("/blob/")) {
      finalUrl = makeGitHubRaw(input);
    }

    const data = await tryFetch(finalUrl);
    output.value = data;

  } catch (err) {
    output.value =
      "FAILED TO FETCH\n\n" +
      "Possible reasons:\n" +
      "- Private content\n" +
      "- Login required\n" +
      "- Cloudflare protection\n\n" +
      err;
  }
}

function copyOutput() {
  const out = document.getElementById("output");
  out.select();
  document.execCommand("copy");
  alert("Copied!");
}

function downloadFile(type) {
  const content = document.getElementById("output").value;
  if (!content) return;

  const ext = type === "html" ? "html" : "txt";
  downloadBlob(content, `fetched.${ext}`);
               }
