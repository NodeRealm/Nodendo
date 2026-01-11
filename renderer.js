const blockTemplates = {
  section: {
    label: "Section",
    zones: 1,
    editorHtml: "<section class=\"container py-5\" data-role=\"section\"><div class=\"pack-dropzone\" data-pack-zone><div class=\"pack-placeholder\">Drop packs here</div></div></section>",
    exportHtml: "<section class=\"container py-5\">{{zone0}}</section>"
  },
  "row-2": {
    label: "Row (2 columns)",
    zones: 2,
    editorHtml: "<section class=\"container py-4\" data-role=\"row\"><div class=\"row g-4\"><div class=\"col-md-6\"><div class=\"pack-dropzone\" data-pack-zone><div class=\"pack-placeholder\">Drop packs here</div></div></div><div class=\"col-md-6\"><div class=\"pack-dropzone\" data-pack-zone><div class=\"pack-placeholder\">Drop packs here</div></div></div></div></section>",
    exportHtml: "<section class=\"container py-4\"><div class=\"row g-4\"><div class=\"col-md-6\">{{zone0}}</div><div class=\"col-md-6\">{{zone1}}</div></div></section>"
  }
};

const packTemplates = {
  hero: {
    label: "Hero",
    html: "<div class=\"p-5 text-bg-dark rounded-4\"><h1 class=\"display-6\" data-editable=\"true\">Hero headline</h1><p class=\"lead\" data-editable=\"true\">Use this area to highlight your main value proposition.</p><button class=\"btn btn-light\" data-editable=\"true\">Get started</button></div>"
  },
  navbar: {
    label: "Navbar",
    html: "<nav class=\"navbar navbar-expand-lg navbar-dark bg-dark rounded-3\"><div class=\"container-fluid\"><a class=\"navbar-brand\" href=\"#\" data-editable=\"true\">Brand</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#navMenu\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse\" id=\"navMenu\"><ul class=\"navbar-nav ms-auto\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#\" data-editable=\"true\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#\" data-editable=\"true\">Features</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#\" data-editable=\"true\">Pricing</a></li></ul><div class=\"btn-group ms-lg-3 mt-3 mt-lg-0\" role=\"group\" aria-label=\"Theme\"><button class=\"btn btn-sm btn-outline-light\" data-theme=\"dark\">Dark</button><button class=\"btn btn-sm btn-outline-light\" data-theme=\"light\">Light</button></div></div></div></nav>"
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
    html: "<div><h3 data-editable=\"true\">Section title</h3><p data-editable=\"true\">Add descriptive text here.</p></div>"
  },
  image: {
    label: "Image",
    html: "<figure><img src=\"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop\" alt=\"Placeholder\" class=\"img-fluid rounded-3\" /><figcaption class=\"text-secondary mt-2\" data-editable=\"true\">Image caption</figcaption></figure>"
  },
  footer: {
    label: "Footer",
    html: "<footer class=\"py-4 border-top\"><div class=\"row\"><div class=\"col-md-6\"><h5 data-editable=\"true\">Your company</h5><p class=\"text-secondary\" data-editable=\"true\">Short footer description.</p></div><div class=\"col-md-6 text-md-end\"><a href=\"#\" class=\"text-secondary me-3\" data-editable=\"true\">Privacy</a><a href=\"#\" class=\"text-secondary\" data-editable=\"true\">Terms</a></div></div></footer>"
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
let activeTheme = document.body.dataset.theme || "dark";

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

const togglePackPlaceholder = (zone) => {
  const placeholder = zone.querySelector(".pack-placeholder");
  if (!placeholder) {
    return;
  }
  const hasPack = zone.querySelectorAll(".pack-item").length > 0;
  placeholder.style.display = hasPack ? "none" : "block";
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

const enableEditableText = (element) => {
  element.querySelectorAll("[data-editable]").forEach((node) => {
    node.setAttribute("contenteditable", "true");
    node.addEventListener("focus", () => {
      const block = node.closest(".canvas-block");
      if (block) {
        setSelectedBlock(block);
      }
    });
  });
};

const createCanvasBlock = (type) => {
  const template = blockTemplates[type];
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
    <div class="canvas-block__body">${template.editorHtml}</div>
  `;

  wrapper.querySelectorAll("[data-pack-zone]").forEach((zone, index) => {
    zone.dataset.zoneIndex = String(index);
    togglePackPlaceholder(zone);
  });

  wrapper.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) {
      event.preventDefault();
    }
    setSelectedBlock(wrapper);
  });

  wrapper.addEventListener("dragstart", (event) => {
    setDragPayload(event, { kind: "move-block", id: wrapper.dataset.id });
    event.dataTransfer.effectAllowed = "move";
    wrapper.classList.add("is-dragging");
  });

  wrapper.addEventListener("dragend", () => {
    wrapper.classList.remove("is-dragging");
  });

  wrapper.dataset.id = crypto.randomUUID();

  return wrapper;
};

const createPackItem = (type, htmlOverride) => {
  const template = packTemplates[type];
  const wrapper = document.createElement("div");
  wrapper.className = "pack-item";
  wrapper.dataset.type = type;
  wrapper.dataset.label = template.label;
  wrapper.draggable = true;
  wrapper.innerHTML = `
    <div class="pack-item__header">
      <span>${template.label}</span>
      <button class="btn btn-sm btn-outline-danger" type="button">Remove</button>
    </div>
    <div class="pack-item__body">${htmlOverride ?? template.html}</div>
  `;

  enableEditableText(wrapper);

  wrapper.querySelector("button").addEventListener("click", () => {
    const zone = wrapper.closest(".pack-dropzone");
    wrapper.remove();
    if (zone) {
      togglePackPlaceholder(zone);
    }
  });

  wrapper.addEventListener("dragstart", (event) => {
    setDragPayload(event, { kind: "move-pack", id: wrapper.dataset.id });
    event.dataTransfer.effectAllowed = "move";
    wrapper.classList.add("is-dragging");
  });

  wrapper.addEventListener("dragend", () => {
    wrapper.classList.remove("is-dragging");
  });

  wrapper.dataset.id = crypto.randomUUID();

  return wrapper;
};

const setDragPayload = (event, payload) => {
  event.dataTransfer.setData("application/x-nodendo", JSON.stringify(payload));
};

const getDragPayload = (event) => {
  const raw = event.dataTransfer.getData("application/x-nodendo");
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
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

const insertPackAtPosition = (zone, pack, y) => {
  const packs = [...zone.querySelectorAll(".pack-item")].filter(
    (item) => item !== pack
  );
  const insertBefore = packs.find((item) => {
    const rect = item.getBoundingClientRect();
    return y < rect.top + rect.height / 2;
  });

  if (insertBefore) {
    zone.insertBefore(pack, insertBefore);
  } else {
    zone.appendChild(pack);
  }

  togglePackPlaceholder(zone);
};

const handleCanvasDrop = (event) => {
  event.preventDefault();
  canvas.classList.remove("is-dragging");

  const payload = getDragPayload(event);
  if (!payload) {
    return;
  }

  if (payload.kind === "new" && payload.group === "block") {
    const block = createCanvasBlock(payload.type);
    insertBlockAtPosition(block, event.clientY);
    togglePlaceholder();
    setSelectedBlock(block);
    return;
  }

  if (payload.kind === "move-block") {
    const movingBlock = canvas.querySelector(`[data-id="${payload.id}"]`);
    if (movingBlock) {
      insertBlockAtPosition(movingBlock, event.clientY);
    }
  }
};

const handlePackDrop = (event, zone) => {
  event.preventDefault();
  zone.classList.remove("is-dragging");

  const payload = getDragPayload(event);
  if (!payload) {
    return;
  }

  if (payload.kind === "new" && payload.group === "pack") {
    const pack = createPackItem(payload.type);
    insertPackAtPosition(zone, pack, event.clientY);
    return;
  }

  if (payload.kind === "move-pack") {
    const movingPack = document.querySelector(`[data-id="${payload.id}"]`);
    if (movingPack) {
      insertPackAtPosition(zone, movingPack, event.clientY);
    }
  }
};

const handleDragOver = (event) => {
  const zone = event.target.closest(".pack-dropzone");
  if (zone) {
    event.preventDefault();
    zone.classList.add("is-dragging");
    return;
  }
  event.preventDefault();
  canvas.classList.add("is-dragging");
};

const handleDragLeave = (event) => {
  const zone = event.target.closest(".pack-dropzone");
  if (zone) {
    zone.classList.remove("is-dragging");
    return;
  }
  canvas.classList.remove("is-dragging");
};

const componentItems = document.querySelectorAll(".component-item");
componentItems.forEach((item) => {
  item.addEventListener("dragstart", (event) => {
    setDragPayload(event, {
      kind: "new",
      group: item.dataset.group,
      type: item.dataset.template
    });
  });
});

canvas.addEventListener("dragover", handleDragOver);
canvas.addEventListener("drop", (event) => {
  const zone = event.target.closest(".pack-dropzone");
  if (zone) {
    handlePackDrop(event, zone);
    return;
  }
  handleCanvasDrop(event);
});
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
  const duplicate = createCanvasBlock(selectedBlock.dataset.type);
  applyBackground(duplicate, selectedBlock.dataset.background || "none");

  const sourceZones = selectedBlock.querySelectorAll("[data-pack-zone]");
  const targetZones = duplicate.querySelectorAll("[data-pack-zone]");

  sourceZones.forEach((zone, index) => {
    const targetZone = targetZones[index];
    if (!targetZone) {
      return;
    }
    zone.querySelectorAll(".pack-item").forEach((pack) => {
      const copiedPack = createPackItem(
        pack.dataset.type,
        pack.querySelector(".pack-item__body").innerHTML
      );
      targetZone.appendChild(copiedPack);
    });
    togglePackPlaceholder(targetZone);
  });

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

const setTheme = (theme) => {
  activeTheme = theme;
  document.body.dataset.theme = theme;
  document.querySelectorAll("[data-theme]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
};

document.body.addEventListener("click", (event) => {
  const themeButton = event.target.closest("[data-theme]");
  if (!themeButton) {
    return;
  }
  setTheme(themeButton.dataset.theme);
});

customCssInput.addEventListener("input", () => {
  customCssInput.dataset.dirty = "true";
});

const getProjectData = () => {
  const blocks = Array.from(canvas.querySelectorAll(".canvas-block")).map(
    (block) => ({
      type: block.dataset.type,
      label: block.dataset.label,
      background: block.dataset.background || "none",
      zones: Array.from(block.querySelectorAll("[data-pack-zone]")).map(
        (zone) => ({
          packs: Array.from(zone.querySelectorAll(".pack-item")).map((pack) => ({
            type: pack.dataset.type,
            label: pack.dataset.label,
            html: pack.querySelector(".pack-item__body").innerHTML
          }))
        })
      )
    })
  );

  return {
    version: 4,
    theme: document.body.dataset.theme || "dark",
    customCss: customCssInput.value,
    blocks
  };
};

const buildExportHtml = () => {
  const project = getProjectData();
  const customCss = project.customCss.trim();
  const styleTag = customCss ? `\n    <style>\n${customCss}\n    </style>` : "";

  const blocksMarkup = project.blocks
    .map((block) => {
      const template = blockTemplates[block.type];
      if (!template) {
        return "";
      }
      let html = template.exportHtml;
      block.zones.forEach((zone, index) => {
        const zoneHtml = zone.packs.map((pack) => pack.html).join("\n");
        html = html.replace(`{{zone${index}}}`, zoneHtml);
      });
      return html;
    })
    .join("\n\n");

  const themeScript = `
    <script>
      const setTheme = (theme) => {
        document.body.dataset.theme = theme;
        document.querySelectorAll('[data-theme]').forEach((btn) => {
          btn.classList.toggle('active', btn.dataset.theme === theme);
        });
      };
      document.addEventListener('click', (event) => {
        const button = event.target.closest('[data-theme]');
        if (!button) return;
        setTheme(button.dataset.theme);
      });
      setTheme('${project.theme}');
    </script>`;

  return `<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"UTF-8\" />
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
    <title>Exported Bootstrap Layout</title>
    <link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" />
    <style>
      body[data-theme="dark"] { background: #0b1220; color: #f8fafc; }
      body[data-theme="light"] { background: #f8fafc; color: #0f172a; }
      .theme-toggle .btn.active { background: #38bdf8; color: #0f172a; border-color: #38bdf8; }
    </style>${styleTag}
  </head>
  <body data-theme=\"${project.theme}\" class=\"p-4\">
    <div class=\"d-flex justify-content-end gap-2 mb-4 theme-toggle\">
      <button class=\"btn btn-outline-secondary btn-sm\" data-theme=\"dark\">Dark</button>
      <button class=\"btn btn-outline-secondary btn-sm\" data-theme=\"light\">Light</button>
    </div>
${blocksMarkup || "    <!-- No blocks were added. -->"}
    ${themeScript}
  </body>
</html>`;
};

const serializeProject = () => {
  return JSON.stringify(getProjectData(), null, 2);
};

const loadProject = (data) => {
  canvas.querySelectorAll(".canvas-block").forEach((block) => block.remove());
  data.blocks.forEach((block) => {
    const newBlock = createCanvasBlock(block.type);
    applyBackground(newBlock, block.background || "none");
    const zones = newBlock.querySelectorAll("[data-pack-zone]");
    block.zones.forEach((zone, index) => {
      const targetZone = zones[index];
      if (!targetZone) {
        return;
      }
      zone.packs.forEach((pack) => {
        const packItem = createPackItem(pack.type, pack.html);
        targetZone.appendChild(packItem);
      });
      togglePackPlaceholder(targetZone);
    });
    canvas.appendChild(newBlock);
  });
  customCssInput.value = data.customCss || "";
  const theme = data.theme || "dark";
  setTheme(theme);
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
setTheme(activeTheme);
