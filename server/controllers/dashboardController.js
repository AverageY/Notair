const Note = require('../models/Notes');
const mongoose = require('mongoose');


const dashboard = async (req, res) => {
    let perPage = 12;
    let page = req.query.page || 1;
    const locals = {
        title: 'Dashboard',
        description: 'Notair is a note taking app that allows you to create, edit, and delete notes.'
    };
    
    
  
    try {
      // Find all notes in the database
      const notes = await Note.aggregate([  // aggregate is used to get substring of title and body
        { $sort: { updatedAt: -1 } },       // to sort notes in descending order of updatedAt
        { $match: { user: new mongoose.Types.ObjectId(req.user.id) } }, // to get notes of logged in user only(important)
        // to get substring of title and body
        {
          $project: {  // project is used to get substring of title and body since the original data will be too long
            title: { $substr: ["$title", 0, 30] }, 
            body: { $substr: ["$body", 0, 100] },
          },
        }
        ])
      .skip(perPage * page - perPage)  // to skip notes on previous pages
      .limit(perPage)                   // to limit notes on current page
      .exec();                          // to execute the query

      const count = await Note.countDocuments();    // to get total number of notes in the database

      res.render('dashboard/index', {
        userName: req.user.firstName, // req.user is available because of passport
        locals,
        notes,
        layout: '../views/layouts/dashboard',
        current: page,                          // to get current page number
      pages: Math.ceil(count / perPage)         // to get total number of pages
    });

    }catch(err) {
      console.log(err);
    }
    
    
}

const dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id }) // to get note by id
    .where({ user: req.user.id })                          // to get note of logged in user only
    .lean();                                               // to get plain javascript object instead of mongoose object
    
    

  if (note) {
    res.render("dashboard/view-note", {
      noteID: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.send("Something went wrong.");
  }
};

const dashboardUpdateNote = async (req, res) => {
    try {
      await Note.findOneAndUpdate(
        { _id: req.params.id },
        { title: req.body.title, body: req.body.body, updatedAt: Date.now() }
      ).where({ user: req.user.id });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

const dashboardDeleteNote = async (req, res) => {
    try {
      await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
const dashboardAddNote = async (req, res) => {
    res.render("dashboard/add", {
      layout: "../views/layouts/dashboard",
    });
  };

const dashboardAddNoteSubmit = async (req, res) => {
    try {
      req.body.user = req.user.id;
      await Note.create(req.body);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };

const dashboardSearch = async (req, res) => {
    try {
      res.render("dashboard/search", {
        searchResults: "",
        layout: "../views/layouts/dashboard",
      });
    } catch (error) {
        console.log(error);
    }
  };

const dashboardSearchSubmit = async (req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
      const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
  
      const searchResults = await Note.find({
        $or: [
          { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
          { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        ],
      }).where({ user: req.user.id });
  
      res.render("dashboard/search", {
        searchResults,
        layout: "../views/layouts/dashboard",
      });
    } catch (error) {
      console.log(error);
    }
  };
  
module.exports = {dashboard, dashboardViewNote, dashboardUpdateNote, dashboardDeleteNote, dashboardAddNote, dashboardAddNoteSubmit, dashboardSearch, dashboardSearchSubmit};