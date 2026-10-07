import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_id, name
        FROM public.category;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getCategoryName = async(id) => {
    const query = `
        SELECT name
        FROM category
        WHERE category_id = $1
    `
    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows[0];
};


const getAllProjectsOfCategory = async(categoryId) => {
    const query = `
        SELECT project.project_id, title, category_id
        FROM project
        JOIN category_has_project cp ON project.project_id = cp.project_id
        WHERE category_id = $1
    `
    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
};


export { getAllCategories, getAllProjectsOfCategory, getCategoryName } 