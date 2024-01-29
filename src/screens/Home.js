import React, { useState } from 'react';
import { Editor, EditorState, convertToRaw, RichUtils, convertFromRaw  } from 'draft-js';
import './Home.css';



const styleMap = {
  'REDCOLOR': {
    color: 'red',
  },
};


export default function Home() {
  const [editorState, setEditorState] = useState(() => {
   const oldStateJson = localStorage.getItem('editor-state');

   // check if json from previous edit is present
    if (!oldStateJson) {
      return EditorState.createEmpty();
    } else {
      const content =  convertFromRaw(JSON.parse(oldStateJson));
      // check if any text is present; ignore if meta data related to formatting is saved
      const text = JSON.parse(oldStateJson).blocks.map(block => block.text).join('\n');
      return !!text
        ? EditorState.createWithContent(content)
        : EditorState.createEmpty();
    }
  });

  const onChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    const selection = newEditorState.getSelection();
    let rawText = contentState.getPlainText();

    if (rawText.startsWith('* ') && !newEditorState.getCurrentInlineStyle().has('BOLD')) {
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'BOLD');
    }

    if (rawText.startsWith('*** ') && !newEditorState.getCurrentInlineStyle().has('UNDERLINE')) {
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'UNDERLINE');
    }

    if (rawText.startsWith('# ') && !newEditorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType().startsWith('header')) {
      // Apply new style
      rawText = rawText.substring(2);
      newEditorState = RichUtils.toggleBlockType(newEditorState, 'header-one');
    }

    if (rawText.startsWith('** ') && !newEditorState.getCurrentInlineStyle().has('REDCOLOR')) {
      // Apply custom style for red color
      newEditorState = RichUtils.toggleInlineStyle(newEditorState, 'REDCOLOR' )
    }
    


    setEditorState(newEditorState);

  };

  const print = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    localStorage.setItem('editor-state', JSON.stringify(rawContentState));
    console.log(localStorage.getItem('editor-state'));
  }

  

  return (
    <div className="edit-field" >
      <div className="container">
        <div className="side">
          <b>Hello! I am editor.</b>
        </div>
        <div className="side-content-center">
          <div className='buttton-style'>
            <button  onClick={print} style={{fontSize: 12, fontWeight: 'bold', padding: 5, paddingLeft: 20, paddingRight: 20, boxShadow: 20}}>Save</button>
          </div>
        </div>
      </div>
      <div style={{
        border: '5px solid #ccc',
        padding: '10px',
        height: '500px',
        overflow: 'auto',
      }}>
        <Editor customStyleMap={styleMap} editorState={editorState} onChange={onChange} />
      </div>
    </div>
  )

}
//placeholder= {`${localStorage.getItem('items')}`}