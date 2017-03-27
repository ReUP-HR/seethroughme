// Results React Component contain dropdown list and translate Results
import React, { Component } from 'react';
// import Keyword from './Keyword/Keyword.js';
import TranslateResult from './Translate/TranslateResult.jsx';
import WordTile from './WordTile/WordTile.jsx';
import OCR from '../OCR/OCR.jsx';
import axios from 'axios';

let TranscribeSection;

class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wordTiles: [],
      spokenLanguage: '',
      playing: false,
      transcribing: false,
      transcribeSpinner: false,
      ocrString: null,
      originalOCRString: null,
      transcriptionLanguage: 'en',
    }

    this.getTranslation = this.getTranslation.bind(this);
    this.spokenLanguages = {
      en: 'en-US_AllisonVoice',
      de: 'de-DE_DieterVoice',
      es: 'es-ES_LauraVoice',
      fr: 'fr-FR_ReneeVoice',
      it: 'it-IT_FrancescaVoice',
      ja: 'ja-JP_EmiVoice',
      pt: 'pt-BR_IsabelaVoice'
    };
    this.spokenLanguage = '';
    this.soundWaveHandler = this.soundWaveHandler.bind(this);
    this.startTranscription = this.startTranscription.bind(this);
    this.transcribe = this.transcribe.bind(this);
    this.changeTranscriptionLanguage = this.changeTranscriptionLanguage.bind(this);
  }

  getTranslation(translations, newLanguage) {
    let newwords = this.props.keywords.map((keyword, index) => {
      keyword.translation = translations[index];
      return keyword;
    });
    this.setState ({
      wordTiles: newwords,
      spokenLanguage: this.spokenLanguages[newLanguage]
    })
  }

  soundWaveHandler() {
    this.setState({
      playing: !this.state.playing
    })
  }

  startTranscription() {
    console.log('STARTING TRANSCRIPTION');
    this.setState({
      transcribing: true,
      transcribeSpinner: true
    })
  }

  finishTranscription() {
    this.setState({
      transcribeSpinner: false
    })
  }

  transcribe(text) {
    this.setState({
      ocrString: text,
      originalOCRString: text
    });
  }

  changeTranscriptionLanguage(lang) {
    console.log('CALLING CHANGETRANSCRIPTIONLANGUAGE FOR:', lang);
    let language = lang;
    this.setState({
      transcriptionLanguage: language
    }, () => {
      console.log('transcriptionLanguage set to:', this.state.transcriptionLanguage);
      axios.post('/api/translateTranscription', { keywords: [this.state.originalOCRString], source: 'en', target: this.state.transcriptionLanguage })
        .then((result) => {
          console.log('result.data.data.translations in changeTranscriptionLanguage:', result.data.data.translations[0].translatedText);
          // let translations = result.data.data.translations.map(v => v.translatedText);
          this.setState({
            ocrString: result.data.data.translations[0].translatedText
          })
          // this.props.getTranslation(translations, this.state.targetLanguage);
        });
    });
  }

  componentWillMount() {
    TranscribeSection = () => (
        <button className="btn btn-primary" onClick={this.startTranscription}>Click here to transcribe!</button>
      )
  }

  render() {
    // console.log('CURRENT STATE OF TRANSCRIBING:', this.state.transcribing);

    if (this.state.transcribing && this.state.ocrString === null) {
      TranscribeSection = () => (
        <OCR imgURL={this.props.imgURL} ocrString={this.state.ocrString} transcribe={this.transcribe} />
      )
    } 

    return (
      <div className="results-container, tile">
        <div className="results-item">
          <div style={{display: "block", margin: "10px"}}>
            <p className="translate-header" style={{display: "inline", fontSize:"14px", fontWeight:"bold"}}>Click to translate!</p>
          </div>
          <TranslateResult keywords={this.props.keywords} getTranslation={this.getTranslation} playing={this.state.playing} changeTranscriptionLanguage={this.changeTranscriptionLanguage}/>
        </div>
        <WordTile keywords={this.props.keywords} wordTiles={ this.state.wordTiles } spokenLanguage={this.state.spokenLanguage} soundWaveHandler={this.soundWaveHandler}/>
        <div className="ocr-container">
          <TranscribeSection />
        </div>
      </div>
    )
  }
}

export default Results;