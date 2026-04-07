class User {
static id = 1
    
    constructor(username, password) {
        this.id = User.id++
        this.username = username
        this.password = password
        this.level = 1
    }
}


export default User