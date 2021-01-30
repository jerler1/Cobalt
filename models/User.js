module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define("User", {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50],
        isAlphanumeric: true,
        unique: true,
      },
    },
  });

  User.associate = function (models) {
    // Associating User with Drawings.
    // When a user is deleted, delete all their drawings.
    Author.hasMany(models.Drawing, {
      onDelete: "cascade",
    });
  };

  return User;
};
