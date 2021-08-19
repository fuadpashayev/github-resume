import moment from "moment";

export default class UserModel {
    constructor(data){
        this.userName = data.login;
        this.name = data.name;
        this.displayName = data.name || data.login;
        this.avatarUrl = data.avatar_url;
        this.profileUrl = data.html_url;
        this.reposApiUrl = data.repos_url;
        this.repos = data.public_repos;
        this.followers = data.followers;
        this.location = data.location;
        this.type = data.type;
        this.createdAt = moment(data.created_at).format('YYYY');
    }
}