import bcrypt from 'bcrypt'
export const users = [
    { id: 1, username: 'user1', email: 'user1@mail.com', password: bcrypt.hashSync('12345', 10), role: 'user' },
    { id: 2, username: 'admin', email: 'admin@mail.com', password: bcrypt.hashSync('12345', 10), role: 'admin' }
]