/**
 * Contents of this file has been taken from
 * https://github.com/Skysplit/json-api-deserializer
 *
 * It was not pre-compiled and unmaintained so we moved it into our own
 * repository so we can make changes and it will automatically be compiled
 */

const normalizeToArray = (list) => {
	return Array.isArray(list) ? list : [list];
};

const getResource = (resources, type, id) => {
	// lookup resource in (included) resources
	let resource = resources[type]

	// return object with id if the resource was not inlcuded 
	if (!resource) return { id }

	// return whole resource if it was included
	return resource[id];
};

const parseResources = (list) => {
	const resources = {};

	if (!list) {
		return resources;
	}

	for (const resource of normalizeToArray(list)) {
		const { type, id, attributes } = resource;

		resources[type] = resources[type] || {};
		resources[type][id] = Object.assign({ id }, attributes);
	}

	return resources;
};

const mapRelationsToResources = (list, resources) =>
	normalizeToArray(list).map(
		({ id, type, relationships = {} }) => injectRelations(id, type, resources, relationships)
	);

const injectRelations = (id, type, resources, relationships = {}) => {
	return Object.keys(relationships).map((name) => {
		const { data } = relationships[name];
		// Skip if there is no data field
		if (!data) {
			// when relationship is null set relationship with id equal to null
			resources[type][id][name] = { id: null }
			return;
		}

		let relation;

		if (Array.isArray(data)) {
			relation = data.map((data) => getResource(resources, data.type, data.id));
		} else {
			relation = getResource(resources, data.type, data.id);
		}

		resources[type][id][name] = relation;

		return getResource(resources, type, id);
	});
};

export default ({ data, included = [] }) => {
	if (!data) {
		return;
	}
	/**
	 * parse resources.
	 * included first, then requested resource
	 */
	const resources = Object.assign(
		{},
		parseResources(included),
		parseResources(data)
	);

	mapRelationsToResources(included, resources),
		mapRelationsToResources(data, resources);

	if (Array.isArray(data)) {
		return data.map(({ type, id }) => getResource(resources, type, id));
	} else {
		return getResource(resources, data.type, data.id);
	}
};
