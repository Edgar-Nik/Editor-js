import { useState, useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';

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
        let content = await e.saver.save();

        setEditorData({ time: content.time ?? new Date().getTime(), blocks: content.blocks });
      },
      autofocus: true,
      tools: {
        header: Header
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
