import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Community = sequelize.define('Community', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'general',
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

export default Community;
