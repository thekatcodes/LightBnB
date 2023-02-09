const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
	user: "vagrant",
	password: "123",
	host: "localhost",
	database: "lightbnb",
});

// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)})

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
	return pool
		.query(`SELECT * FROM users WHERE users.email = $1;`, [email])
		.then((user) => {
			console.log(user.rows[0]); // gets object {} of user info and not array of obj [{}]
			return user.rows[0];
		})
		.catch((err) => {
			console.log(err.message);
			return null;
		});
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
	return pool
		.query(`SELECT * FROM users WHERE users.id = $1;`, [id])
		.then((user) => {
			console.log(user.rows[0]); // gets object {} of user info and not array of obj [{}]
			return user.rows[0];
		})
		.catch((err) => {
			console.log(err.message);
			return null;
		});
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
	//   const userId = Object.keys(users).length + 1;
	//   user.id = userId;
	//   users[userId] = user;
	//     return Promise.resolve(user);
	const { name, email, password } = user;

	return pool
		.query(
			`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`,
			[name, email, password]
		)
		.then((user) => {
			console.log(user.rows); // gets object {} of user info and not array of obj [{}]
			return user.rows;
		})
		.catch((err) => {
			console.log(err.message);
		});
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
	return pool
		.query(
			`SELECT reservations.id, reservations.start_date, properties.*,  avg(property_reviews.rating) as average_rating
FROM reservations 
JOIN properties ON properties.id = reservations.property_id
JOIN property_reviews ON properties.id = property_reviews.property_id
WHERE reservations.guest_id = $1
GROUP BY properties.id, reservations.id
ORDER BY start_date ASC 
LIMIT $2;`,
			[guest_id, limit]
		)
		.then((result) => {
			console.log(result.rows);
			return result.rows;
		})
		.catch((err) => {
			console.log(err.message);
		});
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
	// 1 array to hold any parameters that may be available for the query
	const queryParams = [];

	// 2 start the query with all information that comes before the WHERE clause
	let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;

	//if a city has been passed in as an option, add the city to the queryParams array and create a WHERE clause for the city
	if (options.city) {
		queryParams.push(`%${options.city}%`);
		queryString += `WHERE city LIKE $${queryParams.length} `;
	}

	//if an owner_id is passed in, only return properties belonging to that owner
	if (options.owner_id) {
		queryParams.push(options.owner_id);
		queryString += queryParams.length > 1 ? "AND" : "WHERE";
		queryString += `properties.owner_id = $${queryParams.length}`;
	}

	// if a minimum_price_per_night and a maximum_price_per_night, only return properties within that price range (same with only minimum price or maximum price)
	if (options.minimum_price_per_night && options.maximum_price_per_night) {
		// convert queryParams into cents (*100)
		queryParams.push(
			options.minimum_price_per_night * 100,
			options.maximum_price_per_night * 100
		);
		// if min and max prices were searched
		queryString += queryParams.length > 1 ? "AND" : "WHERE";
		queryString += ` properties.cost_per_night >= $${
			queryParams.length - 1
		} AND properties.cost_per_night <= $${queryParams.length} `;
	} else if (options.minimum_price_per_night) {
		queryParams.push(options.minimum_price_per_night * 100);
		queryString += queryParams.length > 1 ? "AND" : "WHERE";
		queryString += ` properties.cost_per_night >= $${queryParams.length} `;
	} else if (options.maximum_price_per_night) {
		queryParams.push(options.maximum_price_per_night * 100);
		queryString += queryParams.length > 1 ? "AND" : "WHERE";
		queryString += ` properties.cost_per_night <= $${queryParams.length} `;
	}

	//if a minimum_rating is passed in, only return properties with a rating equal to or higher than that
	if (options.minimum_rating) {
		queryParams.push(options.minimum_rating);
		queryString += queryParams.length > 1 ? "AND" : "WHERE";
		queryString += ` property_reviews.rating >= $${queryParams.length} `;
	}

	// 4 add any query that comes after the WHERE clause
	queryParams.push(limit);
	queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;

	// 5 console log everything just to make sure we've done it right
	console.log(queryString, queryParams);

	// 6 run the query
	return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
	const propertyId = Object.keys(properties).length + 1;
	property.id = propertyId;
	properties[propertyId] = property;
	return Promise.resolve(property);
};
exports.addProperty = addProperty;
