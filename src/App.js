import axios from 'axios';
import React, {Component} from 'react';
import UserModel from './models/UserModel';
import RepoModel from './models/RepoModel';
import ProgressBar from './components/ProgressBar';
import './style/style.css';

class App extends Component {
  state = {
    query: '',
    isFetching: false,
    user: null,
    repos: null,
    languages: []
  }

  generate = () => {
    if(this.state.query.length < 1){
      return;
    }
    this.setState({isFetching: true});
    axios.get(`https://api.github.com/users/${this.state.query}`).then(response => {
      let user = new UserModel(response.data);
      axios.get(user.reposApiUrl).then(response => {
        let languages = {};
        let repos = response.data.map(repoData => {
          let repo = new RepoModel(repoData);
          let language = repo.language;
          let languageCount = languages[language];
          if(language) languages[language] = language in languages ? languageCount + 1 : 1;
          return repo;
        });
        this.setState({
          repos,
          user,
          isFetching: false,
          languages,
          query: ''
        });
        document.title = 'Resume - ' + (user.name || user.userName);
      }).catch(error => {
        this.setState({
          isFetching: false
        });
      });
    }).catch(error => {
      let errorMessage = 'User not found';
      if(error.response.status === 403) errorMessage = error.response.data.message;
      alert(errorMessage);
      this.setState({isFetching: false});
    });
  }

  render(){
    let user = this.state.user;
    return (
      <div className="App">
        <div className="logo">
          <img src="/logo.png" alt="Endava Logo" />
        </div>
        <div className="container">
          <div className="header header-white">
            MY GITHUB RESUME
          </div>
          <div className="form">
            <label htmlFor="username" className="form-header">GITHUB USERNAME</label>
            <input
              id="username"
              className="username-input"
              value={this.state.query}
              onChange={e => this.setState({query: e.target.value})}
              onKeyDown={e => e.keyCode === 13 && this.generateButton.click()}
              />
            <button
              className="generate-button"
              ref={generateButton => this.generateButton = generateButton}
              onClick={this.generate}
            >GENERATE</button>
          </div>
          {this.state.isFetching && <div className="loader">Loading ...</div>}
        </div>


        <div className="results">
          {this.state.user && 
            <>
              <div>
                <div className="header header-black">
                  {user.displayName}
                  <div>A PASSIONATE GITHUB USER</div>
                  <a href={user.profileUrl} className="link">{user.profileUrl}</a>
                </div>
                <div className="result-header">
                    <img src={user.avatarUrl} alt={`${user.displayName} - profile`} />
                    <p className="small-info">
                      On GitHub since {user.createdAt}, {user.displayName} is a developer {user.location ? `based in ${user.location}` : ''} with <a href={user.profileUrl + '?tab=repositories'} className="link">{user.repos} public repositories</a> and <a href={user.profileUrl + '?tab=followers'} className="link">{user.followers} followers</a>
                    </p>
                </div>
                <div className="fields">
                  <div className="header header-black">Languages</div>
                  <div className="language-field">
                    {Object.keys(this.state.languages).map(language => {
                      let allCount = eval(Object.values(this.state.languages).join('+'));
                      let count = this.state.languages[language];
                      let percentage = Math.floor(count / allCount * 100);
                      return <ProgressBar key={language} label={language} value={percentage}/>;
                    })}
                  </div>
                </div>
              </div>
              <div className="header header-black">Popular Repositories</div>
                {this.state.repos.map((repo, index) => 
                  <div key={repo.name} className={`repo repo-${index % 2 ? 'light' : 'dark'}`}>
                    <div className="repo-header">
                      <h5><a href={repo.url} className="link-dark">{repo.name}</a></h5>
                      <small>{repo.language ? repo.language + ' - ' : ''}{repo.owner.login === user.userName ? 'Owner' : 'Contributor'}</small>
                      <p className="small-info">{repo.description}</p>
                      <div className="repo-year">{repo.createdAt}{repo.createdAt !== repo.updatedAt ? `- ${repo.updatedAt}` : ''}</div>
                      <div className="repo-detail">
                        This repository has {repo.stars} stars and {repo.forks} forks. If you would like more information about this repository and my contributed code, please visit <a href={repo.url} className="link">[the repo]</a> on GitHub.
                      </div>
                    </div>
                  </div>
                )}
            </>
          }
        </div>

        <div className="footer">© Fuad Pashayev 2021</div>
      </div>
    );
  }
}

export default App;
