import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { users } from '../user.js'
import { authJWT, authRole } from '../middleware/middleware.js'

const router = new Router()

router.post('/login', (req, res) => {
    const { username, password } = req.body
    try {
        const user = users.find(user => user.username === username)
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.SECRET_KEY, { expiresIn: '10m' })
            res.json({ token })
        } else {
            res.status(401).send('Invalid username or password')
        }
    } catch (e) {
        res.status(500).send('Internal server error')
    }
})

router.put('/update-email', authJWT, (req, res) => {
    const { email } = req.body;
    try {
        const user = users.find(user => user.id === req.user.id)
        if (user) {
            user.email = email;
            res.json({ message: 'Email updated successfully', user })
        } else {
            res.status(404).send('User not found')
        }
    } catch (e) {
        res.status(500).send('Internal server error')
    }
});

router.delete('/delete-account', authJWT, (req, res) => {
    const userId = req.user.id
    try {
        const userIndex = users.findIndex(user => user.id === userId)
        if(userIndex !== -1) {
            users.splice(userIndex, 1)
            return res.json({message: 'Account succesfuly deleted'})
        }else {
            return res.status(404).json({message: 'User not found'})
        }
    }catch(e) {
        res.status(500).send('Internal server error')
    }
})
router.put('/update-role', authJWT, authRole('admin'), (req, res) => {
    const {id, newRole} = req.body
    try {
        const user = users.find(user => user.id === id)
        if(!user) {
            return res.status(404).json({message: 'User not found'})
        }
        user.role = newRole
        res.json({message: 'Role updated successfully', user})
    }catch(e){
        res.status(500).send('Internal server error')
    }
})

router.post('/refresh-token', authJWT,(req, res) => {
    const user = req.user
    try {
        const newToken = jwt.sign({id: user.id, username: user.username, role: user.role}, process.env.SECRET_KEY, {expiresIn: '10m'})
        res.json({token: newToken})
    }catch(e){
        res.status(500).send('Internal server error')
    }
})

router.get('/protected', authJWT,(req, res) => {
    res.json({message: 'You have acces to protected route'})
})
export default router