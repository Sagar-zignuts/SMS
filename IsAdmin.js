const {client} = require('./config/PgConfig')
const bcrypt = require('bcrypt')

const IsAdmin = async()=>{
    try {
        const password = process.env.ADMIN_PASS
        const email = process.env.ADMIN_EMAIL
        const hashedPassword = await bcrypt.hash(password , 10)

        const query = `
            INSERT INTO admins (email , password)
            VALUES 
            ($1 , $2)
            ON CONFLICT (email) DO NOTHING
            RETURNING *
        `;

        const values = [email , hashedPassword]

        const {rows} = await client.query(query , values)

    } catch (error) {
        console.log(`Error in set admin : ${error}`);
    } 
}

module.exports = {IsAdmin};