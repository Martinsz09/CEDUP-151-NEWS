const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.getRegister = (req, res) => {
    res.render('user/index');
};

exports.postRegister = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('user/index', { errorMessage: 'E-mail já registrado.' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: passwordHash });
        await user.save();

        res.redirect('/login');
    } catch (err) {
        console.error(err);
        res.render('user/index', { errorMessage: 'Erro ao registrar. Tente novamente.' });
    }
};


exports.getLogin = (req, res) => {
    res.render('user/login');
};

exports.postLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.render('user/login', { errorMessage: 'Usuário não encontrado.' });
    }

    const passwordH = await bcrypt.compare(password, user.password);

    if (passwordH) {
        req.session.userId = user._id;
        req.session.userImage = user.image;
        res.redirect('/home');
    } else {
        res.render('user/login', { errorMessage: 'Senha incorreta.' });
    }
};
