CREATE TABLE organization (
	organization_id SERIAL PRIMARY KEY,
	name VARCHAR(40) NOT NULL,
	description TEXT NOT NULL,
	contact_email VARCHAR(40) NOT NULL,
	logo_filename VARCHAR(100) NOT NULL
);


INSERT INTO organization (organization_id, name, description, contact_email, logo_filename)
VALUES
	(1, 'BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
	(2, 'GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
	(3, 'UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


CREATE TABLE project (
	project_id SERIAL PRIMARY KEY,
	organization_id INT,
	title VARCHAR(50) NOT NULL,
	description TEXT NOT NULL,
	location VARCHAR(150) NOT NULL,
	date DATE NOT NULL,
	FOREIGN KEY (organization_id) REFERENCES organization (organization_id)
);

CREATE TABLE category (
	category_id SERIAL PRIMARY KEY,
	name VARCHAR(20) NOT NULL
);

CREATE TABLE category_has_project (
	category_id INT,
	project_id INT, 
	PRIMARY KEY (category_id, project_id),
	FOREIGN KEY (category_id) REFERENCES category (category_id),
	FOREIGN KEY (project_id) REFERENCES project (project_id),
);

INSERT INTO project
    (organization_id, title, description, location, date)
VALUES

-- BrightFuture Builders (Organization 1)

(1,
 'Community Playground Renovation',
 'Help renovate a local playground by repairing equipment, painting structures, and improving safety for children.',
 'Salt Lake City, Utah',
 '2026-10-10'),

(1,
 'Affordable Housing Construction',
 'Assist with building affordable homes for low-income families through construction, painting, and landscaping.',
 'Provo, Utah',
 '2026-10-17'),

(1,
 'Community Center Restoration',
 'Restore an aging community center by repairing walls, installing fixtures, and improving accessibility.',
 'Ogden, Utah',
 '2026-10-24'),

(1,
 'Neighborhood Park Cleanup',
 'Improve a neighborhood park by collecting litter, repairing benches, and planting trees.',
 'West Jordan, Utah',
 '2026-11-07'),

(1,
 'School Building Improvement',
 'Support local schools by painting classrooms, repairing furniture, and improving outdoor learning spaces.',
 'Sandy, Utah',
 '2026-11-14'),


-- GreenHarvest Growers (Organization 2)

(2,
 'Urban Community Garden',
 'Create a community garden where local residents can grow vegetables and learn sustainable farming practices.',
 'Salt Lake City, Utah',
 '2026-10-12'),

(2,
 'Neighborhood Tree Planting',
 'Plant native trees throughout residential neighborhoods to improve air quality and provide natural shade.',
 'Murray, Utah',
 '2026-10-19'),

(2,
 'Food Sustainability Workshop',
 'Teach families how to grow vegetables at home, reduce food waste, and practice sustainable food production.',
 'Provo, Utah',
 '2026-10-26'),

(2,
 'Community Farm Harvest',
 'Help harvest fresh vegetables from a community farm and distribute produce to families experiencing food insecurity.',
 'Lehi, Utah',
 '2026-11-09'),

(2,
 'School Garden Development',
 'Build educational gardens at local schools to teach students about nutrition, agriculture, and environmental sustainability.',
 'Orem, Utah',
 '2026-11-16'),


-- UnityServe Volunteers (Organization 3)

(3,
 'Community Food Drive',
 'Collect, organize, and distribute donated food to local families and individuals experiencing food insecurity.',
 'Salt Lake City, Utah',
 '2026-10-15'),

(3,
 'Senior Center Volunteer Day',
 'Spend time with senior citizens by organizing recreational activities, assisting with daily tasks, and providing companionship.',
 'Provo, Utah',
 '2026-10-22'),

(3,
 'Winter Clothing Donation',
 'Collect and distribute warm clothing, blankets, and winter essentials to people experiencing homelessness.',
 'Ogden, Utah',
 '2026-10-29'),

(3,
 'Animal Shelter Assistance',
 'Support a local animal shelter by cleaning facilities, preparing supplies, and helping care for rescued animals.',
 'Draper, Utah',
 '2026-11-12'),

(3,
 'Holiday Community Outreach',
 'Prepare and distribute holiday care packages containing food, hygiene products, and essential supplies for families in need.',
 'West Valley City, Utah',
 '2026-12-05');


INSERT INTO category (name)
VALUES ('Construction'), ('Environment'), ('Community');

INSERT INTO category_has_project (category_id, project_id)
VALUES
-- Construction
(1, 1),
(1, 2),
(1, 3),
(1, 5),

-- Environment
(2, 4),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10),

-- Community
(3, 1),
(3, 3),
(3, 4),
(3, 6),
(3, 8),
(3, 9),
(3, 10),
(3, 11),
(3, 12),
(3, 13),
(3, 14),
(3, 15);






