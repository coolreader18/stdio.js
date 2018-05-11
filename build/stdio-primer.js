(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.stdio = factory());
}(this, (function () { 'use strict';

  /* @legume @preserve
   * @name stdio
   * @author coolreader18
   */

  const camelHyphen = str => str.replace(/[A-Z]/g, a => `-${a.toLowerCase()}`);

  function jsx(el, attrs, ...children) {
    const output = document.createElement(el);
    if (el === "style" && typeof children[0] == "object") {
      const iterray = Object.entries(children[0]);
      let textCont = "";
      for (let i = 0; i < iterray.length; i++) {
        let [selKey, val] = iterray[i];
        if (!Array.isArray(val)) val = [val];
        val = val.map(cur => Object.entries(cur));
        textCont += val.reduce(
          (str, cur) =>
            `${str}${selKey} {\n${cur.reduce((str, [key, val]) => {
            if (typeof val === "object") {
              let newSel = selKey + (key.startsWith("&") ? key : " " + key);
              iterray.push([newSel, val]);
              return str;
            }
            return `${str}  ${camelHyphen(key)}: ${val};\n`;
          }, "")}}\n`,
          ""
        );
      }
      output.textContent = textCont;
    }
    for (let [name, value] of Object.entries(attrs || {})) {
      let set = true;
      if (name === "style" && typeof value === "object") {
        set = false;

        Object.assign(
          output.style,
          Object.entries(value)
            .map(cur => {
              cur[0] = camelHyphen(cur[0]);
              return cur;
            })
            .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {})
        );
      }
      if (name.match("data-.+") && typeof value == "object") {
        value = JSON.stringify(object);
      }
      if (set) output.setAttribute(name, value);
    }
    children.forEach(cur => output.append(...[].concat(cur)));
    return output;
  }

  var _transformElem = elem =>
    ({
      title: () => (
        jsx('div', {class: "Subhead"},
          jsx('div', {class: "Subhead-heading"}, elem.text)
        )
      ),
      textInput: () => (
        jsx('dl', {class: "form-group"},
          jsx('dt', null,
            jsx('label', null, elem.label || elem.name)
          ),
          jsx('dd', null,
            jsx('input', {
              type: "text",
              class: "form-control",
              placeholder: elem.placeholder || ""}
            )
          )
        )
      ),
      checkbox: type => ({
        elem: (
          jsx('dl', null,
            jsx('dt', null,
              jsx('label', null, elem.label || elem.name)
            ),
            jsx('dd', null,
              elem.options.map(cur => {
                if (typeof cur === "string") cur = { val: cur };
                return (
                  jsx('div', {class: "form-checkbox"},
                    jsx('label', null,
                      jsx('input', {type: "checkbox", 'data-value': cur.val}),
                      cur.label || cur.val
                    )
                  )
                );
              })
            )
          )
        ),
        evt: "input"
      }),
      radio: () => ({
        elem: (
          jsx('dl', null,
            jsx('dt', null,
              jsx('label', null, elem.label || elem.name)
            ),
            jsx('dd', null,
              elem.options.map(cur => {
                if (typeof cur === "string") cur = { val: cur };
                return (
                  jsx('div', {class: "form-checkbox"},
                    jsx('label', {class: ""},
                      jsx('input', {type: "radio", name: elem.name, 'data-value': cur.val}),
                      cur.label || cur.val
                    )
                  )
                );
              })
            )
          )
        ),
        evt: "input"
      }),
      output: () => ({
        elem: (
          jsx('div', {
            style: {
              display: "block",
              height: "fit-content",
              width: "fit-content",
              marginTop: "25px",
              marginBottom: "20px"
            }
          },
            jsx('output', {class: "Box p-2 hover-grow"})
          )
        ),
        evt: "output"
      }),
      heading: () => jsx('h1', {class: "h" + elem.size}, elem.text),
      text: () => jsx('p', {class: "io-text"}, elem.text),
      canvas: () => ({
        elem: (
          jsx('div', {
            class: "Box p-2",
            style: {
              width: "fit-content",
              height: "fit-content"
            }
          },
            jsx('canvas', {width: elem.width || "", height: elem.height || ""})
          )
        ),
        evt: "canvas"
      }),
      file: () => ({
        elem: (
          jsx('dl', {class: "form-group"},
            jsx('dt', null,
              jsx('label', null, elem.label || elem.name)
            ),
            jsx('dd', null,
              jsx('div', {class: "form-control"},
                jsx('button', {class: "btn"}, "Choose file"),
                jsx('span', {class: "m-2"})
              )
            )
          )
        ),
        fileDragTo: ".form-control",
        fileDisplay: "span",
        fileButton: "button"
      }),
      button: () => ({
        elem: (
          jsx('div', {
            style: {
              padding: "10px 0"
            }
          },
            jsx('button', {class: "btn"}, elem.label || elem.name)
          )
        ),
        evt: "button"
      })
    }[elem.type]());

  const root$1 = jsx('div', {class: "Box p-5 m-4"});

  const styleUrl =
    "https://cdn.jsdelivr.net/npm/primer@10.4.0/build/build.css";

  var _themeObj = /*#__PURE__*/Object.freeze({
    default: _transformElem,
    root: root$1,
    styleUrl: styleUrl
  });

  /* eslint no-void: "off" */

  // Loaded ready states
  var loadedStates = ['interactive', 'complete'];

  // Return Promise
  var whenDomReady = function whenDomReady(cb, doc) {
  	return new Promise(function (resolve) {
  		// Allow doc to be passed in as the lone first param
  		if (cb && typeof cb !== 'function') {
  			doc = cb;
  			cb = null;
  		}

  		// Use global document if we don't have one
  		doc = doc || window.document;

  		// Handle DOM load
  		var done = function done() {
  			return resolve(void (cb && setTimeout(cb)));
  		};

  		// Resolve now if DOM has already loaded
  		// Otherwise wait for DOMContentLoaded
  		if (loadedStates.indexOf(doc.readyState) !== -1) {
  			done();
  		} else {
  			doc.addEventListener('DOMContentLoaded', done);
  		}
  	});
  };

  // Promise chain helper
  whenDomReady.resume = function (doc) {
  	return function (val) {
  		return whenDomReady(doc).then(function () {
  			return val;
  		});
  	};
  };

  let themeObj = _themeObj;
  let transformElem = _transformElem;

  /**
   * Get an array of functions to reduce on
   * @param {Function|Array<Function>|null} func
   */
  const funcArr = func => (func ? (Array.isArray(func) ? func : [func]) : []);
  const funcReduce = (funcs, val) => funcs.reduce((agr, cur) => cur(agr), val);
  const addToNullArr = (obj, arr, elem) => {
    if (obj[arr]) obj[arr].push(elem);
    else obj[arr] = [elem];
  };
  const createOutputs = () => ({ output: {}, canvas: [] });

  let isDOMReady = false;

  const dom = Object.assign([], {
    /**
     * Refresh the virtual DOM onto the document
     */
    refresh() {
      if (!isDOMReady) return;
      const { root, scope, outputs, title, listeners } = this;
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
            scope[name] = "";
            input.addEventListener("input", ({ target: { value } }) => {
              scope[name] = funcReduce(funcs, value);
            });
          },
          checkbox: () => {
            evtElem.forEach(cur =>
              cur.addEventListener(
                "change",
                () =>
                  (scope[name] = Array.from(evtElem).reduce(
                    (arr, cur) =>
                      arr.concat(cur.checked ? cur.dataset.value : []),
                    []
                  ))
              )
            );
          },
          radio: () => {
            evtElem.forEach(cur =>
              cur.addEventListener(
                "change",
                () => (scope[name] = cur.dataset.value)
              )
            );
          },
          output: () => {
            addToNullArr(outputs.output, userElem.link, {
              elem: evtElem[0],
              tranform: userElem.transform
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
            outputs.canvas.push((listeners[name] = obj));
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
              scope[name] = funcReduce(funcs, file.slice());
            }
          },
          button: () => {
            const listener = { type: "button", handler: userElem.handler };
            evtElem[0].addEventListener("click", () => this.trigger(listener));
            if (name) this.listeners[name] = listener;
          }
        };
        if (userElem.type in handle) handle[userElem.type]();
        themeElem.elem.forEach(df.appendChild.bind(df));
      });
      while (root.firstChild) root.removeChild(root.firstChild);
      this.root.appendChild(df);
    },
    update(input) {
      const { output, canvas } = this.outputs;
      (output[input] || []).forEach(
        ({ elem, transform }) =>
          (elem.innerHTML = funcReduce(funcArr(transform), this.scope[input]))
      );
      canvas.forEach(cur => cur.onUpdate && this.trigger(cur));
    },
    trigger(target) {
      if (typeof target === "string") target = this.listeners[target];
      const { handler } = target;
      ({
        button: () => handler(this.scope),
        canvas: ({ canvas }) =>
          handler(canvas.getContext("2d"), this.scope, canvas)
      }[target.type](target));
    },
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
  whenDomReady().then(() => {
    isDOMReady = true;
    dom.root = document.body;
    const r = "root";
    if (r in themeObj) {
      dom.root = dom.root.appendChild(themeObj[r]);
      dom.refresh();
    }
    const i = "init";
    if (i in themeObj) themeObj[i](root);
  });

  const stdio = {
    /**
     * Add stdio elements to the document
     * @param {...stdio.Element} elems
     */
    add(...elems) {
      elems.forEach(cur => dom.push(cur));
      dom.refresh();
    },
    title(title) {
      this.dom.title = title;
      return this;
    },
    dom: new Proxy(dom, {
      set(obj, prop, val) {
        obj[prop] = val;
        dom.refresh();
        return true;
      }
    }),
    /**
     * Set a custom element output for the elements
     * @param {Function} stl
     */
    style(stl) {
      if (typeof stl === "function") transformElem = stl;
      else if (typeof stl === "object") {
        themeObj = stl;
        transformElem = stl.transformElem;
      } else throw new Error();
    },
    loadStyleSheet() {
      let { styleUrl: style } = themeObj;
      if (!style) return;
      if (typeof style === "function") style = style(testing);
      style = [].concat(style);
      style.forEach(cur =>
        document.head.appendChild(jsx('link', {rel: "stylesheet", href: cur}))
      );
      return this;
    }
  };

  return stdio;

})));
