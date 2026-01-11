const componentTemplates = {
  section: {
    label: "Section",
    html: "<section class=\"container py-5\" data-role=\"section\"><div class=\"row\"><div class=\"col-lg-8\"><h2 data-editable=\"true\">Section heading</h2><p class=\"lead\" data-editable=\"true\">Use this section for a key message.</p></div></div></section>"
  },
  "row-2": {
    label: "Row (2 columns)",
    html: "<section class=\"container py-4\" data-role=\"row\"><div class=\"row g-4\"><div class=\"col-md-6\"><h3 data-editable=\"true\">Left column</h3><p data-editable=\"true\">Add your copy here.</p></div><div class=\"col-md-6\"><h3 data-editable=\"true\">Right column</h3><p data-editable=\"true\">Add your copy here.</p></div></div></section>"
  },
  hero: {
    label: "Hero",
    html: "<section class=\"container py-5\" data-role=\"hero\"><div class=\"p-5 text-bg-dark rounded-4\"><h1 class=\"display-6\" data-editable=\"true\">Hero headline</h1><p class=\"lead\" data-editable=\"true\">Use this area to highlight your main value proposition.</p><button class=\"btn btn-light\" data-editable=\"true\">Get started</button></div></section>"
  },
  navbar: {
    label: "Navbar",
    html: "<nav class=\"navbar navbar-expand-lg navbar-dark bg-dark rounded-3\" data-role=\"navbar\"><div class=\"container-fluid\"><a class=\"navbar-brand\" href=\"#\" data-editable=\"true\">Brand</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#navMenu\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse\" id=\"navMenu\"><ul class=\"navbar-nav ms-auto\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#\" data-editable=\"true\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#\" data-editable=\"true\">Features</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#\" data-editable=\"true\">Pricing</a></li></ul></div></div></nav>"
  },
  card: {
    label: "Card",
    html: "<div class=\"card\" style=\"max-width: 22rem;\"><div class=\"card-body\"><h5 class=\"card-title\" data-editable=\"true\">Card title</h5><p class=\"card-text\" data-editable=\"true\">Some quick example text to build on the card title.</p><a href=\"#\" class=\"btn btn-outline-primary\" data-editable=\"true\">Action</a></div></div>"
  },
  button: {
    label: "Primary Button",
    html: "<button class=\"btn btn-primary\" data-editable=\"true\">Primary action</button>"
  },
  alert: {
    label: "Warning Alert",
    html: "<div class=\"alert alert-warning\" role=\"alert\" data-editable=\"true\">Heads up! This is an alert.</div>"
  },
  text: {
    label: "Text",
    html: "<div class=\"container\"><h3 data-editable=\"true\">Section title</h3><p data-editable=\"true\">Add descriptive text here.</p></div>"
  },
  image: {
    label: "Image",
    html: "<figure class=\"container\"><img src=\"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop\" alt=\"Placeholder\" class=\"img-fluid rounded-3\" /><figcaption class=\"text-secondary mt-2\" data-editable=\"true\">Image caption</figcaption></figure>"
  },
  footer: {
    label: "Footer",
    html: "<footer class=\"container py-4 border-top\" data-role=\"footer\"><div class=\"row\"><div class=\"col-md-6\"><h5 data-editable=\"true\">Your company</h5><p class=\"text-secondary\" data-editable=\"true\">Short footer description.</p></div><div class=\"col-md-6 text-md-end\"><a href=\"#\" class=\"text-secondary me-3\" data-editable=\"true\">Privacy</a><a href=\"#\" class=\"text-secondary\" data-editable=\"true\">Terms</a></div></div></footer>"
  }
};

