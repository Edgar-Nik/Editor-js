import { useState, useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from './paragraph';

const bold = /\*\*(.*)\*\*/gim;
const italics = /\*(.*)\*/gim;

const markdownParser = (text: string) => {
  let tmp = text;
  const toHTML = tmp.replace(bold, '<b>$1</b>').replace(italics, '<i>$1</i>');
  return toHTML.trim();
};

class MyParagraph extends Paragraph {
  constructor({ data, api, config, readOnly, block }: any) {
    super({ data, api, config, readOnly, block });
    //@ts-ignore
    this._element.addEventListener('keydown', (e) => {
      if (bold.test(e.target.innerHTML) || italics.test(e.target.innerHTML)) {
        if ('Enter' === e.code) {
          //@ts-ignore
          this._element.innerHTML = markdownParser(e.target.innerHTML);
          //@ts-ignore
          const p = this._element as any;
          //@ts-ignore
          const length = p.lastChild?.innerHTML ? 1 : p.lastChild.length;

          const s = window.getSelection();
          const r = document.createRange();
          r.setStart(p.lastChild, length);
          r.setEnd(p.lastChild, length);
          s?.removeAllRanges();
          s?.addRange(r);
        }
      }
    });
  }

  save(blockContent: any) {
    const content = Paragraph.prototype.save(blockContent);
    return { ...content, text: markdownParser(content.text) };
  }
}

const initialData = () => {
  return {
    time: new Date().getTime(),
    blocks: [
      {
        type: 'header',
        data: {
          text: 'Hello)',
          level: 1
        }
      }
    ]
  };
};

const Editor = () => {
  const ejInstance = useRef<any>();
  const [editorData, setEditorData] = useState(initialData);

  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      if (ejInstance.current) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, []);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: 'editorjs',
      data: editorData,
      onReady: () => {
        ejInstance.current = editor;
      },

      onChange: async (api, event) => {
        if (event.type !== 'block-changed') {
          return;
        }
        const id: string = event.detail.target.id;

        const content = await api.saver.save();
        let currentBlock = content.blocks.find((item) => item.id === id);

        const updatedBlocks = {
          time: new Date().getTime(),
          blocks: content.blocks.map((item) => (item.id === id ? { ...item, data: { ...currentBlock?.data } } : item))
        };
        setEditorData({ ...updatedBlocks });
        // const id: string = event.detail.target.id;

        // api.saver.save().then((content) => {
        //   let reRender = false;

        //   if (id) {
        //     let currentBlock = content.blocks.find((item) => item.id === id);

        //     if (currentBlock) {
        //       if (currentBlock.data?.text) {
        //         const text = currentBlock.data?.text;
        //         reRender = bold.test(currentBlock.data?.text);
        //         currentBlock.data = { ...currentBlock.data, text: markdownParser(text) };
        //       }
        //     }
        //     const updatedBlocks = {
        //       time: new Date().getTime(),
        //       blocks: content.blocks.map((item) =>
        //         item.id === id ? { ...item, data: { ...currentBlock?.data } } : item
        //       )
        //     };

        //     if (currentBlock?.id && reRender) {
        //       if (reRender) {
        //         api.blocks.update(currentBlock.id, { ...currentBlock.data });
        //       }
        //     }
        //     setEditorData({ ...updatedBlocks });
        //   }
        // });
      },
      autofocus: true,
      tools: {
        header: Header,
        paragraph: {
          //@ts-ignore
          class: MyParagraph,
          inlineToolbar: true,
          config: {
            preserveBlank: true
          }
        }
      }
    });
  };

  return (
    <>
      <div id="editorjs" />
    </>
  );
};

export default Editor;
