
const authorizeRole = (...roles)=>{
    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){

            return res.status(401).send({message:"Access Denied UnAuthorized"});
        }
        next();

    }
}


module.exports  = authorizeRole;