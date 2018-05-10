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
      title: () => jsx('h1', {class: "io-title"}, elem.text),
      textInput: () => (
        jsx('label', {class: "io-input-label"},
          elem.label || elem.name, ":",
          jsx('input', {type: "text", class: "io-input"})
        )
      ),
      checkbox: () => ({
        elem: (
          jsx('div', {class: "io-checkbox-wrapper"},
            elem.options.map(cur => {
              if (typeof cur === "string") cur = { val: cur };
              return (
                jsx('label', {class: "io-checkbox-label"},
                  cur.label || cur.val, ":",
                  jsx('input', {
                    type: "checkbox",
                    class: "io-checkbox",
                    'data-value': cur.val}
                  )
                )
              );
            })
          )
        ),
        evt: "input"
      }),
      radio: () => ({
        elem: (
          jsx('div', {class: "io-radio-wrapper"},
            elem.options.map(cur => {
              if (typeof cur === "string") cur = { val: cur };
              return (
                jsx('label', {class: "io-radio-label"},
                  cur.label || cur.val, ":",
                  jsx('input', {
                    type: "radio",
                    class: "io-radio",
                    name: elem.name,
                    'data-value': cur.val}
                  )
                )
              );
            })
          )
        ),
        evt: "input"
      }),
      output: () => jsx('output', {class: "io-output"}),
      heading: () =>
        jsx(`h${elem.size || 1}`, { class: "io-heading" }, elem.text),
      text: () => jsx('p', {class: "io-text"}, elem.text),
      canvas: () => ({
        elem: (
          jsx('div', {class: "io-canvas-wrapper"},
            jsx('canvas', {
              width: elem.width || "",
              height: elem.height || "",
              class: "io-canvas"}
            )
          )
        ),
        evt: "canvas"
      }),
      file: () => ({
        elem: (
          jsx('div', {class: "io-file-wrapper"},
            jsx('button', {class: "io-file-button"}, "Choose file"),
            jsx('span', {class: "io-file-display"})
          )
        ),
        fileDragTo: null,
        fileDisplay: "span",
        fileButton: "button"
      }),
      button: () => ({
        elem: (
          jsx('div', {class: "io-button-wrapper"},
            jsx('button', {class: "io-button"})
          )
        ),
        evt: "button"
      })
    }[elem.type]());

  const root$1 = jsx('div');

  const styleUrl = [
    "./default.css",
    "https://cdn.jsdelivr.net/npm/stdio.js/build/default.css"
  ];

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
  //# sourceMappingURL=index.es2015.js.map

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
      const { root, scope, outputs, title } = this;
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
            scope[userElem.name] = "";
            input.addEventListener("input", ({ target: { value } }) => {
              scope[userElem.name] = funcReduce(funcs, value);
            });
          },
          checkbox: () => {
            evtElem.forEach(cur =>
              cur.addEventListener(
                "change",
                () =>
                  (scope[userElem.name] = Array.from(evtElem).reduce(
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
                () => (scope[userElem.name] = cur.dataset.value)
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
            let { interval } = userElem;
            const updateCanvas = () =>
              userElem.draw(evtElem[0].getContext("2d"), this.scope, evtElem[0]);
            const obj = {
              updateCanvas,
              onUpdate: true
            };
            if (interval === void 0) interval = "update";
            if (typeof interval === "number") {
              obj.onUpdate = false;
              obj.interval = setInterval(updateCanvas, interval);
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
              scope[userElem.name] = funcReduce(funcs, file.slice());
            }
          },
          button: () => {
            evtElem[0].addEventListener("click", () =>
              userElem.handler(dom.scope)
            );
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
      canvas.forEach(cur => {
        if (cur.onUpdate) cur.updateCanvas();
      });
    },
    outputs: createOutputs(),
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
      let style = "styleUrl";
      if (!(style in themeObj)) return;
      style = [].concat(themeObj[style]);
      style.forEach(cur =>
        document.head.appendChild(jsx('link', {rel: "stylesheet", href: cur}))
      );
      return this;
    }
  };

  return stdio;

})));
