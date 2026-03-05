const auth = (req, res, next) => {

    const token = req.headers["authorization"]

    if(!token){
        return res.status(401).json({message:"Unauthorized: No token"})
    }

    if(token !== "mysecrettoken"){
        return res.status(401).json({message:"Unauthorized: Invalid token"})
    }

    next()
}

module.exports = auth