const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const userUseCases = require('./use-cases/userUseCases');

function initialize(passport) {

    const authenticateUser = async (userName, password, done) => {

        const userDoc = await userUseCases.getUserByUserName({userName});

        if (userDoc == null) {
            return done(null, false, { message: 'Nombre de usuario inválido' })
        }
    
        try {
            if (await bcrypt.compare(password, userDoc.password)) {
                console.log('User authenticaded');
                return done(null, userDoc);
            } 
            else {
                console.log('Incorrect password');
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
        } catch (error) {
            return done(error);
        }
    
    }

    passport.use(new LocalStrategy({ usernameField: 'userName' }, authenticateUser));
    passport.serializeUser((userDoc, done) => done(null, userDoc._id));
    passport.deserializeUser(async (id, done) => {
        const user = await userUseCases.getUserById({user_id : id}); 
        done(null, user);
    });
}

module.exports = initialize;