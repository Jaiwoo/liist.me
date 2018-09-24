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
    // liists row click handlers
    $('#liists-table .liists-table-row').click(function() {
      getLiistByID($(this).attr('id'), renderCurrentLiist);
    });
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
    // delete liist click handler
    $('#delete-liist-btn').on('click', function() {
      let del = confirm(`Are you sure you want to delete liist ${STATE.currentLiist.name}?`);
      if (del) {
        deleteCurrentLiist();
        getRecentLiists(processLiistsData);
      }
    });
    // delete song click handler
    $('#current-liist-table .song-delete-btn').click(function() {
      let songID = $(this).parent().attr('id');
      let songToDelete = getSongNameToDelete(songID);
      let del = confirm(`Are you sure you want to delete the song ${songToDelete} from the liist?`);
      if (del) {
        deleteSongInCurrentLiist(songID, renderCurrentLiist);
      }
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

const API_URL = '/liists';

// GET /liists (GET ALL LIISTS)
function getRecentLiists(callback) {
  const settings = {
    url: API_URL,
    datatype: 'json',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

// GET to /liists:ID (GET LIIST BY ID)
function getLiistByID(ID, callback) {
  const settings = {
    url: API_URL + `/${ID}`,
    datatype: 'json',
    type: 'GET',
    success: callback
  };
  
  $.ajax(settings);
}

// PUT to /liists:ID (ADD SONG TO CURRENT LIIST)
function addSongToLiist(songToAdd, callback) {
  const settings = {
    url: API_URL + `/${STATE.currentLiistID}/songs`,
    data: JSON.stringify(songToAdd),
    contentType: 'application/json',
    datatype: 'json',
    type: 'PUT',
    success: callback
  };

  $.ajax(settings);
}

// POST to /liists (CREATE NEW LIIST)
function createNewLiist(userInput, callback) {
  const settings = {
    url: API_URL,
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
    url: API_URL + `/${STATE.currentLiistID}`,
    datatype: 'json',
    type: 'DELETE',
    success: callback
  };
  
  $.ajax(settings);
}

// DELETE song in current liist
function deleteSongInCurrentLiist(songID, callback) {
  const settings = {
    url: API_URL + `/${STATE.currentLiistID}/songs`,
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
      errorMessage: 'There are currently no Liists. Create a new Liist above to get started.',
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
        <td>${data.liists[index].owner}</td>
        <td>${data.liists[index].numOfSongs}</td>
      </tr>`
    );
  }

  liistsTableRows = liistsTableRows.join('');

  const liistsTable = `
    <div id="liists-container" class="container">
      <h2 id="liists-container-title" class="container-title">Recent Liists</h2>
      <table id="liists-table">
        <thead>
          <tr>
            <th>liist name</th>
            <th>created by</th>
            <th style="width: 10%">🎵's</th>
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
          <td class="song-addedBy">${liist.songs[index].addedBy}</td>
          <td class="song-delete-btn">X</td>
        </tr>`
      );
    }
  
    liistTableRows = liistTableRows.join('');
  
    const liistTable = `
      <div id="liist-container" class="container">
        <div id="liist-container-info" class="container-info">
          <h2 id="liist-name">${liist.name}</h2>
          <h3 id="liist-owner">Created By: ${liist.owner}</h3>
          <div id="liist-description">${liist.description}</div>
        </div>
        <button id="add-song-btn" class="liist-button">Add Song</button>
        <button id="delete-liist-btn" class="liist-button">Delete Liist</button>
        <table id="current-liist-table">
          <thead>
            <tr>
              <th style="width: 40%">track</th>
              <th style="width: 25%">artist</th>
              <th style="width: 25%">added by</th>
              <th>❌</th>
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
      <div id="liist-container" class="container">
        <div id="liist-container-info" class="container-info">
          <h2 id="liist-name">${liist.name}</h2>
          <h3 id="liist-owner">Created By: ${liist.owner}</h3>
          <div id="liist-description">${liist.description}</div>
        </div>
        <button id="add-song-btn" class="liist-button">Add Song</button>
        <button id="delete-liist-btn" class="liist-button">Delete Liist</button>
        <p id="add-song-message">Liist is currently empty, add a song above.</p>
      </div>
    `;
    return addSongMessage;
  }

}

function getSongNameToDelete(ID) {
  const songIndex = STATE.currentLiist.songs.findIndex(function(element) {
    return element._id == ID;
  });

  return STATE.currentLiist.songs[songIndex].title;
}

//
// ─── ADD SONG HTML ─────────────────────────────────────────────────────────────
//

function generateAddSongForm(liist) {
  const addSongFormHTML = `
    <div id="add-song-container" class="container">
      <form id="add-song-form" role="form" action="#">
        <fieldset>
          <legend>Add a song to ${liist.name}.</legend>
          <label for="add-song-addedBy">Your Name:</label>
          <br>
          <input id="add-song-addedBy" type="text">
          <br>
          <label for="add-song-name">Song Name:</label>
          <br>
          <input id="add-song-name" type="text">
          <br>
          <label for="add-song-artist">Artist:</label>
          <br>
          <input id="add-song-artist" type="text">
          <br>
          <input id="add-song-submit" class="form-submit" type="submit" value="Add Song">
        </fieldset>
      </form>
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
      addedBy: $('#add-song-addedBy').val(),
      addedDate: new Date()
    };

    addSongToLiist(songToAdd, renderCurrentLiist);
  });
}

//
// ─── CREATE LIIST HTML ─────────────────────────────────────────────────────────
//

function generateCreateForm() {
  const createFormHTML = `
    <div id="create-liist-container" class="container">
      <form id="create-liist-form" role="form" action="#">
        <fieldset>
          <legend>Create a new liist & give it a fun description to share with others.</legend>
          <label for="create-owner-name">Your Name:</label>
          <br>
          <input id="create-owner-name" type="text">
          <br>
          <label for="create-liist-name">Liist Name:</label>
          <br>
          <input id="create-liist-name" type="text">
          <br>
          <label for="create-liist-description">Liist Description:</label>
          <br>
          <textarea id="create-liist-description" type="text"></textarea>
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
      owner: $('#create-owner-name').val(),
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
    <div id="error-container" class="container">
      <p id="error-text">${STATE.errorMessage}</p>
    </div>
  `;
  return errorHTML;
}

//
// ─── NAV-BUTTON HANDLERS──────────────────────────────────────────────────────────
//

$('#get-liists-btn').on('click', function() {
  $('#landing-container').hide();
  getRecentLiists(processLiistsData);
});

$('#create-btn').on('click', function() {
  $('#landing-container').hide();
  setStateAndRender({ page: 'create-liist' });
});

$('#banner-text').on('click', function() {
  $('#landing-container').show();
  $('#data').empty();
});