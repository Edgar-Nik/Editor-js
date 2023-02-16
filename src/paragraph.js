import EditorParagraph from '@editorjs/paragraph';

const bold = /\*\*(.*)\*\*/gim;
const italic = /(?<!\*)\*(?![*\s])(?:([^*]*[^*\s]))?\*/gim;

let lastOffsetKey = 1;
const time = new Date().getTime();

const markdownParser = (text, offsetKey, tag) => {
  let tmp = text;
  let helpers = `&#8203;<span data-offset-key="${time}-${offsetKey}"></span>`;
  if (tag === 'bold') {
    return tmp.replace(bold, `<b>$1</b>${helpers}`);
  } else if (tag === 'italic') {
    return tmp.replace(italic, `<i>$1</i>${helpers}`);
  }
  return tmp;
};
class Paragraph extends EditorParagraph {
  constructor({ data, api, config, readOnly, block }) {
    super({ data, api, config, readOnly, block });
    this._element.addEventListener('keyup', (e) => {
      if (bold.test(e.target.innerHTML)) {
        //@ts-ignore
        this._element.innerHTML = markdownParser(e.target.innerHTML, lastOffsetKey, 'bold');
      } else if (italic.test(e.target.innerHTML)) {
        //@ts-ignore
        this._element.innerHTML = markdownParser(e.target.innerHTML, lastOffsetKey, 'italic');
      }
      const element = document.querySelector(`[data-offset-key="${time}-${lastOffsetKey}"]`);
      lastOffsetKey += 1;
      if (element) {
        const s = window.getSelection();
        const r = document.createRange();
        r.setStart(element, 0);
        r.setEnd(element, 0);
        s?.removeAllRanges();
        s?.addRange(r);
      }
    });
  }
}

export default Paragraph;