const canvas = document.getElementById("canvas");
const clearCanvasButton = document.getElementById("clearCanvas");
const exportButton = document.getElementById("exportHtml");
const exportOutput = document.getElementById("exportOutput");
const copyButton = document.getElementById("copyHtml");
const downloadButton = document.getElementById("downloadHtml");
const downloadProjectButton = document.getElementById("downloadProject");
const importButton = document.getElementById("importProject");
const importInput = document.getElementById("importInput");
const previewButtons = document.querySelectorAll("[data-preview]");
const themeButtons = document.querySelectorAll("[data-theme]");
const customCssInput = document.getElementById("customCss");

const inspectorEmpty = document.getElementById("inspectorEmpty");
const inspectorDetails = document.getElementById("inspectorDetails");
const selectedLabel = document.getElementById("selectedLabel");
const backgroundSelect = document.getElementById("backgroundSelect");
const duplicateButton = document.getElementById("duplicateBlock");
const moveUpButton = document.getElementById("moveUp");
const moveDownButton = document.getElementById("moveDown");
const deleteButton = document.getElementById("deleteBlock");

const exportModal = new bootstrap.Modal(document.getElementById("exportModal"));

let selectedBlock = null;

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

const setSelectedBlock = (block) => {
  canvas.querySelectorAll(".canvas-block").forEach((item) => {
    item.classList.toggle("is-selected", item === block);
  });

  selectedBlock = block;

  if (!block) {
    inspectorEmpty.hidden = false;
    inspectorDetails.hidden = true;
    return;
  }

  inspectorEmpty.hidden = true;
  inspectorDetails.hidden = false;
  selectedLabel.textContent = block.dataset.label;
  backgroundSelect.value = block.dataset.background || "none";
};

const applyBackground = (block, value) => {
  block.dataset.background = value;
  block.classList.remove("bg-light", "bg-dark", "bg-accent");
  if (value === "light") {
    block.classList.add("bg-light");
  }
  if (value === "dark") {
    block.classList.add("bg-dark");
  }
  if (value === "accent") {
    block.classList.add("bg-accent");
  }
};

const enableEditableText = (block) => {
  block.querySelectorAll("[data-editable]").forEach((node) => {
    node.setAttribute("contenteditable", "true");
    node.addEventListener("focus", () => setSelectedBlock(block));
  });
};

const createCanvasBlock = (type, htmlOverride) => {
  const template = componentTemplates[type];
  const wrapper = document.createElement("div");
  wrapper.className = "canvas-block";
  wrapper.dataset.type = type;
  wrapper.dataset.label = template.label;
  wrapper.draggable = true;
  wrapper.innerHTML = `
    <div class="canvas-block__header" data-drag-handle>
      <span>${template.label}</span>
      <span class="canvas-block__meta">Drag to reorder</span>
    </div>
    <div class="canvas-block__body">${htmlOverride ?? template.html}</div>
  `;

  enableEditableText(wrapper);

  wrapper.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) {
      event.preventDefault();
    }
    setSelectedBlock(wrapper);
  });

  wrapper.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", wrapper.dataset.id);
    event.dataTransfer.effectAllowed = "move";
    wrapper.classList.add("is-dragging");
  });

  wrapper.addEventListener("dragend", () => {
    wrapper.classList.remove("is-dragging");
  });

  wrapper.dataset.id = crypto.randomUUID();

  return wrapper;
};

const handleDrop = (event) => {
  event.preventDefault();
  canvas.classList.remove("is-dragging");

  const type = event.dataTransfer.getData("text/plain");
  if (componentTemplates[type]) {
    const block = createCanvasBlock(type);
    insertBlockAtPosition(block, event.clientY);
    togglePlaceholder();
    setSelectedBlock(block);
    return;
  }

  const blockId = event.dataTransfer.getData("text/plain");
  const movingBlock = canvas.querySelector(`[data-id="${blockId}"]`);
  if (movingBlock) {
    insertBlockAtPosition(movingBlock, event.clientY);
  }
};

