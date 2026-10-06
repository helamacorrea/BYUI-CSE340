import express from 'express';

import { showHomePage } from "./controllers/index.js";
import { showCategoriesPage } from "./controllers/categories.js";
import { showOrgPage } from "./controllers/organizations.js";
import { showProjectsPage } from "./controllers/projects.js";
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrgPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// error testing
router.get('/test-error', testErrorPage);

export default router;