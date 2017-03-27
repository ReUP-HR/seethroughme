import React, { Component } from 'react';
import ImageView from './ImageView/ImageView.jsx';
import Results from './Results/Results.jsx';
import { Link } from 'react-router';
import Slider from 'react-slick';

class Translate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keywords: [],
    }
  }

  render() {
    console.log('this.props.keywords!: ', this.props.keywords);
    console.log('this.state.keywords in render: ', this.state.keywords);
    const settings = { 
      dots: true,
      dotsClass: 'slick-dots slick-thumb',
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      pauseOnHover: true,
    }

    return (
      <div className="translate-container">
        <div className="backButton"><Link className="btn btn-primary" to="/">Back</Link></div>
        <div className="container">
          {this.props.uploads.length > 0 ?
            <Slider {...settings}> 
            {this.props.uploads.map((upload, index) => 
              <div data-index={index} key={index}>
                <div className="container">
                  <img className="thumbnails" src={ upload } onClick={() => this.props.setImgURL(upload)} />
                </div>
              </div>
            )}
          </Slider> : null}
        </div>
        <div className="translate-header">translation results</div>
        <div className="translate-components">
          <div className="image-div"><ImageView imgURL={this.props.imgURL} /></div>
          <div className="results-div"><Results keywords={this.props.keywords} imgURL={this.props.imgURL} /></div>
        </div>
      </div>
    );
  }
}

export default Translate;
