// GLOBAL STATE OBJECT
const STATE = {};

//
// ─── STATE & RENDER LOGIC ───────────────────────────────────────────────────────
//

function setStateAndRender(newState) {
  Object.assign(STATE, newState);
  render(STATE);
}

function render(state) {

  // render liists page
  if (state.page === 'liists') {
    const liistsTableHtml = generateLiistsTable(state.liists);
    $('#data').html(liistsTableHtml);
  } 
  // render current liist page
  else if (state.page === 'currentLiist') {
    const liistTableHtml = generateCurrentLiistTable(state.currentLiist);
    $('#data').html(liistTableHtml);
    // add-song click handler
    $('#add-song-btn').on('click', function() {
      const addSongFormHTML = generateAddSongForm(state.currentLiist);
      $('#data').html(addSongFormHTML);
      handleAddSongSubmit(STATE.currentLiistID);
    });
    // edit liist click handler
    $('#edit-liist-btn').on('click', function() {
      const editLiistFormHTML = generateEditLiistForm(state.currentLiist);
      $('#data').html(editLiistFormHTML);
      handleEditLiistSubmit();
    });

    // delete liist click handler
    $('#delete-liist-btn').on('click', function() {
      let del = confirm(`Are you sure you want to delete liist ${STATE.currentLiist.name}?`);
      if (del) {
        deleteCurrentLiist(function() {
          getUserLiists(processLiistsData);
        });
      }
    });
    // delete song click handler
    $('#current-liist-table .song-delete-btn').click(function() {
      let songID = $(this).parent().attr('id');
      let songToDelete = getSong(songID);
      let del = confirm(`Are you sure you want to delete the song ${songToDelete.title} from the liist?`);
      if (del) {
        deleteSongInCurrentLiist(songID, renderCurrentLiist);
      }
    });
    // edit song click handler
    $('#current-liist-table .song-edit-btn').click(function() {
      let songID = $(this).parent().attr('id');
      let songToEdit = getSong(songID);
      const editSongFormHTML = generateEditSongForm(songToEdit);
      $('#data').html(editSongFormHTML);
      handleEditSongSubmit(songID);
    });
  }
  // render create-liist page
  else if (state.page === 'create-liist') {
    const createFormHTML = generateCreateForm();
    $('#data').html(createFormHTML);
    handleCreateLiistSubmit();
  }
  // render error page
  else if (state.page === 'error-page') {
    const errorMessage = generateErrorHTML();
    $('#data').html(errorMessage);
  }
}

//
// ─── API CALLS ──────────────────────────────────────────────────────────────────
//

const API_LIISTS_URL = '/liists';
const API_USERS_URL = '/users';

