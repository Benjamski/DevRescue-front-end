'use strict';

const app = require('../app-data');
// const newGame = require('./index.js');
const authApi = require('./api');

let currentUser = {
  token:'',
  id: undefined
};


//display Rescues function used in getAlbums api ajax call for GET below this.
// Passes rescues object to handlebars. Called by getAblums
let displayRescues = function(rescues){
    $('.landing-div').hide(); //this hides the landing page div
    $('.content').html(''); //this clears the content in my table html
  let rescuesListingTemplate = require('../templates/rescue-show.handlebars');
  console.log("display rescues");
    $('.content').append(rescuesListingTemplate({
      rescues : rescues.rescues
    }));
    //when rescue panel is clicked to open edit modal
    $('.edit-rescue').on('click', function() {
      //load clicked rescue ID from data-attribute into local storage for use in auth/api.editRescue call
      localStorage.setItem('ID', $(this).attr('data-attribute'));
      //sets value of 'edit rescue' fields so that they don't default to empty
      // and accidentally delete stuff

      // $('#inputRescueTitle').val($(this).find('.rescue-title').text());
      let rescueTitleText = $(this).closest('tr').children('.rescue-title').text();
      $('#edit-rescue #inputRescueTitle').val(rescueTitleText);

      let rescueUrlText = $(this).closest('tr').children().contents('a').attr('href');
      $('#edit-rescue #inputRescueLink').val(rescueUrlText);
      // the above varies from title and url in that it selects the same this, tr
      // and children of click on ln 24 but then also selects the 'a' anchor
      // tag in their contents and the 'href' attribute
      // this lets the variable fill the url edit form with the link and not
      // Rescue Me as text.


      let rescueTagText = $(this).closest('tr').children('.rescue-tag').text();
      $('#edit-rescue #inputRescueTags').val(rescueTagText);




      // This is my first attempt at the fill form, it doesn't work
      // but talk about growth yo look at that garbage!
      // $('#inputRescueLink').val($(this).find('.rescue-url').text());
      // $('#inputRescueTags').val($(this).find('.rescue-tags').text());
      $('#edit-rescue-modal').modal('show');
      });
    //shows add rescue modal
    $('.open-new-rescue').on('click', function(event){
      event.preventDefault();
      $('#newModal').modal('show');
  });
};


// Moved ajax get for rescues from api to here
const showRescues = () => {
  $.ajax({
    method: "GET",
    url: app.api +'/users/' + currentUser.id +'/rescues/',
    dataType: 'json',
    headers: {
      Authorization: "Token token=" + currentUser.token
    },
    // data: {
    //   "rescue": {
    //     "title": rescue.title,
    //     "url": rescue.url,
    //     "tag": rescue.tag,
    //   }
    // }
  })
  .done(function(rescues){
    console.log('get rescue successful');
    console.log(rescues);
  displayRescues(rescues);
});
};


const signInSuccess = (data) => {
  currentUser.token = data.user.token;
  currentUser.id = data.user.id;
  console.log(app);
  console.log("Sign in successful");
  showRescues();
};

const signOutSuccess = () => {
  currentUser.token = "";
  currentUser.id = undefined;
  console.log(app);
  console.log("You signed OUT bro. Sweet!");
  $('.content').html('');
  // $('.landing-div').show(); no landing div yet
};

const success = (data) => {
  console.log(data);
};

const failure = (error) => {
  console.error(error);
};

// this function gets handlebars template and appends it to my html
let rescueUrl = [];
if (authApi.rescue) {
for (var i = 0; i < authApi.rescues.length; i++) {
  rescueUrl.append([i].rescue.url);
}
}
// migth be obsolete after ui api transfer changes
// this shows rescues by appending the template
// const showRescues = (rescues) => {
//   let rescueListingTemplate = require('../templates/rescue-show.handlebars');
//     // console.log(rescues.rescueUrl);
//     console.log(rescues);
//     $('.content').append(rescueListingTemplate({rescues, rescueUrl}));
//     $('.edit-rescue').on('click', function(event){
//       event.preventDefault();
//     $('#edit-rescue-modal').modal('show');
//     // $('.content').empty  //this makes the content div empty after an edit
//     localStorage.setItem('ID', $(this).attr('data-rescue-id'));
// });
// };

// const newRescueSuccess = (data) => {
//   console.log("You added things you user you");
//   console.log(data);
//   showRescues();
// };
// not calling properly

const editRescueSuccess = (data) => {
  console.log("you edited this!");
  console.log(data);
  $('#edit-rescue-modal').modal('hide');
  showRescues();
};

const deleteRescueSuccess = (data) => {
  $('#delete-rescue-modal').modal('hide');
  console.log("you deleted things!");
  console.log(data);
  showRescues();
};



module.exports = {
  failure,
  success,
  signOutSuccess,
  signInSuccess,
  app,
  currentUser,
  showRescues,
  editRescueSuccess,
  deleteRescueSuccess
};
