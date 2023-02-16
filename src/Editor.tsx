import Checklist from '@editorjs/checklist';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from './paragraph';
import Embed from '@editorjs/embed';
import List from '@editorjs/list';
import RawTool from '@editorjs/raw';
import SimpleImage from '@editorjs/simple-image';
import { useEffect, useRef, useState } from 'react';
import DragDrop from 'editorjs-drag-drop';

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
        new DragDrop(editor);
      },

      onChange: async (api, event) => {
        if (event.type !== 'block-changed') {
          return;
        }

        const content = await api.saver.save();

        setEditorData({ time: new Date().getTime(), blocks: content.blocks });
      },
      autofocus: true,
      tools: {
        header: {
          //@ts-ignore
          class: Header,
          inlineToolbar: ['link'],
          shortcut: 'CMD+SHIFT+H',
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4],
            defaultLevel: 2
          }
        },
        paragraph: {
          //@ts-ignore
          class: Paragraph,
          inlineToolbar: true,
          config: {
            preserveBlank: true
          }
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
          shortcut: 'CMD+SHIFT+L'
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        raw: RawTool,
        image: {
          class: SimpleImage,
          inlineToolbar: true
        },
        embed: {
          class: Embed,
          inlineToolbar: true,
          config: {
            services: {
              youtube: true,
              coub: true
            }
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
