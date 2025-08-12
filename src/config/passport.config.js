import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { JWT_SECRET } from "../utils/jwt.js";
import { userModel } from "../dao/models/user.model.js";
import { createHash, verifyPassword } from "../utils/hash.js";
import { cartModel } from "../dao/models/cart.model.js"; // Importamos el modelo de carrito

export function initializePassport() {
  // Función para crear carrito (completa)
  const createCart = async () => {
    const newCart = await cartModel.create({ products: [] });
    return newCart._id;
  };

  // Estrategia de registro
  passport.use(
    "register",
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async (req, email, password, done) => {
        try {
          const { firstName, lastName, age } = req.body;
          
          if (!email || !password || !firstName || !lastName || !age) {
            return done(null, false, { message: "Todos los campos son requeridos" });
          }

          const existingUser = await userModel.findOne({ email });
          if (existingUser) {
            return done(null, false, { message: "El usuario ya existe" });
          }

          const hashedPassword = await createHash(password);
          const userCart = await createCart();
          
          const user = await userModel.create({
            email,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName,
            age,
            cart: userCart,
            role: email === 'adminCoder@coder.com' ? 'admin' : 'user'
          });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia de login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          const user = await userModel.findOne({ email });
          if (!user) return done(null, false, { message: "Usuario no encontrado" });

          const isValid = await verifyPassword(password, user.password);
          if (!isValid) return done(null, false, { message: "Contraseña incorrecta" });

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Estrategia JWT (versión final)
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          (req) => req?.cookies?.token,
          ExtractJwt.fromAuthHeaderAsBearerToken()
        ]),
        secretOrKey: JWT_SECRET,
        passReqToCallback: true
      },
      async (req, payload, done) => {
        try {
          if (!payload.id) {
            return done(null, false, { message: "Token inválido" });
          }

          const user = await userModel.findById(payload.id).lean();
          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }

          return done(null, {
            id: user._id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            cart: user.cart
          });
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Serialización
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialización
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}