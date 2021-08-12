import moment from "moment";

export default class RepoModel {
    constructor(data){
        this.name = data.name;
        this.url = data.html_url;
        this.createdAt = moment(data.created_at).format('YYYY');
        this.forks = data.forks_count;
        this.stars = data.watchers;
        this.language = data.language;
        this.owner = data.owner;
    }
}