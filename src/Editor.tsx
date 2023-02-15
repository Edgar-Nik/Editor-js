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

      onChange: async (e) => {
        // console.log(e);
        // let content = await e.saver.save();
        let reRender = false;
        // console.log(e);
        const index = e.blocks.getCurrentBlockIndex();

        if (index >= 0) {
          let currentBlock = e.blocks.getBlockByIndex(index);
          console.log(currentBlock?.config);
          if (currentBlock) {
            //   if (currentBlock.data?.text) {
            //     const text = currentBlock.data?.text;
            //     reRender = bold.test(currentBlock.data?.text);
            //     currentBlock.data = { ...currentBlock.data, text: markdownParser(text) };
            //   }
            // }
            // const updatedBlocks = {
            //   time:new Date().getTime(),
            //   blocks: content.blocks.map((item, idx) =>
            //     idx === index ? { ...item, data: { ...currentBlock.data } } : item
            //   )
            // };
            // console.log('-------');
            // console.log(currentBlock?.id);
            // console.log(reRender);
            // console.log('-------');
            // if (currentBlock?.id && reRender) {
            //   if (reRender) {
            //     e.blocks.update(currentBlock.id, { ...currentBlock.data });
            //   }
          }
          // setEditorData({ ...updatedBlocks });
        }
      },
      autofocus: true,
      tools: {
        header: Header,
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
          config: {
            preserveBlank: true
          }
        }
      }
    });
  };

  const test = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (ejInstance.current && e.key === 'Enter') {
      // let content = await ejInstance.current.save();
      console.log(editorData);
    }
  };

  return (
    <>
      <div id="editorjs" onKeyUp={(e) => test(e)} />
    </>
  );
};

export default Editor;
