// check the authorization of the user thr middleware:

const adminAuth = (req, res, next)=>{
    // logic of checking if the req is authoqrized
    console.log("Admin auth is under check!")
    const token = "xyz";
    const isAdminAuth = token === "xyz"
    if (!isAdminAuth) {
        res.status(401).send("You are not authorized for this page");
    } else {
        next();
    }
};

module.exports = {
    adminAuth,
}