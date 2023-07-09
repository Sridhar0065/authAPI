import User from "./User.js";

import jwt from "jsonwebtoken"

const isAuthenticated = async (req,res,next) => {
    const {token} = req.cookies;
    if(token)
    {
        const userId = jwt.verify(token,"sridhar");
        req.user = await User.findById(userId);
        next();
    }
    else
    {
        res.redirect("login");
    }
}

export default isAuthenticated; 