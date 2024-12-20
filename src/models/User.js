const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, '../data/users.json');

class User {
  static async init() {
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
      await fs.writeFile(USERS_FILE, '[]');
    }
  }

  static async findByUsername(username) {
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    return users.find(user => user.username === username);
  }

  static async create(userData) {
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      password: hashedPassword,
      isAdmin: userData.isAdmin || false,
      ...userData
    };

    users.push(newUser);
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async update(id, updates) {
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    const index = users.findIndex(user => user.id === id);
    
    if (index === -1) return null;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    users[index] = { ...users[index], ...updates };
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    
    const { password, ...userWithoutPassword } = users[index];
    return userWithoutPassword;
  }

  static async delete(id) {
    const users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
    const filteredUsers = users.filter(user => user.id !== id);
    await fs.writeFile(USERS_FILE, JSON.stringify(filteredUsers, null, 2));
  }
}

module.exports = User;