import React, { Component } from 'react';


class App extends Component {
  render() {
    var i = 1;
    return (
      <div className="App">
        <h1>{i === 1 ? 'True!' : 'False'}</h1>
      </div>
    );
  }
}

export default App;