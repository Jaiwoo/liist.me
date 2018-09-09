const STATE = {};

//
// ─── API CALLS ──────────────────────────────────────────────────────────────────
//

// GET /liists
function getRecentLiists(callback) {
  setTimeout(function() {
    callback(mockDatabase);
  }, 100);
}

// GET to /liists:ID
function getLiistByID(ID) {
  const liist = mockDatabase.liists.find(function(element) {
    return element.id == ID;
  });

  return Promise.resolve({
    currentLiistID: ID,
    currentLiist: liist,
    page: 'currentLiist'
  });
}

// PUT to /liists:ID
function addSongToLiist(songToAdd) {
  const liistIndex = mockDatabase.liists.findIndex(function(element) {
    return element.id == STATE.currentLiistID;
  });

  mockDatabase.liists[liistIndex].songs.push(songToAdd);

  return Promise.resolve();
}

// POST to /create/liist
function createNewLiist(userInput) {
  // POST API call to /create/liist
  let newLiist = {
    id:
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15),
    songs: []
  };
  Object.assign(newLiist, userInput);
  mockDatabase.liists.push(newLiist);

  return Promise.resolve(newLiist.id);
}

// DELETE to /liist:ID
function deleteLiistByID(ID) {
  const liistIndex = mockDatabase.liists.findIndex(function(element) {
    return element.id == ID;
  });

  mockDatabase.liists.splice(liistIndex, 1);
  getRecentLiists(data => {
    setStateAndRender({ liists: data, page: 'liists' });
  });
}

//
// ─── RECENT LIISTS LOGIC ───────────────────────────────────────────────────────
//

function generateLiistsTable(data) {
  let liistsTableRows = [];
  for (let index in data.liists) {
    liistsTableRows.push(
      `<tr id="${data.liists[index].id}" class="liist-table-row">
        <td>${data.liists[index].name}</td>
        <td>${data.liists[index].owner}</td>
        <td>${data.liists[index].length}</td>
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
    $('#liists-table .liist-table-row').click(function() {
      getLiistByID($(this).attr('id')).then(setStateAndRender);
    });

    // render liist page
  } else if (state.page === 'currentLiist') {
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
      let del = confirm(`Are you sure you want to delete ${STATE.currentLiist.name}?`);
      if (del) {
        deleteLiistByID(STATE.currentLiistID);
      }
    });
  }
  // render create-liist page
  else if (state.page === 'create-liist') {
    const createFormHTML = generateCreateForm();
    $('#data').html(createFormHTML);
    handleCreateLiistSubmit();
  }
}

//
// ─── LIIST LOGIC ────────────────────────────────────────────────────────────────
//

function generateCurrentLiistTable(liist) {
  let liistTableRows = [];
  for (let index in liist.songs) {
    liistTableRows.push(
      `<tr class="liist-table-row">
        <td>${liist.songs[index].title}</td>
        <td>${liist.songs[index].artist}</td>
        <td>${liist.songs[index].addedBy}</td>
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
      <table id="liist-table">
        <thead>
          <tr>
            <th style="width: 40%">track</th>
            <th style="width: 25%">artist</th>
            <th style="width: 25%">added by</th>
          </tr>
        </thead>
        <tbody id="liist-table-body">
          ${liistTableRows}
        </tbody>
      </table>
    </div>`;

  return liistTable;
}

//
// ─── ADD SONG LOGIC ─────────────────────────────────────────────────────────────
//

function generateAddSongForm(liist) {
  const addSongFormHTML = `
    <div id="add-song-container" class="container">
      <form id="add-song-form" role="form" action="#">
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
      </form>
    </div>
  `;

  return addSongFormHTML;
}

function addSongToState(songToAdd) {

  const updatedLiist = Object.assign({}, STATE.currentLiist, {
    songs: STATE.currentLiist.songs.concat([songToAdd])
  });

  setStateAndRender({currentLiist: updatedLiist});
}

function handleAddSongSubmit() {
  $('#add-song-form').on('submit', function(e) {
    e.preventDefault();

    const songToAdd = {
      title: $('#add-song-name').val(),
      artist: $('#add-song-artist').val(),
      addedBy: $('#add-song-addedBy').val(),
      addedDate: new Date(),
      stars: 0
    };

    addSongToState(songToAdd);

    addSongToLiist(songToAdd).catch(() =>
      setStateAndRender({
        errorMessage: 'Something went wrong, try to add a song again'
      })
    );
  });
}

//
// ─── CREATE LIIST LOGIC ─────────────────────────────────────────────────────────
//

function generateCreateForm() {
  const createFormHTML = `
    <div id="create-liist-container" class="container">
      <form id="create-liist-form" role="form" action="#">
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

    createNewLiist(userInput).then(function(ID) {
      getLiistByID(ID).then(setStateAndRender);
    });
  });
}

//
// ─── NAV-BUTTON HANDLERS──────────────────────────────────────────────────────────
//

$('#get-liists-btn').on('click', function() {
  getRecentLiists(data => {
    setStateAndRender({ liists: data, page: 'liists' });
  });
});

$('#create-btn').on('click', function() {
  setStateAndRender({ page: 'create-liist' });
});