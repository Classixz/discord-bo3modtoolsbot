const isHigher = user => {
    const roles = getHigherRoles();
    return user.roles.find(e => roles.includes(e.id));
};

const getHigherRoles = () => {
    return process.env.MANAGEMENT_ROLES.split(",");
};

module.exports = {isHigher, getHigherRoles};