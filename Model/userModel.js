
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        fullname: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false,unique: true},
        password: { type: DataTypes.STRING, allowNull: false },
        image: { type: DataTypes.STRING, allowNull: false },
        nums: { type: DataTypes.STRING, allowNull: true },
        code: { type: DataTypes.STRING, allowNull: true },
        expires: { type: DataTypes.STRING, allowNull: true },
        trial: { type: DataTypes.STRING, allowNull: true },
        verified: { type: DataTypes.BOOLEAN, defaultValue: false },
        role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
    })
    return User
}