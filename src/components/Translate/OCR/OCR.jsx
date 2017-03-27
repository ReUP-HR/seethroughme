import React, { Component } from 'react';
import Tesseract from 'tesseract.js';

 class OCR extends Component {
   constructor(props) {
     super(props);
   }

  componentWillMount() {
    let context = this;
    // console.log('CALLING TESSERACT RECOGNIZE');
    Tesseract.recognize(this.props.imgURL, {
      lang: 'eng'
    })
    .then(function(result) {
      // console.log('OCR RESULTS:', result.text);
      context.props.transcribe(result.text);
    });
  }

  render() {

    return (
        <div className="OCRTile">
          <p className="translate-header" style={{display: "inline", fontSize:"14px", fontWeight:"bold"}}>Transcription</p>
          <div>
            { !this.props.ocrString ? (<img src="assets/spinner2.gif" />) : this.props.ocrString}
          </div>
        </div>
    )
  }
  
}

export default OCR;
