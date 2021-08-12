import moment from "moment";

export default class UserModel {
    constructor(data){
        this.userName = data.login;
        this.name = data.name;
        this.avatarUrl = data.avatar_url;
        this.profileUrl = data.html_url;
        this.reposApiUrl = data.repos_url;
        this.repos = data.public_repos;
        this.followers = data.followers;
        this.type = data.type;
        this.createdAt = moment(data.created_at).format('YYYY');
    }
}