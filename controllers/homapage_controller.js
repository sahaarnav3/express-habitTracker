module.exports.destroySession = (req, res) => {
    req.logout((err) => {
        if(err){
            console.log(err);
            return res.status(500).send("Error Logging Out.");
        }
        res.redirect('/');
    })
}

module.exports.createHabit = (req, res) => {
    if(!req.isAuthenticated())
        return req.redirect('/');
    res.json(req.user);
}