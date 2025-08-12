import { userModel } from "../models/user.model.js";

class UserDao {
    async create(data) {
        return await userModel.create(data);
    }

    async getByEmail(email) {
        return await userModel.findOne({ email });
    }

    async getById(id) {
        return await userModel.findById(id);
    }

    async update(id, data) {
        return await userModel.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await userModel.findByIdAndDelete(id);
    }

    async getAll() {
        return await userModel.find();
    }
}

// Exporta la instancia directamente
export const userDao = new UserDao();