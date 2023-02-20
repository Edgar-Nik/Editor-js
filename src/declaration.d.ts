
declare const Paragraph;

declare module '*.module.css';
declare module '*.module.scss';
declare module '@editorjs/*';
declare module 'editorjs-drag-drop';

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.png';
declare module '*.jpg';
declare module '*.svg';
declare module '*.webp';
