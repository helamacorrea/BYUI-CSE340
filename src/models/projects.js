import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT project_id, project.organization_id, title, project.description, location, date, organization.name as org_name
        FROM public.project
        JOIN organization ON project.organization_id = organization.organization_id;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects} 