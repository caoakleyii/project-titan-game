const $ = require('jquery');
const req = require('superagent/superagent');

let sub = localStorage.getItem('sub');

function pageLoad() {
  loadCharacters();
}

$('.create-character-btn').click((e) => {
  $('.create-character-window').show();
});

$('#frmCreateCharacter').submit((e) => {
  e.preventDefault();

  var data = serializeForm(e.currentTarget);

  req
  .post(`http://localhost:6543/users/${sub}/characters`)
  .set('Content-Type', 'application/json')
  .send(data)
  .end((err, res) => {
    if(err){
      return;
    }
    localStorage.setItem('character-sub', res.body.sub);
    window.location.href = "game.hbs";
  });

});


pageLoad();

function loadCharacters() {
  req
    .get(`http://localhost:6543/users/${sub}/characters`)
    .end((err, res) => {
      let { characters } = res.body;
      characters.forEach((c) => {

        $('#character-list').append(
          `<li class='character' data-sub='${c._id}'>
            <span class='name'>${c.name}</span>
            <span class='level right'>${c.level}</span>
          </li>`
        );
      });

      $('.character').click((e) => {
        let characterSub = $(e.currentTarget).data('sub');

        req
          .get(`http://localhost:6543/characters/${characterSub}`)
          .end((err, res) => {
              if (err) {
                return;
              }
              localStorage.setItem('character', JSON.stringify(res.body));
              window.location.href = "game.hbs";
          });
        localStorage.setItem('character-sub', characterSub);

      });
    });
}


function serializeForm(form){
  var data = {};
    var inputs = [].slice.call(form.getElementsByTagName('input'));
    inputs.forEach(input => {
      data[input.name] = input.value;
    });

    return data;
}
