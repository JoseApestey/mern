import { userDao } from '../dao/mongoDao/user.dao.js';
import { createHash, verifyPassword as isValidPassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';
import { UserDTO } from '../dto/user.dto.js';
import { cartService } from './cartService.js';

class UserService {
    constructor(userDao) {
        this.userDao = userDao;
    }

    async register(userData) {
        try {
            const { email, password } = userData;
            
            if (!email || !password) {
                throw new Error('EMAIL_AND_PASSWORD_REQUIRED');
            }

            // Verificar si el usuario ya existe
            const existingUser = await this.userDao.getByEmail(String(email).trim());
            if (existingUser) throw new Error('USER_ALREADY_EXISTS');
            
            // Crear carrito para el usuario
            const cart = await cartService.createCart();
            
            // Hashear la contraseña
            const hashedPassword = await createHash(String(password));
            
            // Crear nuevo usuario
            const newUser = await this.userDao.create({
                ...userData,
                email: String(email).trim(), // Aseguramos formato correcto
                password: hashedPassword,
                cart: cart._id,
                role: String(email).trim().toLowerCase() === 'admincoder@coder.com' ? 'admin' : 'user'
            });
            
            return new UserDTO(newUser);
        } catch (error) {
            throw new Error(`REGISTRATION_ERROR: ${error.message}`);
        }
    }

    async login(credentials) {
        try {
            const { email, password } = credentials;
            
            if (!email || !password) {
                throw new Error('EMAIL_AND_PASSWORD_REQUIRED');
            }

            const emailString = String(email).trim();
            const passwordString = String(password);

            const user = await this.userDao.getByEmail(emailString);
            
            if (!user || !(await isValidPassword(passwordString, user.password))) {
                throw new Error('INVALID_CREDENTIALS');
            }
            
            // Generar token JWT
            const token = generateToken({
                id: user._id,
                email: user.email,
                role: user.role,
                cart: user.cart
            });
            
            return {
                user: new UserDTO(user),
                token
            };
        } catch (error) {
            throw new Error(`LOGIN_ERROR: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            const user = await this.userDao.getById(String(id)); // Conversión explícita
            if (!user) throw new Error('USER_NOT_FOUND');
            return new UserDTO(user);
        } catch (error) {
            throw new Error(`GET_USER_ERROR: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            // Si se actualiza la contraseña, hashearla
            if (data.password) {
                data.password = await createHash(String(data.password));
            }
            
            const updatedUser = await this.userDao.update(String(id), data);
            if (!updatedUser) throw new Error('USER_NOT_FOUND');
            return new UserDTO(updatedUser);
        } catch (error) {
            throw new Error(`UPDATE_USER_ERROR: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const result = await this.userDao.delete(String(id));
            if (!result) throw new Error('USER_NOT_FOUND');
            return true;
        } catch (error) {
            throw new Error(`DELETE_USER_ERROR: ${error.message}`);
        }
    }

    async getAll() {
        try {
            const users = await this.userDao.getAll();
            return users.map(user => new UserDTO(user));
        } catch (error) {
            throw new Error(`GET_ALL_USERS_ERROR: ${error.message}`);
        }
    }
}

// Exportación nombrada
export const userService = new UserService(userDao);