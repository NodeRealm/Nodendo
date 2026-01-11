const componentTemplates = {
  button: {
    label: "Primary Button",
    html: "<button class=\"btn btn-primary\">Primary action</button>"
  },
  alert: {
    label: "Warning Alert",
    html: "<div class=\"alert alert-warning\" role=\"alert\">Heads up! This is an alert.</div>"
  },
  card: {
    label: "Card",
    html: "<div class=\"card\" style=\"max-width: 22rem;\"><div class=\"card-body\"><h5 class=\"card-title\">Card title</h5><p class=\"card-text\">Some quick example text to build on the card title.</p><a href=\"#\" class=\"btn btn-outline-primary\">Action</a></div></div>"
  },
  hero: {
    label: "Hero",
    html: "<section class=\"p-5 text-bg-dark rounded-3\"><div class=\"container\"><h1 class=\"display-6\">Hero headline</h1><p class=\"lead\">Use this area to highlight your main value proposition.</p><button class=\"btn btn-light\">Get started</button></div></section>"
  }
};

const canvas = document.getElementById("canvas");
const clearCanvasButton = document.getElementById("clearCanvas");
const exportButton = document.getElementById("exportHtml");
const exportOutput = document.getElementById("exportOutput");
const copyButton = document.getElementById("copyHtml");
const downloadButton = document.getElementById("downloadHtml");

const exportModal = new bootstrap.Modal(document.getElementById("exportModal"));

const createCanvasBlock = (type) => {
  const template = componentTemplates[type];
  const wrapper = document.createElement("div");
  wrapper.className = "canvas-block";
  wrapper.dataset.type = type;
  wrapper.innerHTML = `
    <div class="canvas-block__header">
      <span>${template.label}</span>
      <button class="btn btn-sm btn-outline-danger" type="button">Remove</button>
    </div>
    <div class="canvas-block__body">${template.html}</div>
  `;

  wrapper.querySelector("button").addEventListener("click", () => {
    wrapper.remove();
    togglePlaceholder();
  });

  return wrapper;
};

const togglePlaceholder = () => {
  const placeholder = canvas.querySelector(".canvas-placeholder");
  if (!placeholder) {
    return;
  }

  if (canvas.querySelectorAll(".canvas-block").length > 0) {
    placeholder.style.display = "none";
  } else {
    placeholder.style.display = "grid";
  }
};

const handleDrop = (event) => {
  event.preventDefault();
  canvas.classList.remove("is-dragging");

  const type = event.dataTransfer.getData("text/plain");
  if (!componentTemplates[type]) {
    return;
  }

  const block = createCanvasBlock(type);
  canvas.appendChild(block);
  togglePlaceholder();
};

const handleDragOver = (event) => {
  event.preventDefault();
  canvas.classList.add("is-dragging");
};

const handleDragLeave = () => {
  canvas.classList.remove("is-dragging");
};

const componentItems = document.querySelectorAll(".component-item");
componentItems.forEach((item) => {
  item.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", item.dataset.template);
  });
});

canvas.addEventListener("dragover", handleDragOver);
canvas.addEventListener("drop", handleDrop);
canvas.addEventListener("dragleave", handleDragLeave);

clearCanvasButton.addEventListener("click", () => {
  canvas.querySelectorAll(".canvas-block").forEach((block) => block.remove());
  togglePlaceholder();
});

const buildExportHtml = () => {
  const blocks = Array.from(canvas.querySelectorAll(".canvas-block__body"));
  const bodyContent = blocks.map((block) => block.innerHTML).join("\n\n");

  return `<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>Exported Bootstrap Layout</title>
    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" />
  </head>
  <body class=\"p-4\">
${bodyContent || "    <!-- No components were added. -->"}
  </body>
</html>`;
};

exportButton.addEventListener("click", () => {
  const html = buildExportHtml();
  exportOutput.value = html;
  exportModal.show();
});

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(exportOutput.value);
  copyButton.textContent = "Copied!";
  setTimeout(() => {
    copyButton.textContent = "Copy to clipboard";
  }, 1500);
});

downloadButton.addEventListener("click", () => {
  const blob = new Blob([exportOutput.value], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "bootstrap-layout.html";
  link.click();
  URL.revokeObjectURL(url);
});

togglePlaceholder();
