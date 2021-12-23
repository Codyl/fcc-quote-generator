import React from "react";
import "./QuoteMessage.css";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";

class CategoryButton extends React.Component {
  render() {
    let variant;
    if (this.props.category === this.props.children.toLowerCase()) {
      variant = "primary";
    } else {
      variant = "secondary";
    }
    return (
      <option style={{ margin: "3px" }} variant={variant}>
        {this.props.children}
      </option>
    );
  }
}
CategoryButton.propTypes = {
  category: PropTypes.string,
  onClick: PropTypes.func,
};

class QuoteMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: "age",
      categorys: [],
    };
    this.getNewQuote = this.fetchNewQuote.bind(this);
    this.setCategory = this.setCategory.bind(this);
    this.myRef = React.createRef();
  }
  componentDidMount() {
    this.fetchNewQuote();
  }
  setCategory() {
    const newCategory = this.myRef.current.value;
    this.setState({
      category: newCategory,
    });
    setTimeout(() => this.fetchNewQuote(), 100);
  }
  getCategory() {
    return this.state.category;
  }
  fetchNewQuote() {
    const settings = {
      async: true,
      crossDomain: true,
      url: `https://famous-quotes4.p.rapidapi.com/random?category=${this.state.category}&count=1`,
      method: "GET",
      headers: {
        "x-rapidapi-key": process.env.REACT_APP_quoteAPIKey,
        "x-rapidapi-host": "famous-quotes4.p.rapidapi.com",
      },
    };
    fetch(settings.url, settings)
      .then((response) => response.json())
      .then((data) => {
        console.log(
          data,
          `https://famous-quotes4.p.rapidapi.com/random?category=${this.state.category}&count=1`
        );
        this.setState({ author: data[0].author, text: data[0].text });
      })
      .then(() => {
        document.getElementById("quote-box").classList.remove("fadeInText");
        void document.getElementById("quote-box").offsetWidth; //Do not remove, required for fade to work!
        document.getElementById("quote-box").classList.add("fadeInText");
      });
  }
  getCategories() {
    fetch("https://famous-quotes4.p.rapidapi.com/", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "famous-quotes4.p.rapidapi.com",
        "x-rapidapi-key": process.env.REACT_APP_quoteAPIKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({ categorys: data });
      })
      .catch((err) => {
        console.error(err);
      });
  }
  componentWillMount() {
    this.getCategories();
  }
  render() {
    CategoryButton.defaultProps = {
      onClick: this.setCategory,
      category: this.getCategory(),
    };

    let catsElems = [];
    this.state.categorys.forEach((cat) => {
      catsElems.push(
        <CategoryButton value={cat} key={cat}>
          {cat}
        </CategoryButton>
      );
    });
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Inspirational Quotes</h1>
        <hr />
        <label htmlFor="category">Choose a category</label>{" "}
        <select
          name="category"
          id="categorySelect"
          ref={this.myRef}
          onChange={this.setCategory}>
          {catsElems}
        </select>
        <div
          className="fadeInText"
          id="quote-box"
          style={{
            backgroundColor: "lightgrey",
            margin: "10px 10%",
            borderRadius: "5px",
            padding: "5px",
          }}>
          <h2 id="author">{this.state.author}</h2>
          <blockquote id="text">{this.state.text}</blockquote>
        </div>
        <a
          style={{ position: "absolute", left: "41%", top: 305 }}
          id="tweet-quote"
          target="_blank"
          rel="noreferrer"
          href={`https://twitter.com/intent/tweet?text=${this.state.text}&hashtags=quotes`}>
          Tweet Quote
        </a>
        <Button
          style={{ position: "absolute", left: "50%", top: 300 }}
          id="new-quote"
          variant="success"
          onClick={() => this.setCategory()}>
          New Quote!
        </Button>
      </div>
    );
  }
}

export default QuoteMessage;
