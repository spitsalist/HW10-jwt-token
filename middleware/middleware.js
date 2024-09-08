import jwt from 'jsonwebtoken'

export const authJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(403).json({message: 'Authorization token is required'})
    }
        try{
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            req.user = decoded
            next()
        }catch(e){
            if(e instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({message: 'Invalid token'})
            }else if (e instanceof jwt.TokenExpiredError) {
                return res.status(401).json({message: 'Token has expired'})
            }else {
                return res.status(500).json({message: 'Internal server error'})
            }
        }
    }
export const authRole = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role) {
            return res.status(403).json({message: 'Only admin can access this route'})
            }
            next()
        }
}