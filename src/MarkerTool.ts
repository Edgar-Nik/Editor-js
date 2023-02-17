export class CustomParagraph {
  data: any;
  api: any;
  paragraph: HTMLParagraphElement | undefined;
  initialElement: HTMLDivElement;

  constructor({ data, api }: any) {
    this.data = data;
    this.api = api

    this.initialElement = document.createElement('div');
  }

  render() {
    console.log('render')
    this.initialElement.classList.add('ce-paragraph');
    this.initialElement.classList.add('cdx-block');

    this.initialElement.setAttribute('contenteditable', "true")

    this.initialElement.addEventListener('keyup', (event: any) => {
      if (event.target?.innerHTML.includes('#')) {
        this._createElement(event.target?.innerHTML);
      }
    });

    return this.initialElement;
  }

  _createElement(text: any) {
    let newElement: any

    if (text.startsWith('#&nbsp') || text.startsWith('# ')) {
      newElement = document.createElement('h1')
      newElement.setAttribute('level', "1")
    } else if (text.startsWith('##&nbsp') || text.startsWith('## ')) {
      newElement = document.createElement('h2')
      newElement.setAttribute('level', "2")
    } else if (text.startsWith('###&nbsp') || text.startsWith('### ')) {
      newElement = document.createElement('h3')
      newElement.setAttribute('level', "3")
    }

    if (newElement) {
      newElement.classList.add('ce-header');
      newElement.setAttribute('contenteditable', "true")
      this.initialElement.parentNode?.replaceChild(newElement, this.initialElement)

      newElement.innerHTML = text.replaceAll('#', '')
      this.initialElement = newElement

      this.initialElement.focus()
    }
  };

  save(blockContent: any) {
    const level = blockContent.getAttribute('level')

    if (!!level) {
      return {
        level: level,
        text: blockContent.innerHTML
      }
    }

    return {
      text: blockContent.innerHTML
    }
  }
}