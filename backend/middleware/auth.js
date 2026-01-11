import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message:"Unauthorized"})
    }

    // Extract token after "Bearer "
    const token = authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id;
        next() // Add parentheses here

    } catch (error) {
        console.log(error); // Add logging to help debug
        res.status(401).json({message:"Unauthorized"})
    }
}

export default authUser