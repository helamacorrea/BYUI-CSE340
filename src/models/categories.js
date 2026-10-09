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

const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO category_has_project (project_id, category_id)
        VALUES ($1, $2);
    `;
    const queryParams = [projectId, categoryId];
    await db.query(query, queryParams);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    const query = `
        DELETE FROM category_has_project
        WHERE project_id = $1;
    `;
    const queryParams = [projectId];
    await db.query(query, queryParams);
    console.log("Project ID:", projectId);
    console.log("Category IDs:", categoryIds);
    categoryIds.forEach(async category => {
      await assignCategoryToProject(projectId, category);
    });
};

export { getAllCategories, getAllProjectsOfCategory, getCategoryName, updateCategoryAssignments } 