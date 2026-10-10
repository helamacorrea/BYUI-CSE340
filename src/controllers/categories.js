import { getAllCategories, getAllProjectsOfCategory, getCategoryName, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js'
import { getProjectDetails, getAllCategoriesOfProject } from '../models/projects.js';
import { body, validationResult } from 'express-validator';


const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Organization name must be between 3 and 100 characters')
];

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = "Categories";
    res.render('categories', { title, categories });
};

const showCategoryDetais = async (req, res) => {
    const categoryId = req.params.id;
    const projectsOfCategory = await getAllProjectsOfCategory(categoryId);
    const title = "Category Details";
    const categoryName = await getCategoryName(categoryId);

    res.render('category', { title, projectsOfCategory, categoryName, categoryId });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const currentCategories = await getAllCategoriesOfProject(projectId);

    const title = "Assign Categories to Project";

    res.render('assign-categories', {projectId, projectDetails, categories, currentCategories, title});
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categories || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories Updated!');
    res.redirect(`/project/${projectId}`); 
};

const showNewCategoryForm = async (req, res) => {
    const title = "Create New Category";

    res.render('new-category', { title });
}

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const categoryName = await getCategoryName(categoryId);
    const title = "Update Category";

    res.render('edit-category', { title, categoryName, categoryId });
}

const processNewCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    const categoryName = req.body.name || [];
    const categoryId = await createCategory(categoryName);

    req.flash('success', 'Category created successfully!');
    res.redirect(`/category/${categoryId}`);
}

const processEditCategoryForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-category/${req.params.id}`);
    }

    const categoryId = req.params.id;
    const categoryName = req.body.name || [];
    await updateCategory(categoryId, categoryName);

    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${categoryId}`);
}

export { showCategoriesPage, showCategoryDetais, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, showEditCategoryForm, categoryValidation, processNewCategoryForm, processEditCategoryForm }