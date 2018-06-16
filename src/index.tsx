import "ts-polyfill/lib/es2015-core";
import "ts-polyfill/lib/es2015-promise";
import "ts-polyfill/lib/es2016-array-include";
import "ts-polyfill/lib/es2017-string";
import "ts-polyfill/lib/es2017-object";

import * as _themeObj from "./themes/default";
import DOMReady from "when-dom-ready";
import { PureComponent } from "react";
import ReactDOM from "react-dom";
import React from "react";

type StdioTags =
  | "title"
  | "heading"
  | "text"
  | "textInput"
  | "checkbox"
  | "radio"
  | "file"
  | "button"
  | "switch"
  | "output"
  | "canvas";

interface StdioTagsProps {
  title: { text: string };
  heading: { text: string; size: number };
  text: { text: string };
  textInput: { onInput: React.FormEventHandler<HTMLElement> };
  checkbox: {
    label: string;
    options: (string | { val: string; label?: string })[];
  };
  radio: {};
  file: {};
  button: {};
  switch: {};
  output: {};
  canvas: {};
}

type StdioElemProps<B extends StdioTags> = StdioTagsProps[B];

interface StdioTheme extends StdioTagsProps {
  root?: React.ComponentType<{}>;
  styleUrl?: string | string[];
}
const a: StdioTheme = {} as any;

const funcArr = (func: Function | Function[] | null) =>
  func ? (Array.isArray(func) ? func : [func]) : [];
const funcReduce = (funcs: Function[], val: any) =>
  funcs.reduce((agr, cur) => cur(agr), val);
const createOutputs = () => ({ output: [], canvas: [] });

interface StdioElem {
  type: string;
  name: string;
}

interface StdioProps {
  loadStyles?: boolean;
  theme: StdioTheme;
  elems: StdioElem[];
  title?: string;
}

interface StdioState {
  userState: { [k: string]: any };
}

class StdioComponent extends PureComponent<StdioProps, StdioState> {
  state: StdioState = {
    userState: {}
  };
  setUserState(name, val) {
    this.setState(({ userState }) => ({
      userState: { ...userState, [name]: "" }
    }));
  }
  /**
   * Refresh the virtual DOM onto the document
   */
  render() {
    const Root = this.props.theme.root || React.Fragment;
    return (
      <Root>
        {this.props.elems.map(userElem => {
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
              if (name) {
                if (!(name in this.state.userState)) {
                  this.setUserState(name, "");
                }
                return {
                  onInput: (e: React.FormEvent<HTMLInputElement>) =>
                    this.setUserState(
                      name,
                      funcReduce(funcs, e.currentTarget.value)
                    )
                };
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

              fileDisplay = fileDisplay
                ? main.querySelector(fileDisplay)
                : main;
              fileButton = fileButton ? main.querySelector(fileButton) : main;
              fileDragTo = fileDragTo ? main.querySelector(fileDragTo) : main;

              fileButton.addEventListener(
                "click",
                fileInput.click.bind(fileInput)
              );

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
              evtElem[0].addEventListener("click", () =>
                this.trigger(listener)
              );
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
        })}
      </Root>
    );
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

let DOMIsReady = false;
const whenDOMReady = DOMReady().then(() => (DOMIsReady = true));

class StdioDOM {
  root = document.body;
  theme: StdioTheme = _themeObj as any;
  loadStyles = false;
  stdioComponent: StdioComponent;
  elems: StdioElem[];
  title: string;
  constructor() {
    if (!DOMIsReady)
      DOMReady.then(() => {
        if (!this.root) this.root = document.body;
      });
  }
  /**
   * Add stdio elements to the DOM
   */
  add(...toAdd: StdioElem[]) {
    this.elems.splice(-1, 0, ...toAdd);
    this.mount();
    return this;
  }
  /**
   * Mount to the DOM
   */
  mount(root?: HTMLElement) {
    if (!DOMIsReady) DOMReady.then(() => this.mount());
    if (root) return this.remountTo(root);
    ReactDOM.render(
      <StdioComponent {...this} ref={ref => (this.stdioComponent = ref)} />,
      this.root
    );
    return this;
  }
  /**
   * Remount the stdio DOM onto another HTML element
   */
  remountTo(root: HTMLElement) {
    this.unmount();
    this.root = root;
    this.mount();
    return this;
  }
  /**
   * Unmount the stdio DOM from the browser DOM
   */
  unmount() {
    ReactDOM.unmountComponentAtNode(this.root);
    return this;
  }
  /**
   * Set the title for the stdio DOM
   */
  setTitle(title: string) {
    this.title = title;
    return this;
  }
  /**
   * Set a custom element output for the elements
   */
  setTheme(theme: StdioTheme) {
    this.theme = theme;
    return this;
  }
  /**
   * Mount the stdio DOM to a specific HTML element
   */
  mountTo(root: HTMLElement) {
    this.root = root;
    return this;
  }
  /**
   * Load the CSS stylesheet for the current theme
   */
  loadStyleSheet() {
    this.loadStyles = true;
    this.mount();
    return this;
  }
  StdioClass = StdioComponent;
}

export default new StdioDOM();
