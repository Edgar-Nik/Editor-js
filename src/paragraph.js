import EditorParagraph from '@editorjs/paragraph';

const bold = /\*\*(.*)\*\*/gim;
const strike = /~(.*)~/gim;
const italic = /(?<!\*)\*(?![*\s])(?:([^*]*[^*\s]))?\*/gim;
const code = /```(.*)```/gim;
const heading3 = /^###&nbsp;(.*)|^### (.*)/gim;
const heading2 = /^##&nbsp;(.*)|^### (.*)/gim;
const heading1 = /^#&nbsp;(.*)|^### (.*)/gim;
const heading = /#+&nbsp;|#+ (.*)/gim;

let lastOffsetKey = 1;
const time = new Date().getTime();

const markdownParser = (text, offsetKey, tag) => {
  let tmp = text;
  let helpers = `&#8203;<span data-offset-key="${time}-${offsetKey}"></span>`;

  if (tag === 'bold') {
    return tmp.replace(bold, `<b>$1</b>${helpers}`);
  } else if (tag === 'italic') {
    return tmp.replace(italic, `<i>$1</i>${helpers}`);
  } else if (tag === 'strike') {
    return tmp.replace(strike, `<strike>$1</strike>${helpers}`);
  } else if (tag === 'code') {
    return tmp.replace(code, `<code>$1</code>${helpers}`);
  }

  return tmp;
};
class Paragraph extends EditorParagraph {
  constructor({ data, api, config, readOnly, block }) {
    super({ data, api, config, readOnly, block });

    this._element.addEventListener('keyup', (e) => {
      if (e.code === 'Space') {
        if (heading3.test(e.target.innerHTML)) {
          this.insertHeading(3, e.target.innerHTML);
        } else if (heading2.test(e.target.innerHTML)) {
          this.insertHeading(2, e.target.innerHTML);
        } else if (heading1.test(e.target.innerHTML)) {
          this.insertHeading(1, e.target.innerHTML);
        }
      } else if (bold.test(e.target.innerHTML)) {
        this._element.innerHTML = markdownParser(e.target.innerHTML, lastOffsetKey, 'bold');
      } else if (italic.test(e.target.innerHTML)) {
        this._element.innerHTML = markdownParser(e.target.innerHTML, lastOffsetKey, 'italic');
      } else if (strike.test(e.target.innerHTML)) {
        this._element.innerHTML = markdownParser(e.target.innerHTML, lastOffsetKey, 'strike');
      } else if (code.test(e.target.innerHTML)) {
        this._element.innerHTML = markdownParser(e.target.innerHTML, lastOffsetKey, 'code');
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

  insertHeading(level, text) {
    const index = this.api.blocks.getCurrentBlockIndex();

    this.api.blocks.delete(index);

    this.api.blocks.insert(
      'header',
      {
        text: text.replace(heading, '$1'),
        level
      },
      undefined,
      index
    );

    this.api.caret.setToBlock(index);
  }
}

export default Paragraph;
