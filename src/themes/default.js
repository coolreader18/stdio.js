import jsx from "./jsx-factory";

export default elem =>
  ({
    title: () => <h1 class="io-title">{elem.text}</h1>,
    textInput: () => (
      <label class="io-input-label">
        {elem.label || elem.name}:
        <input type="text" class="io-input" />
      </label>
    ),
    checkbox: () => ({
      elem: (
        <div class="io-checkbox-wrapper">
          {elem.options.map(cur => {
            if (typeof cur === "string") cur = { val: cur };
            return (
              <label class="io-checkbox-label">
                {cur.label || cur.val}:
                <input
                  type="checkbox"
                  class="io-checkbox"
                  data-value={cur.val}
                />
              </label>
            );
          })}
        </div>
      ),
      evt: "input"
    }),
    radio: () => ({
      elem: (
        <div class="io-radio-wrapper">
          {elem.options.map(cur => {
            if (typeof cur === "string") cur = { val: cur };
            return (
              <label class="io-radio-label">
                {cur.label || cur.val}:
                <input
                  type="radio"
                  class="io-radio"
                  name={elem.name}
                  data-value={cur.val}
                />
              </label>
            );
          })}
        </div>
      ),
      evt: "input"
    }),
    output: () => <output class="io-output" />,
    heading: () =>
      jsx(`h${elem.size || 1}`, { class: "io-heading" }, elem.text),
    text: () => <p class="io-text">{elem.text}</p>,
    canvas: () => ({
      elem: (
        <div class="io-canvas-wrapper">
          <canvas
            width={elem.width || ""}
            height={elem.height || ""}
            class="io-canvas"
          />
        </div>
      ),
      evt: "canvas"
    }),
    file: () => ({
      elem: (
        <div class="io-file-wrapper">
          <button class="io-file-button">Choose file</button>
          <span class="io-file-display" />
        </div>
      ),
      fileDragTo: null,
      fileDisplay: "span",
      fileButton: "button"
    }),
    button: () => ({
      elem: (
        <div class="io-button-wrapper">
          <button class="io-button">{elem.label || elem.name}</button>
        </div>
      ),
      evt: "button"
    })
  }[elem.type]());

export const root = <div />;

export const styleUrl = [
  "./build/default.css",
  "./default.css",
  "https://cdn.jsdelivr.net/npm/stdio.js/build/default.css"
];
