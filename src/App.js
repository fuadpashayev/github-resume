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
          languages
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
        <div className="container">
          <div className="row py-5 justify-content-center">
            <div className="col-6">
              <div className="row">
                <div className="form">
                  <input
                    className="form-control username-input"
                    placeholder="Enter Github username"
                    value={this.state.query}
                    onChange={e => this.setState({query: e.target.value})}
                    />
                  <button
                    className="form-control btn btn-success generate-button"
                    onClick={this.generate}
                    >Generate</button>
                </div>
                {this.state.isFetching && <div className="text-center mt-2">Loading ...</div>}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              {this.state.user && 
                <div className="results">
                  <div className="result-header">
                      <img src={user.avatarUrl} alt="" />
                      <h1>{user.name || user.userName}</h1>
                      <div><em>Github {user.type}</em></div>
                      <hr />
                  </div>
                  <div className="fields">
                    <div>
                      <span>Github Profile</span>
                      <span><a href={user.profileUrl}>{user.name}</a> joined Github on {user.createdAt} and has <a href={user.profileUrl + '?tab=repositories'}>{user.repos} public repositories</a>.</span>
                    </div>
                    <div>
                      <span>Languages</span>
                      <div>
                        {Object.keys(this.state.languages).map(language => {
                          let allCount = eval(Object.values(this.state.languages).join('+'));
                          let count = this.state.languages[language];
                          let percentage = Math.floor(count / allCount * 100);
                          return <ProgressBar key={language} label={language} value={percentage}/>;
                        })}
                      </div>
                    </div>
                    <div>
                      <span>Public Repositories</span>
                      <div>
                        {this.state.repos.map(repo => 
                          <div key={repo.name} className="repo">
                            <div className="repo-header">
                              <a href={repo.url}><h5>{repo.name}</h5></a>
                              <small>{repo.language ? repo.language + ' - ' : ''}{repo.owner.login === user.userName ? 'Owner' : 'Contributor'}</small>
                              <div className="repo-year">{repo.createdAt}</div>
                              <div className="repo-detail">
                                <div><i className="material-icons">mediation</i> {repo.forks}  <i className="material-icons">stars</i> {repo.stars}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
