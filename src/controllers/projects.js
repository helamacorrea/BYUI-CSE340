import { getAllProjects, getUpcomingProjects, getProjectDetails, getAllCategoriesOfProject, createProject, updateProject } from '../models/projects.js'
import { getAllOrganizations } from '../models/organizations.js'
import { body, validationResult } from 'express-validator';
import { addVolunteer, removeVolunteer, getVolunteerProjectsOfUser, isVolunteerOfProject } from '../models/users.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Organization must be a valid integer')
];

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = "Upcoming Service Projects";

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user?.user_id || null;
    const projectDetails = await getProjectDetails(projectId);
    const projectCategories = await getAllCategoriesOfProject(projectId)
    const title = "Project Details";
    const isProjectVolunteer = await isVolunteerOfProject(userId, projectId);

    res.render('project', {title, projectDetails, projectCategories, projectId, isProjectVolunteer });
};

const showNewProjectForm = async (req, res) => {
    const title = "Create Service Project"
    const organizations = await getAllOrganizations()

    res.render('new-project', { title, organizations })
};

const processNewProjectForm = async (req, res) => {
    //input validation
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-project');
    }

    const { organizationId, title, description, location, date } = req.body;
    const projectId = await createProject(title, description, location, date, organizationId);

    req.flash('success', 'Project Created Successfully!');
    res.redirect(`/project/${projectId}`);
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const projectDetails = await getProjectDetails(projectId);
    const title = "Edit Project";
    const organizations = await getAllOrganizations();

    res.render('edit-project', { title, projectDetails, organizations })
}

const processEditProjectForm = async (req, res) => {
    
    const projectId = req.params.id;
    //input validation
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }

    const { title, description, location, date, organizationId } = req.body;
    await updateProject(title, description, location, date, projectId, organizationId);

    req.flash('success', 'Project Updated Successfully!');
    res.redirect(`/project/${projectId}`);
}

const processVolunteerToProject = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.id;
    await addVolunteer(userId, projectId);
    req.flash('success', 'You are now volunteering for this project');
    res.redirect(`/project/${projectId}`);
}

const processWithdrawFromProject = async (req, res) => {
    const userId = req.session.user.user_id;
    const projectId = req.params.id;
    await removeVolunteer(userId, projectId);
    req.flash('success', 'You are not volunteering for this project anymore');

    const currentPage = req.get('Referer');
    const fallback = `/project/${projectId}`;
    let redirectTo = fallback;

    const pathname = new URL(currentPage).pathname;

    if (pathname === '/dashboard' || pathname === fallback) {
        redirectTo = pathname;
    }

    res.redirect(redirectTo);
}


export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm, processVolunteerToProject, processWithdrawFromProject }