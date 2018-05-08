(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.easyIO = factory());
}(this, (function () { 'use strict';

  /* @legume @preserve
   * @name easyIO
   * @author coolreader18
   */

  var theme = () => {
    throw new Error(
      "easyIO none theme is in use and a theme hasn't been registered"
    );
  };

  var themeObj = /*#__PURE__*/Object.freeze({
    default: theme
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

  let transformElem = theme;

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
              userElem.process(
                evtElem[0].getContext("2d"),
                this.scope,
                evtElem[0]
              );
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

  const easyIO = {
    /**
     * Add easyIO elements to the document
     * @param {...easyIO.Element} elems
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
     * @param {Function} func
     */
    style(func) {
      if (typeof func === "function") transformElem = func;
      else throw new Error();
    }
  };

  return easyIO;

})));
