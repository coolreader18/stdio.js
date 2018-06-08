import * as _themeObj from "./themes/default";
import DOMready from "when-dom-ready";
import jsx from "./themes/jsx-factory";
let transformElem,
  themeObj = ({ default: transformElem } = _themeObj);

/**
 * Get an array of functions to reduce on
 * @param {Function|Array<Function>|null} func
 */
const funcArr = func => (func ? (Array.isArray(func) ? func : [func]) : []);
const funcReduce = (funcs, val) => funcs.reduce((agr, cur) => cur(agr), val);
const createOutputs = () => ({ output: [], canvas: [] });

let isDOMReady = false;

class StdioDom extends Array {
  constructor(...elems) {
    super(...elems);
    Object.assign(this, {
      outputs: createOutputs(),
      listeners: {},
      scope: new Proxy(
        {},
        {
          set(obj, prop, val) {
            obj[prop] = val;
            dom.update(prop);
            return true;
          }
        }
      ),
      root: document.body
    });
  }
  /**
   * Refresh the virtual DOM onto the document
   */
  refresh() {
    if (!isDOMReady) return;
    const { root, scope, outputs, title, listeners } = dom;
    const df = document.createDocumentFragment();
    if (title)
      df.appendChild(
        transformElem(
          {
            type: "title",
            text: title
          },
          dom
        )
      );
    this.forEach(userElem => {
      const { name } = userElem;
      let themeElem = transformElem(userElem, dom);
      const funcs = funcArr(userElem.transform);
      if (themeElem instanceof HTMLElement || Array.isArray(themeElem)) {
        themeElem = { elem: themeElem };
      }
      themeElem.elem = [].concat(themeElem.elem);
      const main = themeElem.elem[themeElem.main || 0];
      const evtElem = themeElem.evt
        ? main.querySelectorAll(themeElem.evt)
        : [main];
      const handle = {
        textInput: () => {
          let input = evtElem[0];
          if (name) {
            scope[name] = "";
            input.addEventListener("input", e => {
              scope[name] = funcReduce(funcs, e.currentTarget.value);
            });
          }
        },
        checkbox: () => {
          evtElem.forEach(cur =>
            cur.addEventListener("change", () => {
              if (name)
                scope[name] = Array.from(evtElem).reduce(
                  (arr, cur) =>
                    arr.concat(cur.checked ? cur.dataset.value : []),
                  []
                );
            })
          );
        },
        radio: () => {
          evtElem.forEach(cur =>
            cur.addEventListener("change", () => {
              if (name) scope[name] = cur.dataset.value;
            })
          );
        },
        output: () => {
          outputs.output.push({
            elem: evtElem[0],
            transform: userElem.transform
          });
        },
        canvas: () => {
          let { interval, draw } = userElem;
          const obj = {
            type: "canvas",
            canvas: evtElem[0],
            onUpdate: true,
            handler: draw
          };
          if (interval == null) interval = "update";
          if (typeof interval === "number") {
            obj.onUpdate = false;
            obj.interval = setInterval(handler, interval);
          }
          if (name) {
            listeners[name] = obj;
            scope[name] = obj.canvas;
          }
          outputs.canvas.push(obj);
        },
        file: () => {
          let { fileDisplay, fileButton, fileDragTo } = themeElem;
          const fileInput = document.createElement("input");
          fileInput.type = "file";

          fileDisplay = fileDisplay ? main.querySelector(fileDisplay) : main;
          fileButton = fileButton ? main.querySelector(fileButton) : main;
          fileDragTo = fileDragTo ? main.querySelector(fileDragTo) : main;

          fileButton.addEventListener("click", fileInput.click.bind(fileInput));

          Object.entries({
            drop: e => {
              e.preventDefault();
              var dt = e.dataTransfer;
              if (dt.items) {
                const item = dt.items[0];
                if (item.kind == "file") {
                  haveFile(item.getAsFile());
                }
              } else {
                haveFile(dt.files[0]);
              }
            },
            dragover: e => e.preventDefault(),
            dragend: e => {
              var dt = e.dataTransfer;
              if (dt.items) {
                for (var i = 0; i < dt.items.length; i++) {
                  dt.items.remove(i);
                }
              } else {
                e.dataTransfer.clearData();
              }
            }
          }).forEach(([evt, handler]) =>
            fileDragTo.addEventListener(evt, handler)
          );

          fileInput.addEventListener("input", e =>
            haveFile(e.currentTarget.files[0])
          );
          function haveFile(file) {
            if (!file) return;
            fileDisplay.innerText = file.name;
            if (name) scope[name] = funcReduce(funcs, file.slice());
          }
        },
        button: () => {
          const listener = { type: "button", handler: userElem.handler };
          evtElem[0].addEventListener("click", () => this.trigger(listener));
          if (name) this.listeners[name] = listener;
        },
        switch: () => {
          evtElem[0].addEventListener(
            "change",
            ({ currentTarget: { checked } }) => {
              scope[name] = checked;
            }
          );
        }
      };
      if (userElem.type in handle) handle[userElem.type]();
      themeElem.elem.forEach(df.appendChild.bind(df));
    });
    while (root.firstChild) root.removeChild(root.firstChild);
    this.root.appendChild(df);
  }
  update(input) {
    const { output, canvas } = this.outputs;
    output.forEach(({ elem, transform }) => {
      elem.textContent = funcReduce(
        funcArr(transform).map(cur => {
          if (typeof cur === "string") {
            const name = cur;
            cur = scope => scope[name];
          }
          return cur;
        }),
        this.scope
      );
    });
    canvas.forEach(cur => cur.onUpdate && this.trigger(cur));
  }
  trigger(target) {
    if (typeof target === "string") target = this.listeners[target];
    const { handler } = target;
    ({
      button: () => handler(this.scope),
      canvas: ({ canvas }) =>
        handler(canvas.getContext("2d"), this.scope, canvas)
    }[target.type](target));
  }
}

const dom = new StdioDom();
DOMready().then(() => {
  isDOMReady = true;
  dom.root = document.body;
  if ("root" in themeObj) {
    dom.root = dom.root.appendChild(themeObj.root);
    dom.refresh();
  }
  if ("init" in themeObj) themeObj.init(root);
});

const stdio = {
  /**
   * Add stdio elements to the document
   * @param {...stdio.Element} elems
   */
  add(...elems) {
    dom.splice(0, 0, ...elems);
    dom.refresh();
    return this;
  },
  title(title) {
    this.dom.title = title;
    return this;
  },
  dom: new Proxy(dom, {
    set(...args) {
      const ret = Reflect.set(...args);
      if (ret) dom.refresh();
      return ret;
    }
  }),
  /**
   * Set a custom element output for the elements
   * @param {Function} stl
   */
  style(stl) {
    if (typeof stl === "function") transformElem = stl;
    else if (typeof stl === "object") {
      themeObj = { transformElem } = stl;
    } else throw new Error();
    return this;
  },
  loadStyleSheet() {
    let { styleUrl: style } = themeObj;
    if (!style) return;
    if (typeof style === "function") style = style(testing);
    style = [].concat(style);
    style.forEach(cur =>
      document.head.appendChild(<link rel="stylesheet" href={cur} />)
    );
    return this;
  }
};

export default stdio;
