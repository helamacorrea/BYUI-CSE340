import db from './db.js'
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash, role=1) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        VALUES
        ($1, $2, $3, $4)
        RETURNING user_id;
    `;

    const queryParams = [name, email, passwordHash, role];
    const result = await db.query(query, queryParams);

    if (result.rows.lenght === 0) {
        throw new Error('Failed to create user');
    }
    if (process.env.ENABLE_SQL_LOGGING == 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
}

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];
    
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }
    
    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (user === null) {
        return null;
    }
    const verification = await verifyPassword(password, user.password_hash);

    if (verification) {
        delete user.password_hash;
        return user;
    } else {
        return null;
    }
}

const getUsersList = async () => {
    const query = `
        SELECT name, email, role_name FROM users JOIN roles ON users.role_id = roles.role_id;
    `;
    const result = await db.query(query);

    return result.rows;
}

export {createUser, authenticateUser, getUsersList};

