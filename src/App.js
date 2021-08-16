import React from 'react';
import './App.css';
import {emailSuggestions} from './data'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      emails: [],
      error: null,
      //The active selection's index
      activeSuggestion: 0,
      //The suggestions that match the user's input
      //eslint-disable-next-line
      filteredSuggestions: [],
      //whether or not the suggestion list is shown
      showSuggestions: false
    }
  };

  
  handleChange = (evt) => {

    const value = evt.currentTarget.value;
   //eslint-disable-next-line
   const filteredSuggestions = emailSuggestions.filter(suggestion => suggestion.toLowerCase().indexOf(value.toLowerCase()) > -1);

    this.setState({value: evt.target.value, error: null, activeSuggestion: 0, filteredSuggestions, showSuggestions: true});
  };

  handleKeyDown = (evt) => {

    const { activeSuggestion, filteredSuggestions } = this.state;
    if(['Enter', 'Tab'].includes(evt.key)) {
      evt.preventDefault();
     //eslint-disable-next-line
      var email = this.state.value.trim();

      if(email && this.isVaidEmail(email))  {
        this.setState({
          emails: [...this.state.emails, this.state.value],
          activeSuggestion: 0,
          showSuggestions: false,
          value: "", 
        });
      }
    }

    // User pressed the up arrow
    if (evt.keyCode === 38) {
      if (activeSuggestion === 0) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion - 1 });
    }
    // User pressed the down arrow
    else if (evt.keyCode === 40) {
      if (activeSuggestion - 1 === filteredSuggestions.length) {
        return;
      }

      this.setState({ activeSuggestion: activeSuggestion + 1 });
    }
  };

  handleDelete = (toBeDeleted) => {
    this.setState({
      emails: this.state.emails.filter(email => email !== toBeDeleted)
    });
  };

  onClick = e => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      value: e.currentTarget.innerText
    });
  };

  isVaidEmail(email) {
    var error = null;

    if(!this.isEmail(email)) {
      error = "Invalid email address";
    }

    if(error) {
      this.setState({ error })

      return false;
    }

    return true;

}

isEmail(email) {
  return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
}





  render() {
   const {
     onClick,
    state: {
      activeSuggestion,
      filteredSuggestions,
      showSuggestions,
      value
    }
  } = this;

  let suggestionListComponent;

  if(showSuggestions && value) {
    if(filteredSuggestions.length) {
      suggestionListComponent = (
        <ul class="suggestions">
          {filteredSuggestions.map((suggestion, index) => {
            let className;

            if(index === activeSuggestion) {
              className = "suggestion-active";
            }

            return(
              <li className={className} key={suggestion} onClick={onClick}>
                {suggestion}
              </li>
            );
          })}
        </ul>
      );
    }
  }
  
    return (
      <div className="wrapper">
       {this.state.emails.map(email => (
       <div className="email-chip" key={email}>
         {email}

         <button
         type="button"
         className="delete-button"
         onClick={() => this.handleDelete(email)}
         >
           &times;
         </button>
         </div>))}

        <input
        className={"email-input " + (this.state.error && " has-error")}
      placeholder="Enter recipients..."
      value={this.state.value}
      onChange={this.handleChange}
      onKeyDown={this.handleKeyDown}
      />
    {suggestionListComponent}
    {this.state.error && <p className="error">{this.state.error}</p>}
      </div>
      
    );
  }
}

export default App;
