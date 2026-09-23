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
