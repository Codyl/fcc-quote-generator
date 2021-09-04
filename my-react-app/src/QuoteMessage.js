import React from "react";
import styles from "./QuoteMessage.css";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

class CategoryButton extends React.Component
{
  render()
  {
    let variant;
    if(this.props.parentState.category === this.props.children.toLowerCase())
    {
      variant = 'primary';
    }
    else
    {
      variant = 'secondary';
    }
    return (
      <Button style={{ margin: '3px'}} onClick={this.props.onClick} variant={variant}>{this.props.children}</Button>
    );
  }
}

class QuoteMessage extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      category: 'business'
    }
    this.getNewQuote = this.getNewQuote.bind(this);
    this.setCategory = this.setCategory.bind(this);
  }
  componentDidMount(){
    this.getNewQuote(this,'business');
  }
  setCategory(e)
  {
    const newCategory = e.target.innerText.toLowerCase();
    this.setState({
      category: newCategory
    });
    this.getNewQuote();
  }
  getNewQuote(){
    const settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://famous-quotes4.p.rapidapi.com/random?category=travel&count=1",
    "method": "GET",
    "headers": {
      "x-rapidapi-key": process.env.REACT_APP_quoteAPIKey,
      "x-rapidapi-host": "famous-quotes4.p.rapidapi.com"
    }
  };
    fetch('https://famous-quotes4.p.rapidapi.com/random?category='+this.state.category+'&count=1',settings)
    .then(response => response.json())
    .then(data => {
       this.setState({author: data[0].author, text: data[0].text});
    }).then(
      () =>
      {

        document.getElementById('quote-box').classList.remove("fadeInText");
        void document.getElementById('quote-box').offsetWidth;
        document.getElementById('quote-box').classList.add("fadeInText");
      }
    );
  }
  render(){
    console.log(styles)
    return (<div style={{textAlign:'center'}}>
      <h1>Inspirational Quotes</h1>
      <summary>Select a category</summary><hr/>
      <CategoryButton onClick={this.setCategory} key='Communication' parentState={this.state}>Communication</CategoryButton>
      <CategoryButton onClick={this.setCategory} key='Business' parentState={this.state}>Business</CategoryButton>
      <CategoryButton onClick={this.setCategory} key='Success' parentState={this.state}>Success</CategoryButton>
      <CategoryButton onClick={this.setCategory} key='Dating' parentState={this.state}>Dating</CategoryButton>
      <CategoryButton onClick={this.setCategory} key='Funny' parentState={this.state}>Funny</CategoryButton>
      <div className='fadeInText' id='quote-box' style={{backgroundColor: 'lightgrey',margin: "10px 10%", borderRadius:"5px", padding: '5px'}}>
      <h2 id='author'>          
        {this.state.author}
      </h2>
      <blockquote id='text'>
        {this.state.text}
      </blockquote>
      </div>
        <a style={{position:'absolute',left:'41%',top:305}} id="tweet-quote" target="_blank" rel="noreferrer" href={`https://twitter.com/intent/tweet?text=${this.state.text}&hashtags=quotes`}>Tweet Quote</a>
        <Button style={{position:'absolute',left:'50%',top:300}} id="new-quote" variant='success' onClick={this.getNewQuote}>New Quote!</Button>
     </div>);
  }
}
export default QuoteMessage;