const insertBlockAtPosition = (block, y) => {
  const blocks = [...canvas.querySelectorAll(".canvas-block")].filter(
    (item) => item !== block
  );
  const insertBefore = blocks.find((item) => {
    const rect = item.getBoundingClientRect();
    return y < rect.top + rect.height / 2;
  });

  if (insertBefore) {
    canvas.insertBefore(block, insertBefore);
  } else {
    canvas.appendChild(block);
  }
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
  setSelectedBlock(null);
  togglePlaceholder();
});

backgroundSelect.addEventListener("change", (event) => {
  if (selectedBlock) {
    applyBackground(selectedBlock, event.target.value);
  }
});

duplicateButton.addEventListener("click", () => {
  if (!selectedBlock) {
    return;
  }
  const duplicate = createCanvasBlock(
    selectedBlock.dataset.type,
    selectedBlock.querySelector(".canvas-block__body").innerHTML
  );
  applyBackground(duplicate, selectedBlock.dataset.background || "none");
  selectedBlock.after(duplicate);
  setSelectedBlock(duplicate);
  togglePlaceholder();
});

moveUpButton.addEventListener("click", () => {
  if (!selectedBlock) {
    return;
  }
  const previous = selectedBlock.previousElementSibling;
  if (previous && previous.classList.contains("canvas-block")) {
    previous.before(selectedBlock);
  }
});

moveDownButton.addEventListener("click", () => {
  if (!selectedBlock) {
    return;
  }
  const next = selectedBlock.nextElementSibling;
  if (next && next.classList.contains("canvas-block")) {
    next.after(selectedBlock);
  }
});

deleteButton.addEventListener("click", () => {
  if (!selectedBlock) {
    return;
  }
  selectedBlock.remove();
  setSelectedBlock(null);
  togglePlaceholder();
});

previewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    previewButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    canvas.dataset.preview = button.dataset.preview;
  });
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    themeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    document.body.dataset.theme = theme;
  });
});

customCssInput.addEventListener("input", () => {
  customCssInput.dataset.dirty = "true";
});

const buildExportHtml = () => {
  const blocks = Array.from(canvas.querySelectorAll(".canvas-block__body"));
  const bodyContent = blocks.map((block) => block.innerHTML).join("\n\n");
  const customCss = customCssInput.value.trim();
  const styleTag = customCss ? `\n    <style>\n${customCss}\n    </style>` : "";

  return `<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>Exported Bootstrap Layout</title>
    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" />${styleTag}
  </head>
  <body class=\"p-4\">
${bodyContent || "    <!-- No components were added. -->"}
  </body>
</html>`;
};

const serializeProject = () => {
  return JSON.stringify({
    version: 3,
    theme: document.body.dataset.theme || "dark",
    customCss: customCssInput.value,
    blocks: Array.from(canvas.querySelectorAll(".canvas-block")).map((block) => ({
      type: block.dataset.type,
      label: block.dataset.label,
      background: block.dataset.background || "none",
      html: block.querySelector(".canvas-block__body").innerHTML
    }))
  }, null, 2);
};

const loadProject = (data) => {
  canvas.querySelectorAll(".canvas-block").forEach((block) => block.remove());
  data.blocks.forEach((block) => {
    const newBlock = createCanvasBlock(block.type, block.html);
    applyBackground(newBlock, block.background || "none");
    canvas.appendChild(newBlock);
  });
  customCssInput.value = data.customCss || "";
  const theme = data.theme || "dark";
  document.body.dataset.theme = theme;
  themeButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
  togglePlaceholder();
  setSelectedBlock(null);
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

downloadProjectButton.addEventListener("click", () => {
  const blob = new Blob([serializeProject()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nodendo-project.json";
  link.click();
  URL.revokeObjectURL(url);
});

importButton.addEventListener("click", () => {
  importInput.click();
});

importInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.blocks) {
        throw new Error("Invalid project file");
      }
      loadProject(data);
    } catch (error) {
      alert("Unable to load project file.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
});

togglePlaceholder();
if (themeButtons.length) {
  themeButtons[0].classList.add("active");
}
