import { default as React, useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';

const DEFAULT_INITIAL_DATA = () => {
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

const EDITTOR_HOLDER_ID = 'editorjs';

const Editor = (props: any) => {
  const ejInstance = useRef<any>();
  const [editorData, setEditorData] = React.useState(DEFAULT_INITIAL_DATA);

  // This will run only once
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
      holder: EDITTOR_HOLDER_ID,
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
    <React.Fragment>
      <div id={EDITTOR_HOLDER_ID}> </div>
    </React.Fragment>
  );
};

export default Editor;
