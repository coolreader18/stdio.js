import React from "react";

export default elem =>
  ({
    title: () => (
      <div className="Subhead">
        <div className="Subhead-heading">{elem.text}</div>
      </div>
    ),
    textInput: () => ({
      elem: (
        <dl className="form-group">
          <dt>
            <label>{elem.label || elem.name}</label>
          </dt>
          <dd>
            <input
              type="text"
              className="form-control"
              placeholder={elem.placeholder || ""}
            />
          </dd>
        </dl>
      ),
      evt: "input"
    }),
    checkbox: type => ({
      elem: (
        <dl>
          <dt>
            <label>{elem.label || elem.name}</label>
          </dt>
          <dd>
            {elem.options.map(cur => {
              if (typeof cur === "string") cur = { val: cur };
              return (
                <div className="form-checkbox">
                  <label>
                    <input type="checkbox" data-value={cur.val} />
                    {cur.label || cur.val}
                  </label>
                </div>
              );
            })}
          </dd>
        </dl>
      ),
      evt: "input"
    }),
    radio: () => ({
      elem: (
        <dl>
          <dt>
            <label>{elem.label || elem.name}</label>
          </dt>
          <dd>
            {elem.options.map(cur => {
              if (typeof cur === "string") cur = { val: cur };
              return (
                <div className="form-checkbox">
                  <label className="">
                    <input type="radio" name={elem.name} data-value={cur.val} />
                    {cur.label || cur.val}
                  </label>
                </div>
              );
            })}
          </dd>
        </dl>
      ),
      evt: "input"
    }),
    output: () => ({
      elem: (
        <div
          style={{
            display: "block",
            height: "fit-content",
            width: "fit-content",
            marginTop: "25px",
            marginBottom: "20px"
          }}
        >
          <output className="Box p-2 hover-grow" />
        </div>
      ),
      evt: "output"
    }),
    heading: () => <h1 className={"h" + elem.size}>{elem.text}</h1>,
    text: () => <p className="io-text">{elem.text}</p>,
    canvas: () => ({
      elem: (
        <div
          className="Box p-2"
          style={{
            width: "fit-content",
            height: "fit-content"
          }}
        >
          <canvas width={elem.width || ""} height={elem.height || ""} />
        </div>
      ),
      evt: "canvas"
    }),
    file: () => ({
      elem: (
        <dl className="form-group">
          <dt>
            <label>{elem.label || elem.name}</label>
          </dt>
          <dd>
            <div className="form-control">
              <button className="btn">Choose file</button>
              <span className="m-2" />
            </div>
          </dd>
        </dl>
      ),
      fileDragTo: ".form-control",
      fileDisplay: "span",
      fileButton: "button"
    }),
    button: () => ({
      elem: (
        <div
          style={{
            padding: "10px 0"
          }}
        >
          <button className="btn">{elem.label || elem.name}</button>
        </div>
      ),
      evt: "button"
    }),
    switch: () => ({
      elem: (
        <dl>
          <dt>
            <label>{elem.label || elem.name}</label>
          </dt>
          <dd style={{ marginTop: "5px" }}>
            <input type="checkbox" checked={!!elem.default} />
          </dd>
        </dl>
      ),
      evt: "input"
    })
  }[elem.type]());

export const root = <div className="Box p-5 m-4" />;

export const styleUrl =
  "https://cdn.jsdelivr.net/npm/primer@10.4.0/build/build.css";
