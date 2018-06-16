const camelHyphen = str => str.replace(/[A-Z]/g, a => `-${a.toLowerCase()}`);

export default function jsx(el, attrs, ...children) {
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
    if (typeof value === "boolean" && !value) set = false;
    if (set) output.setAttribute(name, value);
  }
  children.forEach(cur => output.append(...[].concat(cur)));
  return output;
}
