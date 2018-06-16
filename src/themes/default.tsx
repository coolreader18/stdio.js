import React from "react";

export default elem =>
  ({
    title: () => <h1 className="io-title">{elem.text}</h1>,
    textInput: () => (
      <label className="io-input-label">
        {elem.label || elem.name}:
        <input type="text" className="io-input" />
      </label>
    ),
    checkbox: () => ({
      elem: (
        <div className="io-checkbox-wrapper">
          {elem.options.map(cur => {
            if (typeof cur === "string") cur = { val: cur };
            return (
              <label className="io-checkbox-label">
                {cur.label || cur.val}:
                <input
                  type="checkbox"
                  className="io-checkbox"
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
        <div className="io-radio-wrapper">
          {elem.options.map(cur => {
            if (typeof cur === "string") cur = { val: cur };
            return (
              <label className="io-radio-label">
                {cur.label || cur.val}:
                <input
                  type="radio"
                  className="io-radio"
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
    output: () => <output className="io-output" />,
    heading: () => {
      const H = `h${elem.size}`;
      return <H className="io-heading">{elem.text}</H>;
    },
    text: () => <p className="io-text">{elem.text}</p>,
    canvas: () => ({
      elem: (
        <div className="io-canvas-wrapper">
          <canvas
            width={elem.width || ""}
            height={elem.height || ""}
            className="io-canvas"
          />
        </div>
      ),
      evt: "canvas"
    }),
    file: () => ({
      elem: (
        <div className="io-file-wrapper">
          <button className="io-file-button">Choose file</button>
          <span className="io-file-display" />
        </div>
      ),
      fileDragTo: null,
      fileDisplay: "span",
      fileButton: "button"
    }),
    button: () => ({
      elem: (
        <div className="io-button-wrapper">
          <button className="io-button">{elem.label || elem.name}</button>
        </div>
      ),
      evt: "button"
    }),
    switch: () => ({
      elem: (
        <div className="io-switch-wrapper">
          <label className="io-switch-label">
            {elem.label || elem.name}
            <input type="checkbox" className="io-switch" />
          </label>
        </div>
      )
    })
  }[elem.type]());

export const root = <div />;

export const styleUrl = [
  "./build/default.css",
  "./default.css",
  "https://cdn.jsdelivr.net/npm/stdio.js/build/default.css"
];
