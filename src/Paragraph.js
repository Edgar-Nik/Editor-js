import EditorParagraph from '@editorjs/paragraph'

const bold = /\*\*(.*)\*\*/gim;
const strike = /~(.*)~/gim;
const italic = /(?<!\*)\*(?![*\s])(?:([^*]*[^*\s]))?\*/gim;
const code = /```(.*)```/gim;
const heading3 = /^###&nbsp;(.*)|^### (.*)/gim;
const heading2 = /^##&nbsp;(.*)|^### (.*)/gim;
const heading1 = /^#&nbsp;(.*)|^### (.*)/gim;
const heading = /#+&nbsp;|#+ (.*)/gim;
const triggers = ['*', '~', '`']

let lastOffsetKey = 1;
const time = new Date().getTime();

export class Paragraph extends EditorParagraph {
  constructor({ data, api, config, readOnly, block }) {
    super({ data, api, config, readOnly, block });

    this._element.addEventListener('keyup', (event) => {
      const enteredText = event.target?.innerHTML

      if (enteredText.includes('#')) {
        this._checkHeading(enteredText);
      }
      if (triggers.includes(event.key)) {
        this._textModify(enteredText);
      }
    })
  }

  _checkHeading(text) {
    if (text.startsWith('#&nbsp') || text.startsWith('# ')) {
      this._createElement(1, text)
    } else if (text.startsWith('##&nbsp') || text.startsWith('## ')) {
      this._createElement(2, text)
    } else if (text.startsWith('###&nbsp') || text.startsWith('### ')) {
      this._createElement(3, text)
    }

    // if (heading1.test(text)) {
    //   this._createElement(1, text)
    // } else if (heading2.test(text)) {
    //   this._createElement(2, text)
    // } else if (heading3.test(text)) {
    //   this._createElement(3, text)
    // }
  };

  _textModify(text) {
    if (bold.test(text)) {
      this._element.innerHTML = this.markdownParser(text, lastOffsetKey, 'bold');
    } else if (italic.test(text)) {
      this._element.innerHTML = this.markdownParser(text, lastOffsetKey, 'italic');
    } else if (strike.test(text)) {
      this._element.innerHTML = this.markdownParser(text, lastOffsetKey, 'strike');
    } else if (code.test(text)) {
      this._element.innerHTML = this.markdownParser(text, lastOffsetKey, 'code');
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
  }



  markdownParser = (text, offsetKey, tag) => {
    let tmp = text;
    let helpers = `&#8203;<span data-offset-key="${time}-${offsetKey}"></span>`;


  // if (tag === 'bold') {
  //   return tmp.replace(bold, `<b>$1</b>${helpers}`);
  // } else if (tag === 'italic') {
  //   return tmp.replace(italic, `<i>$1</i>${helpers}`);
  // } else if (tag === 'strike') {
  //   return tmp.replace(strike, `<strike>$1</strike>${helpers}`);
  // } else if (tag === 'code') {
  //   return tmp.replace(code, `<code>$1</code>${helpers}`);
  // }

  // return tmp;

    switch (tag) {
      case ('bold'):
        return tmp.replace(bold, `<b>$1</b>${helpers}`)

      case ('italic'):
        return tmp.replace(italic, `<i>$1</i>${helpers}`)

      case ('strike'):
        return tmp.replace(strike, `<strike>$1</strike>${helpers}`)

      case ('code'):
        return tmp.replace(code, `<code>$1</code>${helpers}`)
        
      default: return tmp
    }
  };

  _createElement(level, text) {
    const currentElementIndex = this.api.blocks.getCurrentBlockIndex();

    this.api.blocks.delete(currentElementIndex);

    this.api.blocks.insert(
      'header',
      {
        text: text.replaceAll('#', ''),
        level
      },
      undefined,
      currentElementIndex
    );

    this.api.caret.setToBlock(currentElementIndex);
  }
};
