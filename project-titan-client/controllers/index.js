const $ = require('jquery');
const req = require('superagent/superagent');


$(document).ready(() => {
  $('.register-tab').hide();
  $('.login-tab').show();
});

// *** UI EVENTS ****
$('.login-tab-button').click((e) => {
  $(e.currentTarget).addClass('active');
  $('.register-tab-button').removeClass('active');

  $('.register-tab').hide();
  $('.login-tab').show();

});

$('.register-tab-button').click((e) => {
  $(e.currentTarget).addClass('active');
  $('.login-tab-button').removeClass('active');

  $('.login-tab').hide();
  $('.register-tab').show();
});
// **** END UI EVENTS ****



// **** FORM EVENTS ****
$('#frmRegister').submit((e) => {
  e.preventDefault();
  var data = serializeForm(e.currentTarget);

  req
  .post('http://localhost:6543/users/')
  .set('Content-Type', 'application/json')
  .send(data)
  .end((err, res) => {
    if (err) {
      // todo: add error handling...
      return;
    }

    localStorage.setItem('sub', res.body.sub);
    window.location.href = 'character_create.hbs';
  });
});

$('#frmLogin').submit((e) => {
  e.preventDefault();
  var data = serializeForm(e.currentTarget);

  req
  .post('http://localhost:6543/users/credentials/verify')
  .set('Content-Type', 'application/json')
  .send(data)
  .end((err, res) => {
    if (err) {
      // todo: add error handling...
      return;
    }

    localStorage.setItem('sub', res.body.sub);
    window.location.href = 'character_create.hbs';
  });
});
// **** END FORM EVENTS *****

function serializeForm(form){
  var data = {};
    var inputs = [].slice.call(form.getElementsByTagName('input'));
    inputs.forEach(input => {
      data[input.name] = input.value;
    });

    return data;
}
