import jsx from "./jsx-factory";

export default elem =>
  ({
    title: () => (
      <div class="Subhead">
        <div class="Subhead-heading">{elem.text}</div>
      </div>
    ),
    textInput: () => (
      <dl class="form-group">
        <dt>
          <label>{elem.label || elem.name}</label>
        </dt>
        <dd>
          <input
            type="text"
            class="form-control"
            placeholder={elem.placeholder || ""}
          />
        </dd>
      </dl>
    ),
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
                <div class="form-checkbox">
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
                <div class="form-checkbox">
                  <label class="">
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
          <output class="Box p-2 hover-grow" />
        </div>
      ),
      evt: "output"
    }),
    heading: () => <h1 class={"h" + elem.size}>{elem.text}</h1>,
    text: () => <p class="io-text">{elem.text}</p>,
    canvas: () => ({
      elem: (
        <div
          class="Box p-2"
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
        <dl class="form-group">
          <dt>
            <label>{elem.label || elem.name}</label>
          </dt>
          <dd>
            <div class="form-control">
              <button class="btn">Choose file</button>
              <span class="m-2" />
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
          <button class="btn">{elem.label || elem.name}</button>
        </div>
      ),
      evt: "button"
    })
  }[elem.type]());

export const root = <div class="Box p-5 m-4" />;

export const styleUrl =
  "https://cdn.jsdelivr.net/npm/primer@10.4.0/build/build.css";
