const homepage = async (req, res) => {
    const locals = {
        title: 'Notair',
        description: 'Notair is a note taking app that allows you to create, edit, and delete notes.'
    };
    res.render('index', {
        locals,
        layout: '../views/layouts/front-page',
    });
};

const about = async (req, res) => {
    const locals = {
        title: 'About Notair',
        description: 'Notair is a note taking app that allows you to create, edit, and delete notes.'
    };
    res.render('about', locals);
}

module.exports = {homepage,about};