// GET /users (check if user exists)
function getUser(userEmail, callback) {

  const settings = {
    url: API_USERS_URL + `/${userEmail}`,
    datatype: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

// GET /liists (GET ALL LIISTS)
function getUserLiists(callback) {
  const settings = {
    url: API_LIISTS_URL,
    datatype: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

// GET to /liists:ID (GET LIIST BY ID)
function getLiistByID(ID, callback) {
  const settings = {
    url: API_LIISTS_URL + `/${ID}`,
    datatype: 'json',
    type: 'GET',
    success: callback
  };
  
  $.ajax(settings);
}

// PUT TO /liists:ID (EDIT LIIST INFO)
function editCurrentLiist(userInput, callback) {
  const settings = {
    url: API_LIISTS_URL + `/${STATE.currentLiistID}`,
    data: JSON.stringify(userInput),
    contentType: 'application/json',
    datatype: 'json',
    type: 'PUT',
    success: callback
  };

  $.ajax(settings);
}

// POST to /liists/:ID/songs (ADD SONG TO CURRENT LIIST)
function addSongToLiist(songToAdd, callback) {
  const settings = {
    url: API_LIISTS_URL + `/${STATE.currentLiistID}/songs`,
    data: JSON.stringify(songToAdd),
    contentType: 'application/json',
    datatype: 'json',
    type: 'POST',
    success: callback
  };

  $.ajax(settings);
}

// POST to /liists (CREATE NEW LIIST)
function createNewLiist(userInput, callback) {
  const settings = {
    url: API_LIISTS_URL,
    data: JSON.stringify(userInput),
    contentType: 'application/json',
    dataType: 'json',
    type: 'POST',
    success: callback
  };
  $.ajax(settings);
}

// DELETE current liist by ID
function deleteCurrentLiist(callback) {
  const settings = {
    url: API_LIISTS_URL + `/${STATE.currentLiistID}`,
    datatype: 'json',
    type: 'DELETE',
    success: callback
  };
  
  $.ajax(settings);
}
// PUT to /liists/:id/songs (edit song in current liist)
function editSongInCurrentLiist(userInput, callback) {
  const settings = {
    url: API_LIISTS_URL + `/${STATE.currentLiistID}/songs`,
    data: JSON.stringify(userInput),
    contentType: 'application/json',
    datatype: 'json',
    type: 'PUT',
    success: callback
  };

  $.ajax(settings);
}

// DELETE song in current liist
function deleteSongInCurrentLiist(songID, callback) {
  const settings = {
    url: API_LIISTS_URL + `/${STATE.currentLiistID}/songs`,
    data: JSON.stringify({ songID: songID }),
    contentType: 'application/json',
    datatype: 'json',
    type: 'DELETE',
    success: callback
  };

  $.ajax(settings);
}

//
// ─── AJAX RESPONSE PROCESSING FUNCTIONS ─────────────────────────────────────────
//

function processLiistsData(response) {
  let newState;
  
  if (response.liists.length > 0) {
    newState = {
      liists: response,
      page: 'liists'
    };
  }
  else {
    newState = {
      errorMessage: 'You currently have no Liists. Create a new Liist above to get started.',
      page: 'error-page'
    };
  }
  setStateAndRender(newState);
}

function renderCurrentLiist(liist) {
  const newState = {
    currentLiist: liist,
    currentLiistID: liist.id,
    page: 'currentLiist'
  };
  setStateAndRender(newState);
}

//
// ─── RECENT LIISTS HTML ───────────────────────────────────────────────────────
//

function generateLiistsTable(data) {
  let liistsTableRows = [];
  for (let index in data.liists) {
    liistsTableRows.push(
      `<tr id="${data.liists[index].id}" class="liists-table-row">
        <td>${data.liists[index].name}</td>
        <td>${data.liists[index].description}</td>
        <td class="num-of-songs">${data.liists[index].numOfSongs}</td>
      </tr>`
    );
  }

  liistsTableRows = liistsTableRows.join('');

  const liistsTable = `
    <nav id="nav-container">
      <button id="get-liists-btn" class="nav-button">Get liists</button>
      <button id="create-btn" class="nav-button">Create a liist</button>
    </nav>
    <div id="liists-container" class="container">
      <table aria-label="a table of your saved lists" id="liists-table" class="display">
        <thead>
          <tr>
            <th style="width: 30%">liist name</th>
            <th style="width: 60%">description</th>
            <th style="width: 10%">songs</th>
          </tr>
        </thead>
        <tbody id="liists-table-body">
          ${liistsTableRows}
        </tbody>
      </table>
    </div>`;

  return liistsTable;
}

//
// ─── CURRENT LIIST HTML ─────────────────────────────────────────────────────────
//

function generateCurrentLiistTable(liist) {
  if(liist.songs.length > 0) {
    let liistTableRows = [];
    for (let index in liist.songs) {
      liistTableRows.push(
        `<tr id="${liist.songs[index]._id}" class="current-liist-table-row">
          <td class="song-title">${liist.songs[index].title}</td>
          <td class="song-artist">${liist.songs[index].artist}</td>
          <td aria-label="edit info for the song ${liist.songs[index].title}" class="song-edit-btn liist-row-btn"><i class="fas fa-edit"></i></td>
          <td aria-label="delete the song ${liist.songs[index].title} from the liist" class="song-delete-btn liist-row-btn"><i class="fas fa-minus-circle"></i></td>
        </tr>`
      );
    }
  
    liistTableRows = liistTableRows.join('');
  
    const liistTable = `
      <nav id="nav-container">
        <button aria-label="click to get your saved lists" id="get-liists-btn" class="nav-button">Get liists</button>
        <button aria-label="click to create a new list" id="create-btn" class="nav-button">Create a liist</button>
      </nav>
      <div id="liist-container" class="container">
        <div id="liist-container-info" class="container-info">
          <h2 id="liist-name">${liist.name}</h2>
          <p id="liist-description">${liist.description}</p>
          <div aria-hidden="true" class="customHr">.</div>
        </div>
        <button id="add-song-btn" class="liist-button">Add Song</button>
        <button id="delete-liist-btn" class="liist-button">Delete Liist</button>
        <button id="edit-liist-btn" class="liist-button">Edit Liist</button>
        <table aria-label="a table of songs from list ${liist.name}" id="current-liist-table" class="display">
          <thead>
            <tr>
              <th style="width: 32%">track</th>
              <th style="width: 32%">artist</th>
              <th style="width: 2%"></th>
              <th style="width: 2%"></th>
            </tr>
          </thead>
          <tbody id="current-liist-table-body">
            ${liistTableRows}
          </tbody>
        </table>
      </div>`;
  
    return liistTable;
  }
  else {
    const addSongMessage = `
      <nav id="nav-container">
        <button id="get-liists-btn" class="nav-button">Get liists</button>
        <button id="create-btn" class="nav-button">Create a liist</button>
      </nav>
      <div id="liist-container" class="container">
        <div id="liist-container-info" class="container-info">
          <h2 id="liist-name">${liist.name}</h2>
          <p id="liist-description">${liist.description}</p>
          <div aria-hidden="true" class="customHr">.</div>
        </div>
        <button id="add-song-btn" class="liist-button">Add Song</button>
        <button id="delete-liist-btn" class="liist-button">Delete Liist</button>
        <button id="edit-liist-btn" class="liist-button">Edit Liist</button>
        <p id="add-song-message">Liist is currently empty, add a song above.</p>
      </div>
    `;
    return addSongMessage;
  }

}

function getSong(ID) {
  const songIndex = STATE.currentLiist.songs.findIndex(function(element) {
    return element._id == ID;
  });

  return STATE.currentLiist.songs[songIndex];
}

//
// ─── ADD SONG HTML ─────────────────────────────────────────────────────────────
//

function generateAddSongForm(liist) {
  const addSongFormHTML = `
    <nav id="nav-container">
      <button id="get-liists-btn" class="nav-button">Get liists</button>
      <button id="create-btn" class="nav-button">Create a liist</button>
    </nav>
    <div id="add-song-container" class="container">
      <form id="add-song-form" role="form" action="#">
        <fieldset>
          <legend>Add a song to ${liist.name}.</legend>
          <br>
          <div aria-hidden="true" class="customHr">.</div>
          <label for="add-song-name">Song Name:</label>
          <br>
          <input id="add-song-name" type="text" placeholder="The Greatest Song Ever">
          <br>
          <label for="add-song-artist">Artist:</label>
          <br>
          <input id="add-song-artist" type="text" placeholder="Best Artist of All Time">
          <br>
          <input id="add-song-submit" class="form-submit" type="submit" value="Add Song">
        </fieldset>
      </form>
      <button id="add-song-cancel" class="form-submit cancel-btn">Cancel</button>
    </div>
  `;

  return addSongFormHTML;
}

function handleAddSongSubmit() {
  $('#add-song-form').on('submit', function(e) {
    e.preventDefault();

    const songToAdd = {
      title: $('#add-song-name').val(),
      artist: $('#add-song-artist').val(),
      addedDate: new Date()
    };

    addSongToLiist(songToAdd, renderCurrentLiist);
  });
}

//
// ─── EDIT SONG HTML ─────────────────────────────────────────────────────────────
//

function generateEditSongForm(song) {
  const editSongHTML = `
    <nav id="nav-container">
      <button id="get-liists-btn" class="nav-button">Get liists</button>
      <button id="create-btn" class="nav-button">Create a liist</button>
    </nav>
    <div id="edit-liist-container" class="container">
      <form id="edit-song-form" role="form" action="#">
        <fieldset>
          <legend>Edit song info.</legend>
          <br>
          <div aria-hidden="true" class="customHr">.</div>
          <label for="edit-song-title">Song Title:</label>
          <br>
          <input id="edit-song-title" type="text" value="${song.title}" required>
          <br>
          <label for="edit-song-artist">Artist:</label>
          <br>
          <input id="edit-song-artist" type="text" value="${song.artist}" required>
          <br>
          <input id="edit-song-submit" class="form-submit" type="submit" value="Submit Changes">
        </fieldset>
      </form>
      <button id="edit-song-cancel" class="form-submit cancel-btn">Cancel</button>
    </div>
  `;

  return editSongHTML;
}

function handleEditSongSubmit(songID) {
  $('#edit-song-form').on('submit', function(e) {
    e.preventDefault();
    
    const userInput = {
      songID: songID,
      title: $('#edit-song-title').val(),
      artist: $('#edit-song-artist').val()
    };

    editSongInCurrentLiist(userInput, renderCurrentLiist);
  });
}


//
// ─── EDIT LIIST HTML ────────────────────────────────────────────────────────────
//

function generateEditLiistForm(liist) {
  const editLiistHTML = `
  <nav id="nav-container">
    <button id="get-liists-btn" class="nav-button">Get liists</button>
    <button id="create-btn" class="nav-button">Create a liist</button>
  </nav>
  <div id="edit-liist-container" class="container">
    <form id="edit-liist-form" role="form" action="#">
      <fieldset>
        <legend>Edit info for ${liist.name}.</legend>
        <br>
        <div aria-hidden="true" class="customHr">.</div>
        <label for="edit-liist-name">Liist Name:</label>
        <br>
        <input id="edit-liist-name" type="text" value="${liist.name}" required>
        <br>
        <label for="edit-liist-description">Description:</label>
        <br>
        <textarea id="edit-liist-description" type="text" rows="6" required>${liist.description}</textarea>
        <br>
        <input id="edit-liist-submit" class="form-submit" type="submit" value="Submit Changes">
      </fieldset>
    </form>
    <button id="edit-liist-cancel" class="form-submit cancel-btn">Cancel</button>
  </div>
  `;

  return editLiistHTML;
}

function handleEditLiistSubmit() {
  $('#edit-liist-form').on('submit', function(e) {
    e.preventDefault();

    const userInput = {
      name: $('#edit-liist-name').val(),
      description: $('#edit-liist-description').val()
    };

    editCurrentLiist(userInput, renderCurrentLiist);
  });
}


//
// ─── CREATE LIIST HTML ─────────────────────────────────────────────────────────
//

function generateCreateForm() {
  const createFormHTML = `
    <nav id="nav-container">
      <button id="get-liists-btn" class="nav-button">Get liists</button>
    </nav> 
    <div id="create-liist-container" class="container">
      <form id="create-liist-form" role="form" action="#">
        <fieldset>
          <legend>Create a new liist & give it a fun description.</legend>
          <br>
          <div aria-hidden="true" class="customHr">.</div>
          <label for="create-liist-name">Liist Name:</label>
          <br>
          <input id="create-liist-name" type="text">
          <br>
          <label for="create-liist-description">Liist Description:</label>
          <br>
          <textarea id="create-liist-description" type="text" rows="6"></textarea>
          <br>
          <input id="create-liist-submit" class="form-submit" value="Create Liist" type="submit">
        </fieldset>
      </form>
    </div>  
  `;

  return createFormHTML;
}

function handleCreateLiistSubmit() {
  $('#create-liist-form').submit(function(e) {
    e.preventDefault();
    const userInput = {
      name: $('#create-liist-name').val(),
      description: $('#create-liist-description').val()
    };
    createNewLiist(userInput, renderCurrentLiist);
  });
}

//
// ─── ERROR MESSAGE HTML ─────────────────────────────────────────────────────────
//

function generateErrorHTML() {
  const errorHTML = `
    <nav id="nav-container">
      <button id="get-liists-btn" class="nav-button">Get liists</button>
      <button id="create-btn" class="nav-button">Create a liist</button>
    </nav>
    <div id="error-container" class="container">
      <p id="error-text">${STATE.errorMessage}</p>
    </div>
  `;
  return errorHTML;
}

//
// ───BUTTON HANDLERS──────────────────────────────────────────────────────────
//

// GET LIISTS
$('body').on('click', '#get-liists-btn', function() {
  $('#landing-container').hide();
  getUserLiists(processLiistsData);
});

// CREATE LIIST
$('body').on('click', '#create-btn', function() {
  setStateAndRender({ page: 'create-liist' });
});

// BANNER BUTTON
$('#banner-text').on('click', function() {
  $('body').removeClass('logged-in');
  $('#features-container').hide();
  $('#flex-filler').hide();
  $('#features-btn').show();
  $('#landing-container').show();
  $('#data').show();
  $('#data').empty();
});

// GET STARTED
$('#get-started-form').on('submit', function(e) {
  e.preventDefault();
  $('#landing-container').hide();
  $('body').addClass('logged-in');
  const userEmail = $('#user-login-email').val();
  getUser(userEmail.toLowerCase(), function() {
    getUserLiists(processLiistsData);
  });
});

// LIISTS ROW CLICK HANDLERS
$('body').on('click touchstart', '#liists-table .liists-table-row', function() {
  getLiistByID($(this).attr('id'), renderCurrentLiist);
});

// CANCEL BUTTON CLICK HANDLERS
$('body').on('click', '.cancel-btn' , function() {
  renderCurrentLiist(STATE.currentLiist);
});

// THEME TOGGLE
$('#theme-btn').on('click', function() {
  if($('body').hasClass('t--dark')) {
    $('body').removeClass('t--dark');
    $('body').addClass('t--light');
  }
  else if ($('body').hasClass('t--light')) {
    $('body').removeClass('t--light');
    $('body').addClass('t--dark');
  }
});

// FEATURES TOGGLE

$('#features-btn').on('click', function() {
  if($('body').hasClass('logged-in')) {
    $('#data').toggle();
    $('#flex-filler').toggle();
    $('#features-container').toggle();
  }
  else {
    $('#landing-container').toggle();
    $('#features-container').toggle();
  }
});