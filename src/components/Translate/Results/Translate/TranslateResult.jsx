// TranslateResult component contain drop down menu allow user to select language
// display the translated word from API
import React, { Component } from 'react';
import axios from 'axios';
import path from 'path';

class TranslateResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keywords: [],
      targetLanguage: 'en'
    }

    this.componentWillMount = this.componentWillMount.bind(this);
    this.onLangSelect = this.onLangSelect.bind(this);
  }

  componentWillMount(prevProps, prevState) {
    const mappedKeywords = this.props.keywords.map(v => v.class);
    this.setState({
      keywords: mappedKeywords
    });
  }

  onLangSelect(lang) {
    let language = lang;
    
    this.setState({
      targetLanguage: language
    }, () => {
      axios.post('/api/translate', { keywords: this.state.keywords, source: 'en', target: this.state.targetLanguage })
        .then((result) => {
          let translations = result.data.data.translations.map(v => v.translatedText);
          this.props.getTranslation(translations, this.state.targetLanguage);
        });
    });
  }

  render() {
    return (
      <div className="img-hover">
        <div className="withAudio">
            { 
              <div style={{display: "block"}}>
                <img className={ this.props.playing ? "wave pulse-ring" : "wave" } src={"assets/levels.png"} style={{display: "inline"}}/>
                <p className="translate-header">Audio format supported</p>
              </div>
              }
          <div className="flags img-responsive img-rounded" >
            <img className="flagImg" src={"assets/france.png"} onClick={() => {this.onLangSelect("fr"); this.props.changeTranscriptionLanguage("fr");}}/>
          </div>
          <div className="flags img-responsive img-rounded" >
            <img className="flagImg" src={"assets/japan.png"} onClick={() => {this.onLangSelect("ja"); this.props.changeTranscriptionLanguage("ja");}}/>
          </div>
          <div className="flags img-responsive img-rounded" >
            <img className="flagImg" src={"assets/spain.png"} onClick={() => {this.onLangSelect("es"); this.props.changeTranscriptionLanguage("es");}}/>
          </div>
          <div className="flags img-responsive img-rounded" >
            <img className="flagImg" src={"assets/germany.png"} onClick={() => {this.onLangSelect("de"); this.props.changeTranscriptionLanguage("de");}}/>
          </div>
          <div className="flags img-responsive img-rounded" >
            <img className="flagImg" src={"assets/portugal.png"} onClick={() => {this.onLangSelect("pt"); this.props.changeTranscriptionLanguage("pt");}}/>
          </div>
          <div className="flags img-responsive img-rounded" >
            <img className="flagImg" src={"assets/italy.png"} onClick={() => {this.onLangSelect("it"); this.props.changeTranscriptionLanguage("it");}}/>
         </div>
       </div>
       <div className="comingSoon">
          <div className="flags img-responsive img-rounded" >
            <img className="flagImg" src={"assets/south-korea.png"} onClick={() => {this.onLangSelect("ko")}}/>
          </div>
          <div className="flags img-responsive img-rounded" >
            <img className="flagImg" src={"assets/israel.png"} onClick={() => {this.onLangSelect("iw")}}/>
          </div>
          <div className="flags img-responsive img-rounded" >
            <img className="flagImg" src={"assets/india.png"} onClick={() => {this.onLangSelect("hi")}}/>
          </div>
          <div className="flags img-responsive img-rounded" >
            <img className="flagImg" src={"assets/china.png"} onClick={() => {this.onLangSelect("zh-CN")}}/>
          </div>
        </div>
      </div>
    )
  }
}

export default TranslateResult;