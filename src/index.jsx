import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { IndexRoute, Router, Route, Link, browserHistory } from 'react-router';
import axios from 'axios';

import Input from './components/Input/Input.jsx';
import Translate from './components/Translate/Translate.jsx'
import './styles/index.css';
import App from './components/app.jsx'

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keywords: [],
      imgURL: '',
      imageURL: "",
      progressVisible: false,
      uploads: [],
      currentKeywords: []
    }

    this.setRootKeywords = this.setRootKeywords.bind(this);
    this.setRootUrl = this.setRootUrl.bind(this);
    this.fetchIBM = this.fetchIBM.bind(this);
    this.handleImageSubmission = this.handleImageSubmission.bind(this);
    this.changeParentUrl = this.changeParentUrl.bind(this);
    this.handleSpinningProgress = this.handleSpinningProgress.bind(this);
    this.setUploads = this.setUploads.bind(this);
    this.setImgURL = this.setImgURL.bind(this);
  }

  setRootKeywords(keywords) {
    this.setState({ keywords }, () => {
      browserHistory.push('/translate');
    })
  }

  setRootUrl(url) {
    this.setState({ imgURL: url });
  }

  setUploads(imgURL) {
    console.log('imgURL inside setUploads: ', imgURL);
    this.setState({
      uploads: this.state.uploads.concat([imgURL])
    });
    console.log('UPLOADS!!:', this.state.uploads);
  }

  setImgURL(imgURL) {
    let current = this.state.keywords.filter((obj) => obj.url === imgURL )[0]['keywords'];
    console.log('Current!!:', current);
    this.setState({ 
      imgURL: imgURL, 
      currentKeywords: current
    })
  }
  // request server /api/upload to receive the ibm results
  // allow passing callback
  fetchIBM(cb) {
    // if the image exists (has been updated by user giving img url or drop down a image) 
    if (this.state.imageURL) {
      axios.post('/api/upload', { url: this.state.imageURL })
        .then(res => {
          res.data.sort(function (a,b) {
            return b.score-a.score;
          });
          let obj = {
            url: this.state.imageURL,
            keywords: res.data
          }
          this.setState({ keywords: [...this.state.keywords, obj] }, () => {
            cb(true);
          });
        })
        .catch(err => {
          console.log("FAIL In App.jsx, request server /api/upload:", err);
          cb(false);
        })
    }
  }

  handleImageSubmission() {
    this.handleSpinningProgress();
    if (this.state.imageURL.length > 0) {
      console.log('State changed to: ', this.state.imageURL);
      this.fetchIBM( (success) => {
        if (success) {
          this.setUploads(this.state.imageURL);
          this.setImgURL(this.state.imageURL);
          console.log("fetchIBM success the state.keywords ", this.state.keywords);
          this.setRootKeywords(this.state.keywords);
          this.handleSpinningProgress();
        } else {
          console.log("fetchIBM failed");
        }
      });

    }
  }

  changeParentUrl(url) {
    console.log('CALLING CHANGEPARENTURL:', url);
    this.setState({ imageURL: url }, () => {
      this.setRootUrl(this.state.imageURL);
      this.handleImageSubmission();
    });
  }

  handleSpinningProgress() {
    console.log('TOGGLING SPINNER');
    this.setState({
    	progressVisible: !this.state.progressVisible      
    })
  }

  render() {
    const { children } = this.props;

    return (
      <div className="react-root">     
        { children && 
        React.cloneElement(children, 
        { setRootKeywords: this.setRootKeywords, 
        keywords: this.state.currentKeywords, 
        setRootUrl: this.setRootUrl,
        imgURL: this.state.imgURL,
        imageURL: this.state.imageURL,
        handleSpinningProgress: this.state.handleSpinningProgress,
        progressVisible: this.state.progressVisible,
        changeParentUrl: this.changeParentUrl,
        fetchIBM: this.fetchIBM,
        uploads: this.state.uploads,
        setImgURL: this.setImgURL
        })}
      </div>
    )
  }
}

ReactDOM.render((
  <Router history={browserHistory} >
    <Route path='/' component={Root}>
      <IndexRoute component={App} />
      <Route path='/translate' component={Translate} />
    </Route>
  </Router>
), document.getElementById('container'));