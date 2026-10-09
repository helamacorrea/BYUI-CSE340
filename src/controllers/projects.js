import { getAllProjects, getUpcomingProjects, getProjectDetails, getAllCategoriesOfProject, createProject } from '../models/projects.js'
import { getAllOrganizations } from '../models/organizations.js'
import { body, validationResult } from 'express-validator';

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
    const projectDetails = await getProjectDetails(projectId);
    const projectCategories = await getAllCategoriesOfProject(projectId)
    const title = "Project Details";

    res.render('project', {title, projectDetails, projectCategories, projectId });
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


export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation }