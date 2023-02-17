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
        this._element.innerHTML = markdownParser(e.target.innerHTML, lastOffsetKey, 'bold');
      } else if (italic.test(e.target.innerHTML)) {
        this._element.innerHTML = markdownParser(e.target.innerHTML, lastOffsetKey, 'italic');
      }

      const element = document.querySelector(`[data-offset-key="${time}-${lastOffsetKey}"]`);
      lastOffsetKey += 1;

      if (element) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.setStart(element, 0);
        range.setEnd(element, 0);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    });
  }
}

export default Paragraph;
