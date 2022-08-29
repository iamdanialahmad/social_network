// Controller Actions
module.exports.invalid_route = (req, res) => res.status(404).json('PAGE NOT FOUND');

module.exports.bad_request = (req, res) => res.status(400).json('BAD REQUEST');
