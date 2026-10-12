import db from './db.js'

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

export {createUser};

