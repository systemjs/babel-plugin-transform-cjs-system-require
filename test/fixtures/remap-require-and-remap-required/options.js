module.exports = {
	requireName: 'require',
	mappedRequireName: '$__require',
	map: function(name) {
		return name.substring(0, 8);
	}
};