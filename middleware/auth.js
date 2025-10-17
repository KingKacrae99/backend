/********************************************
 * Check if user is logged in
*********************************************/
const isAuthenticated = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json("You don't have access. Pls login.")
    }
    next()
}

/********************************************
 * Checks if LoggedIn user is admin
*********************************************/
const isAdmin = (req, res, next) => {
    if (req.session.user) {
        const role = req.session.user.role;
        if (role === "Admin") {
            return next()
        }
        return res.status(401).json("You're not authorized to access this route.")
    }
    return res.status(401).json("Unathorized access denied!.")
}

/*********************************************
 * Checks if loggedIn user is a staff
**********************************************/
const isStaff = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json("You need to login first.")
    }
    const user = req.session.user;
    const userRole = user.role;
    const staffs= ["Admin","Manager","Staff"]
    if (staffs.includes(userRole)) {
        return next()
    }
    return res.status(401).json("Unathorized access! pls contact the system administrator.")
}

/***************************************************
 * Checks if loggedIn user is a manager or admin
****************************************************/
const isManagerOrAdmin = (req, res, next) => {
    if (req.session.user === undefined) {
        return res.status(401).json("You need to login first.")
    }
    const user = req.session.user;
    const userRole = user.role;
    const snrStaff = ["Admin", "Manager",];

    if (snrStaff.includes(userRole)) {
        return next()
    }
    return res.status(401).json("Access denied! Contact system administrator.")
}

module.exports = {
    isAuthenticated,
    isAdmin,
    isStaff,
    isManagerOrAdmin
}