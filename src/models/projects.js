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

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getUpcomingProjects = async (numer_of_projects) => {
      const query = `
        SELECT 
          project_id,
          title,
          project.description,
          date,
          location,
          org.organization_id,
          org.name as organization_name
        FROM project
		    JOIN organization org ON org.organization_id = project.organization_id
		    WHERE DATE(NOW()) <= date
        ORDER BY date
        LIMIT $1 
      `

      const queryParams = [numer_of_projects];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getProjectDetails = async (id) => {
      const query = `
        SELECT 
          project_id,
          title,
          project.description,
          date,
          location,
          org.organization_id,
          org.name as organization_name
        FROM project
        JOIN organization org ON org.organization_id = project.organization_id
        WHERE project_id = $1
      `

      const queryParams = [id];
      const result = await db.query(query, queryParams);

      return result.rows[0];
}; 

const getAllCategoriesOfProject = async(projectId) => {
    const query = `
        SELECT category.category_id, name, project_id
        FROM category
        JOIN category_has_project cp ON category.category_id = cp.category_id
        WHERE project_id = $1
    `
    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const createProject = async(title, description, location, date, organizationId) => {
    const query = `
    INSERT INTO project (title, description, location, date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
    `
    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

const updateProject = async(title, description, location, date, projectId, organizationId) => {
    const query = `
      UPDATE project
      SET title = $1, description = $2, location = $3, date = $4, organization_id = $6
      WHERE project_id = $5
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, projectId, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;

};

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, getAllCategoriesOfProject, createProject, updateProject } 