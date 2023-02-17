import EditorParagraph from '@editorjs/paragraph'

export class Paragraph extends EditorParagraph {
  constructor({ data, api, config, readOnly, block }) {
    super({ data, api, config, readOnly, block });
    this.data = data;
    this.api = api

    this._element.addEventListener('keyup', (event) => {
      if (event.target?.innerHTML.includes('#')) {
        this._checkHeading(event.target?.innerHTML);
      }
    })
  }

  _checkHeading(text) {
    if (text.startsWith('#&nbsp') || text.startsWith('# ')) {
      this._createElement(1,text)
    } else if (text.startsWith('##&nbsp') || text.startsWith('## ')) {
      this._createElement(2,text)
    } else if (text.startsWith('###&nbsp') || text.startsWith('### ')) {
      this._createElement(3,text)
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
}